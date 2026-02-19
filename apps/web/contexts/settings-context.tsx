'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
	isSettingsOpen: boolean;
	isSettingsCollapsed: boolean;
	toggleSettingsOpen: () => void;
	toggleSettingsCollapse: () => void;
	openSettings: () => void;
	closeSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(false);

	useEffect(() => {
		const savedOpen = localStorage.getItem('obralog_settings_open');
		if (savedOpen) setIsSettingsOpen(savedOpen === 'true');

		const savedCollapsed = localStorage.getItem(
			'obralog_settings_collapsed',
		);
		if (savedCollapsed) setIsSettingsCollapsed(savedCollapsed === 'true');
	}, []);

	const toggleSettingsOpen = () => {
		setIsSettingsOpen((prev) => {
			const newState = !prev;
			localStorage.setItem('obralog_settings_open', String(newState));
			return newState;
		});
	};

	const toggleSettingsCollapse = () => {
		setIsSettingsCollapsed((prev) => {
			const newState = !prev;
			localStorage.setItem(
				'obralog_settings_collapsed',
				String(newState),
			);
			return newState;
		});
	};

	const openSettings = () => {
		setIsSettingsOpen(true);
		localStorage.setItem('obralog_settings_open', 'true');
	};

	const closeSettings = () => {
		setIsSettingsOpen(false);
		localStorage.setItem('obralog_settings_open', 'false');
	};

	return (
		<SettingsContext.Provider
			value={{
				isSettingsOpen,
				isSettingsCollapsed,
				toggleSettingsOpen,
				toggleSettingsCollapse,
				openSettings,
				closeSettings,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettingsSidebar = () => {
	const context = useContext(SettingsContext);
	if (!context)
		throw new Error(
			'useSettingsSidebar must be used within SettingsProvider',
		);
	return context;
};
