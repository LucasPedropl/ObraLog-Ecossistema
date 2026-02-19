'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { constructionService } from '@/services/firebase/construction-service';
import { ConstructionSite } from '@/lib/types';
import { Trash2, Save, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function ObraSettings({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const unwrappedParams = use(params);
	const siteId = unwrappedParams.id;
	const router = useRouter();
	const { currentTheme } = useTheme();

	const [site, setSite] = useState<ConstructionSite | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const [name, setName] = useState('');

	useEffect(() => {
		const fetchSite = async () => {
			if (!siteId) return;
			setIsLoading(true);
			try {
				const data = await constructionService.getById(siteId);
				if (data) {
					setSite(data);
					setName(data.name);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchSite();
	}, [siteId]);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!siteId || !name) return;

		try {
			setIsSaving(true);
			await constructionService.update(siteId, { name });
			// Optionally refresh context or site state
			alert('Configurações salvas com sucesso!');
		} catch (error) {
			console.error(error);
			alert('Erro ao salvar alterações');
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async () => {
		if (
			!confirm(
				'ATENÇÃO: Esta ação é irreversível. Deseja realmente excluir esta obra e todos os seus dados?',
			)
		)
			return;

		try {
			setIsDeleting(true);
			await constructionService.delete(siteId);
			router.push('/admin/obras');
		} catch (error) {
			console.error(error);
			alert(
				'Erro ao excluir obra. Verifique se existem sub-coleções que impedem a exclusão.',
			);
		} finally {
			setIsDeleting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (!site) return <div>Obra não encontrada.</div>;

	return (
		<div className="max-w-2xl space-y-8">
			<div>
				<h2
					className="text-xl font-semibold mb-4"
					style={{ color: currentTheme.colors.text }}
				>
					Configurações da Obra
				</h2>
				<p
					className="text-sm opacity-70"
					style={{ color: currentTheme.colors.textSecondary }}
				>
					Gerencie as informações básicas e zona de perigo desta obra.
				</p>
			</div>

			<div
				className="p-6 rounded-lg border shadow-sm"
				style={{
					backgroundColor: currentTheme.colors.card,
					borderColor: currentTheme.colors.border,
				}}
			>
				<form onSubmit={handleSave} className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="name"
							className="text-sm font-medium"
							style={{ color: currentTheme.colors.text }}
						>
							Nome da Obra
						</label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							style={{
								backgroundColor: currentTheme.isDark
									? `${currentTheme.colors.background}80`
									: '#fff',
								borderColor: currentTheme.colors.border,
								color: currentTheme.colors.text,
							}}
						/>
					</div>
					<div className="pt-2">
						<Button
							type="submit"
							disabled={isSaving || !name}
							className="flex items-center gap-2"
						>
							{isSaving ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Save className="h-4 w-4" />
							)}
							Salvar Alterações
						</Button>
					</div>
				</form>
			</div>

			<div className="p-6 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10">
				<div className="flex items-start gap-4">
					<div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600">
						<AlertTriangle className="h-6 w-6" />
					</div>
					<div className="space-y-4 flex-1">
						<div>
							<h3 className="text-lg font-medium text-red-900 dark:text-red-400">
								Zona de Perigo
							</h3>
							<p className="text-sm text-red-700 dark:text-red-300 mt-1">
								Excluir esta obra removerá permanentemente todos
								os dados associados, incluindo inventário,
								histórico e ferramentas.
							</p>
						</div>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isDeleting}
							className="flex items-center gap-2"
						>
							{isDeleting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Trash2 className="h-4 w-4" />
							)}
							Excluir Obra
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
