import { db } from '@/lib/firebase';
import {
	collection,
	getDocs,
	addDoc,
	doc,
	deleteDoc,
	updateDoc,
	query,
	orderBy,
	getDoc,
} from 'firebase/firestore';
import { AccessProfile } from '@/lib/types';
import { IAccessProfileService } from '@/services/access-profile-service';

const COLLECTION_NAME = 'access_profiles';

export class FirebaseAccessProfileService implements IAccessProfileService {
	async getAll(): Promise<AccessProfile[]> {
		const ref = collection(db, COLLECTION_NAME);
		const q = query(ref, orderBy('name'));
		const snapshot = await getDocs(q);

		return snapshot.docs.map(
			(doc) =>
				({
					id: doc.id,
					...doc.data(),
				}) as AccessProfile,
		);
	}

	async getById(id: string): Promise<AccessProfile | null> {
		const ref = doc(db, COLLECTION_NAME, id);
		const snap = await getDoc(ref);

		if (snap.exists()) {
			return {
				id: snap.id,
				...snap.data(),
			} as AccessProfile;
		}
		return null;
	}

	async create(profile: Omit<AccessProfile, 'id'>): Promise<string> {
		const ref = collection(db, COLLECTION_NAME);
		const docRef = await addDoc(ref, profile);
		return docRef.id;
	}

	async update(id: string, profile: Partial<AccessProfile>): Promise<void> {
		const ref = doc(db, COLLECTION_NAME, id);
		await updateDoc(ref, profile);
	}

	async delete(id: string): Promise<void> {
		const ref = doc(db, COLLECTION_NAME, id);
		await deleteDoc(ref);
	}
}

export const accessProfileService = new FirebaseAccessProfileService();
