'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from '@/components/ui/card';

export default function LoginPage() {
	const { login, loginWithGoogle, loading } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		try {
			await login({ email, password });
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Falha no login');
		}
	};

	const handleGoogleLogin = async () => {
		setError('');
		try {
			await loginWithGoogle();
		} catch (err: unknown) {
			setError(
				err instanceof Error
					? err.message
					: 'Falha no login com Google',
			);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-950 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center space-y-2">
					<CardTitle className="text-3xl font-extrabold">
						ObraLog
					</CardTitle>
					<CardDescription>
						Faça login para acessar o sistema
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<form onSubmit={handleLogin} className="space-y-4">
						{error && (
							<div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm text-center">
								{error}
							</div>
						)}
						<div className="space-y-2">
							<Input
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={loading}
							/>
							<Input
								type="password"
								placeholder="Senha"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={loading}
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading ? 'Entrando...' : 'Entrar'}
						</Button>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-card px-2 text-muted-foreground">
								Ou continue com
							</span>
						</div>
					</div>

					<Button
						variant="outline"
						type="button"
						className="w-full"
						onClick={handleGoogleLogin}
						disabled={loading}
					>
						Google
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
