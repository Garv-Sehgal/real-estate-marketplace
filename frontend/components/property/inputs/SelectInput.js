"use client";
import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectInput = ({ label, name, value, onChange, options, placeholder, required = false, className = "" }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative group">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium appearance-none outline-none transition-all duration-200
                    hover:border-slate-400
                    focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                    disabled:bg-slate-50 disabled:text-slate-500
                    ${value === "" ? "text-slate-400" : "text-slate-900"}
                    `}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value || opt} value={opt.value || opt}>
                            {opt.label || opt}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none transition-transform duration-200 group-focus-within:rotate-180 group-focus-within:text-blue-600" />
            </div>
        </div>
    );
};

export default SelectInput;
