import { ReactNode } from 'react';

interface BentoCardProps {
    children: ReactNode;
    variant?: 'green' | 'cream' | 'dark';
    className?: string;
}

export function BentoCard({ children, variant = 'cream', className = '' }: BentoCardProps) {
    const baseStyles = 'rounded-3xl p-6 transition-all duration-200 font-body';
    const variants = {
        green: 'bg-[#004434] text-white',
        cream: 'bg-[#EAE5D9] text-[#1C1917]',
        dark: 'bg-[#1C1917] text-[#F5F2EB]',
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
}