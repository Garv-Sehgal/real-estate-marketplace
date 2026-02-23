"use client";

import React from 'react';
import { Check } from 'lucide-react';

const ListingStepper = ({ steps, currentStep, setCurrentStep }) => {

    if (!steps || steps.length === 0) return null;

    const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="w-full mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">List Your Property</h1>

            {/* Step Counter & Progress Text */}
            <div className="flex justify-between items-end mb-6 px-1">
                <div>
                    <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Step {currentStep} of {steps.length}</span>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                        {steps[currentStep - 1]?.label}
                    </h2>
                </div>
                <span className="text-sm font-medium text-slate-500">{Math.round(progressPercentage)}% Completed</span>
            </div>

            {/* Progress Bar Container */}
            <div className="relative mb-12">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0 -translate-y-1/2 rounded-full"></div>

                {/* Active Progress Line */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-0 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>

                {/* Steps Circles */}
                <div className="relative flex justify-between w-full">
                    {steps.map((step, index) => {
                        const stepId = index + 1;
                        const isActive = currentStep === stepId;
                        const isCompleted = currentStep > stepId;

                        return (
                            <div
                                key={step.id || step.key}
                                className="group relative flex flex-col items-center cursor-pointer"
                                onClick={() => isCompleted && setCurrentStep(stepId)}
                            >
                                {/* Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 
                                        ${isActive
                                            ? 'bg-white border-blue-600 text-blue-600 font-bold ring-4 ring-blue-50 scale-110'
                                            : isCompleted
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'bg-slate-50 border-slate-300 text-slate-400'
                                        }`}
                                >
                                    {isCompleted ? <Check className="w-6 h-6" /> : <span className="text-sm">{stepId}</span>}
                                </div>

                                {/* Step Title */}
                                <div className={`absolute top-12 whitespace-nowrap text-xs font-bold transition-colors duration-300 hidden md:block uppercase tracking-wider
                                    ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
                                >
                                    {step.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ListingStepper;
