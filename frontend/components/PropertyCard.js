"use client";

import React from 'react';
import { Heart, MapPin, BedDouble, Bath, Square, Home, CheckCircle } from 'lucide-react';

const PropertyCard = ({ property, onCompare, isSelected, onClick }) => {
    return (
        <div
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col md:flex-row h-auto md:h-64 cursor-pointer"
            onClick={onClick}
        >
            {/* Image Section - 40% width on Desktop */}
            <div className="w-full md:w-2/5 relative h-56 md:h-full bg-gray-200 overflow-hidden">
                <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>

                {/* Compare Checkbox - Only show if onCompare is provided */}
                {onCompare && (
                    <div className="absolute top-3 left-3 z-20">
                        <label className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2 py-1.5 rounded cursor-pointer hover:bg-black/70 transition-colors">
                            <input
                                type="checkbox"
                                checked={isSelected || false}
                                onChange={(e) => onCompare && onCompare(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#4169E1] focus:ring-[#4169E1]"
                            />
                            <span className="text-xs font-semibold text-white">Compare</span>
                        </label>
                    </div>
                )}

                {/* Badges */}
                {property.isVerified && (
                    <div className="absolute top-3 left-28 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                    </div>
                )}

                {property.tag && (
                    <div className="absolute top-3 left-48 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        {property.tag}
                    </div>
                )}

                {/* Action Icons */}
                <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors text-white hover:text-red-500 z-20">
                    <Heart className="w-4 h-4 fill-current" />
                </button>

                {/* Photo Count */}
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {property.photos} Photos
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-5 flex flex-col justify-between">

                {/* Header content */}
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight group-hover:text-[#4169E1] transition-colors">{property.title}</h3>
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                                <MapPin className="w-4 h-4 mr-1 text-[#4169E1]" />
                                {property.location}
                            </div>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-2xl font-bold text-[#4169E1]">{property.price}</p>
                            <p className="text-xs text-gray-500 font-medium">{property.pricePerSqft}</p>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4 py-4 border-t border-b border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase font-semibold">Config</span>
                            <div className="flex items-center gap-1 text-gray-700 font-bold">
                                <BedDouble className="w-4 h-4 text-gray-400" />
                                {property.bhk}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase font-semibold">Area</span>
                            <div className="flex items-center gap-1 text-gray-700 font-bold">
                                <Square className="w-4 h-4 text-gray-400" />
                                {property.area}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase font-semibold">Baths</span>
                            <div className="flex items-center gap-1 text-gray-700 font-bold">
                                <Bath className="w-4 h-4 text-gray-400" />
                                {property.baths}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase font-semibold">Status</span>
                            <div className="flex items-center gap-1 text-gray-700 font-bold">
                                <Home className="w-4 h-4 text-gray-400" />
                                {property.status}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-2 pt-2">
                    {/* Mobile Price */}
                    <div className="w-full md:hidden mb-2">
                        <span className="text-2xl font-bold text-[#4169E1]">{property.price}</span>
                    </div>

                    <button
                        className="w-full md:w-auto px-6 py-2.5 rounded-lg border-2 border-[#4169E1] text-[#4169E1] font-bold text-sm hover:bg-[#4169E1] hover:text-white transition-all"
                        onClick={onClick}
                    >
                        View Details
                    </button>
                    <button
                        className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-[#4169E1] text-white font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Contact Agent
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PropertyCard;
