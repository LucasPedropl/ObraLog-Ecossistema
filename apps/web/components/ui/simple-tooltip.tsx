'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SimpleTooltipProps {
	text: string;
	children: React.ReactNode;
	enabled?: boolean;
	side?: 'right' | 'top' | 'bottom' | 'left';
}

export function SimpleTooltip({
	text,
	children,
	enabled = true,
	side = 'right',
}: SimpleTooltipProps) {
	const [visible, setVisible] = useState(false);
	const [coords, setCoords] = useState({ top: 0, left: 0 });
	const triggerRef = useRef<HTMLDivElement>(null);

	const updateCoords = () => {
		const rect = triggerRef.current?.getBoundingClientRect();
		if (rect) {
			setCoords({
				top: rect.top + rect.height / 2,
				left: rect.right + 8,
			});
		}
	};

	const handleMouseEnter = () => {
		if (!enabled) return;
		updateCoords();
		setVisible(true);
	};

	const handleMouseLeave = () => {
		setVisible(false);
	};

	return (
		<div
			ref={triggerRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className="w-full"
		>
			{children}
			{visible &&
				typeof document !== 'undefined' &&
				createPortal(
					<div
						className="fixed z-[9999] px-2 py-1 bg-zinc-900 text-white text-xs rounded shadow-md pointer-events-none border border-white/10 whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
						style={{
							top: coords.top,
							left: coords.left,
							transform: 'translateY(-50%)',
						}}
					>
						{text}
					</div>,
					document.body,
				)}
		</div>
	);
}
