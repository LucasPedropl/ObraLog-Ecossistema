import React from 'react';

export interface User {
	id?: string;
	name?: string;
	email: string;
	role: 'admin' | 'almoxarife' | 'operario';
	createdAt: Date;
}

export interface AccessProfile {
	id?: string;
	name: string;
	description: string;
	permissions: string[];
	level: 'Alto' | 'Médio' | 'Baixo';
}

export interface InventoryItem {
	id?: string;
	code?: string;
	name: string;
	quantity: number;
	unit: string;
	category: string;
	costType?: string;
	unitValue?: number;
	stockControl: boolean;
	minThreshold: number;
	updatedAt: Date;
}

export interface ConstructionSite {
	id?: string;
	name: string;
	createdAt: Date;
}

export interface MeasurementUnit {
	id?: string;
	name: string;
	abbreviation: string;
}

export interface ItemCategory {
	id?: string;
	type: 'Produto' | 'Serviço';
	category: string;
	subcategory: string;
	registrationType: 'Próprio' | 'Padrão';
}

export interface ThemeColors {
	background: string;
	sidebar: string;
	sidebarText: string;
	card: string;
	text: string;
	textSecondary: string;
	primary: string;
	border: string;
}

export interface Theme {
	id: string;
	name: string;
	colors: ThemeColors;
	isDark: boolean;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}
