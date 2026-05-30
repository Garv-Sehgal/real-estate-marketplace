"use client";
import React from 'react';

const CheckboxGroup = ({ label, options, selectedValues = [], onChange, className = "" }) => {

    const toggleOption = (id) => {
        if (selectedValues.includes(id)) {
            onChange(selectedValues.filter(val => val !== id));
        } else {
            onChange([...selectedValues, id]);
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option.id || option);
                    const labelText = option.label || option;
                    const Icon = option.icon;

                    return (
                        <div
                            key={option.id || option}
                            onClick={() => toggleOption(option.id || option)}
                            className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center justify-center gap-2 transition-all select-none
                            ${isSelected
                                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                }
                            `}
                        >
                            {Icon && (
                                <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                            )}
                            <span className="text-xs font-bold text-center">{labelText}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckboxGroup;
