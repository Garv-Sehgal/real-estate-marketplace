"use client";
import React from 'react';

const TextArea = ({ label, name, value, onChange, placeholder, rows = 4, required = false, className = "" }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                required={required}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium transition-all duration-200
                placeholder:text-slate-400 outline-none resize-none
                hover:border-slate-400
                focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
            />
        </div>
    );
};

export default TextArea;
