"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';

import { AMENITIES_LIST } from '../constants';

const AmenitiesStep = ({ formData, toggleAmenity, isActive }) => {
    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Select Amenities</h3>
                    <p className="text-slate-500 mt-1">
                        Select all the amenities available at the property to attract more leads.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {AMENITIES_LIST.map((item) => {
                        const Icon = item.icon;
                        const isSelected = formData.amenities.includes(item.id);
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleAmenity(item.id)}
                                className={`
                                    relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-200 group
                                    ${isSelected
                                        ? 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600 shadow-sm'
                                        : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5'
                                    }
                                `}
                            >
                                <div className={`
                                    p-3 rounded-xl transition-colors duration-200
                                    ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}
                                `}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={`font-semibold text-sm ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                                    {item.label}
                                </span>

                                {isSelected && (
                                    <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </StepWrapper>
    );
};

export default AmenitiesStep;
