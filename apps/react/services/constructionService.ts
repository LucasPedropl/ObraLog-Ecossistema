import { ConstructionSite } from '@obralog/shared-types';

const COLLECTION_NAME = 'construction_sites';

export const constructionService = {
	getAll: async (): Promise<ConstructionSite[]> => {
		// TODO: Implement with Firebase
		return [];
	},

	getById: async (id: string): Promise<ConstructionSite | null> => {
		// TODO: Implement with Firebase
		return null;
	},

	add: async (name: string) => {
		// TODO: Implement with Firebase
	},

	update: async (id: string, name: string) => {
		// TODO: Implement with Firebase
	},

	delete: async (id: string) => {
		// TODO: Implement with Firebase
	},
};
