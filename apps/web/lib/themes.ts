// Copied from React app
import { Theme } from '@/lib/types';

export const themes: Theme[] = [
	{
		id: 'midnight-mixed',
		name: 'Midnight (Misto)',
		isDark: false,
		colors: {
			background: '#ffffff', // Fundo Branco Puro
			sidebar: '#000000', // Preto Absoluto
			sidebarText: '#ffffff', // Ícones e Texto Branco Puro
			card: '#ffffff', // Cards Brancos
			text: '#09090b', // Texto Preto na página
			textSecondary: '#71717a', // Cinza médio
			primary: '#000000', // Botões Pretos (Alto contraste na página branca)
			border: '#e4e4e7', // Bordas cinza claro
		},
	},
	{
		id: 'light-minimal',
		name: 'Claro (Minimalista)',
		isDark: false,
		colors: {
			background: '#f8fafc', // Slate 50
			sidebar: '#ffffff', // Sidebar Branca
			sidebarText: '#334155', // Slate 700
			card: '#ffffff', // Cards Brancos
			text: '#0f172a', // Slate 900
			textSecondary: '#64748b', // Slate 500
			primary: '#0f172a', // Slate 900
			border: '#cbd5e1', // Slate 300
		},
	},
	{
		id: 'corporate-navy',
		name: 'Corporativo (Navy)',
		isDark: false,
		colors: {
			background: '#f1f5f9', // Slate 100
			sidebar: '#0f172a', // Slate 900
			sidebarText: '#ffffff', // Branco Puro
			card: '#ffffff',
			text: '#0f172a',
			textSecondary: '#475569',
			primary: '#0ea5e9', // Sky 500
			border: '#cbd5e1', // Slate 300
		},
	},
	{
		id: 'enterprise-forest',
		name: 'Enterprise (Verde)',
		isDark: false,
		colors: {
			background: '#f0fdf4', // Green 50
			sidebar: '#064e3b', // Emerald 900
			sidebarText: '#ffffff', // Branco Puro
			card: '#ffffff',
			text: '#022c22',
			textSecondary: '#047857',
			primary: '#10b981', // Emerald 500
			border: '#d1d5db', // Gray 300
		},
	},
	{
		id: 'modern-charcoal',
		name: 'Moderno (Grafite)',
		isDark: false,
		colors: {
			background: '#f4f4f5', // Zinc 100
			sidebar: '#18181b', // Zinc 950
			sidebarText: '#ffffff', // Branco Puro
			card: '#ffffff',
			text: '#18181b',
			textSecondary: '#52525b',
			primary: '#6366f1', // Indigo 500
			border: '#d4d4d8', // Zinc 300
		},
	},
	{
		id: 'saas-royal',
		name: 'SaaS (Roxo)',
		isDark: false,
		colors: {
			background: '#faf5ff', // Purple 50
			sidebar: '#4c1d95', // Violet 900
			sidebarText: '#ffffff', // Branco Puro
			card: '#ffffff',
			text: '#2e1065',
			textSecondary: '#6d28d9',
			primary: '#8b5cf6', // Violet 500
			border: '#d8b4fe', // Purple 300
		},
	},
	{
		id: 'construction-orange',
		name: 'Obra (Laranja)',
		isDark: false,
		colors: {
			background: '#fff7ed', // Orange 50
			sidebar: '#9a3412', // Orange 800
			sidebarText: '#ffffff',
			card: '#ffffff',
			text: '#431407',
			textSecondary: '#c2410c',
			primary: '#ea580c',
			border: '#fdba74',
		},
	},
];
