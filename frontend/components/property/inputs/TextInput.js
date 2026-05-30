"use client";
import React from 'react';

const TextInput = ({ label, name, value, onChange, placeholder, type = "text", required = false, prefix, suffix, className = "" }) => {
    return (
        <div className={`flex flex-col gap-0.5 ${className}`}>
            {label && (
                <label className="text-xs font-semibold text-slate-700 ml-1 mb-0.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative flex items-center group">
                {prefix && (
                    <div className="absolute left-4 text-slate-400 pointer-events-none transition-colors group-focus-within:text-blue-600">
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
                    className={`w-full py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium transition-all duration-200
                    placeholder:text-slate-400 outline-none
                    hover:border-slate-400
                    focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:bg-white
                    disabled:bg-slate-50 disabled:text-slate-500
                    ${prefix ? 'pl-10' : 'pl-4'}
                    ${suffix ? 'pr-10' : 'pr-4'}
                    `}
                />
                {suffix && (
                    <div className="absolute right-4 text-slate-400 pointer-events-none transition-colors group-focus-within:text-blue-600">
                        {suffix}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextInput;
