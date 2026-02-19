'use client';

import React, { useEffect, useState, use } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { siteInventoryService } from '@/services/firebase/site-inventory-service';
import { StockMovement } from '@/lib/types';
import {
	Search,
	ArrowDownLeft,
	ArrowUpRight,
	Calendar,
	User,
	FileText,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function ObraMovements({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const unwrappedParams = use(params);
	const siteId = unwrappedParams.id;
	const { currentTheme } = useTheme();

	const [movements, setMovements] = useState<StockMovement[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const fetchMovements = async () => {
			if (!siteId) return;
			setIsLoading(true);
			try {
				const data =
					await siteInventoryService.getAllSiteMovements(siteId);
				setMovements(data);
			} catch (error) {
				console.error('Failed to fetch movements', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchMovements();
	}, [siteId]);

	const filteredData = movements.filter(
		(m) =>
			m.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			'' ||
			m.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			'' ||
			m.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			'',
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
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="relative w-full sm:w-80">
					<Search
						className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
						style={{ color: currentTheme.colors.textSecondary }}
					/>
					<Input
						placeholder="Buscar por item, usuário ou motivo..."
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
				<div
					className="text-sm opacity-70"
					style={{ color: currentTheme.colors.textSecondary }}
				>
					{filteredData.length} registros encontrados
				</div>
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
								Data/Hora
							</th>
							<th
								className="p-4 font-medium"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							>
								Tipo
							</th>
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
								Qtd.
							</th>
							<th
								className="p-4 font-medium"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							>
								Responsável
							</th>
							<th
								className="p-4 font-medium"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							>
								Motivo
							</th>
						</tr>
					</thead>
					<tbody
						className="divide-y"
						style={{ borderColor: currentTheme.colors.border }}
					>
						{filteredData.length === 0 ? (
							<tr>
								<td
									colSpan={6}
									className="p-8 text-center"
									style={{
										color: currentTheme.colors
											.textSecondary,
									}}
								>
									Nenhuma movimentação registrada.
								</td>
							</tr>
						) : (
							filteredData.map((m) => (
								<tr
									key={m.id || Math.random()}
									className="hover:bg-muted/50 transition-colors border-b last:border-0"
									style={{
										borderColor: currentTheme.colors.border,
									}}
								>
									<td
										className="p-4 whitespace-nowrap symbol-font"
										style={{
											color: currentTheme.colors
												.textSecondary,
										}}
									>
										<div className="flex items-center gap-2">
											<Calendar className="h-3 w-3 opacity-50" />
											{m.date.toLocaleString('pt-BR')}
										</div>
									</td>
									<td className="p-4">
										{m.type === 'IN' ? (
											<span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
												<ArrowDownLeft className="h-3 w-3" />
												Entrada
											</span>
										) : (
											<span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
												<ArrowUpRight className="h-3 w-3" />
												Saída
											</span>
										)}
									</td>
									<td
										className="p-4 font-medium"
										style={{
											color: currentTheme.colors.text,
										}}
									>
										{m.itemName}
									</td>
									<td
										className="p-4 font-bold"
										style={{
											color: currentTheme.colors.text,
										}}
									>
										{m.quantity}{' '}
										<span className="text-xs font-normal opacity-70">
											{m.itemUnit}
										</span>
									</td>
									<td
										className="p-4"
										style={{
											color: currentTheme.colors
												.textSecondary,
										}}
									>
										<div className="flex items-center gap-2">
											<User className="h-3 w-3 opacity-50" />
											{m.userName || 'Sistema'}
										</div>
									</td>
									<td
										className="p-4 max-w-xs truncate"
										style={{
											color: currentTheme.colors
												.textSecondary,
										}}
									>
										<div
											className="flex items-center gap-2"
											title={m.reason}
										>
											<FileText className="h-3 w-3 opacity-50" />
											{m.reason || '-'}
										</div>
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
