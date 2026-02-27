"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check, Search } from 'lucide-react';

const MultiSelectInput = ({ label, value = [], onChange, options = [], placeholder = "Select options", className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (optionId) => {
        const newValue = value.includes(optionId)
            ? value.filter(id => id !== optionId)
            : [...value, optionId];
        onChange(newValue);
    };

    const removeOption = (e, optionId) => {
        e.stopPropagation();
        onChange(value.filter(id => id !== optionId));
    };

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOptionsTags = value.map(id => options.find(opt => opt.id === id)).filter(Boolean);

    return (
        <div className={`flex flex-col gap-0.5 ${className}`} ref={dropdownRef}>
            {label && (
                <label className="text-xs font-semibold text-slate-700 ml-1 mb-0.5">
                    {label}
                </label>
            )}

            <div className="relative">
                {/* Main Input Area */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-full min-h-[42px] px-4 py-2 rounded-xl border bg-white cursor-pointer transition-all duration-200
                        flex items-center justify-between gap-2
                        ${isOpen ? 'border-blue-600 ring-4 ring-blue-600/10' : 'border-slate-300 hover:border-slate-400'}
                    `}
                >
                    <div className="flex flex-wrap gap-1.5 flex-1 items-center">
                        {selectedOptionsTags.length > 0 ? (
                            selectedOptionsTags.map(opt => (
                                <span
                                    key={opt.id}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100"
                                >
                                    {opt.label}
                                    <X
                                        className="w-3 h-3 hover:text-blue-900 cursor-pointer"
                                        onClick={(e) => removeOption(e, opt.id)}
                                    />
                                </span>
                            ))
                        ) : (
                            <span className="text-slate-400 font-medium">{placeholder}</span>
                        )}
                    </div>

                    <div className="shrink-0 text-slate-400">
                        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                    </div>
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                        {/* Search Bar */}
                        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search amenities..."
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none bg-white"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(opt => {
                                    const isSelected = value.includes(opt.id);
                                    return (
                                        <div
                                            key={opt.id}
                                            onClick={() => toggleOption(opt.id)}
                                            className={`
                                                flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors
                                                ${isSelected
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`
                                                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                    ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}
                                                `}>
                                                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                                {opt.icon && <opt.icon className="w-4 h-4 text-slate-500" />}
                                                <span>{opt.label}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center text-sm text-slate-500">
                                    No amenities found.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultiSelectInput;
