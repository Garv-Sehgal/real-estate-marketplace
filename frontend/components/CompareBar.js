"use client";

import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CompareBar({ selectedProperties, onRemove, onClear }) {
    if (!selectedProperties || selectedProperties.length === 0) return null;

    // Construct URL with selected IDs
    const compareUrl = `/compare?ids=${selectedProperties.map(p => p.id).join(',')}`;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] animate-slide-up">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Left: Info & Thumbnails */}
                <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="flex flex-col flex-shrink-0">
                        <span className="text-sm font-bold text-gray-900">Compare Properties</span>
                        <span className="text-xs text-gray-500">{selectedProperties.length} of 4 selected</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {selectedProperties.map((property) => (
                            <div key={property.id} className="relative group w-16 h-12 flex-shrink-0">
                                <img
                                    src={property.image}
                                    alt={property.title}
                                    className="w-full h-full object-cover rounded border border-gray-200"
                                />
                                <button
                                    onClick={() => onRemove(property.id)}
                                    className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}

                        {/* Empty Slots */}
                        {Array.from({ length: 4 - selectedProperties.length }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="w-16 h-12 border border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs text-gray-400">Add</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={onClear}
                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Clear All
                    </button>
                    <Link href={compareUrl} className="flex-1 md:flex-none">
                        <button className={`w-full md:w-auto px-6 py-2.5 bg-[#4169E1] text-white text-sm font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 ${selectedProperties.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={selectedProperties.length < 2}>
                            Compare Now <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
