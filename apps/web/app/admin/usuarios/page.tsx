'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/services/firebase/user-service';
import { accessProfileService } from '@/services/firebase/access-profile-service';
import { User, AccessProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/theme-context';
import {
	Loader2,
	Plus,
	Edit2,
	Trash2,
	Search,
	User as UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function UsuariosPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [profiles, setProfiles] = useState<AccessProfile[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { currentTheme } = useTheme();
	const [searchQuery, setSearchQuery] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	// Form state
	const [newUser, setNewUser] = useState<Partial<User>>({
		name: '',
		email: '',
		role: 'operario',
		profileId: '',
	});

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const [usersData, profilesData] = await Promise.all([
				userService.getAll(),
				accessProfileService.getAll(),
			]);
			setUsers(usersData);
			setProfiles(profilesData);
		} catch (error) {
			console.error('Failed to fetch data', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const filteredUsers = users.filter(
		(user) =>
			user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleCreateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newUser.name || !newUser.email) return;

		try {
			setIsCreating(true);
			await userService.create({
				name: newUser.name,
				email: newUser.email,
				role: newUser.role || 'operario',
				profileId: newUser.profileId,
				// password: 'defaultpassword123' // Authentication usually handles password creation via email link or separate flow
			} as any);

			setNewUser({
				name: '',
				email: '',
				role: 'operario',
				profileId: '',
			});
			await fetchData();
		} catch (err) {
			console.error(err);
			alert('Erro ao criar usuário');
		} finally {
			setIsCreating(false);
		}
	};

	const handleDeleteUser = async (id: string) => {
		if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
		try {
			await userService.delete(id);
			await fetchData();
		} catch (err) {
			console.error(err);
			alert('Erro ao excluir usuário');
		}
	};

	const getProfileName = (id?: string) => {
		if (!id) return '-';
		const profile = profiles.find((p) => p.id === id);
		return profile ? profile.name : 'Desconhecido';
	};

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center min-h-[50vh]">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1
						className="text-2xl font-bold tracking-tight"
						style={{ color: currentTheme.colors.text }}
					>
						Usuários
					</h1>
					<p style={{ color: currentTheme.colors.textSecondary }}>
						Gerencie o acesso dos colaboradores ao sistema.
					</p>
				</div>
			</div>

			<div
				className="rounded-md border p-6 space-y-4"
				style={{
					backgroundColor: currentTheme.colors.card,
					borderColor: currentTheme.colors.border,
				}}
			>
				<h2
					className="text-lg font-semibold"
					style={{ color: currentTheme.colors.text }}
				>
					Novo Usuário
				</h2>
				<form
					onSubmit={handleCreateUser}
					className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
				>
					<div className="space-y-2">
						<label
							className="text-sm font-medium"
							style={{ color: currentTheme.colors.text }}
						>
							Nome
						</label>
						<Input
							required
							placeholder="Nome completo"
							value={newUser.name}
							onChange={(e) =>
								setNewUser({ ...newUser, name: e.target.value })
							}
							style={{
								backgroundColor: currentTheme.isDark
									? `${currentTheme.colors.background}80`
									: '#fff',
								borderColor: currentTheme.colors.border,
								color: currentTheme.colors.text,
							}}
						/>
					</div>
					<div className="space-y-2">
						<label
							className="text-sm font-medium"
							style={{ color: currentTheme.colors.text }}
						>
							Email
						</label>
						<Input
							required
							type="email"
							placeholder="email@empresa.com"
							value={newUser.email}
							onChange={(e) =>
								setNewUser({
									...newUser,
									email: e.target.value,
								})
							}
							style={{
								backgroundColor: currentTheme.isDark
									? `${currentTheme.colors.background}80`
									: '#fff',
								borderColor: currentTheme.colors.border,
								color: currentTheme.colors.text,
							}}
						/>
					</div>
					<div className="space-y-2">
						<label
							className="text-sm font-medium"
							style={{ color: currentTheme.colors.text }}
						>
							Função
						</label>
						<select
							className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							value={newUser.role}
							onChange={(e) =>
								setNewUser({
									...newUser,
									role: e.target.value as any,
								})
							}
							style={{
								backgroundColor: currentTheme.isDark
									? `${currentTheme.colors.background}80`
									: '#fff',
								borderColor: currentTheme.colors.border,
								color: currentTheme.colors.text,
							}}
						>
							<option value="operario">Operário</option>
							<option value="almoxarife">Almoxarife</option>
							<option value="admin">Administrador</option>
						</select>
					</div>
					<div className="space-y-2">
						<label
							className="text-sm font-medium"
							style={{ color: currentTheme.colors.text }}
						>
							Perfil de Acesso
						</label>
						<select
							className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							value={newUser.profileId}
							onChange={(e) =>
								setNewUser({
									...newUser,
									profileId: e.target.value,
								})
							}
							style={{
								backgroundColor: currentTheme.isDark
									? `${currentTheme.colors.background}80`
									: '#fff',
								borderColor: currentTheme.colors.border,
								color: currentTheme.colors.text,
							}}
						>
							<option value="">Selecione um perfil...</option>
							{profiles.map((p) => (
								<option key={p.id} value={p.id}>
									{p.name}
								</option>
							))}
						</select>
					</div>
					<Button type="submit" disabled={isCreating}>
						{isCreating ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Plus className="h-4 w-4 mr-2" />
						)}
						Cadastrar
					</Button>
				</form>
			</div>

			<div
				className="rounded-md border p-4 space-y-4"
				style={{
					backgroundColor: currentTheme.colors.card,
					borderColor: currentTheme.colors.border,
				}}
			>
				<div className="relative max-w-sm">
					<Search
						className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
						style={{ color: currentTheme.colors.textSecondary }}
					/>
					<Input
						placeholder="Buscar usuário..."
						className="pl-9"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						style={{
							backgroundColor: currentTheme.isDark
								? `${currentTheme.colors.background}80`
								: '#fff',
							borderColor: currentTheme.colors.border,
							color: currentTheme.colors.text,
						}}
					/>
				</div>

				<div
					className="rounded-md border overflow-hidden"
					style={{ borderColor: currentTheme.colors.border }}
				>
					<table className="w-full text-sm text-left">
						<thead
							className="bg-muted/50 text-muted-foreground"
							style={{
								backgroundColor: `${currentTheme.colors.sidebar}20`,
							}}
						>
							<tr>
								<th
									className="p-4 font-medium"
									style={{
										color: currentTheme.colors
											.textSecondary,
									}}
								>
									Usuário
								</th>
								<th
									className="p-4 font-medium"
									style={{
										color: currentTheme.colors
											.textSecondary,
									}}
								>
									Email
								</th>
								<th
									className="p-4 font-medium"
									style={{
										color: currentTheme.colors
											.textSecondary,
									}}
								>
									Função
								</th>
								<th
									className="p-4 font-medium"
									style={{
										color: currentTheme.colors
											.textSecondary,
									}}
								>
									Perfil
								</th>
								<th
									className="p-4 font-medium text-right"
									style={{
										color: currentTheme.colors
											.textSecondary,
									}}
								>
									Ações
								</th>
							</tr>
						</thead>
						<tbody className="">
							{filteredUsers.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="p-8 text-center"
										style={{
											color: currentTheme.colors
												.textSecondary,
										}}
									>
										Nenhum usuário encontrado.
									</td>
								</tr>
							) : (
								filteredUsers.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-muted/50 transition-colors border-b last:border-0"
										style={{
											borderColor:
												currentTheme.colors.border,
										}}
									>
										<td
											className="p-4 font-medium"
											style={{
												color: currentTheme.colors.text,
											}}
										>
											<div className="flex items-center gap-2">
												<div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
													<UserIcon className="h-4 w-4" />
												</div>
												{user.name}
											</div>
										</td>
										<td
											className="p-4"
											style={{
												color: currentTheme.colors
													.textSecondary,
											}}
										>
											{user.email}
										</td>
										<td
											className="p-4"
											style={{
												color: currentTheme.colors.text,
											}}
										>
											<span className="capitalize">
												{user.role}
											</span>
										</td>
										<td
											className="p-4"
											style={{
												color: currentTheme.colors
													.textSecondary,
											}}
										>
											{getProfileName(user.profileId)}
										</td>
										<td className="p-4 text-right space-x-2">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 hover:bg-red-50"
												onClick={() =>
													user.id &&
													handleDeleteUser(user.id)
												}
											>
												<Trash2 className="h-4 w-4 text-red-500" />
											</Button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
