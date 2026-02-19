// apps/web/services/firebase/rented-equipment-service.ts
import { db } from '@/lib/firebase';
import {
	collection,
	getDocs,
	addDoc,
	serverTimestamp,
	query,
	orderBy,
	doc,
	updateDoc,
} from 'firebase/firestore';
import { RentedEquipment } from '@/lib/types'; // Assuming this type exists

export const rentedEquipmentService = {
	getAll: async (siteId: string): Promise<RentedEquipment[]> => {
		const ref = collection(
			db,
			'construction_sites',
			siteId,
			'rented_equipment',
		);
		const q = query(ref, orderBy('entryDate', 'desc'));
		const snapshot = await getDocs(q);

		return snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				...data,
				// Handle Timestamp to Date conversion safely
				entryDate: data.entryDate?.toDate
					? data.entryDate.toDate()
					: new Date(data.entryDate),
				exitDate: data.exitDate?.toDate
					? data.exitDate.toDate()
					: data.exitDate
						? new Date(data.exitDate)
						: undefined,
				updatedAt: data.updatedAt?.toDate
					? data.updatedAt.toDate()
					: undefined,
			} as RentedEquipment;
		});
	},

	registerEntry: async (
		siteId: string,
		data: Omit<
			RentedEquipment,
			'id' | 'updatedAt' | 'siteId' | 'status' | 'exitDate' | 'exitPhotos'
		>,
	) => {
		const ref = collection(
			db,
			'construction_sites',
			siteId,
			'rented_equipment',
		);
		await addDoc(ref, {
			...data,
			siteId,
			status: 'ACTIVE',
			updatedAt: serverTimestamp(),
		});
	},

	registerExit: async (
		siteId: string,
		equipmentId: string,
		exitData: { exitDate: Date; exitPhotos: string[] },
	) => {
		const ref = doc(
			db,
			'construction_sites',
			siteId,
			'rented_equipment',
			equipmentId,
		);
		await updateDoc(ref, {
			status: 'RETURNED',
			exitDate: exitData.exitDate,
			exitPhotos: exitData.exitPhotos,
			updatedAt: serverTimestamp(),
		});
	},
};
