import { AccessProfile } from '@/lib/types';

export interface IAccessProfileService {
	getAll(): Promise<AccessProfile[]>;
	getById(id: string): Promise<AccessProfile | null>;
	create(profile: Omit<AccessProfile, 'id'>): Promise<string>;
	update(id: string, profile: Partial<AccessProfile>): Promise<void>;
	delete(id: string): Promise<void>;
}
