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
	runTransaction,
	getDoc,
} from 'firebase/firestore';
import { SiteInventoryItem, StockMovement } from '@/lib/types';

export const siteInventoryService = {
	getSiteInventory: async (siteId: string): Promise<SiteInventoryItem[]> => {
		const ref = collection(db, 'construction_sites', siteId, 'inventory');
		const q = query(ref, orderBy('name'));
		const snapshot = await getDocs(q);

		return snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				originalItemId: data.originalItemId,
				name: data.name,
				unit: data.unit,
				category: data.category,
				quantity: data.quantity ?? 0,
				averagePrice: data.averagePrice ?? 0,
				minThreshold: data.minThreshold ?? 0,
				isTool: data.isTool ?? false,
				siteId: siteId,
				updatedAt: data.updatedAt?.toDate() || new Date(),
			} as SiteInventoryItem;
		});
	},

	addItem: async (
		siteId: string,
		item: Omit<SiteInventoryItem, 'id' | 'updatedAt' | 'siteId'>,
	) => {
		const ref = collection(db, 'construction_sites', siteId, 'inventory');
		await addDoc(ref, {
			...item,
			siteId: siteId,
			updatedAt: serverTimestamp(),
		});
	},

	updateItem: async (
		siteId: string,
		itemId: string,
		data: Partial<SiteInventoryItem>,
	) => {
		const ref = doc(db, 'construction_sites', siteId, 'inventory', itemId);
		const dataToUpdate = { ...data, updatedAt: serverTimestamp() };

		// Ensure id is not in the update payload
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...cleanData } = dataToUpdate as any;

		await updateDoc(ref, cleanData);
	},

	deleteItem: async (siteId: string, itemId: string) => {
		const ref = doc(db, 'construction_sites', siteId, 'inventory', itemId);
		await deleteDoc(ref);
	},

	registerMovement: async (
		siteId: string,
		itemId: string,
		movement: Omit<StockMovement, 'id' | 'date'>,
	) => {
		const itemRef = doc(
			db,
			'construction_sites',
			siteId,
			'inventory',
			itemId,
		);
		const movementsRef = collection(itemRef, 'movements'); // Subcollection inside the item doc or separate?
		// Otrack2 code: `collection(db, 'construction_sites', siteId, 'inventory', itemId, 'movements')`
		// which matches `collection(itemRef, 'movements')` path wise.

		await runTransaction(db, async (transaction) => {
			const itemDoc = await transaction.get(itemRef);
			if (!itemDoc.exists()) {
				throw new Error('Item not found!');
			}

			const currentQty = itemDoc.data().quantity || 0;
			let newQty = currentQty;

			if (movement.type === 'IN') {
				newQty += movement.quantity;
			} else {
				newQty -= movement.quantity;
			}

			if (movement.type === 'OUT' && newQty < 0) {
				throw new Error(
					`Insufficient stock. Current: ${currentQty}, Requested: ${movement.quantity}`,
				);
			}

			// 1. Update quantity
			transaction.update(itemRef, {
				quantity: newQty,
				updatedAt: serverTimestamp(),
			});

			// 2. Add movement history
			// transaction.set on a new doc ref
			const newMovementDoc = doc(movementsRef);
			transaction.set(newMovementDoc, {
				...movement,
				date: serverTimestamp(),
			});
		});
	},

	getItemHistory: async (
		siteId: string,
		itemId: string,
	): Promise<StockMovement[]> => {
		const ref = collection(
			db,
			'construction_sites',
			siteId,
			'inventory',
			itemId,
			'movements',
		);
		const q = query(ref, orderBy('date', 'desc'));
		const snapshot = await getDocs(q);

		return snapshot.docs.map(
			(doc) =>
				({
					id: doc.id,
					...doc.data(),
					date: doc.data().date?.toDate() || new Date(),
				}) as StockMovement,
		);
	},

	getAllSiteMovements: async (siteId: string): Promise<StockMovement[]> => {
		const items = await siteInventoryService.getSiteInventory(siteId);

		const promises = items.map(async (item) => {
			if (!item.id) return [];
			const history = await siteInventoryService.getItemHistory(
				siteId,
				item.id,
			);
			return history.map((h: StockMovement) => ({
				...h,
				itemName: item.name,
				itemUnit: item.unit,
			}));
		});

		const results = await Promise.all(promises);
		// Type assertion to fix flat typings if needed, but array of arrays works
		const flatResults = results.flat() as StockMovement[];
		return flatResults.sort((a, b) => b.date.getTime() - a.date.getTime());
	},
};
