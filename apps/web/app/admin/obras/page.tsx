'use client';

import { useState, useEffect } from 'react';
import { constructionService } from '@/services/firebase/construction-service';
import { ConstructionSite } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useTheme } from '@/contexts/theme-context';
import { Loader2, Plus, Building2, Trash2, Home } from 'lucide-react';
import { cn } from '@/lib/utils';


export default function ObrasPage() {
	const [sites, setSites] = useState<ConstructionSite[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { currentTheme } = useTheme();
	const [newSiteName, setNewSiteName] = useState('');
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState('');

	const fetchSites = async () => {
		setIsLoading(true);
		try {
			const data = await constructionService.getAll();
			setSites(data);
		} catch (error) {
			console.error('Failed to fetch sites', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchSites();
	}, []);

	const handleCreateSite = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newSiteName.trim()) return;

		try {
			setIsCreating(true);
			await constructionService.create({
				name: newSiteName,
			});
			setNewSiteName('');
			await fetchSites();
		} catch (err) {
			setError('Erro ao criar obra');
			console.error(err);
		} finally {
			setIsCreating(false);
		}
	};

	const handleDeleteSite = async (id: string) => {
		if (!confirm('Tem certeza que deseja excluir esta obra?')) return;
		try {
			await constructionService.delete(id);
			await fetchSites();
		} catch (err) {
			console.error('Erro ao excluir obra', err);
			alert('Erro ao excluir obra');
		}
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
			<div>
				<h1
					className="text-2xl font-bold tracking-tight"
					style={{ color: currentTheme.colors.text }}
				>
					Obras
				</h1>
				<p style={{ color: currentTheme.colors.textSecondary }}>
					Gerencie as obras e centros de custo.
				</p>
			</div>

			<Card
				className="border shadow-none"
				style={{
					backgroundColor: currentTheme.colors.card,
					borderColor: currentTheme.colors.border,
				}}
			>
				<CardHeader>
					<CardTitle style={{ color: currentTheme.colors.text }}>
						Nova Obra
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleCreateSite}
						className="flex gap-4 items-end"
					>
						<div className="flex-1 space-y-2">
							<Input
								placeholder="Nome da Obra (ex: Residencial Flores)"
								value={newSiteName}
								onChange={(e) => setNewSiteName(e.target.value)}
								style={{
									backgroundColor: currentTheme.isDark
										? `${currentTheme.colors.background}80`
										: '#fff',
									borderColor: currentTheme.colors.border,
									color: currentTheme.colors.text,
								}}
							/>
						</div>
						<Button
							type="submit"
							disabled={isCreating || !newSiteName.trim()}
							className="bg-primary text-primary-foreground hover:bg-primary/90"
						>
							{isCreating ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Plus className="h-4 w-4 mr-2" />
							)}
							Adicionar
						</Button>
					</form>
					{error && (
						<p className="text-red-500 text-sm mt-2">{error}</p>
					)}
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{sites.map((site) => (
					<Card
						key={site.id}
						className="hover:shadow-md transition-shadow"
						style={{
							backgroundColor: currentTheme.colors.card,
							borderColor: currentTheme.colors.border,
						}}
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle
								className="text-sm font-medium"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							>
								Unidade
							</CardTitle>
							<Home
								className="h-4 w-4 text-muted-foreground"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							/>
						</CardHeader>
						<CardContent>
							<div
								className="text-2xl font-bold mb-4"
								style={{ color: currentTheme.colors.text }}
							>
								{site.name}
							</div>
							<div className="flex justify-end gap-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										site.id && handleDeleteSite(site.id)
									}
									className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Excluir
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
