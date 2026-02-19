'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function Home() {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (loading) return;

		if (user) {
			router.push('/admin/dashboard');
		} else {
			router.push('/login');
		}
	}, [user, loading, router]);

	return (
		<div className="flex h-screen items-center justify-center">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
		</div>
	);
}
