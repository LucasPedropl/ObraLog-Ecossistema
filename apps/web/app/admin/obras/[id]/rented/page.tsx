'use client';

import React, { useEffect, useState, use } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { rentedEquipmentService } from '@/services/firebase/rented-equipment-service';
import { RentedEquipment } from '@/lib/types';
import { Plus, Search, Truck, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function ObraRented({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const unwrappedParams = use(params);
	const siteId = unwrappedParams.id;
	const { currentTheme } = useTheme();

	// Data
	const [rentedItems, setRentedItems] = useState<RentedEquipment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

	// Add Logic
	const [newItemName, setNewItemName] = useState('');
	const [newItemSupplier, setNewItemSupplier] = useState('');
	const [isAdding, setIsAdding] = useState(false);

	const fetchData = async () => {
		if (!siteId) return;
		setIsLoading(true);
		try {
			const items = await rentedEquipmentService.getAll(siteId);
			setRentedItems(items);
		} catch (error) {
			console.error('Failed to fetch rented items', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [siteId]);

	const handleAddRented = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newItemName || !newItemSupplier) return;

		try {
			setIsAdding(true);
			await rentedEquipmentService.registerEntry(siteId, {
				name: newItemName,
				supplier: newItemSupplier,
				entryDate: new Date(),
				entryPhotos: [], // TODO: File upload
			});
			setNewItemName('');
			setNewItemSupplier('');
			await fetchData();
		} catch (error) {
			console.error(error);
			alert('Erro ao registrar entrada');
		} finally {
			setIsAdding(false);
		}
	};

	const handleReturn = async (itemId: string) => {
		if (!confirm('Registrar devolução deste equipamento?')) return;
		try {
			// Usually we'd ask for date and photos. Here defaulting to now.
			await rentedEquipmentService.registerExit(siteId, itemId, {
				exitDate: new Date(),
				exitPhotos: [],
			});
			await fetchData();
		} catch (error) {
			console.error(error);
			alert('Erro ao registrar devolução');
		}
	};

	const filteredItems = rentedItems.filter(
		(item) =>
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
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
						placeholder="Buscar equipamentos..."
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
					onSubmit={handleAddRented}
					className="flex gap-2 w-full sm:w-auto items-end"
				>
					<Input
						placeholder="Nome do Equipamento"
						className="w-48"
						value={newItemName}
						onChange={(e) => setNewItemName(e.target.value)}
						style={{
							backgroundColor: currentTheme.isDark
								? `${currentTheme.colors.background}80`
								: '#fff',
							borderColor: currentTheme.colors.border,
							color: currentTheme.colors.text,
						}}
						required
					/>
					<Input
						placeholder="Fornecedor"
						className="w-40"
						value={newItemSupplier}
						onChange={(e) => setNewItemSupplier(e.target.value)}
						style={{
							backgroundColor: currentTheme.isDark
								? `${currentTheme.colors.background}80`
								: '#fff',
							borderColor: currentTheme.colors.border,
							color: currentTheme.colors.text,
						}}
						required
					/>
					<Button type="submit" disabled={isAdding || !newItemName}>
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
								Equipamento
							</th>
							<th
								className="p-4 font-medium"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							>
								Fornecedor
							</th>
							<th
								className="p-4 font-medium"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							>
								Entrada
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
						{filteredItems.length === 0 ? (
							<tr>
								<td
									colSpan={5}
									className="p-8 text-center"
									style={{
										color: currentTheme.colors
											.textSecondary,
									}}
								>
									Nenhum equipamento alugado registrado.
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
										className="p-4 font-medium flex items-center gap-3"
										style={{
											color: currentTheme.colors.text,
										}}
									>
										<div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600">
											<Truck className="h-4 w-4" />
										</div>
										{item.name}
									</td>
									<td
										className="p-4"
										style={{
											color: currentTheme.colors.text,
										}}
									>
										{item.supplier}
									</td>
									<td
										className="p-4"
										style={{
											color: currentTheme.colors
												.textSecondary,
										}}
									>
										{item.entryDate
											? new Date(
													item.entryDate,
												).toLocaleDateString()
											: '-'}
									</td>
									<td className="p-4">
										{item.status === 'ACTIVE' ? (
											<span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
												<ArrowUpRight className="h-3 w-3" />
												Ativo
											</span>
										) : (
											<span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
												<ArrowDownLeft className="h-3 w-3" />
												Devolvido
											</span>
										)}
									</td>
									<td className="p-4 text-right">
										{item.status === 'ACTIVE' && (
											<Button
												variant="outline"
												size="sm"
												className="h-8"
												onClick={() =>
													item.id &&
													handleReturn(item.id)
												}
											>
												Devolver
											</Button>
										)}
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
