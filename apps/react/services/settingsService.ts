import { MeasurementUnit, ItemCategory } from '@obralog/shared-types';

// Dados padrão extraídos dos relatórios (OCR)
export const DEFAULT_UNITS: Omit<MeasurementUnit, 'id'>[] = [
	{ name: '%', abbreviation: '%' },
	{ name: 'Balde', abbreviation: 'Bd' },
	{ name: 'Barra', abbreviation: 'BR' },
	{ name: 'Bloco', abbreviation: 'BL' },
	{ name: 'Caixa', abbreviation: 'CX' },
	{ name: 'Conjunto', abbreviation: 'CJ' },
	{ name: 'CT', abbreviation: 'CT' },
	{ name: 'Dia', abbreviation: 'DIA' },
	{ name: 'Dúzia', abbreviation: 'DZ' },
	{ name: 'Fardo', abbreviation: 'FD' },
	{ name: 'Folha', abbreviation: 'FL' },
	{ name: 'Galão', abbreviation: 'GL' },
	{ name: 'Hora', abbreviation: 'H' },
	{ name: 'Jogo', abbreviation: 'JG' },
	{ name: 'Quilômetro', abbreviation: 'KM' },
	{ name: 'Quilowatt', abbreviation: 'kW' },
	{ name: 'Lata', abbreviation: 'LA' },
	{ name: 'Litro', abbreviation: 'L' },
	{ name: 'Locação/Mês', abbreviation: 'loc/mês' },
	{ name: 'Metro', abbreviation: 'M' },
	{ name: 'Metro Cúbico', abbreviation: 'M³' },
	{ name: 'Metro Quadrado', abbreviation: 'M²' },
	{ name: 'Milheiro', abbreviation: 'MIL' },
	{ name: 'Pacote', abbreviation: 'PCT' },
	{ name: 'Par', abbreviation: 'PAR' },
	{ name: 'Peça', abbreviation: 'PÇ' },
	{ name: 'Quilo', abbreviation: 'KG' },
	{ name: 'Rolo', abbreviation: 'RL' },
	{ name: 'Saca', abbreviation: 'SC' },
	{ name: 'Tonelada', abbreviation: 'TON' },
	{ name: 'Unidade', abbreviation: 'UN' },
	{ name: 'Verba', abbreviation: 'VB' },
];

export const DEFAULT_CATEGORIES: Omit<ItemCategory, 'id'>[] = [
	{
		type: 'Produto',
		category: 'Acabamentos',
		subcategory: 'Pisos, Azulejos e porcelanatos',
		registrationType: 'Padrão',
	},
	{
		type: 'Produto',
		category: 'Acabamentos',
		subcategory: 'Rejuntes',
		registrationType: 'Padrão',
	},
	{
		type: 'Produto',
		category: 'Acabamentos',
		subcategory: 'Pintura',
		registrationType: 'Padrão',
	},
	{
		type: 'Produto',
		category: 'Aço',
		subcategory: '',
		registrationType: 'Próprio',
	},
	{
		type: 'Produto',
		category: 'Aglomerantes',
		subcategory: '',
		registrationType: 'Padrão',
	},
	{
		type: 'Produto',
		category: 'Agregados',
		subcategory: '',
		registrationType: 'Padrão',
	},
	{
		type: 'Produto',
		category: 'Aluguel de máquinas',
		subcategory: 'Andaimes',
		registrationType: 'Padrão',
	},
	{
		type: 'Produto',
		category: 'Aluguel de máquinas',
		subcategory: 'Betoneiras',
		registrationType: 'Padrão',
	},
	{
		type: 'Produto',
		category: 'Elétrica',
		subcategory: 'Fios e Cabos',
		registrationType: 'Padrão',
	},
	{
		type: 'Produto',
		category: 'Hidráulica',
		subcategory: 'Tubos e Conexões',
		registrationType: 'Padrão',
	},
	{
		type: 'Produto',
		category: 'Madeiras',
		subcategory: 'Compensados',
		registrationType: 'Padrão',
	},
	{
		type: 'Serviço',
		category: 'Mão de Obra',
		subcategory: 'Pedreiro',
		registrationType: 'Padrão',
	},
	{
		type: 'Serviço',
		category: 'Mão de Obra',
		subcategory: 'Servente',
		registrationType: 'Padrão',
	},
	{
		type: 'Serviço',
		category: 'Transporte',
		subcategory: 'Frete',
		registrationType: 'Padrão',
	},
	{
		type: 'Serviço',
		category: 'Alimentação',
		subcategory: 'Refeição',
		registrationType: 'Padrão',
	},
];

const UNITS_COLLECTION = 'measurement_units';
const CATEGORIES_COLLECTION = 'item_categories';

export const settingsService = {
	// UNIDADES
	getUnits: async (): Promise<MeasurementUnit[]> => {
		// TODO: Implement with Firebase
		return DEFAULT_UNITS.map((u, index) => ({
			id: `default-${index}`,
			...u,
		}));
	},

	addUnit: async (unit: Omit<MeasurementUnit, 'id'>) => {
		// TODO: Implement with Firebase
	},

	updateUnit: async (id: string, unit: Partial<MeasurementUnit>) => {
		// TODO: Implement with Firebase
	},

	deleteUnit: async (id: string) => {
		// TODO: Implement with Firebase
	},

	importDefaultUnits: async () => {
		// TODO: Implement with Firebase
	},

	// CATEGORIAS
	getCategories: async (): Promise<ItemCategory[]> => {
		// TODO: Implement with Firebase
		return DEFAULT_CATEGORIES.map((c, index) => ({
			id: `default-${index}`,
			...c,
		}));
	},

	addCategory: async (category: Omit<ItemCategory, 'id'>) => {
		// TODO: Implement with Firebase
	},

	updateCategory: async (id: string, category: Partial<ItemCategory>) => {
		// TODO: Implement with Firebase
	},

	deleteCategory: async (id: string) => {
		// TODO: Implement with Firebase
	},

	importDefaultCategories: async () => {
		// TODO: Implement with Firebase
	},
};
