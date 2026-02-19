import { ConstructionSite } from '@/lib/types';

export interface IConstructionService {
	getAll(): Promise<ConstructionSite[]>;
	getById(id: string): Promise<ConstructionSite | null>;
	create(site: Omit<ConstructionSite, 'id' | 'createdAt'>): Promise<string>;
	update(id: string, site: Partial<ConstructionSite>): Promise<void>;
	delete(id: string): Promise<void>;
}
