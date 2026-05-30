"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, X, MapPin } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const BACKEND_BASE = API_BASE.replace('/api/v1', '');

const ALL_AMENITIES = ["Gym", "Pool", "Parking", "Security", "Club House", "Garden", "Home Automation", "Concierge", "Wifi"];

function getImageUrl(property) {
    const raw = property.coverImage || (property.images && property.images[0]);
    if (!raw) return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
    if (raw.startsWith('http')) return raw;
    return `${BACKEND_BASE}${raw}`;
}

function formatPrice(property) {
    const p = property.pricing || {};
    const amount = p.expectedPrice || p.monthlyRent || p.rentPerBed;
    if (!amount) return 'Price on request';
    const suffix = p.monthlyRent ? '/mo' : p.rentPerBed ? '/bed' : '';
    if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr${suffix}`;
    if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(1)} L${suffix}`;
    return `₹ ${amount.toLocaleString('en-IN')}${suffix}`;
}

function mapProperty(p) {
    const details = p.details || {};
    const amenities = p.amenities || [];
    const city = p.location?.city || p.location?.locality || '';
    const locality = p.location?.locality || '';

    return {
        id: p._id || p.id,
        title: p.title || 'Untitled',
        location: locality || 'N/A',
        city,
        price: formatPrice(p),
        area: details.superArea || details.carpetArea ? `${details.superArea || details.carpetArea} sqft` : '—',
        bhk: details.bhk || (details.bedrooms ? `${details.bedrooms} BHK` : '—'),
        baths: details.bathrooms ? `${details.bathrooms} Bath${details.bathrooms > 1 ? 's' : ''}` : '—',
        status: details.availabilityStatus || details.availableFrom || '—',
        image: getImageUrl(p),
        amenities: Array.isArray(amenities) ? amenities : [],
        listingType: p.listingType || '',
    };
}

function CompareContent() {
    const searchParams = useSearchParams();
    const idsParam = searchParams.get('ids') || '';
    const ids = idsParam ? idsParam.split(',').filter(Boolean) : [];

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (ids.length === 0) { setLoading(false); return; }

        async function fetchProperties() {
            setLoading(true);
            setError(null);
            try {
                const results = await Promise.all(
                    ids.map(id =>
                        fetch(`${API_BASE}/property/${id}`)
                            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
                            .then(json => json.data || json)
                            .catch(() => null)
                    )
                );
                setProperties(results.filter(Boolean).map(mapProperty));
            } catch {
                setError('Failed to load properties. Please try again.');
            } finally {
                setLoading(false);
            }
        }
        fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idsParam]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-[#4169E1] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading comparison...</p>
            </div>
        );
    }

    if (error || properties.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{error ? 'Something went wrong' : 'No Properties Selected'}</h1>
                <p className="text-gray-600 mb-6">
                    {error || <>Please go <Link href="/properties" className="text-[#4169E1] hover:underline">back</Link> and select properties to compare.</>}
                </p>
                <Link href="/properties">
                    <button className="px-6 py-3 bg-[#4169E1] text-white font-bold rounded-lg shadow hover:bg-blue-700 transition">
                        Back to Properties
                    </button>
                </Link>
            </div>
        );
    }

    const n = properties.length;
    // CSS grid: label column is fixed at 140px, each property gets equal share of remaining space
    const gridStyle = { display: 'grid', gridTemplateColumns: `140px repeat(${n}, 1fr)` };

    const labelCell = "p-4 font-bold text-gray-500 text-sm bg-gray-50 border-r border-gray-100 flex items-center";
    const valueCell = "p-4 text-gray-700 text-sm flex items-center border-r border-gray-100 last:border-r-0";

    return (
        <div className="min-h-screen bg-gray-50 pb-16">

            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
                    <Link href="/properties" className="p-2 hover:bg-gray-100 rounded-full text-gray-600 flex-shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Compare Properties ({n})</h1>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* ── Property images header ── */}
                    <div style={gridStyle}>
                        <div className={`${labelCell} text-xs uppercase tracking-wider`}>Property</div>
                        {properties.map(p => (
                            <div key={p.id} className="p-4 border-r border-gray-100 last:border-r-0 flex flex-col gap-3">
                                <Link href={`/properties/${p.id}`}>
                                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 relative cursor-pointer hover:opacity-90 transition-opacity">
                                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                                        {p.listingType && (
                                            <span className="absolute top-2 left-2 bg-[#4169E1] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                                {p.listingType}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2" title={p.title}>{p.title}</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="line-clamp-1">{p.location}{p.city ? `, ${p.city}` : ''}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="divide-y divide-gray-100">

                        {/* ── Price ── */}
                        <div style={gridStyle} className="hover:bg-gray-50 transition-colors">
                            <div className={labelCell}>Price</div>
                            {properties.map(p => (
                                <div key={p.id} className={`${valueCell} font-bold text-[#4169E1] text-base`}>{p.price}</div>
                            ))}
                        </div>

                        {/* ── Location ── */}
                        <div style={gridStyle} className="hover:bg-gray-50 transition-colors">
                            <div className={labelCell}>Location</div>
                            {properties.map(p => (
                                <div key={p.id} className={valueCell}>{p.location}{p.city ? `, ${p.city}` : ''}</div>
                            ))}
                        </div>

                        {/* ── Area ── */}
                        <div style={gridStyle} className="hover:bg-gray-50 transition-colors">
                            <div className={labelCell}>Area</div>
                            {properties.map(p => (
                                <div key={p.id} className={`${valueCell} font-medium`}>{p.area}</div>
                            ))}
                        </div>

                        {/* ── Config ── */}
                        <div style={gridStyle} className="hover:bg-gray-50 transition-colors">
                            <div className={labelCell}>Config</div>
                            {properties.map(p => (
                                <div key={p.id} className={valueCell}>{p.bhk} · {p.baths}</div>
                            ))}
                        </div>

                        {/* ── Status ── */}
                        <div style={gridStyle} className="hover:bg-gray-50 transition-colors">
                            <div className={labelCell}>Status</div>
                            {properties.map(p => (
                                <div key={p.id} className={valueCell}>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        p.status === 'Ready to Move' ? 'bg-green-100 text-green-700' :
                                        p.status === 'Under Construction' ? 'bg-orange-100 text-orange-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {p.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* ── Amenities header ── */}
                        <div className="bg-gray-100 px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Amenities &amp; Features
                        </div>

                        {ALL_AMENITIES.map(amenity => (
                            <div key={amenity} style={gridStyle} className="hover:bg-gray-50 transition-colors group">
                                <div className={`${labelCell} font-medium text-gray-600 text-xs group-hover:bg-gray-100 transition-colors`}>{amenity}</div>
                                {properties.map(p => {
                                    const has = Array.isArray(p.amenities) && p.amenities.some(a =>
                                        (typeof a === 'string' ? a : a?.name || '').toLowerCase() === amenity.toLowerCase()
                                    );
                                    return (
                                        <div key={p.id} className={`${valueCell} justify-center`}>
                                            {has ? (
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                    <Check className="w-3.5 h-3.5" />
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

                        {/* ── View Details row ── */}
                        <div style={gridStyle}>
                            <div className={labelCell} />
                            {properties.map(p => (
                                <div key={p.id} className="p-4 border-r border-gray-100 last:border-r-0">
                                    <Link href={`/properties/${p.id}`}>
                                        <button className="w-full px-4 py-2 bg-[#4169E1] text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ComparePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading Comparison...</div>}>
            <CompareContent />
        </Suspense>
    );
}
