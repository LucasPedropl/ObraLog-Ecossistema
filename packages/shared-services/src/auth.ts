import { auth } from './firebase';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { User } from '@obralog/shared-types';

export const authService = {
	getCurrentUser: () => {
		const user = auth.currentUser;
		if (!user) return null;

		return {
			id: user.uid,
			email: user.email || '',
			name: user.displayName || '',
			role: 'admin' as const,
			createdAt: new Date(user.metadata.creationTime || 0),
		} as User;
	},

	login: async (email: string, password: string): Promise<User | null> => {
		try {
			const result = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);
			return {
				id: result.user.uid,
				email: result.user.email || '',
				name: result.user.displayName || '',
				role: 'admin',
				createdAt: new Date(result.user.metadata.creationTime || 0),
			} as User;
		} catch (error) {
			console.error('Login failed:', error);
			throw error;
		}
	},

	register: async (email: string, password: string): Promise<User | null> => {
		try {
			const result = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			return {
				id: result.user.uid,
				email: result.user.email || '',
				name: result.user.displayName || '',
				role: 'operario',
				createdAt: new Date(result.user.metadata.creationTime || 0),
			} as User;
		} catch (error) {
			console.error('Registration failed:', error);
			throw error;
		}
	},

	logout: async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error('Logout failed:', error);
			throw error;
		}
	},

	onAuthChanged: (callback: (user: User | null) => void) => {
		return auth.onAuthStateChanged((user) => {
			if (user) {
				callback({
					id: user.uid,
					email: user.email || '',
					name: user.displayName || '',
					role: 'admin',
					createdAt: new Date(user.metadata.creationTime || 0),
				} as User);
			} else {
				callback(null);
			}
		});
	},
};
