"use client";
import React from 'react';
import { Grid } from 'lucide-react';

const SelectInput = ({ label, name, value, onChange, options, placeholder, required = false, className = "" }) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-bold text-slate-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none bg-white appearance-none font-medium transition-all
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
                <Grid className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
        </div>
    );
};

export default SelectInput;
