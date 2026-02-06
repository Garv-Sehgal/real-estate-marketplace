"use client";

import React, { useState } from 'react';
import PropertyCard from '@/components/PropertyCard';

// Mock Data
const MOCK_PROPERTIES = [
    {
        id: 1,
        title: "3 BHK Luxury Apartment",
        location: "Indiranagar, Bangalore",
        price: "₹ 1.25 Cr",
        pricePerSqft: "₹ 6,750 per sqft",
        bhk: "3 BHK",
        area: "1850 sqft",
        baths: "3 Baths",
        status: "Ready to Move",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photos: 12,
        isVerified: true,
        tag: "Trending"
    },
    {
        id: 2,
        title: "4 BHK Premium Villa",
        location: "Whitefield, Bangalore",
        price: "₹ 3.50 Cr",
        pricePerSqft: "₹ 9,200 per sqft",
        bhk: "4 BHK",
        area: "3200 sqft",
        baths: "4 Baths",
        status: "Under Construction",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photos: 18,
        isVerified: true,
        tag: "New Launch"
    },
    {
        id: 3,
        title: "2 BHK Cozy Flat",
        location: "Koramangala, Bangalore",
        price: "₹ 85 L",
        pricePerSqft: "₹ 7,100 per sqft",
        bhk: "2 BHK",
        area: "1200 sqft",
        baths: "2 Baths",
        status: "Resale",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photos: 8,
        isVerified: false,
        tag: ""
    },
    {
        id: 4,
        title: "3 BHK Garden Facing",
        location: "Hebbal, Bangalore",
        price: "₹ 1.10 Cr",
        pricePerSqft: "₹ 6,400 per sqft",
        bhk: "3 BHK",
        area: "1650 sqft",
        baths: "3 Baths",
        status: "Ready to Move",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        isVerified: true,
        tag: "Featured"
    }
];

export default function PropertiesPage() {
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('newest');

    // Filter State
    const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
    const [bhk, setBhk] = useState([]);
    const [status, setStatus] = useState([]);
    const [amenities, setAmenities] = useState([]);

    const toggleFilter = (state, setState, value) => {
        if (state.includes(value)) {
            setState(state.filter(item => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Price Range */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Budget</h3>
                <div className="flex gap-2 items-center mb-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 border rounded text-sm focus:ring-[#4169E1] focus:border-[#4169E1]"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 border rounded text-sm focus:ring-[#4169E1] focus:border-[#4169E1]"
                    />
                </div>
                <input
                    type="range"
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4169E1]"
                />
            </div>

            {/* BHK Type */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">BHK Type</h3>
                <div className="flex flex-wrap gap-2">
                    {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map((item) => (
                        <button
                            key={item}
                            onClick={() => toggleFilter(bhk, setBhk, item)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${bhk.includes(item)
                                ? 'bg-blue-50 border-[#4169E1] text-[#4169E1]'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* Property Status */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Property Status</h3>
                <div className="space-y-2">
                    {['Ready to Move', 'Under Construction'].map((item) => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={status.includes(item)}
                                onChange={() => toggleFilter(status, setStatus, item)}
                                className="w-4 h-4 text-[#4169E1] border-gray-300 rounded focus:ring-[#4169E1]"
                            />
                            <span className="text-gray-700 text-sm">{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Amenities */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Amenities</h3>
                <div className="space-y-2">
                    {['Parking', 'Gym', 'Swimming Pool', 'Security', 'Club House'].map((item) => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={amenities.includes(item)}
                                onChange={() => toggleFilter(amenities, setAmenities, item)}
                                className="w-4 h-4 text-[#4169E1] border-gray-300 rounded focus:ring-[#4169E1]"
                            />
                            <span className="text-gray-700 text-sm">{item}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Bar */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div>
                        <span className="text-gray-500 text-sm">Showing </span>
                        <span className="text-gray-900 font-bold">{MOCK_PROPERTIES.length} Properties</span>
                        <span className="text-gray-500 text-sm"> in Bangalore</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm hidden sm:inline">Sort By:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border-none text-sm font-semibold text-gray-900 focus:ring-0 cursor-pointer bg-transparent"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 w-full flex gap-6 flex-1">

                {/* Desktop Sidebar (Hidden on Mobile) */}
                <aside className="hidden lg:block w-1/4 min-w-[280px]">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                            <button className="text-[#4169E1] text-sm font-semibold hover:underline">Clear All</button>
                        </div>
                        <FilterContent />
                    </div>
                </aside>

                {/* Results Grid */}
                <main className="flex-1 w-full">

                    {/* Map Placeholder */}
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-6 flex flex-col items-center justify-center border border-gray-300 relative overflow-hidden group cursor-pointer hover:bg-gray-300 transition-colors">
                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span className="text-gray-600 font-semibold">View on Map</span>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none"></div>
                    </div>

                    {/* Property Cards Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {MOCK_PROPERTIES.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                </main>
            </div>

            {/* Mobile Wrapper for Filters */}
            {/* Floating Filter Button (Mobile Only) */}
            <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="bg-[#4169E1] text-white px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    Filters
                </button>
            </div>

            {/* Mobile Filter Modal */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)}></div>
                    <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl p-6 h-[80vh] overflow-y-auto transform transition-transform duration-300 ease-in-out">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <FilterContent />
                        <div className="mt-8 pt-4 border-t sticky bottom-0 bg-white pb-4">
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-full bg-[#4169E1] text-white font-bold py-3 rounded-lg shadow-lg"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}