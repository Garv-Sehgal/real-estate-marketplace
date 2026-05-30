import React from 'react';

export default function ProgressBar({ currentStep, totalSteps }) {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="relative w-full h-1 bg-slate-200 rounded-full mb-8">
            <div
                className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
