import {
	signInWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
	signOut as firebaseSignOut,
	onAuthStateChanged as onFirebaseAuthStateChanged,
	User as FirebaseUser,
	setPersistence,
	browserLocalPersistence,
	browserSessionPersistence,
	AuthError,
} from 'firebase/auth';
import {
	doc,
	getDoc,
	setDoc,
	serverTimestamp,
	collection,
	query,
	where,
	getDocs,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/lib/types';
import { IAuthService, LoginCredentials } from '@/services/auth-service';

const ADMIN_EMAILS = [
	'pedrolucasmota2005@gmail.com',
	'pedro@gmail.com',
	'teste@gmail.com',
];
const STORAGE_KEY = 'obralog_user';

export class FirebaseAuthService implements IAuthService {
	private async syncUser(firebaseUser: FirebaseUser): Promise<User> {
		// 1. Try fetching by UID (google auth)
		const userDocRef = doc(db, 'users', firebaseUser.uid);
		const userDocSnap = await getDoc(userDocRef);

		if (userDocSnap.exists()) {
			const data = userDocSnap.data();
			return {
				id: firebaseUser.uid,
				name: data.name,
				email: data.email,
				role: data.role,
				profileId: data.profileId,
				createdAt: data.createdAt?.toDate() || new Date(),
			} as User;
		}

		// 2. Try fetching by Email (manual user who logged in with Google)
		const q = query(
			collection(db, 'users'),
			where('email', '==', firebaseUser.email),
		);
		const querySnap = await getDocs(q);

		if (!querySnap.empty) {
			const data = querySnap.docs[0].data();
			return {
				id: querySnap.docs[0].id,
				name: data.name,
				email: data.email,
				role: data.role,
				profileId: data.profileId,
				createdAt: data.createdAt?.toDate() || new Date(),
			} as User;
		}

		// 3. Auto-register specific admins
		if (ADMIN_EMAILS.includes(firebaseUser.email || '')) {
			const newUser: Omit<User, 'id'> = {
				name: firebaseUser.displayName || 'Administrador',
				email: firebaseUser.email!,
				role: 'admin',
				createdAt: new Date(),
			};

			await setDoc(userDocRef, {
				...newUser,
				createdAt: serverTimestamp(),
			});

			return {
				id: firebaseUser.uid,
				...newUser,
			} as User;
		}

		await firebaseSignOut(auth);
		throw new Error(
			'Acesso negado. Seu email não está cadastrado no sistema.',
		);
	}

	async login(credentials: LoginCredentials): Promise<User> {
		const { email, password } = credentials;
		if (!password)
			throw new Error('Senha é obrigatória para login com email.');

		try {
			// 1. Manual Firestore Auth (Legacy support/Custom Auth)
			const usersRef = collection(db, 'users');
			const q = query(
				usersRef,
				where('email', '==', email),
				where('password', '==', password),
			);
			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				const userDoc = querySnapshot.docs[0];
				const data = userDoc.data();
				const user: User = {
					id: userDoc.id,
					name: data.name,
					email: data.email,
					role: data.role,
					profileId: data.profileId,
					createdAt: data.createdAt?.toDate() || new Date(),
				};

				this.persistUser(user, true); // Defaulting to local persistence
				return user;
			}

			// 2. Firebase Auth Fallback
			await setPersistence(auth, browserLocalPersistence);
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);
			// Wait for user to be populated
			const syncedUser = await this.syncUser(userCredential.user);

			this.persistUser(syncedUser, true);
			return syncedUser;
		} catch (err: any) {
			console.error('Login error:', err);
			// const error = err as AuthError;
			//  if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
			//    throw new Error("E-mail ou senha incorretos.");
			// }
			throw new Error('Erro ao realizar login.');
		}
	}

	async loginWithGoogle(): Promise<User> {
		// await setPersistence(auth, browserLocalPersistence); // Removed as it might conflict with popup sometimes
		const provider = new GoogleAuthProvider();
		const userCredential = await signInWithPopup(auth, provider);
		const user = await this.syncUser(userCredential.user);
		this.persistUser(user, true);
		return user;
	}

	async logout(): Promise<void> {
		try {
			await firebaseSignOut(auth);
		} catch (e) {
			console.error('Logout error', e);
		}
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
			sessionStorage.removeItem(STORAGE_KEY);
		}
	}

	async getCurrentUser(): Promise<User | null> {
		if (typeof window === 'undefined') return null;

		const stored =
			sessionStorage.getItem(STORAGE_KEY) ||
			localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				return null;
			}
		}
		return null;
	}

	onAuthStateChanged(callback: (user: User | null) => void): () => void {
		return onFirebaseAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				try {
					const user = await this.syncUser(firebaseUser);
					// this.persistUser(user, !!localStorage.getItem(STORAGE_KEY));
					callback(user);
				} catch (e) {
					callback(null);
				}
			} else {
				const storedUser = await this.getCurrentUser();
				if (storedUser) {
					// Simple existence check could be added here
					callback(storedUser);
				} else {
					callback(null);
				}
			}
		});
	}

	private persistUser(user: User, rememberMe: boolean) {
		if (typeof window === 'undefined') return;
		const storage = rememberMe ? localStorage : sessionStorage;
		storage.setItem(STORAGE_KEY, JSON.stringify(user));

		if (rememberMe) sessionStorage.removeItem(STORAGE_KEY);
		else localStorage.removeItem(STORAGE_KEY);
	}
}

export const authService = new FirebaseAuthService();
