'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/components/layout/auth-layout';
import { useTheme } from '@/contexts/theme-context';

export default function LoginPage() {
	const { login, loginWithGoogle, loading } = useAuth();
	const { currentTheme } = useTheme();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
		setIsGoogleLoading(true);
		try {
			await loginWithGoogle();
		} catch (err: unknown) {
			setError(
				err instanceof Error
					? err.message
					: 'Falha no login com Google',
			);
		} finally {
			setIsGoogleLoading(false);
		}
	};

	return (
		<AuthLayout>
			<form onSubmit={handleLogin} className="space-y-4">
				{error && (
					<div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm text-center">
						{error}
					</div>
				)}
				<div className="space-y-4">
					<div>
						<label
							className="block text-sm font-medium mb-1"
							style={{ color: currentTheme.colors.text }}
						>
							Email Corporativo
						</label>
						<Input
							type="email"
							placeholder="nome@empresa.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={loading}
							style={{
								backgroundColor: currentTheme.isDark
									? `${currentTheme.colors.background}80`
									: '#fff',
								borderColor: currentTheme.colors.border,
								color: currentTheme.colors.text,
							}}
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-1"
							style={{ color: currentTheme.colors.text }}
						>
							Senha
						</label>
						<Input
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={loading}
							style={{
								backgroundColor: currentTheme.isDark
									? `${currentTheme.colors.background}80`
									: '#fff',
								borderColor: currentTheme.colors.border,
								color: currentTheme.colors.text,
							}}
						/>
					</div>
				</div>

				<div className="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						className="h-4 w-4 rounded border-gray-300 focus:ring-brand-500"
						style={{
							borderColor: currentTheme.colors.border,
						}}
					/>
					<label
						htmlFor="remember-me"
						className="ml-2 block text-sm"
						style={{
							color: currentTheme.colors.textSecondary,
						}}
					>
						Lembrar dispositivo
					</label>
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={loading}
					style={{
						backgroundColor: currentTheme.colors.primary,
						color: '#fff',
					}}
				>
					{loading ? 'Entrando...' : 'Entrar no Sistema'}
				</Button>
			</form>

			<div className="relative my-6">
				<div className="absolute inset-0 flex items-center">
					<span
						className="w-full border-t"
						style={{ borderColor: currentTheme.colors.border }}
					/>
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span
						className="px-2"
						style={{
							backgroundColor: currentTheme.colors.card,
							color: currentTheme.colors.textSecondary,
						}}
					>
						Ou continue com
					</span>
				</div>
			</div>

			<Button
				variant="outline"
				type="button"
				className="w-full"
				onClick={handleGoogleLogin}
				disabled={loading || isGoogleLoading}
				style={{
					borderColor: currentTheme.colors.border,
					color: currentTheme.colors.text,
				}}
			>
				{isGoogleLoading ? 'Entrando...' : 'Google'}
			</Button>

			<div className="mt-6 text-center">
				<p
					className="text-xs"
					style={{ color: currentTheme.colors.textSecondary }}
				>
					Problemas com acesso? Contate o suporte
				</p>
			</div>
		</AuthLayout>
	);
}
