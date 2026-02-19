import { User } from '@/lib/types';

export interface LoginCredentials {
	email: string;
	password?: string;
}

export interface IAuthService {
	login(credentials: LoginCredentials): Promise<User>;
	logout(): Promise<void>;
	getCurrentUser(): Promise<User | null>;
	onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
