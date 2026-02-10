import { AccessProfile } from '@obralog/shared-types';

const COLLECTION_NAME = 'access_profiles';

const DEFAULT_PROFILES: Omit<AccessProfile, 'id'>[] = [
	{
		name: 'Administrador',
		description: 'Acesso total ao sistema',
		permissions: ['all'],
		level: 'Alto',
	},
	{
		name: 'Almoxarife',
		description: 'Gerencia estoque e obras',
		permissions: ['read_inventory', 'write_inventory'],
		level: 'Médio',
	},
	{
		name: 'Operário',
		description: 'Visualização básica',
		permissions: ['read_inventory'],
		level: 'Baixo',
	},
];

export const accessProfileService = {
	getAll: async (): Promise<AccessProfile[]> => {
		// TODO: Implement with Firebase
		return DEFAULT_PROFILES.map((p, i) => ({ id: `default-${i}`, ...p }));
	},

	add: async (profile: Omit<AccessProfile, 'id'>) => {
		// TODO: Implement with Firebase
	},

	update: async (id: string, profile: Partial<AccessProfile>) => {
		// TODO: Implement with Firebase
	},

	delete: async (id: string) => {
		// TODO: Implement with Firebase
	},
};
