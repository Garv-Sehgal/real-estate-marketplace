"use client";
import React from 'react';

const TextInput = ({ label, name, value, onChange, placeholder, type = "text", required = false, prefix, suffix, className = "" }) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-bold text-slate-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative flex items-center">
                {prefix && (
                    <div className="absolute left-4 text-slate-400 pointer-events-none">
                        {prefix}
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`w-full py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all placeholder:text-slate-300 font-medium
                    ${prefix ? 'pl-10' : 'pl-4'}
                    ${suffix ? 'pr-10' : 'pr-4'}
                    `}
                />
                {suffix && (
                    <div className="absolute right-4 text-slate-400 pointer-events-none">
                        {suffix}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextInput;
