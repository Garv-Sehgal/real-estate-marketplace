"use client";

import React from 'react';
import { Check } from 'lucide-react';

// Use passed 'steps' prop instead of static 'STEPS' from config
const ListingStepper = ({ steps, currentStep, setCurrentStep }) => {

    // Safety check if steps undefined/empty
    if (!steps || steps.length === 0) return null;

    return (
        <div className="relative flex justify-between items-center w-full px-2 mb-8">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0 -translate-y-1/2 rounded-full"></div>
            <div
                className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-0 -translate-y-1/2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, index) => {
                // Since currentStep is 1-based index from useListingForm logic
                // we compare 1-based index (index + 1)
                const stepId = index + 1;

                return (
                    <div
                        key={step.id || step.key} // Using unique key
                        className="relative z-10 flex flex-col items-center group cursor-pointer"
                        onClick={() => currentStep > stepId && setCurrentStep(stepId)}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-4 transition-all duration-300
                                ${currentStep > stepId
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : currentStep === stepId
                                        ? 'bg-white border-blue-600 text-blue-600 shadow-md scale-110'
                                        : 'bg-white border-slate-200 text-slate-400'
                                }`}
                        >
                            {currentStep > stepId ? <Check className="w-4 h-4" /> : stepId}
                        </div>
                        <span className={`absolute top-10 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap transition-colors duration-300 hidden sm:block
                            ${currentStep >= stepId ? 'text-blue-600' : 'text-slate-400'}
                        `}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default ListingStepper;
