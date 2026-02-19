'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { useSidebar } from '@/contexts/sidebar-context';
import { useAuth } from '@/contexts/auth-context';
import { accessProfileService } from '@/services';
import { useRouter } from 'next/navigation';
import {
	Search,
	Settings,
	Menu,
	LogOut,
	User as UserIcon,
	ChevronDown,
} from 'lucide-react';
import { User, AccessProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopBarProps {
	onToggleSettings: () => void;
	isSettingsOpen: boolean;
	hasSettingsAccess?: boolean;
}

export function TopBar({
	onToggleSettings,
	isSettingsOpen,
	hasSettingsAccess = true,
}: TopBarProps) {
	const { currentTheme } = useTheme();
	const { toggleMobileSidebar } = useSidebar();
	const { user, logout } = useAuth();
	const router = useRouter();

	const [profileName, setProfileName] = useState<string>('');
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			if (user?.profileId) {
				try {
					const profile = await accessProfileService.getById(
						user.profileId,
					);
					if (profile) setProfileName(profile.name);
				} catch (e) {
					console.error('Erro ao carregar perfil na TopBar', e);
				}
			} else if (user?.role) {
				const roles: Record<string, string> = {
					admin: 'Administrador',
					almoxarife: 'Almoxarife',
					operario: 'Operário',
				};
				setProfileName(roles[user.role] || user.role);
			}
		};
		fetchProfile();
	}, [user]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setIsUserMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = async () => {
		await logout();
	};

	const getInitials = (name?: string) => {
		if (!name) return '??';
		const parts = name.trim().split(' ');
		if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	};

	return (
		<header
			className="backdrop-blur-sm sticky top-0 z-30 px-4 sm:px-8 py-4 flex gap-4 justify-between items-center transition-colors duration-300 relative"
			style={{
				backgroundColor: currentTheme.colors.sidebar,
				color: currentTheme.colors.sidebarText,
			}}
		>
			<div
				className="absolute bottom-0 left-0 right-0 h-[1px]"
				style={{
					backgroundColor: currentTheme.colors.sidebarText,
					opacity: 0.12,
				}}
			/>

			<div className="flex items-center gap-4">
				<button
					onClick={toggleMobileSidebar}
					className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
					style={{ color: currentTheme.colors.sidebarText }}
				>
					<Menu size={24} />
				</button>
			</div>

			<div className="flex items-center gap-3 justify-end flex-1">
				{/* Search Bar - Hidden on mobile */}
				<div className="hidden md:flex items-center bg-white/10 rounded-lg px-3 py-1.5 w-64 border border-white/10 focus-within:border-white/30 transition-colors">
					<Search size={18} className="text-white/60 mr-2" />
					<input
						type="text"
						placeholder="Pesquisar..."
						className="bg-transparent border-none outline-none text-sm w-full placeholder-white/40 text-white"
					/>
				</div>

				<div className="h-6 w-[1px] bg-white/10 mx-2 hidden md:block"></div>

				{hasSettingsAccess && (
					<button
						onClick={onToggleSettings}
						className={cn(
							'p-2 rounded-lg transition-all duration-300 relative group',
							isSettingsOpen
								? 'bg-white/20'
								: 'hover:bg-white/10',
						)}
						title="Configurações"
					>
						<Settings
							size={20}
							className={cn(
								'transition-transform duration-500',
								isSettingsOpen && 'rotate-180',
							)}
						/>
					</button>
				)}

				<div className="relative" ref={menuRef}>
					<button
						onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
						className="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
					>
						<div
							className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold shadow-sm"
							style={{
								backgroundColor: currentTheme.colors.primary,
								color: '#fff',
							}}
						>
							{getInitials(user?.name)}
						</div>
						<div className="hidden md:block text-left">
							<p className="text-sm font-medium leading-none mb-0.5">
								{user?.name}
							</p>
							<p className="text-[10px] opacity-70 font-light tracking-wide uppercase">
								{profileName}
							</p>
						</div>
						<ChevronDown
							size={14}
							className={cn(
								'ml-1 opacity-50 transition-transform duration-200',
								isUserMenuOpen && 'rotate-180',
							)}
						/>
					</button>

					{isUserMenuOpen && (
						<div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
							<div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 mb-2">
								<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
									{user?.name}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
									{user?.email}
								</p>
							</div>

							<div className="px-2 space-y-1">
								<button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
									<UserIcon size={16} />
									<span>Meu Perfil</span>
								</button>
								<button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
									<Settings size={16} />
									<span>Preferências</span>
								</button>
							</div>

							<div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/10 px-2">
								<button
									onClick={handleLogout}
									className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
								>
									<LogOut size={16} />
									<span>Sair</span>
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
