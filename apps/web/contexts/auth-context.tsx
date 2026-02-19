'use client';

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useMemo,
} from 'react';
import { User } from '@/lib/types';
import { authService as firebaseAuthService } from '@/services';
import { LoginCredentials } from '@/services/auth-service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (credentials: LoginCredentials) => Promise<void>;
	loginWithGoogle: () => Promise<void>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	// Initialize checks
	useEffect(() => {
		let mounted = true;

		const initAuth = async () => {
			const stored = await firebaseAuthService.getCurrentUser();
			if (mounted && stored) {
				setUser(stored);
			}
		};
		initAuth();

		const unsubscribe = firebaseAuthService.onAuthStateChanged((u) => {
			if (mounted) {
				setUser(u);
				setLoading(false);
			}
		});

		return () => {
			mounted = false;
			unsubscribe();
		};
	}, []);

	const login = async (credentials: LoginCredentials) => {
		setLoading(true);
		try {
			const loggedUser = await firebaseAuthService.login(credentials);
			setUser(loggedUser);
			router.push('/admin/dashboard');
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const loginWithGoogle = async () => {
		setLoading(true);
		try {
			const loggedUser = await firebaseAuthService.loginWithGoogle();
			setUser(loggedUser);
			router.push('/admin/dashboard');
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		await firebaseAuthService.logout();
		setUser(null);
		router.push('/login');
	};

	const value = useMemo(
		() => ({
			user,
			loading,
			login,
			loginWithGoogle,
			logout,
			isAuthenticated: !!user,
		}),
		[user, loading],
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
