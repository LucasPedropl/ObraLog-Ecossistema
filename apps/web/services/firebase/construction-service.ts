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
	serverTimestamp,
} from 'firebase/firestore';
import { ConstructionSite } from '@/lib/types';
import { IConstructionService } from '@/services/construction-service';

const COLLECTION_NAME = 'construction_sites';

export class FirebaseConstructionService implements IConstructionService {
	async getAll(): Promise<ConstructionSite[]> {
		const ref = collection(db, COLLECTION_NAME);
		const q = query(ref, orderBy('name'));
		const snapshot = await getDocs(q);

		return snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				name: data.name,
				createdAt: data.createdAt?.toDate() || new Date(),
				// Map other fields if any
			} as ConstructionSite;
		});
	}

	async getById(id: string): Promise<ConstructionSite | null> {
		const ref = doc(db, COLLECTION_NAME, id);
		const snap = await getDoc(ref);

		if (snap.exists()) {
			const data = snap.data();
			return {
				id: snap.id,
				name: data.name,
				createdAt: data.createdAt?.toDate() || new Date(),
			} as ConstructionSite;
		}
		return null;
	}

	async create(
		site: Omit<ConstructionSite, 'id' | 'createdAt'>,
	): Promise<string> {
		const ref = collection(db, COLLECTION_NAME);
		const docRef = await addDoc(ref, {
			...site,
			createdAt: serverTimestamp(),
		});
		return docRef.id;
	}

	async update(id: string, site: Partial<ConstructionSite>): Promise<void> {
		const ref = doc(db, COLLECTION_NAME, id);
		await updateDoc(ref, site);
	}

	async delete(id: string): Promise<void> {
		const ref = doc(db, COLLECTION_NAME, id);
		await deleteDoc(ref);
	}
}

export const constructionService = new FirebaseConstructionService();
