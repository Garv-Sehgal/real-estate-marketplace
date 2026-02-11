"use client";
import React from 'react';

const TextArea = ({ label, name, value, onChange, placeholder, rows = 4, required = false, className = "" }) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-bold text-slate-700">
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all placeholder:text-slate-300 font-medium resize-none"
            />
        </div>
    );
};

export default TextArea;
