"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import HomeExtensions from './HomeExtensions';

const HomePage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('buy');
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState('Type');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleSearch = () => {
        const queryParams = new URLSearchParams();
        queryParams.append('listingType', activeTab === 'buy' ? 'sell' : activeTab);

        if (location.trim()) {
            queryParams.append('city', location.trim());
        }

        if (propertyType && propertyType !== 'Type' && propertyType !== 'Any') {
            queryParams.append('type', propertyType);
        }

        if (minPrice && Number(minPrice) > 0) {
            queryParams.append('minPrice', minPrice);
        }
        if (maxPrice && Number(maxPrice) > 0) {
            queryParams.append('maxPrice', maxPrice);
        }

        // Redirect to properties view-all page with filters
        router.push(`/properties?${queryParams.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-display">
            <Header />
            {/* Hero Section */}
            <div className="relative w-full min-h-screen bg-slate-900 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-5xl px-6 md:px-12 lg:px-16 flex flex-col items-center">

                    <h1 className="text-3xl md:text-5xl text-white font-bold mb-8 text-center drop-shadow-md">
                        Find Your Dream Home
                    </h1>

                    {/* Search Component */}
                    <div className="bg-white rounded-lg shadow-xl w-full overflow-hidden">

                        {/* Tabs */}
                        <div className="flex border-b">
                            <button
                                onClick={() => setActiveTab('buy')}
                                className={`flex-1 py-3 text-sm md:text-base font-semibold transition-colors ${activeTab === 'buy' ? 'text-[#4169E1] border-b-2 border-[#4169E1] bg-blue-50/20' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Buy
                            </button>
                            <button
                                onClick={() => setActiveTab('rent')}
                                className={`flex-1 py-3 text-sm md:text-base font-semibold transition-colors ${activeTab === 'rent' ? 'text-[#4169E1] border-b-2 border-[#4169E1] bg-blue-50/20' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Rent
                            </button>
                            <button
                                onClick={() => setActiveTab('commercial')}
                                className={`flex-1 py-3 text-sm md:text-base font-semibold transition-colors ${activeTab === 'commercial' ? 'text-[#4169E1] border-b-2 border-[#4169E1] bg-blue-50/20' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Commercial
                            </button>
                        </div>

                        {/* Search Inputs */}
                        <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-4 items-end">

                            {/* Location Input - Map Integration Ready */}
                            <div className="w-full lg:flex-[2]">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                                    Location
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter City e.g. Amritsar, Delhi"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className="w-full lg:flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                                    Type
                                </label>
                                <select
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white text-gray-700"
                                >
                                    <option value="Type">Type</option>
                                    <option value="Any">Any</option>
                                    <option value="Flat">Flat</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Plot">Plot</option>
                                    <option value="House">House</option>
                                </select>
                            </div>

                            {/* Budget */}
                            <div className="w-full lg:flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                                    Budget
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => {
                                            const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0).toString();
                                            setMinPrice(val);
                                        }}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white text-gray-700"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => {
                                            const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0).toString();
                                            setMaxPrice(val);
                                        }}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="w-full lg:w-auto">
                                <button
                                    onClick={handleSearch}
                                    className="w-full lg:w-auto bg-[#4169E1] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors shadow-lg flex items-center justify-center gap-2"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Search
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-8 grid grid-cols-4 gap-2 px-4 md:flex md:justify-center md:gap-6 w-full max-w-4xl mx-auto">
                        <QuickLinkButton
                            label="Owner Properties"
                            icon={
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            }
                        />
                        <QuickLinkButton
                            label="Verified Agents"
                            icon={
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <QuickLinkButton
                            label="Ready to Move"
                            icon={
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                        />
                        <QuickLinkButton
                            label="New Projects"
                            icon={
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            }
                        />
                    </div>

                </div>
            </div>
            {/* Extended Sections */}
            <HomeExtensions />

            {/* Chat Floating Bubble */}
            <button
                onClick={() => router.push('/messages')}
                className="fixed bottom-6 right-6 bg-[#4169E1] hover:bg-blue-800 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-50 group"
                aria-label="Open Chat"
            >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>
        </div>
    );
};

const QuickLinkButton = ({ label, icon }) => (
    <button className="flex flex-col items-center gap-2 group cursor-pointer w-full">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#4169E1] shadow-lg group-hover:scale-110 group-hover:bg-[#4169E1] group-hover:text-white transition-all duration-300">
            {icon}
        </div>
        <span className="text-white text-[10px] md:text-sm font-medium drop-shadow-md text-center leading-tight">{label}</span>
    </button>
);

export default HomePage;
