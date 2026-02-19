'use client';

// ...existing code...
import React, { useEffect, useState } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import {
	AlertTriangle,
	Package,
	TrendingUp,
	DollarSign,
	Loader2,
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { inventoryService } from '@/services/firebase/inventory-service';
import { InventoryItem } from '@/lib/types';
import { cn } from '@/lib/utils';
// import { Card } from '@/components/ui/card';

interface StatCardProps {
	title: string;
	value: string;
	icon: React.ElementType;
	trend?: string;
	colorClass: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	theme: any;
}

const StatCard: React.FC<StatCardProps> = ({
	title,
	value,
	icon: Icon,
	trend,
	colorClass,
	theme,
}) => (
	<div
		className="p-6 rounded-xl shadow-sm border"
		style={{
			backgroundColor: theme.colors.card,
			borderColor: theme.colors.border,
		}}
	>
		<div className="flex items-start justify-between">
			<div>
				<p
					className="text-sm font-medium"
					style={{ color: theme.colors.textSecondary }}
				>
					{title}
				</p>
				<h3
					className="text-2xl font-bold mt-2"
					style={{ color: theme.colors.text }}
				>
					{value}
				</h3>
			</div>
			<div className={cn('p-3 rounded-lg', colorClass)}>
				<Icon className="h-6 w-6 text-white" />
			</div>
		</div>
		{trend && (
			<p className="text-sm text-green-500 mt-4 flex items-center">
				<TrendingUp className="h-3 w-3 mr-1" /> {trend}
			</p>
		)}
	</div>
);

export default function DashboardPage() {
	const [items, setItems] = useState<InventoryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { currentTheme } = useTheme();

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const data = await inventoryService.getAll();
				setItems(data);
			} catch (error) {
				console.error('Failed to fetch inventory', error);
				// Mock data if failed or empty for demo
			} finally {
				setIsLoading(false);
			}
		};
		fetchItems();
	}, []);

	const lowStockItems = items.filter(
		(i) => i.quantity <= (i.minThreshold || 0),
	);
	const totalItems = items.reduce(
		(acc, curr) => acc + (curr.quantity || 0),
		0,
	);
	const distinctItems = items.length;

	const chartData =
		items.length > 0
			? items
					.slice(0, 5)
					.map((i) => ({ name: i.name, quantidade: i.quantity || 0 }))
			: [
					{ name: 'Cimento', quantidade: 40 },
					{ name: 'Areia', quantidade: 30 },
					{ name: 'Tijolo', quantidade: 20 },
					{ name: 'Brita', quantidade: 27 },
					{ name: 'Aço', quantidade: 18 },
				];

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
					Dashboard
				</h1>
				<p style={{ color: currentTheme.colors.textSecondary }}>
					Visão geral do almoxarifado central
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<StatCard
					title="Itens Cadastrados"
					value={distinctItems.toString()}
					icon={Package}
					trend={isLoading ? undefined : '+4 novos hoje'}
					colorClass="bg-blue-500"
					theme={currentTheme}
				/>
				<StatCard
					title="Estoque Total"
					value={totalItems.toString()}
					icon={TrendingUp}
					colorClass="bg-emerald-500"
					theme={currentTheme}
				/>
				<StatCard
					title="Alertas de Baixo Estoque"
					value={lowStockItems.length.toString()}
					icon={AlertTriangle}
					colorClass="bg-orange-500"
					theme={currentTheme}
				/>
				<StatCard
					title="Valor Estimado"
					value="R$ 124.500"
					icon={DollarSign}
					colorClass="bg-purple-500"
					theme={currentTheme}
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div
					className="p-6 rounded-xl shadow-sm border"
					style={{
						backgroundColor: currentTheme.colors.card,
						borderColor: currentTheme.colors.border,
					}}
				>
					<h3
						className="text-lg font-semibold mb-6"
						style={{ color: currentTheme.colors.text }}
					>
						Itens com Maior Estoque
					</h3>
					<div className="h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={chartData}>
								<CartesianGrid
									strokeDasharray="3 3"
									vertical={false}
									stroke={currentTheme.colors.border}
								/>
								<XAxis
									dataKey="name"
									axisLine={false}
									tickLine={false}
									tick={{
										fill: currentTheme.colors.textSecondary,
									}}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{
										fill: currentTheme.colors.textSecondary,
									}}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor:
											currentTheme.colors.card,
										borderColor: currentTheme.colors.border,
										color: currentTheme.colors.text,
									}}
									cursor={{
										fill: currentTheme.colors.background,
										opacity: 0.5,
									}}
								/>
								<Bar
									dataKey="quantidade"
									fill={currentTheme.colors.primary}
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div
					className="p-6 rounded-xl shadow-sm border"
					style={{
						backgroundColor: currentTheme.colors.card,
						borderColor: currentTheme.colors.border,
					}}
				>
					<h3
						className="text-lg font-semibold mb-6"
						style={{ color: currentTheme.colors.text }}
					>
						Atividades Recentes
					</h3>
					<div className="space-y-4">
						{[1, 2, 3, 4, 5].map((_, i) => (
							<div
								key={i}
								className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
								style={{
									borderColor: currentTheme.colors.border,
								}}
							>
								<div className="flex items-center gap-3">
									<div
										className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs"
										style={{
											backgroundColor: `${currentTheme.colors.primary}20`,
											color: currentTheme.colors.primary,
										}}
									>
										JS
									</div>
									<div>
										<p
											className="text-sm font-medium"
											style={{
												color: currentTheme.colors.text,
											}}
										>
											João Silva retirou Cimento
										</p>
										<p
											className="text-xs"
											style={{
												color: currentTheme.colors
													.textSecondary,
											}}
										>
											Há 2 horas • Obra Centro
										</p>
									</div>
								</div>
								<span
									className="text-sm font-semibold"
									style={{ color: currentTheme.colors.text }}
								>
									-10 un
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
