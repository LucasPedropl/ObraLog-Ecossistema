'use client';

import React from 'react';
import { useTheme } from '@/contexts/theme-context';
import { CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function ObraOverview() {
	const { currentTheme } = useTheme();

	return (
		<div className="space-y-6 max-w-7xl mx-auto">
			{/* Top Row: Main Status + Side Widgets */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Status Card */}
				<div
					className="lg:col-span-2 rounded-xl p-6 border flex flex-col justify-between"
					style={{
						backgroundColor: currentTheme.colors.card,
						borderColor: currentTheme.colors.border,
					}}
				>
					<div className="flex justify-between items-start mb-4">
						<div className="flex items-center gap-2">
							<div className="h-5 w-1 bg-orange-500 rounded-full"></div>{' '}
							{/* Accent line */}
							<h3
								className="font-bold text-lg"
								style={{ color: currentTheme.colors.text }}
							>
								Status do Projeto
							</h3>
						</div>
						<span className="text-xs font-bold px-2 py-1 rounded bg-green-500/20 text-green-500 uppercase">
							Saudável
						</span>
					</div>

					<p
						className="mb-6 text-sm"
						style={{ color: currentTheme.colors.textSecondary }}
					>
						Acompanhe o progresso geral e as etapas concluídas da
						obra.
					</p>

					<div className="mt-auto">
						<div
							className="flex justify-between text-xs mb-2"
							style={{ color: currentTheme.colors.textSecondary }}
						>
							<span>Progresso Geral</span>
							<span>75% Concluído</span>
						</div>
						<div className="w-full h-2 rounded-full bg-gray-700/50 overflow-hidden">
							<div className="h-full bg-orange-500 w-3/4 rounded-full"></div>
						</div>
						<div
							className="flex gap-4 mt-4 text-xs"
							style={{ color: currentTheme.colors.textSecondary }}
						>
							<div className="flex items-center gap-1">
								<CheckCircle2 size={12} /> 12/16 etapas
							</div>
							<div className="flex items-center gap-1">
								<FileText size={12} /> 4 documentos pendentes
							</div>
						</div>
					</div>
				</div>

				{/* Right Column Widgets */}
				<div className="space-y-6">
					{/* Widget 1 */}
					<div
						className="rounded-xl p-4 border"
						style={{
							backgroundColor: currentTheme.colors.card,
							borderColor: currentTheme.colors.border,
						}}
					>
						<h4
							className="text-xs font-bold uppercase mb-3 opacity-70"
							style={{ color: currentTheme.colors.text }}
						>
							Equipes
						</h4>
						<div className="flex gap-2">
							<span
								className="text-xs px-3 py-1 rounded-full border opacity-80"
								style={{
									borderColor: currentTheme.colors.border,
									color: currentTheme.colors.text,
								}}
							>
								Alvenaria
							</span>
							<span
								className="text-xs px-3 py-1 rounded-full border opacity-80"
								style={{
									borderColor: currentTheme.colors.border,
									color: currentTheme.colors.text,
								}}
							>
								Elétrica
							</span>
							<span
								className="text-xs px-3 py-1 rounded-full border opacity-80"
								style={{
									borderColor: currentTheme.colors.border,
									color: currentTheme.colors.text,
								}}
							>
								Hidráulica
							</span>
						</div>
					</div>

					{/* Widget 2 */}
					<div
						className="rounded-xl p-4 border"
						style={{
							backgroundColor: currentTheme.colors.card,
							borderColor: currentTheme.colors.border,
						}}
					>
						<h4
							className="text-xs font-bold uppercase mb-3 opacity-70"
							style={{ color: currentTheme.colors.text }}
						>
							Responsáveis
						</h4>
						<div className="flex gap-2">
							<span
								className="text-xs px-3 py-1 rounded-full border opacity-80"
								style={{
									borderColor: currentTheme.colors.border,
									color: currentTheme.colors.text,
								}}
							>
								Eng. Civil
							</span>
							<span
								className="text-xs px-3 py-1 rounded-full border opacity-80"
								style={{
									borderColor: currentTheme.colors.border,
									color: currentTheme.colors.text,
								}}
							>
								Mestre
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Row */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* Attention Needed */}
				<div
					className="rounded-xl border overflow-hidden"
					style={{
						backgroundColor: currentTheme.colors.card,
						borderColor: currentTheme.colors.border,
					}}
				>
					<div
						className="p-3 border-b flex justify-between items-center bg-white/5"
						style={{ borderColor: currentTheme.colors.border }}
					>
						<div
							className="flex items-center gap-2 text-sm font-semibold"
							style={{ color: currentTheme.colors.text }}
						>
							<AlertCircle size={16} className="text-red-500" />{' '}
							Atenção Necessária
						</div>
						<span className="text-xs bg-white/10 px-2 rounded text-white">
							1
						</span>
					</div>
					<div className="p-8 flex flex-col items-center justify-center text-center h-48">
						<span
							className="text-sm font-medium mb-1"
							style={{ color: currentTheme.colors.text }}
						>
							Aprovação de Compra
						</span>
						<span
							className="text-xs opacity-60"
							style={{ color: currentTheme.colors.textSecondary }}
						>
							Pedido #1023 aguardando
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
