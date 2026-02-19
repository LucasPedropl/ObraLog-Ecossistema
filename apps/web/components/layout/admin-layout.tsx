'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
	LayoutDashboard,
	HardHat,
	Settings,
	ChevronLeft,
	ChevronRight,
	Building2,
	Calculator,
	ShieldCheck,
	ChevronDown,
	ChevronUp,
	Users,
	FileText,
	Ruler,
	Tag,
	FolderDot,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { useSidebar } from '@/contexts/sidebar-context';
import { useSettingsSidebar } from '@/contexts/settings-context';
import { usePermissions } from '@/contexts/permissions-context';
import { TopBar } from './top-bar';
import { constructionService } from '@/services';
import { ConstructionSite } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const RAW_SETTINGS_MENUS = [
	{
		id: 'orcamento',
		label: 'Orçamento',
		icon: Calculator,
		items: [
			{
				label: 'Insumos',
				path: '/admin/insumos',
				icon: FileText,
				permission: 'orcamento_insumos:view',
			},
			{
				label: 'Unid. de Medidas',
				path: '/admin/unidades',
				icon: Ruler,
				permission: 'orcamento_unidades:view',
			},
			{
				label: 'Categorias',
				path: '/admin/categorias',
				icon: Tag,
				permission: 'orcamento_categorias:view',
			},
		],
	},
	{
		id: 'acesso',
		label: 'Acesso ao sistema',
		icon: ShieldCheck,
		items: [
			{
				label: 'Perfis de acesso',
				path: '/admin/perfis',
				icon: ShieldCheck,
				permission: 'acesso_perfis:view',
			},
			{
				label: 'Usuários',
				path: '/admin/usuarios',
				icon: Users,
				permission: 'acesso_usuarios:view',
			},
		],
	},
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const { currentTheme } = useTheme();
	const {
		hasPermission,
		allowedSites,
		allSites,
		isAdmin,
		isLoading: isPermissionsLoading,
	} = usePermissions();

	const {
		isCollapsed: isPrimaryCollapsed,
		toggleSidebar: togglePrimarySidebar,
		isMobileOpen,
		closeMobileSidebar,
	} = useSidebar();

	const {
		isSettingsOpen,
		isSettingsCollapsed,
		toggleSettingsOpen,
		toggleSettingsCollapse,
		openSettings,
		closeSettings,
	} = useSettingsSidebar();

	const [sites, setSites] = useState<ConstructionSite[]>([]);
	const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
		orcamento: true,
		acesso: true,
	});

	const settingsMenus = RAW_SETTINGS_MENUS.map((menu) => ({
		...menu,
		items: menu.items.filter((item) =>
			hasPermission(item.permission.split(':')[0], 'view'),
		),
	})).filter((menu) => menu.items.length > 0);

	const hasSettingsAccess = settingsMenus.length > 0;

	useEffect(() => {
		const fetchSites = async () => {
			try {
				const data = await constructionService.getAll();

				const filteredSites = data.filter((site) => {
					if (isAdmin || allSites) return true;
					return allowedSites.includes(site.id!);
				});

				setSites(filteredSites);
			} catch (error) {
				console.error('Failed to fetch sites for sidebar', error);
			}
		};
		if (!isPermissionsLoading) {
			fetchSites();
		}
	}, [isPermissionsLoading, allowedSites, allSites, isAdmin]);

	// Handle auto-open settings
	useEffect(() => {
		// Logic to open settings if we navigate to a settings page
		const isSettingsPath = RAW_SETTINGS_MENUS.some((m) =>
			m.items.some((i) => pathname.startsWith(i.path)),
		);
		if (isSettingsPath && !isSettingsOpen) {
			openSettings();
		}
	}, [pathname, isSettingsOpen, openSettings]);

	useEffect(() => {
		closeMobileSidebar();
	}, [pathname]);

	const toggleMenu = (menu: string) => {
		setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
	};

	const navItemsRaw = [
		{
			icon: LayoutDashboard,
			label: 'Dashboard',
			path: '/admin/dashboard',
			permission: 'dashboard:view',
		},
		{
			icon: Building2,
			label: 'Gerenciar Obras',
			path: '/admin/obras',
			permission: 'obras:view',
		},
	];

	const navItems = navItemsRaw.filter((item) =>
		hasPermission(item.permission.split(':')[0], 'view'),
	);

	const handlePrimaryNavigate = (path: string) => {
		router.push(path);
		// Logic to close/open settings based on destination could go here
		const isSettingsPath = RAW_SETTINGS_MENUS.some((m) =>
			m.items.some((i) => path.startsWith(i.path)),
		);
		if (!isSettingsPath && isSettingsOpen) {
			// closeSettings(); // Optional, depends on UX preference
		}
	};

	const handleSettingsNavigate = (path: string) => {
		router.push(path);
		if (window.innerWidth < 768) closeSettings();
	};

	const showContent = true; // Simplified for now

	// Inline styles for theme colors
	const sidebarStyle = {
		backgroundColor: currentTheme.colors.sidebar,
		color: currentTheme.colors.sidebarText,
		borderColor: currentTheme.colors.border,
	};

	const getSidebarItemStyle = (isActive: boolean) => ({
		backgroundColor: isActive
			? currentTheme.isDark ||
				['#000000', '#09090b', '#18181b'].includes(
					currentTheme.colors.sidebar,
				)
				? 'rgba(255,255,255,0.12)'
				: `${currentTheme.colors.primary}15`
			: 'transparent',
		color: currentTheme.colors.sidebarText,
		opacity: isActive ? 1 : 0.7,
		fontWeight: isActive ? 600 : 400,
	});

	if (isPermissionsLoading) {
		// Create a nice loading skeleton or just return null
		return (
			<div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950">
				Carregando...
			</div>
		);
	}

	return (
		<div
			className="h-screen flex flex-row overflow-hidden transition-colors duration-300"
			style={{ backgroundColor: currentTheme.colors.background }}
		>
			{isMobileOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
					onClick={closeMobileSidebar}
				/>
			)}

			{/* Primary Sidebar */}
			<aside
				className={cn(
					'fixed md:relative inset-y-0 left-0 z-50 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out shadow-2xl md:shadow-none',
					isMobileOpen
						? 'translate-x-0 w-64'
						: '-translate-x-full md:translate-x-0',
					isPrimaryCollapsed ? 'md:w-20' : 'md:w-64',
				)}
				style={sidebarStyle}
			>
				<div
					className="absolute right-0 top-0 bottom-0 w-[1px] z-50"
					style={{
						backgroundColor: currentTheme.colors.sidebarText,
						opacity: 0.12,
					}}
				/>

				<button
					onClick={togglePrimarySidebar}
					className="absolute hidden md:flex items-center justify-center h-6 w-6 rounded-lg border border-solid shadow-sm z-50 transition-colors cursor-pointer hover:opacity-80"
					style={{
						top: '81px',
						right: '-12px',
						transform: 'translateY(-50%)',
						backgroundColor: currentTheme.colors.sidebar,
						borderColor: `${currentTheme.colors.sidebarText}1F`,
						color: currentTheme.colors.sidebarText,
					}}
				>
					{isPrimaryCollapsed ? (
						<ChevronRight size={14} />
					) : (
						<ChevronLeft size={14} />
					)}
				</button>

				<div
					className={cn(
						'h-[81px] p-6 flex items-center transition-all relative',
						isPrimaryCollapsed ? 'md:justify-center' : 'space-x-3',
					)}
				>
					<div
						className="absolute bottom-0 left-0 right-0 h-[1px]"
						style={{
							backgroundColor: currentTheme.colors.sidebarText,
							opacity: 0.12,
						}}
					/>
					<HardHat
						className="h-8 w-8 flex-shrink-0"
						style={{ color: currentTheme.colors.sidebarText }}
					/>
					<div
						className={cn(
							'overflow-hidden whitespace-nowrap',
							isPrimaryCollapsed && !isMobileOpen
								? 'md:hidden'
								: 'block',
						)}
					>
						<h1 className="text-xl font-bold tracking-tight">
							ObraLog
						</h1>
						<p className="text-xs opacity-70">Gestão de Obra</p>
					</div>
				</div>

				<nav className="p-4 space-y-2 flex-1 overflow-y-auto overflow-x-hidden">
					{navItems.map((item) => {
						const isActive = pathname === item.path;
						return (
							<button
								key={item.path}
								onClick={() => handlePrimaryNavigate(item.path)}
								className={cn(
									'group relative w-full flex items-center px-4 py-3 rounded-lg transition-all hover:bg-white/5',
									isPrimaryCollapsed
										? 'md:justify-center'
										: 'space-x-3',
								)}
								style={getSidebarItemStyle(isActive)}
								title={
									isPrimaryCollapsed ? item.label : undefined
								}
							>
								<item.icon className="h-5 w-5 flex-shrink-0" />
								<span
									className={cn(
										'whitespace-nowrap',
										isPrimaryCollapsed && !isMobileOpen
											? 'md:hidden'
											: 'block',
									)}
								>
									{item.label}
								</span>
							</button>
						);
					})}

					{(hasPermission('obras', 'view') || isAdmin) && (
						<div className="pt-4 mt-2 border-t border-white/10">
							<p
								className={cn(
									'px-4 text-xs font-bold uppercase tracking-wider mb-2 opacity-50',
									isPrimaryCollapsed && !isMobileOpen
										? 'md:hidden'
										: 'block',
								)}
							>
								Obras Ativas
							</p>
							<div className="space-y-1">
								{sites.map((site) => (
									<button
										key={site.id}
										onClick={() =>
											handlePrimaryNavigate(
												`/admin/obra/${site.id}`,
											)
										}
										className={cn(
											'group relative w-full flex items-center px-4 py-2 rounded-lg transition-all hover:bg-white/5',
											isPrimaryCollapsed
												? 'md:justify-center'
												: 'space-x-3',
										)}
										style={getSidebarItemStyle(
											pathname.startsWith(
												`/admin/obra/${site.id}`,
											),
										)}
										title={
											isPrimaryCollapsed
												? site.name
												: undefined
										}
									>
										<FolderDot className="h-4 w-4 flex-shrink-0" />
										<span
											className={cn(
												'whitespace-nowrap text-sm truncate',
												isPrimaryCollapsed &&
													!isMobileOpen
													? 'md:hidden'
													: 'block',
											)}
										>
											{site.name}
										</span>
									</button>
								))}
							</div>
						</div>
					)}
				</nav>

				{/* Appearance / Settings Link */}
				{(hasSettingsAccess || isAdmin) && (
					<div className="p-4 relative">
						<div
							className="absolute top-0 left-0 right-0 h-[1px]"
							style={{
								backgroundColor:
									currentTheme.colors.sidebarText,
								opacity: 0.12,
							}}
						/>
						<button
							onClick={() =>
								handlePrimaryNavigate('/admin/settings')
							}
							className={cn(
								'group relative w-full flex items-center px-4 py-3 rounded-lg transition-all hover:bg-white/5',
								isPrimaryCollapsed
									? 'md:justify-center'
									: 'space-x-3',
							)}
							style={getSidebarItemStyle(
								pathname === '/admin/settings',
							)}
							title={isPrimaryCollapsed ? 'Aparência' : undefined}
						>
							<Settings className="h-5 w-5 flex-shrink-0" />
							<span
								className={cn(
									'whitespace-nowrap',
									isPrimaryCollapsed && !isMobileOpen
										? 'md:hidden'
										: 'block',
								)}
							>
								Aparência
							</span>
						</button>
					</div>
				)}
			</aside>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
				<TopBar
					onToggleSettings={toggleSettingsOpen}
					isSettingsOpen={isSettingsOpen}
					hasSettingsAccess={hasSettingsAccess}
				/>

				<div className="flex-1 flex overflow-hidden relative">
					{/* Settings Sidebar */}
					<aside
						className={cn(
							'flex-shrink-0 transition-all duration-300 flex flex-col z-20 relative bg-zinc-900 border-r border-white/5',
							isSettingsOpen
								? isSettingsCollapsed
									? 'md:w-20 overflow-visible'
									: 'w-full md:w-64 overflow-y-auto'
								: 'w-0 overflow-hidden',
							isSettingsOpen
								? 'absolute inset-0 md:relative'
								: '',
						)}
						style={sidebarStyle}
					>
						<div className="p-4 space-y-6">
							{settingsMenus.map((menu) => (
								<div key={menu.id} className="relative">
									<button
										onClick={() =>
											!isSettingsCollapsed &&
											toggleMenu(menu.id)
										}
										className={cn(
											'w-full flex items-center mb-2 p-2 rounded hover:bg-white/5 transition-colors',
											isSettingsCollapsed
												? 'justify-center'
												: 'justify-between',
										)}
									>
										<div
											className={cn(
												'flex items-center gap-2 font-semibold',
												isSettingsCollapsed
													? 'justify-center'
													: '',
											)}
											style={{
												color: currentTheme.colors
													.sidebarText,
											}}
										>
											<menu.icon size={18} />
											{!isSettingsCollapsed && (
												<span>{menu.label}</span>
											)}
										</div>
										{!isSettingsCollapsed &&
											(openMenus[menu.id] ? (
												<ChevronUp
													size={14}
													className="opacity-70"
												/>
											) : (
												<ChevronDown
													size={14}
													className="opacity-70"
												/>
											))}
									</button>

									{(!isSettingsCollapsed ||
										window.innerWidth < 768) &&
										openMenus[menu.id] && (
											<div className="ml-4 pl-4 border-l border-white/10 space-y-1">
												{menu.items.map((subItem) => (
													<button
														key={subItem.path}
														onClick={() =>
															handleSettingsNavigate(
																subItem.path,
															)
														}
														className="block w-full text-left py-2 px-3 rounded text-sm transition-colors hover:bg-white/5"
														style={getSidebarItemStyle(
															pathname ===
																subItem.path,
														)}
													>
														<div className="flex items-center gap-2">
															<subItem.icon
																size={14}
															/>
															{subItem.label}
														</div>
													</button>
												))}
											</div>
										)}
								</div>
							))}
						</div>
					</aside>

					{/* Toggle Strip for Settings sidebar */}
					{isSettingsOpen && (
						<div
							className="absolute top-0 bottom-0 left-0 z-40 hidden md:flex items-center justify-start cursor-pointer group"
							style={{
								width: '12px',
								marginLeft: isSettingsCollapsed
									? '79px'
									: '255px',
								transition: 'margin-left 0.3s',
							}}
							onClick={toggleSettingsCollapse}
						>
							<div
								className="absolute top-0 bottom-0 left-0 w-[1px] group-hover:w-[2px] transition-all duration-200"
								style={{
									backgroundColor: currentTheme.colors.border,
								}}
							/>
							{/* Optional handle */}
						</div>
					)}

					{/* Page Content */}
					<main
						className={cn(
							'flex-1 relative w-full h-full overflow-hidden flex flex-col',
							isSettingsOpen ? 'hidden md:flex' : 'flex',
						)}
					>
						<div
							className={cn(
								'flex-1 overflow-y-auto w-full',
								pathname.startsWith('/admin/obra/')
									? ''
									: 'p-4 sm:p-8',
							)}
						>
							{children}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
