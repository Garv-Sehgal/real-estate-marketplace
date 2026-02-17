import React from 'react';

export default function StepWrapper({ children, isActive }) {
    if (!isActive) return null;

    return (
        <div className={`
            animate-in fade-in slide-in-from-right-4 duration-500
            ${isActive ? 'block' : 'hidden'}
            pb-24 md:pb-8 relative
        `}>
            {children}
        </div>
    );
}
