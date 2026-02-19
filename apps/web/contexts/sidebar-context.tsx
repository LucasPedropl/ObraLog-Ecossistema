'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
	isCollapsed: boolean;
	toggleSidebar: () => void;
	isMobileOpen: boolean;
	toggleMobileSidebar: () => void;
	closeMobileSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem('obralog_sidebar_collapsed');
		setIsCollapsed(saved === 'true');
	}, []);

	const toggleSidebar = () => {
		setIsCollapsed((prev) => {
			const newState = !prev;
			localStorage.setItem('obralog_sidebar_collapsed', String(newState));
			return newState;
		});
	};

	const toggleMobileSidebar = () => {
		setIsMobileOpen((prev) => !prev);
	};

	const closeMobileSidebar = () => {
		setIsMobileOpen(false);
	};

	return (
		<SidebarContext.Provider
			value={{
				isCollapsed,
				toggleSidebar,
				isMobileOpen,
				toggleMobileSidebar,
				closeMobileSidebar,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
};

export const useSidebar = () => {
	const context = useContext(SidebarContext);
	if (!context)
		throw new Error('useSidebar must be used within SidebarProvider');
	return context;
};
