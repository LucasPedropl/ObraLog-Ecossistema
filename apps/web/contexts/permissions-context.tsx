'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { accessProfileService } from '@/services';

interface PermissionsContextType {
	permissions: string[];
	allowedSites: string[];
	allSites: boolean;
	isAdmin: boolean;
	isLoading: boolean;
	hasPermission: (module: string, action: string, siteId?: string) => boolean;
	canAccessAny: (permissionsToCheck: string[]) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType>(
	{} as PermissionsContextType,
);

const SUPER_ADMIN_EMAILS = [
	'pedrolucasmota2005@gmail.com',
	'pedro@gmail.com',
	'teste@gmail.com',
];

export function PermissionsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, loading: authLoading } = useAuth();

	const [permissions, setPermissions] = useState<string[]>([]);
	const [allowedSites, setAllowedSites] = useState<string[]>([]);
	const [allSites, setAllSites] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		if (authLoading) return;

		const loadPermissions = async () => {
			setIsLoading(true);
			if (!user) {
				setPermissions([]);
				setAllowedSites([]);
				setAllSites(false);
				setIsAdmin(false);
				setIsLoading(false);
				return;
			}

			if (SUPER_ADMIN_EMAILS.includes(user.email)) {
				setPermissions(['admin:full']);
				setAllowedSites([]);
				setAllSites(true);
				setIsAdmin(true);
				setIsLoading(false);
				return;
			}

			if (user.profileId) {
				try {
					const profile = await accessProfileService.getById(
						user.profileId,
					);
					if (profile) {
						setPermissions(profile.permissions || []);
						setAllowedSites(profile.allowedSites || []);
						setAllSites(profile.allSites ?? false);
						setIsAdmin(profile.permissions.includes('admin:full'));
					} else {
						setPermissions([]);
						setAllowedSites([]);
						setAllSites(false);
						setIsAdmin(false);
					}
				} catch (e) {
					console.error(e);
				}
			}
			setIsLoading(false);
		};

		loadPermissions();
	}, [user, authLoading]);

	const hasPermission = (
		module: string,
		action: string,
		siteId?: string,
	): boolean => {
		if (isAdmin) return true;

		// Check site access first if siteId provided
		if (siteId && !allSites && !allowedSites.includes(siteId)) {
			return false;
		}

		// Check specific permission
		const permissionString = `${module}:${action}`;
		return (
			permissions.includes(permissionString) ||
			permissions.includes(`${module}:full`)
		);
	};

	const canAccessAny = (permissionsToCheck: string[]): boolean => {
		if (isAdmin) return true;
		return permissionsToCheck.some((p) => {
			const [module, action] = p.split(':');
			return hasPermission(module, action || 'view');
		});
	};

	return (
		<PermissionsContext.Provider
			value={{
				permissions,
				allowedSites,
				allSites,
				isAdmin,
				isLoading,
				hasPermission,
				canAccessAny,
			}}
		>
			{children}
		</PermissionsContext.Provider>
	);
}

export const usePermissions = () => useContext(PermissionsContext);
