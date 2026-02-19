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

	useEffect(() => {
		const root = document.documentElement;

		// Update CSS variables
		root.style.setProperty('--background', currentTheme.colors.background);
		root.style.setProperty('--foreground', currentTheme.colors.text);
		root.style.setProperty('--card', currentTheme.colors.card);
		root.style.setProperty('--card-foreground', currentTheme.colors.text);
		root.style.setProperty('--popover', currentTheme.colors.card);
		root.style.setProperty(
			'--popover-foreground',
			currentTheme.colors.text,
		);
		root.style.setProperty('--primary', currentTheme.colors.primary);
		// Assuming primary foreground is white for dark primary, and black for light primary usually
		// But for now let's keep it simple or calculate contrast if needed
		// root.style.setProperty('--primary-foreground', '#ffffff');

		root.style.setProperty('--secondary', currentTheme.colors.sidebar); // Using sidebar color as secondary for now? Or keep default
		root.style.setProperty('--border', currentTheme.colors.border);
		root.style.setProperty('--input', currentTheme.colors.border);
		root.style.setProperty('--ring', currentTheme.colors.primary);

		// Custom variables
		root.style.setProperty('--sidebar', currentTheme.colors.sidebar);
		root.style.setProperty(
			'--sidebar-text',
			currentTheme.colors.sidebarText,
		);

		if (currentTheme.isDark) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	}, [currentTheme]);

	// Prevent hydration mismatch
	// if (!mounted) {
	// 	return <>{children}</>;
	// }

	return (
		<ThemeContext.Provider value={{ currentTheme, setTheme }}>
			{children}
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
