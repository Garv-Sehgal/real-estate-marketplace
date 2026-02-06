"use client";

import React, { useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import CompareBar from '@/components/CompareBar';
import { X, Map as MapIcon, ChevronDown, Filter, List, ArrowRight, ArrowLeft } from 'lucide-react';

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
        tag: "Trending",
        coordinates: { top: '30%', left: '40%' }
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
        tag: "New Launch",
        coordinates: { top: '50%', left: '60%' }
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
        tag: "",
        coordinates: { top: '20%', left: '70%' }
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
        image: "https://images.unsplash.com/photo-1599809275372-b40c369dd6cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photos: 15,
        isVerified: true,
        tag: "Featured",
        coordinates: { top: '60%', left: '30%' }
    },
    {
        id: 5,
        title: "Ultra Modern Penthouse",
        location: "MG Road, Bangalore",
        price: "₹ 5.50 Cr",
        pricePerSqft: "₹ 12,000 per sqft",
        bhk: "4+ BHK",
        area: "4500 sqft",
        baths: "5 Baths",
        status: "Ready to Move",
        image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photos: 22,
        isVerified: true,
        tag: "Premium",
        coordinates: { top: '40%', left: '20%' }
    },
    {
        id: 6,
        title: "Compact Studio",
        location: "Electronic City, Bangalore",
        price: "₹ 45 L",
        pricePerSqft: "₹ 5,200 per sqft",
        bhk: "1 BHK",
        area: "850 sqft",
        baths: "1 Bath",
        status: "Ready to Move",
        image: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photos: 6,
        isVerified: false,
        tag: "Best Value",
        coordinates: { top: '70%', left: '80%' }
    }
];

export default function PropertiesPage() {
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
    const [activePropertyId, setActivePropertyId] = useState(null);

    // Comparison State
    const [comparedProperties, setComparedProperties] = useState([]);

    // Filter State
    const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
    const [bhk, setBhk] = useState(['3 BHK']);
    const [status, setStatus] = useState([]);
    const [amenities, setAmenities] = useState([]);

    // Mobile Scroll State for Map View
    const [currentMobileIndex, setCurrentMobileIndex] = useState(0);

    const toggleFilter = (state, setState, value) => {
        if (state.includes(value)) {
            setState(state.filter(item => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    // Comparison Handlers
    const handleCompare = (property, isChecked) => {
        if (isChecked) {
            if (comparedProperties.length >= 4) {
                alert("You can compare up to 4 properties.");
                return;
            }
            if (!comparedProperties.find(p => p.id === property.id)) {
                setComparedProperties([...comparedProperties, property]);
            }
        } else {
            setComparedProperties(comparedProperties.filter(p => p.id !== property.id));
        }
    };

    const handleRemoveCompare = (id) => {
        setComparedProperties(comparedProperties.filter(p => p.id !== id));
    };

    const handleClearCompare = () => {
        setComparedProperties([]);
    };

    const handleMobileNext = () => {
        setCurrentMobileIndex((prev) => (prev + 1) % MOCK_PROPERTIES.length);
    };

    const handleMobilePrev = () => {
        setCurrentMobileIndex((prev) => (prev - 1 + MOCK_PROPERTIES.length) % MOCK_PROPERTIES.length);
    };

    const FilterSection = ({ title, children, isOpen = true }) => (
        <div className="border-b border-gray-200 py-6 last:border-0">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex justify-between items-center cursor-pointer">
                {title}
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </h3>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );

    const FilterContent = () => (
        <div className="space-y-1">
            {/* Budget */}
            <FilterSection title="Budget">
                <div className="flex gap-2 items-center mb-3">
                    <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#4169E1] focus:border-transparent bg-white text-gray-900" />
                    <span className="text-gray-400">-</span>
                    <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#4169E1] focus:border-transparent bg-white text-gray-900" />
                </div>
                <input type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4169E1]" />
            </FilterSection>

            {/* BHK Type */}
            <FilterSection title="BHK Type">
                <div className="flex flex-wrap gap-2">
                    {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map((item) => (
                        <button key={item} onClick={() => toggleFilter(bhk, setBhk, item)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${bhk.includes(item) ? 'bg-blue-50 border-[#4169E1] text-[#4169E1] shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                            {item}
                        </button>
                    ))}
                </div>
            </FilterSection>

            {/* Property Status */}
            <FilterSection title="Property Status">
                {['Ready to Move', 'Under Construction', 'Resale', 'New Launch'].map((item) => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={status.includes(item)} onChange={() => toggleFilter(status, setStatus, item)} className="w-4 h-4 text-[#4169E1] border-gray-300 rounded focus:ring-[#4169E1]" />
                        <span className="text-gray-700 text-sm group-hover:text-[#4169E1] transition-colors">{item}</span>
                    </label>
                ))}
            </FilterSection>

            {/* Amenities */}
            <FilterSection title="Amenities">
                {['Parking', 'Gym', 'Swimming Pool', 'Security', 'Club House', 'Garden'].map((item) => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={amenities.includes(item)} onChange={() => toggleFilter(amenities, setAmenities, item)} className="w-4 h-4 text-[#4169E1] border-gray-300 rounded focus:ring-[#4169E1]" />
                        <span className="text-gray-700 text-sm group-hover:text-[#4169E1] transition-colors">{item}</span>
                    </label>
                ))}
            </FilterSection>
        </div>
    );

    const MapView = ({ className }) => {
        // Current property focusing logic for mobile or desktop hover
        const activeMarker = activePropertyId || (viewMode === 'map' && window.innerWidth < 1024 ? MOCK_PROPERTIES[currentMobileIndex].id : null);

        return (
            <div className={`w-full h-full bg-gray-200 relative overflow-hidden group ${className}`}>
                {/* Map Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4169E1_1px,transparent_1px)] [background-size:20px_20px]"></div>

                {/* Center Label */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl flex flex-col items-center pointer-events-none select-none">
                    <MapIcon className="w-12 h-12 mb-2 opacity-50" />
                    <span>Interactive Map Area</span>
                </div>

                {/* Price Markers */}
                {MOCK_PROPERTIES.map((property) => (
                    <div
                        key={property.id}
                        className={`absolute cursor-pointer transition-all duration-300 transform hover:scale-110 hover:z-10 ${activeMarker === property.id ? 'z-20 scale-110' : 'z-0'}`}
                        style={{ top: property.coordinates.top, left: property.coordinates.left }}
                        onMouseEnter={() => setActivePropertyId(property.id)}
                        onMouseLeave={() => setActivePropertyId(null)}
                        onClick={() => {
                            if (window.innerWidth < 1024) setCurrentMobileIndex(MOCK_PROPERTIES.findIndex(p => p.id === property.id));
                        }}
                    >
                        <div className={`
                px-3 py-1.5 rounded-full shadow-lg text-xs font-bold border flex items-center gap-1
                ${activeMarker === property.id ? 'bg-[#4169E1] text-white border-[#4169E1]' : 'bg-white text-gray-900 border-gray-300 group-hover:border-[#4169E1]'}
              `}>
                            {property.price}
                            {activeMarker === property.id && <div className="w-2 h-2 bg-white rounded-full ml-1 animate-pulse"></div>}
                        </div>
                        {/* Pointer Triangle */}
                        <div className={`w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 mx-auto ${activeMarker === property.id ? 'border-t-[#4169E1]' : 'border-t-white'}`}></div>
                    </div>
                ))}

                {/* Zoom Controls (Visual) */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-auto">
                    <button className="w-8 h-8 bg-white rounded shadow text-gray-600 hover:text-[#4169E1] font-bold text-lg flex items-center justify-center">+</button>
                    <button className="w-8 h-8 bg-white rounded shadow text-gray-600 hover:text-[#4169E1] font-bold text-lg flex items-center justify-center">-</button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header Container */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-30">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6">

                    {/* Top Bar: Breadcrumbs & Meta */}
                    <div className={`py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 ${viewMode === 'map' ? '' : 'border-b border-gray-100'}`}>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="hover:text-[#4169E1] cursor-pointer">Home</span>
                            <span>/</span>
                            <span className="hover:text-[#4169E1] cursor-pointer">Properties in Bangalore</span>
                            <span>/</span>
                            <span className="text-gray-900 font-semibold">Luxury Flats</span>
                        </div>

                        {/* Map/List Toggle */}
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${viewMode === 'list' ? 'bg-white text-[#4169E1] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                <List className="w-4 h-4" /> List
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${viewMode === 'map' ? 'bg-white text-[#4169E1] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                <MapIcon className="w-4 h-4" /> Map
                            </button>
                        </div>
                    </div>

                    {/* Active Control Bar (Hide in Map Mode for cleaner layout or Keep? Keeping for now but maybe compact) */}
                    {viewMode === 'list' && (
                        <div className="py-3 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">Filter By:</span>
                                <div className="flex items-center gap-1 bg-blue-50 text-[#4169E1] px-2 py-1 rounded text-xs font-semibold border border-blue-100">
                                    3 BHK <X className="w-3 h-3 cursor-pointer hover:text-blue-800" />
                                </div>
                                <div className="flex items-center gap-1 bg-blue-50 text-[#4169E1] px-2 py-1 rounded text-xs font-semibold border border-blue-100">
                                    Ready to Move <X className="w-3 h-3 cursor-pointer hover:text-blue-800" />
                                </div>
                                <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium border border-gray-200 cursor-pointer hover:bg-gray-200">
                                    Clear all
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                                <span className="text-sm text-gray-500">Sort By:</span>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border-none text-sm font-bold text-gray-900 focus:ring-0 cursor-pointer bg-transparent py-0 pl-0 pr-8">
                                    <option value="newest">Relevance</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="date">Date Added</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            {viewMode === 'list' ? (
                // LIST LIST LIST LIST LIST
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-[280px] flex-shrink-0">
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 sticky top-36">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <Filter className="w-4 h-4" /> Filters
                                </h2>
                                <span className="text-xs text-[#4169E1] font-semibold cursor-pointer">Reset</span>
                            </div>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <main className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                                {MOCK_PROPERTIES.length} Premium Properties for Sale in Bangalore
                            </h1>
                            <div onClick={() => setViewMode('map')} className="hidden lg:flex items-center gap-2 cursor-pointer bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm hover:shadow hover:border-[#4169E1] transition-all group">
                                <MapIcon className="w-4 h-4 text-gray-500 group-hover:text-[#4169E1]" />
                                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#4169E1]">Map View</span>
                            </div>
                        </div>

                        <div onClick={() => setViewMode('map')} className="w-full h-32 bg-blue-50 border border-blue-100 rounded-lg mb-6 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors">
                            <div className="flex items-center gap-2 text-[#4169E1] font-bold">
                                <MapIcon className="w-5 h-5" /> View these {MOCK_PROPERTIES.length} properties on Map
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {MOCK_PROPERTIES.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    onCompare={(isChecked) => handleCompare(property, isChecked)}
                                    isSelected={!!comparedProperties.find(p => p.id === property.id)}
                                />
                            ))}
                        </div>
                        <div className="mt-10 flex justify-center gap-2">
                            <button className="px-4 py-2 bg-[#4169E1] text-white rounded font-bold text-sm shadow hover:bg-blue-700">1</button>
                            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded font-bold text-sm hover:bg-gray-50">2</button>
                            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded font-bold text-sm hover:bg-gray-50">3</button>
                            <span className="px-2 py-2 text-gray-400">...</span>
                            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded font-bold text-sm hover:bg-gray-50">12</button>
                        </div>
                    </main>
                </div>
            ) : (
                // MAP MAP MAP MAP MAP
                <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-140px)]">
                    {/* Desktop: Split Screen (Left Map, Right List) */}
                    {/* Mobile: Full Map */}

                    {/* Map Container */}
                    <div className="w-full lg:w-1/2 h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)] relative order-1 lg:order-1 sticky top-0">
                        <MapView className="h-full w-full" />
                    </div>

                    {/* List Container */}
                    <div className="hidden lg:block w-1/2 overflow-y-auto h-full p-6 bg-gray-50 order-2">
                        <div className="mb-4 flex justify-between items-center">
                            <span className="font-bold text-gray-900">{MOCK_PROPERTIES.length} Results</span>
                            <select className="text-sm border-gray-200 rounded bg-white p-1">
                                <option>Newest</option>
                                <option>Price: Low</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {MOCK_PROPERTIES.map((property) => (
                                <div key={property.id} id={`prop-card-${property.id}`} onMouseEnter={() => setActivePropertyId(property.id)} onMouseLeave={() => setActivePropertyId(null)}>
                                    <PropertyCard
                                        property={property}
                                        onCompare={(isChecked) => handleCompare(property, isChecked)}
                                        isSelected={!!comparedProperties.find(p => p.id === property.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Floating Card View */}
                    <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50 order-3">
                        <div className="bg-white rounded-xl shadow-2xl p-1 border border-gray-200 relative">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                {currentMobileIndex + 1} / {MOCK_PROPERTIES.length}
                            </div>
                            {/* Navigation Buttons for Swipe Simulation */}
                            <button
                                onClick={handleMobilePrev}
                                className="absolute top-1/2 -left-3 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 border border-gray-100 z-10"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleMobileNext}
                                className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 border border-gray-100 z-10"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            {/* Compact Card View */}
                            <PropertyCard property={MOCK_PROPERTIES[currentMobileIndex]} />
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Map Button (Mobile Only - List Mode) */}
            {viewMode === 'list' && (
                <div className="fixed bottom-24 right-4 z-40 lg:hidden">
                    <button onClick={() => setViewMode('map')} className="bg-white text-gray-900 p-3 rounded-full shadow-lg border-2 border-transparent focus:border-[#4169E1]">
                        <MapIcon className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Mobile Filter Button (List Mode Only) */}
            {viewMode === 'list' && (
                <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="bg-[#4169E1] text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                </div>
            )}

            {/* Mobile Filter Modal */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
                    <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl p-6 h-[85vh] overflow-y-auto w-full transition-transform duration-300 ease-in-out flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <FilterContent />
                        </div>
                        <div className="mt-4 pt-4 border-t sticky bottom-0 bg-white pb-4">
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-full bg-[#4169E1] text-white font-bold py-3.5 rounded-lg shadow-lg"
                            >
                                Show {MOCK_PROPERTIES.length} Properties
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Conditional Compare Bar */}
            <CompareBar
                selectedProperties={comparedProperties}
                onRemove={handleRemoveCompare}
                onClear={handleClearCompare}
            />
        </div>
    );
}
