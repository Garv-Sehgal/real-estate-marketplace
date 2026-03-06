"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import CompareBar from '@/components/CompareBar';
import { X, Map as MapIcon, ChevronDown, Filter, List, ArrowRight, ArrowLeft, Loader } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const BACKEND_BASE = API_BASE.replace('/api/v1', '');

function mapPropertyToCard(p) {
    const raw = p.coverImage || (p.images && p.images[0]);
    const imgUrl = raw ? (raw.startsWith('http') ? raw : `${BACKEND_BASE}${raw}`) : null;

    const pricing = p.pricing || {};
    const amount = pricing.expectedPrice || pricing.monthlyRent || pricing.rentPerBed;
    let price = 'Price on request';
    if (amount) {
        const suffix = pricing.monthlyRent ? '/mo' : pricing.rentPerBed ? '/bed' : '';
        if (amount >= 10000000) price = `₹ ${(amount / 10000000).toFixed(2)} Cr${suffix}`;
        else if (amount >= 100000) price = `₹ ${(amount / 100000).toFixed(1)} L${suffix}`;
        else price = `₹ ${amount.toLocaleString('en-IN')}${suffix}`;
    }

    const city = p.location?.city || p.location?.locality || '';
    const locality = p.location?.locality || '';
    const location = [locality, city].filter(Boolean).join(', ') || 'Location not specified';

    const details = p.details || {};
    const bhk = details.bhk || (details.bedrooms ? `${details.bedrooms} BHK` : null) || '—';
    const area = details.superArea || details.carpetArea;
    const baths = details.bathrooms;

    const listingTag = { sell: 'For Sale', rent: 'For Rent', pg: 'PG' }[p.listingType?.toLowerCase()];

    return {
        id: p._id || p.id,
        title: p.title || 'Untitled',
        location,
        price,
        pricePerSqft: '',
        bhk,
        area: area ? `${area} sqft` : '—',
        baths: baths ? `${baths} Bath${baths > 1 ? 's' : ''}` : '—',
        status: details.availabilityStatus || details.availableFrom || listingTag || '—',
        image: imgUrl,
        photos: p.images?.length || 0,
        isVerified: false,
        tag: listingTag || '',
    };
}



export default function PropertiesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
    const [activePropertyId, setActivePropertyId] = useState(null);

    // Real properties state
    const [properties, setProperties] = useState([]);
    const [loadingProps, setLoadingProps] = useState(true);

    useEffect(() => {
        async function fetchProperties() {
            try {
                const res = await fetch(`${API_BASE}/property`);
                const json = await res.json();
                const mapped = (json.data || []).map(mapPropertyToCard);
                setProperties(mapped);
            } catch (err) {
                console.error('Failed to fetch properties', err);
            } finally {
                setLoadingProps(false);
            }
        }
        fetchProperties();
    }, []);

    // Handle initial view mode from URL
    useEffect(() => {
        if (searchParams.get('view') === 'map') {
            setViewMode('map');
        }
    }, [searchParams]);

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
        setCurrentMobileIndex((prev) => (prev + 1) % properties.length);
    };

    const handleMobilePrev = () => {
        setCurrentMobileIndex((prev) => (prev - 1 + properties.length) % properties.length);
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
        const [isSearching, setIsSearching] = useState(false);

        const handleSearchArea = () => {
            setIsSearching(true);
            console.log('Scanning coordinates...');
            // Mock fetching properties with bounds
            // const bounds = { north: ..., south: ..., east: ..., west: ... };
            // fetchProperties(bounds);

            setTimeout(() => {
                setIsSearching(false);
            }, 1000);
        };

        return (
            <div className={`w-full h-full bg-gray-200 relative overflow-hidden group ${className}`}>
                {/* Map Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4169E1_1px,transparent_1px)] [background-size:20px_20px]"></div>

                {/* Search This Area Floating Button */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
                    <button
                        onClick={handleSearchArea}
                        disabled={isSearching}
                        className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold text-gray-700 hover:scale-105 transition-transform disabled:opacity-70 disabled:scale-100"
                    >
                        {isSearching ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin text-[#4169E1]" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-primary text-lg">near_me</span>
                                Search this area
                            </>
                        )}
                    </button>
                </div>

                {/* Center Label */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl flex flex-col items-center pointer-events-none select-none">
                    <MapIcon className="w-12 h-12 mb-2 opacity-50" />
                    <span>Interactive Map Area</span>
                </div>

                {/* Price Markers */}
                {properties.map((property, idx) => (
                    <div
                        key={property.id}
                        className={`absolute cursor-pointer transition-all duration-300 transform hover:scale-110 hover:z-10 ${activePropertyId === property.id ? 'z-20 scale-110' : 'z-0'}`}
                        style={{ top: `${20 + (idx * 13) % 60}%`, left: `${15 + (idx * 17) % 70}%` }}
                        onMouseEnter={() => setActivePropertyId(property.id)}
                        onMouseLeave={() => setActivePropertyId(null)}
                        onClick={() => {
                            if (window.innerWidth < 1024) setCurrentMobileIndex(properties.findIndex(p => p.id === property.id));
                        }}
                    >
                        <div className={`
                px-3 py-1.5 rounded-full shadow-lg text-xs font-bold border flex items-center gap-1
                ${activePropertyId === property.id ? 'bg-[#4169E1] text-white border-[#4169E1]' : 'bg-white text-gray-900 border-gray-300 group-hover:border-[#4169E1]'}
              `}>
                            {property.price}
                            {activePropertyId === property.id && <div className="w-2 h-2 bg-white rounded-full ml-1 animate-pulse"></div>}
                        </div>
                        {/* Pointer Triangle */}
                        <div className={`w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 mx-auto ${activePropertyId === property.id ? 'border-t-[#4169E1]' : 'border-t-white'}`}></div>
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
                                {loadingProps ? 'Loading properties…' : `${properties.length} ${properties.length === 1 ? 'Property' : 'Properties'} Available`}
                            </h1>
                            <div onClick={() => setViewMode('map')} className="hidden lg:flex items-center gap-2 cursor-pointer bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm hover:shadow hover:border-[#4169E1] transition-all group">
                                <MapIcon className="w-4 h-4 text-gray-500 group-hover:text-[#4169E1]" />
                                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#4169E1]">Map View</span>
                            </div>
                        </div>

                        <div onClick={() => setViewMode('map')} className="w-full h-32 bg-blue-50 border border-blue-100 rounded-lg mb-6 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors">
                            <div className="flex items-center gap-2 text-[#4169E1] font-bold">
                                <MapIcon className="w-5 h-5" /> View {loadingProps ? '' : `${properties.length} `}properties on Map
                            </div>
                        </div>

                        {/* Loading skeleton */}
                        {loadingProps && (
                            <div className="grid grid-cols-1 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row h-auto md:h-64 animate-pulse">
                                        <div className="w-full md:w-2/5 h-56 md:h-full bg-gray-200" />
                                        <div className="flex-1 p-5 space-y-4">
                                            <div className="h-6 bg-gray-200 rounded w-3/4" />
                                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                                            <div className="grid grid-cols-4 gap-4 my-4">
                                                {[...Array(4)].map((_, j) => <div key={j} className="h-10 bg-gray-200 rounded" />)}
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="h-10 bg-gray-200 rounded w-32" />
                                                <div className="h-10 bg-gray-200 rounded w-32" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty state */}
                        {!loadingProps && properties.length === 0 && (
                            <div className="text-center py-24 text-gray-400">
                                <span className="material-symbols-outlined text-7xl mb-4 block text-gray-200">home</span>
                                <p className="text-xl font-bold text-gray-700">No approved properties yet</p>
                                <p className="text-sm mt-2">Check back soon — new listings are reviewed regularly.</p>
                            </div>
                        )}

                        {/* Real property cards */}
                        {!loadingProps && properties.length > 0 && (
                            <div className="grid grid-cols-1 gap-6">
                                {properties.map((property) => (
                                    <PropertyCard
                                        key={property.id}
                                        property={property}
                                        onCompare={(isChecked) => handleCompare(property, isChecked)}
                                        isSelected={!!comparedProperties.find(p => p.id === property.id)}
                                        onClick={() => router.push(`/properties/${property.id}`)}
                                    />
                                ))}
                            </div>
                        )}
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
                            <span className="font-bold text-gray-900">{properties.length} Results</span>
                            <select className="text-sm border-gray-200 rounded bg-white p-1">
                                <option>Newest</option>
                                <option>Price: Low</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {properties.map((property) => (
                                <div key={property.id} id={`prop-card-${property.id}`} onMouseEnter={() => setActivePropertyId(property.id)} onMouseLeave={() => setActivePropertyId(null)}>
                                    <PropertyCard
                                        property={property}
                                        onCompare={(isChecked) => handleCompare(property, isChecked)}
                                        isSelected={!!comparedProperties.find(p => p.id === property.id)}
                                        onClick={() => router.push(`/properties/${property.id}`)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Floating Card View */}
                    {properties.length > 0 && (
                        <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50 order-3">
                            <div className="bg-white rounded-xl shadow-2xl p-1 border border-gray-200 relative">
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {currentMobileIndex + 1} / {properties.length}
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
                                <PropertyCard
                                    property={properties[currentMobileIndex]}
                                    onClick={() => router.push(`/properties/${properties[currentMobileIndex]?.id}`)}
                                />
                            </div>
                        </div>
                    )}
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
                                Show {properties.length} Properties
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
