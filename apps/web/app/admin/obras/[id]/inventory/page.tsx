'use client';

import React, { useEffect, useState, use } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { inventoryService } from '@/services/firebase/inventory-service'; // Global Items
import { siteInventoryService } from '@/services/firebase/site-inventory-service'; // Site Specific
import { InventoryItem, SiteInventoryItem } from '@/lib/types';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function ObraInventory({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const unwrappedParams = use(params);
	const siteId = unwrappedParams.id;
	const { currentTheme } = useTheme();

	// Data State
	const [siteItems, setSiteItems] = useState<SiteInventoryItem[]>([]);
	const [globalItems, setGlobalItems] = useState<InventoryItem[]>([]); // For dropdown
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

	// Add Item State
	const [newItemOriginalId, setNewItemOriginalId] = useState('');
	const [newItemQty, setNewItemQty] = useState(0);
	const [isAdding, setIsAdding] = useState(false);

	// --- Fetch Data ---
	const fetchData = async () => {
		if (!siteId) return;
		setIsLoading(true);
		try {
			const [sItems, gItems] = await Promise.all([
				siteInventoryService.getSiteInventory(siteId),
				inventoryService.getAll(),
			]);
			setSiteItems(sItems);
			setGlobalItems(gItems);
		} catch (error) {
			console.error('Failed to fetch inventory data', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [siteId]);

	const handleAddItem = async (e: React.FormEvent) => {
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
				minThreshold: selectedGlobal.minThreshold || 0,
				isTool: false, // Default to false for now
			});
			setNewItemOriginalId('');
			setNewItemQty(0);
			await fetchData();
		} catch (error) {
			console.error(error);
			alert('Erro ao adicionar item');
		} finally {
			setIsAdding(false);
		}
	};

	const handleDelete = async (itemId: string) => {
		if (!confirm('Remover item do estoque da obra?')) return;
		try {
			await siteInventoryService.deleteItem(siteId, itemId);
			await fetchData();
		} catch (error) {
			console.error(error);
		}
	};

	const filteredItems = siteItems.filter((item) =>
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
			{/* Header Actions */}
			<div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
				<div className="relative w-full sm:w-64">
					<Search
						className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
						style={{ color: currentTheme.colors.textSecondary }}
					/>
					<Input
						placeholder="Buscar no estoque..."
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

				{/* Simple Add Item Form (Inline) */}
				<form
					onSubmit={handleAddItem}
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
						<option value="">Selecionar Item...</option>
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
						min={0}
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

			{/* Inventory Table */}
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
								Item
							</th>
							<th
								className="p-4 font-medium"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							>
								Categoria
							</th>
							<th
								className="p-4 font-medium"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							>
								Estoque Atual
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
						{filteredItems.length === 0 ? (
							<tr>
								<td
									colSpan={4}
									className="p-8 text-center"
									style={{
										color: currentTheme.colors
											.textSecondary,
									}}
								>
									Nenhum item no estoque desta obra.
								</td>
							</tr>
						) : (
							filteredItems.map((item) => (
								<tr
									key={item.id}
									className="hover:bg-muted/50 transition-colors border-b last:border-0"
									style={{
										borderColor: currentTheme.colors.border,
									}}
								>
									<td
										className="p-4 font-medium"
										style={{
											color: currentTheme.colors.text,
										}}
									>
										{item.name}
									</td>
									<td
										className="p-4"
										style={{
											color: currentTheme.colors
												.textSecondary,
										}}
									>
										<span
											className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border"
											style={{
												backgroundColor: `${currentTheme.colors.primary}10`,
												color: currentTheme.colors
													.primary,
												borderColor: `${currentTheme.colors.primary}20`,
											}}
										>
											{item.category}
										</span>
									</td>
									<td
										className="p-4"
										style={{
											color: currentTheme.colors.text,
										}}
									>
										{item.quantity}{' '}
										<span className="text-xs opacity-70">
											{item.unit}
										</span>
									</td>
									<td className="p-4 text-right space-x-2">
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 hover:bg-red-50"
											onClick={() =>
												item.id && handleDelete(item.id)
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
