'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { SidebarProvider } from '@/contexts/sidebar-context';
import { PermissionsProvider } from '@/contexts/permissions-context';
import { SettingsProvider } from '@/contexts/settings-context';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			<ThemeProvider>
				<PermissionsProvider>
					<SettingsProvider>
						<SidebarProvider>{children}</SidebarProvider>
					</SettingsProvider>
				</PermissionsProvider>
			</ThemeProvider>
		</AuthProvider>
	);
}
