'use client';

import React, { useEffect, useState, use } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { inventoryService } from '@/services/firebase/inventory-service';
import { siteInventoryService } from '@/services/firebase/site-inventory-service';
import { InventoryItem, SiteInventoryItem } from '@/lib/types';
import { Plus, Search, Trash2, Hammer, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function ObraTools({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const unwrappedParams = use(params);
	const siteId = unwrappedParams.id;
	const { currentTheme } = useTheme();

	// Data
	const [siteTools, setSiteTools] = useState<SiteInventoryItem[]>([]);
	const [globalItems, setGlobalItems] = useState<InventoryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

	// Add Logic
	const [newItemOriginalId, setNewItemOriginalId] = useState('');
	const [newItemQty, setNewItemQty] = useState(0);
	const [isAdding, setIsAdding] = useState(false);

	const fetchData = async () => {
		if (!siteId) return;
		setIsLoading(true);
		try {
			const [allSiteItems, gItems] = await Promise.all([
				siteInventoryService.getSiteInventory(siteId),
				inventoryService.getAll(),
			]);
			// Filter only tools
			setSiteTools(allSiteItems.filter((i) => i.isTool === true));
			// Global items that are tools? Or allow picking any global item as a tool?
			// Let's assume we allow picking any item, but mark it as tool.
			// Ideally global items should have 'isTool' flag too, but current type doesn't support it strictly.
			setGlobalItems(gItems);
		} catch (error) {
			console.error('Failed to fetch tools data', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [siteId]);

	const handleAddTool = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newItemOriginalId) return;

		const selectedGlobal = globalItems.find(
			(i) => i.id === newItemOriginalId,
		);
		if (!selectedGlobal) return;

		try {
			setIsAdding(true);
			await siteInventoryService.addItem(siteId, {
				originalItemId: selectedGlobal.id!,
				name: selectedGlobal.name,
				unit: selectedGlobal.unit,
				category: selectedGlobal.category,
				quantity: Number(newItemQty),
				averagePrice: selectedGlobal.unitValue || 0,
				minThreshold: 1, // Tools usually minimum 1
				isTool: true, // IMPORTANT
			});
			setNewItemOriginalId('');
			setNewItemQty(0);
			await fetchData();
		} catch (error) {
			console.error(error);
			alert('Erro ao adicionar ferramenta');
		} finally {
			setIsAdding(false);
		}
	};

	const handleDelete = async (itemId: string) => {
		if (!confirm('Remover ferramenta da obra?')) return;
		try {
			await siteInventoryService.deleteItem(siteId, itemId);
			await fetchData();
		} catch (error) {
			console.error(error);
		}
	};

	const filteredTools = siteTools.filter((item) =>
		item.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
				<div className="relative w-full sm:w-64">
					<Search
						className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
						style={{ color: currentTheme.colors.textSecondary }}
					/>
					<Input
						placeholder="Buscar ferramentas..."
						className="pl-9"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						style={{
							backgroundColor: currentTheme.isDark
								? `${currentTheme.colors.background}80`
								: '#fff',
							borderColor: currentTheme.colors.border,
							color: currentTheme.colors.text,
						}}
					/>
				</div>

				<form
					onSubmit={handleAddTool}
					className="flex gap-2 w-full sm:w-auto items-end"
				>
					<select
						className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						value={newItemOriginalId}
						onChange={(e) => setNewItemOriginalId(e.target.value)}
						style={{
							backgroundColor: currentTheme.isDark
								? `${currentTheme.colors.background}80`
								: '#fff',
							borderColor: currentTheme.colors.border,
							color: currentTheme.colors.text,
							maxWidth: '200px',
						}}
						required
					>
						<option value="">Selecionar...</option>
						{globalItems.map((item) => (
							<option key={item.id} value={item.id}>
								{item.name}
							</option>
						))}
					</select>
					<Input
						type="number"
						placeholder="Qtd"
						className="w-20"
						value={newItemQty}
						onChange={(e) => setNewItemQty(Number(e.target.value))}
						style={{
							backgroundColor: currentTheme.isDark
								? `${currentTheme.colors.background}80`
								: '#fff',
							borderColor: currentTheme.colors.border,
							color: currentTheme.colors.text,
						}}
						min={1}
					/>
					<Button
						type="submit"
						disabled={isAdding || !newItemOriginalId}
					>
						{isAdding ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Plus className="h-4 w-4" />
						)}
					</Button>
				</form>
			</div>

			<div
				className="rounded-md border overflow-hidden"
				style={{
					borderColor: currentTheme.colors.border,
					backgroundColor: currentTheme.colors.card,
				}}
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
									color: currentTheme.colors.textSecondary,
								}}
							>
								Ferramenta
							</th>
							<th
								className="p-4 font-medium text-center"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							>
								Qtd. Disponível
							</th>
							<th
								className="p-4 font-medium"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							>
								Status
							</th>
							<th
								className="p-4 font-medium text-right"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							>
								Ações
							</th>
						</tr>
					</thead>
					<tbody
						className="divide-y"
						style={{ borderColor: currentTheme.colors.border }}
					>
						{filteredTools.length === 0 ? (
							<tr>
								<td
									colSpan={4}
									className="p-8 text-center"
									style={{
										color: currentTheme.colors
											.textSecondary,
									}}
								>
									Nenhuma ferramenta cadastrada nesta obra.
								</td>
							</tr>
						) : (
							filteredTools.map((tool) => (
								<tr
									key={tool.id}
									className="hover:bg-muted/50 transition-colors border-b last:border-0"
									style={{
										borderColor: currentTheme.colors.border,
									}}
								>
									<td
										className="p-4 font-medium flex items-center gap-3"
										style={{
											color: currentTheme.colors.text,
										}}
									>
										<div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-600">
											<Hammer className="h-4 w-4" />
										</div>
										{tool.name}
									</td>
									<td
										className="p-4 text-center"
										style={{
											color: currentTheme.colors.text,
										}}
									>
										<span className="font-bold">
											{tool.quantity}
										</span>
									</td>
									<td className="p-4">
										{tool.quantity > 0 ? (
											<span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
												Disponível
											</span>
										) : (
											<span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
												<AlertTriangle className="h-3 w-3" />
												Indisponível
											</span>
										)}
									</td>
									<td className="p-4 text-right">
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 hover:bg-red-50"
											onClick={() =>
												tool.id && handleDelete(tool.id)
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
	);
}
