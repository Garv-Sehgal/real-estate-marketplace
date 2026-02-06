"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, X, MapPin } from 'lucide-react';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';

// Using the same MOCK data for simplicity, but in a real app this would fetch by ID
const MOCK_PROPERTIES_DATA = [
    {
        id: 1,
        title: "3 BHK Luxury Apartment",
        location: "Indiranagar",
        city: "Bangalore",
        price: "₹ 1.25 Cr",
        priceRaw: 12500000,
        area: "1850 sqft",
        bhk: "3 BHK",
        baths: "3 Baths",
        status: "Ready to Move",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        amenities: ["Gym", "Pool", "Parking", "Security", "Club House"]
    },
    {
        id: 2,
        title: "4 BHK Premium Villa",
        location: "Whitefield",
        city: "Bangalore",
        price: "₹ 3.50 Cr",
        priceRaw: 35000000,
        area: "3200 sqft",
        bhk: "4 BHK",
        baths: "4 Baths",
        status: "Under Construction",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        amenities: ["Gym", "Pool", "Parking", "Security", "Garden", "Home Automation"]
    },
    {
        id: 3,
        title: "2 BHK Cozy Flat",
        location: "Koramangala",
        city: "Bangalore",
        price: "₹ 85 L",
        priceRaw: 8500000,
        area: "1200 sqft",
        bhk: "2 BHK",
        baths: "2 Baths",
        status: "Resale",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        amenities: ["Parking", "Security"]
    },
    {
        id: 4,
        title: "3 BHK Garden Facing",
        location: "Hebbal",
        city: "Bangalore",
        price: "₹ 1.10 Cr",
        priceRaw: 11000000,
        area: "1650 sqft",
        bhk: "3 BHK",
        baths: "3 Baths",
        status: "Ready to Move",
        image: "https://images.unsplash.com/photo-1599809275372-b40c369dd6cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        amenities: ["Gym", "Parking", "Security", "Garden"]
    },
    {
        id: 5,
        title: "Ultra Modern Penthouse",
        location: "MG Road",
        city: "Bangalore",
        price: "₹ 5.50 Cr",
        priceRaw: 55000000,
        area: "4500 sqft",
        bhk: "4+ BHK",
        baths: "5 Baths",
        status: "Ready to Move",
        image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        amenities: ["Gym", "Pool", "Parking", "Security", "Club House", "Garden", "Home Automation", "Concierge"]
    },
    {
        id: 6,
        title: "Compact Studio",
        location: "Electronic City",
        city: "Bangalore",
        price: "₹ 45 L",
        priceRaw: 4500000,
        area: "850 sqft",
        bhk: "1 BHK",
        baths: "1 Bath",
        status: "Ready to Move",
        image: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        amenities: ["Parking", "Security", "Wifi"]
    }
];

const ALL_AMENITIES = ["Gym", "Pool", "Parking", "Security", "Club House", "Garden", "Home Automation", "Concierge", "Wifi"];

function CompareContent() {
    const searchParams = useSearchParams();
    const ids = searchParams.get('ids')?.split(',').map(Number) || [];

    const properties = MOCK_PROPERTIES_DATA.filter(p => ids.includes(p.id));

    if (properties.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">No Properties Selected</h1>
                <p className="text-gray-600 mb-6">Please go back and select properties to compare.</p>
                <Link href="/properties">
                    <button className="px-6 py-3 bg-[#4169E1] text-white font-bold rounded-lg shadow hover:bg-blue-700 transition">
                        Back to Properties
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/properties" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Compare Properties ({properties.length})</h1>
                    </div>
                </div>

                {/* Sticky Images Header Row */}
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 overflow-x-auto hide-scrollbar">
                    <div className="flex min-w-max">
                        <div className="w-40 md:w-56 p-4 flex-shrink-0 font-bold text-gray-500">Property</div>
                        {properties.map(property => (
                            <div key={property.id} className="w-64 md:w-80 p-4 flex-shrink-0 flex flex-col gap-3">
                                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">
                                    <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                                        ID: {property.id}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 line-clamp-1" title={property.title}>{property.title}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {property.location}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Comparison Rows */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 overflow-x-auto hide-scrollbar">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100 min-w-max">

                    {/* Price */}
                    <div className="flex hover:bg-gray-50 transition-colors">
                        <div className="w-40 md:w-56 p-5 flex-shrink-0 font-bold text-gray-900 bg-gray-50/50">Price</div>
                        {properties.map(property => (
                            <div key={property.id} className="w-64 md:w-80 p-5 flex-shrink-0 font-bold text-[#4169E1] text-lg">
                                {property.price}
                            </div>
                        ))}
                    </div>

                    {/* Location */}
                    <div className="flex hover:bg-gray-50 transition-colors">
                        <div className="w-40 md:w-56 p-5 flex-shrink-0 font-bold text-gray-900 bg-gray-50/50">Location</div>
                        {properties.map(property => (
                            <div key={property.id} className="w-64 md:w-80 p-5 flex-shrink-0 text-gray-700">
                                {property.location}, {property.city}
                            </div>
                        ))}
                    </div>

                    {/* Area */}
                    <div className="flex hover:bg-gray-50 transition-colors">
                        <div className="w-40 md:w-56 p-5 flex-shrink-0 font-bold text-gray-900 bg-gray-50/50">Area</div>
                        {properties.map(property => (
                            <div key={property.id} className="w-64 md:w-80 p-5 flex-shrink-0 text-gray-700 font-medium">
                                {property.area}
                            </div>
                        ))}
                    </div>

                    {/* Configuration */}
                    <div className="flex hover:bg-gray-50 transition-colors">
                        <div className="w-40 md:w-56 p-5 flex-shrink-0 font-bold text-gray-900 bg-gray-50/50">Configuration</div>
                        {properties.map(property => (
                            <div key={property.id} className="w-64 md:w-80 p-5 flex-shrink-0 text-gray-700">
                                {property.bhk} • {property.baths}
                            </div>
                        ))}
                    </div>

                    {/* Status */}
                    <div className="flex hover:bg-gray-50 transition-colors">
                        <div className="w-40 md:w-56 p-5 flex-shrink-0 font-bold text-gray-900 bg-gray-50/50">Status</div>
                        {properties.map(property => (
                            <div key={property.id} className="w-64 md:w-80 p-5 flex-shrink-0">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${property.status === 'Ready to Move' ? 'bg-green-100 text-green-700' :
                                        property.status === 'Under Construction' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {property.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Amenities Header */}
                    <div className="bg-gray-100 p-3 font-bold text-gray-500 text-xs tracking-wider uppercase">
                        Amenities & Features
                    </div>

                    {/* Amenities List */}
                    {ALL_AMENITIES.map(amenity => (
                        <div key={amenity} className="flex hover:bg-gray-50 transition-colors group">
                            <div className="w-40 md:w-56 p-4 flex-shrink-0 font-medium text-gray-700 bg-gray-50/30 group-hover:bg-gray-100 transition-colors flex items-center">
                                {amenity}
                            </div>
                            {properties.map(property => {
                                const hasAmenity = property.amenities.includes(amenity);
                                return (
                                    <div key={property.id} className="w-64 md:w-80 p-4 flex-shrink-0 flex items-center pl-8">
                                        {hasAmenity ? (
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                <X className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default function ComparePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Comparison...</div>}>
            <CompareContent />
        </Suspense>
    );
}
