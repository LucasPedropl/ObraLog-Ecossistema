import { User } from '@obralog/shared-types';

const COLLECTION_NAME = 'users';

export const userService = {
	getAll: async (): Promise<User[]> => {
		// TODO: Implement with Firebase
		return [];
	},

	add: async (user: Omit<User, 'id' | 'createdAt'>) => {
		// TODO: Implement with Firebase
	},

	update: async (id: string, user: Partial<User>) => {
		// TODO: Implement with Firebase
	},

	delete: async (id: string) => {
		// TODO: Implement with Firebase
	},
};
