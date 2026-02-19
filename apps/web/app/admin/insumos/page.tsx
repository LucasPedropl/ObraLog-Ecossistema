'use client';

import { useState, useEffect } from 'react';
import { inventoryService } from '@/services/firebase/inventory-service';
import { InventoryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/theme-context';
import {
	Loader2,
	Plus,
	Edit2,
	Trash2,
	Search,
	ArrowUpDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InsumosPage() {
	const [items, setItems] = useState<InventoryItem[]>([]);
	const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { currentTheme } = useTheme();
	const [searchQuery, setSearchQuery] = useState('');
	const [sortConfig, setSortConfig] = useState<{
		key: keyof InventoryItem;
		direction: 'asc' | 'desc';
	} | null>(null);

	const fetchItems = async () => {
		setIsLoading(true);
		try {
			const data = await inventoryService.getAll();
			setItems(data);
			setFilteredItems(data);
		} catch (error) {
			console.error('Failed to fetch inventory', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchItems();
	}, []);

	useEffect(() => {
		let result = [...items];

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(item) =>
					item.name.toLowerCase().includes(query) ||
					item.category.toLowerCase().includes(query) ||
					item.code?.toLowerCase().includes(query),
			);
		}

		if (sortConfig) {
			result.sort((a, b) => {
				const valA = a[sortConfig.key] ?? '';
				const valB = b[sortConfig.key] ?? '';

				if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
				if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
				return 0;
			});
		}

		setFilteredItems(result);
	}, [searchQuery, items, sortConfig]);

	const handleSort = (key: keyof InventoryItem) => {
		let direction: 'asc' | 'desc' = 'asc';
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === 'asc'
		) {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Tem certeza que deseja excluir este item?')) return;
		try {
			await inventoryService.delete(id);
			await fetchItems();
		} catch (err) {
			console.error(err);
			alert('Erro ao excluir item');
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
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1
						className="text-2xl font-bold tracking-tight"
						style={{ color: currentTheme.colors.text }}
					>
						Insumos
					</h1>
					<p style={{ color: currentTheme.colors.textSecondary }}>
						Gerencie o catálogo de materiais e equipamentos.
					</p>
				</div>
				<Button className="bg-primary text-primary-foreground">
					<Plus className="h-4 w-4 mr-2" />
					Novo Item
				</Button>
			</div>

			<div
				className="rounded-md border p-4 space-y-4"
				style={{
					backgroundColor: currentTheme.colors.card,
					borderColor: currentTheme.colors.border,
				}}
			>
				<div className="relative">
					<Search
						className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
						style={{ color: currentTheme.colors.textSecondary }}
					/>
					<Input
						placeholder="Buscar insumos..."
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
									className="p-4 font-medium cursor-pointer hover:bg-muted/50"
									onClick={() => handleSort('name')}
									style={{
										color: currentTheme.colors
											.textSecondary,
									}}
								>
									<div className="flex items-center">
										Nome{' '}
										<ArrowUpDown className="ml-2 h-3 w-3" />
									</div>
								</th>
								<th
									className="p-4 font-medium cursor-pointer hover:bg-muted/50"
									onClick={() => handleSort('category')}
									style={{
										color: currentTheme.colors
											.textSecondary,
									}}
								>
									<div className="flex items-center">
										Categoria{' '}
										<ArrowUpDown className="ml-2 h-3 w-3" />
									</div>
								</th>
								<th
									className="p-4 font-medium cursor-pointer hover:bg-muted/50"
									onClick={() => handleSort('quantity')}
									style={{
										color: currentTheme.colors
											.textSecondary,
									}}
								>
									<div className="flex items-center">
										Estoque{' '}
										<ArrowUpDown className="ml-2 h-3 w-3" />
									</div>
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
										Nenhum item encontrado.
									</td>
								</tr>
							) : (
								filteredItems.map((item) => (
									<tr
										key={item.id}
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
											{item.quantity} {item.unit}
										</td>
										<td className="p-4 text-right space-x-2">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 hover:bg-muted"
											>
												<Edit2
													className="h-4 w-4"
													style={{
														color: currentTheme
															.colors.primary,
													}}
												/>
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 hover:bg-red-50"
												onClick={() =>
													item.id &&
													handleDelete(item.id)
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
				<div
					className="text-xs text-center"
					style={{ color: currentTheme.colors.textSecondary }}
				>
					Mostrando {filteredItems.length} de {items.length} itens
				</div>
			</div>
		</div>
	);
}
