'use client';

import { useEffect, useState, use } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { constructionService } from '@/services/firebase/construction-service';
import { ConstructionSite } from '@/lib/types';
import { useTheme } from '@/contexts/theme-context';
import {
	Building2,
	LayoutDashboard,
	Package,
	ArrowLeftRight,
	Truck,
	Hammer,
	Settings,
	Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function ObraLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}) {
	const unwrappedParams = use(params);
	const id = unwrappedParams.id;
	const router = useRouter();
	const pathname = usePathname();
	const { currentTheme } = useTheme();
	const [site, setSite] = useState<ConstructionSite | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSite = async () => {
			if (!id) return;
			try {
				const data = await constructionService.getById(id);
				if (data) {
					setSite(data);
				} else {
					router.push('/admin/obras');
				}
			} catch (error) {
				console.error(error);
				router.push('/admin/obras');
			} finally {
				setLoading(false);
			}
		};
		fetchSite();
	}, [id, router]);

	if (loading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<Loader2
					className="animate-spin h-8 w-8"
					style={{ color: currentTheme.colors.primary }}
				/>
			</div>
		);
	}

	if (!site) return null;

	const tabs = [
		{ path: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
		{ path: 'inventory', label: 'Almoxarifado', icon: Package },
		{ path: 'tools', label: 'Ferramentas', icon: Hammer },
		{ path: 'rented', label: 'Equip. Alugados', icon: Truck },
		{ path: 'movements', label: 'Movimentações', icon: ArrowLeftRight },
	];

	return (
		<div className="flex flex-col h-full">
			{/* Header Container */}
			<div
				className="flex-shrink-0 border-b shadow-sm z-10"
				style={{
					backgroundColor:
						currentTheme.colors.background === '#f8fafc'
							? '#ffffff'
							: currentTheme.colors.card,
					borderColor: currentTheme.colors.border,
				}}
			>
				{/* Main Title Row */}
				<div className="px-6 py-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
					<div className="flex items-center gap-4">
						<div
							className="p-3 rounded-xl shadow-sm border"
							style={{
								backgroundColor: currentTheme.colors.background,
								borderColor: currentTheme.colors.border,
							}}
						>
							<Building2
								className="h-8 w-8"
								style={{ color: currentTheme.colors.primary }}
							/>
						</div>
						<div>
							<h1
								className="text-2xl font-bold leading-tight"
								style={{ color: currentTheme.colors.text }}
							>
								{site.name}
							</h1>
							<p
								className="text-sm opacity-70"
								style={{
									color: currentTheme.colors.textSecondary,
								}}
							>
								Gerencie o andamento e recursos desta obra.
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 self-start md:self-center">
						<Button
							variant="outline"
							onClick={() =>
								router.push(`/admin/obras/${id}/settings`)
							}
							className="flex items-center gap-2"
							style={{
								borderColor: currentTheme.colors.border,
								color: currentTheme.colors.text,
							}}
						>
							<Settings size={18} />
							<span className="hidden sm:inline">Configurar</span>
						</Button>
					</div>
				</div>

				{/* Tabs Navigation */}
				<div className="px-6 flex overflow-x-auto gap-1 no-scrollbar">
					{tabs.map((tab) => {
						const isActive = pathname.includes(`/${tab.path}`);
						const Icon = tab.icon;

						return (
							<Link
								key={tab.path}
								href={`/admin/obras/${id}/${tab.path}`}
								className={cn(
									'flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap',
									isActive
										? 'border-primary text-primary'
										: 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
								)}
								style={{
									color: isActive
										? currentTheme.colors.primary
										: currentTheme.colors.textSecondary,
									borderColor: isActive
										? currentTheme.colors.primary
										: 'transparent',
								}}
							>
								<Icon size={18} />
								{tab.label}
							</Link>
						);
					})}
				</div>
			</div>

			{/* Main Content Area */}
			<div
				className="flex-1 overflow-auto p-6 transition-colors duration-300"
				style={{ backgroundColor: currentTheme.colors.background }}
			>
				{children}
			</div>
		</div>
	);
}
