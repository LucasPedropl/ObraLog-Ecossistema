import { db } from '@/lib/firebase';
import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	query,
	orderBy,
	serverTimestamp,
} from 'firebase/firestore';
import { User } from '@/lib/types';

const COLLECTION_NAME = 'users';

export const userService = {
	getAll: async (): Promise<User[]> => {
		const ref = collection(db, COLLECTION_NAME);
		const q = query(ref, orderBy('name')); // Assuming 'name' field exists
		const snapshot = await getDocs(q);

		return snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				name: data.name,
				email: data.email,
				role: data.role,
				profileId: data.profileId,
				createdAt: data.createdAt?.toDate() || new Date(),
			} as User;
		});
	},

	create: async (user: Omit<User, 'id' | 'createdAt'>) => {
		const ref = collection(db, COLLECTION_NAME);
		const docRef = await addDoc(ref, {
			...user,
			createdAt: serverTimestamp(),
		});
		return docRef.id;
	},

	update: async (id: string, user: Partial<User>) => {
		const ref = doc(db, COLLECTION_NAME, id);
		await updateDoc(ref, {
			...user,
			// updatedAd: serverTimestamp() // if we track updates
		});
	},

	delete: async (id: string) => {
		const ref = doc(db, COLLECTION_NAME, id);
		await deleteDoc(ref);
	},
};
