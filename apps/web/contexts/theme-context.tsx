'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '@/lib/types';
import { themes } from '@/lib/themes';

interface ThemeContextType {
	currentTheme: Theme;
	setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [currentTheme, setCurrentTheme] = useState<Theme>(
		themes.find((t) => t.id === 'modern-charcoal') || themes[0],
	);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const savedThemeId = localStorage.getItem('obralog_theme_id');
		if (savedThemeId) {
			const foundTheme = themes.find((t) => t.id === savedThemeId);
			if (foundTheme) {
				setCurrentTheme(foundTheme);
			}
		}
		setMounted(true);
	}, []);

	const setTheme = (themeId: string) => {
		const theme = themes.find((t) => t.id === themeId);
		if (theme) {
			setCurrentTheme(theme);
			localStorage.setItem('obralog_theme_id', themeId);
		}
	};

	// Prevent hydration mismatch
	if (!mounted) {
		return <>{children}</>;
	}

	// Apply CSS variables or handle theme application logic here if needed
	// For now, consumers use currentTheme to style themselves inline or via JS
	// ideally we map this to CSS variables on body.

	return (
		<ThemeContext.Provider value={{ currentTheme, setTheme }}>
			<div
				style={
					{
						'--theme-bg': currentTheme.colors.background,
						'--theme-sidebar': currentTheme.colors.sidebar,
						'--theme-sidebar-text': currentTheme.colors.sidebarText,
						'--theme-primary': currentTheme.colors.primary,
						// ... map others to CSS variables
					} as React.CSSProperties
				}
			>
				{children}
			</div>
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
