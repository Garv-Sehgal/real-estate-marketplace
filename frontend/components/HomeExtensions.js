"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getImageUrl(property) {
    const raw = property.coverImage || (property.images && property.images[0]);
    if (!raw) return null;
    // Already an absolute URL
    if (raw.startsWith('http')) return raw;
    // Relative path – prefix with backend base
    const base = API_BASE.replace('/api/v1', '');
    return `${base}${raw}`;
}

function formatPrice(property) {
    const p = property.pricing || {};
    const amount = p.expectedPrice || p.monthlyRent || p.rentPerBed;
    if (!amount) return 'Price on request';
    const suffix = p.monthlyRent ? '/mo' : p.rentPerBed ? '/bed' : '';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr${suffix}`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L${suffix}`;
    return `₹${amount.toLocaleString('en-IN')}${suffix}`;
}

function FeaturedListings() {
    const router = useRouter();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchListings() {
            setLoading(true);
            try {
                const res = await apiRequest('/property');
                const allProps = res.data || [];
                setProperties(allProps.slice(0, 4));
            } catch (err) {
                console.error('Failed to fetch featured listings:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchListings();
    }, []);

    const listingTypeBadge = (type) => {
        if (!type) return null;
        const t = type.toLowerCase();
        if (t === 'sell') return { label: 'Sale', color: 'bg-blue-600' };
        if (t === 'rent') return { label: 'Rent', color: 'bg-emerald-500' };
        if (t === 'pg') return { label: 'PG', color: 'bg-purple-600' };
        return { label: type, color: 'bg-slate-600' };
    };

    return (
        <section className="bg-gray-50 py-16">
            <div className="w-full px-6 md:px-12 lg:px-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Featured Listings</h2>
                        <p className="text-gray-600 mt-2">Explore approved properties from our verified owners</p>
                    </div>
                    <Link href="/properties" className="text-blue-600 font-bold flex items-center gap-1 hover:underline">
                        View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[2rem] overflow-hidden border border-gray-200 animate-pulse">
                                <div className="h-56 bg-gray-200" />
                                <div className="p-6 space-y-4">
                                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    <div className="h-4 bg-gray-200 rounded w-full" />
                                    <div className="h-10 bg-gray-200 rounded-2xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <span className="material-symbols-outlined text-6xl mb-4 block text-gray-300">home</span>
                        <p className="text-xl font-semibold">No listings available yet</p>
                        <p className="text-sm mt-2">Check back soon for approved properties.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {properties.map((property) => {
                            const imgUrl = getImageUrl(property);
                            const price = formatPrice(property);
                            const badge = listingTypeBadge(property.listingType);
                            const city = property.location?.city || property.location?.locality || 'India';
                            const address = [property.location?.locality, city].filter(Boolean).join(', ');
                            const bhk = property.details?.bhk || (property.details?.bedrooms ? `${property.details.bedrooms} BHK` : null);
                            const area = property.details?.superArea || property.details?.carpetArea;
                            const baths = property.details?.bathrooms;

                            return (
                                <div
                                    key={property.id}
                                    onClick={() => router.push(`/properties/${property.id}`)}
                                    className="bg-white rounded-[2rem] overflow-hidden border border-gray-200 group hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                >
                                    <div className="relative h-56 overflow-hidden bg-gray-100">
                                        {imgUrl ? (
                                            <img
                                                src={imgUrl}
                                                alt={property.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                                <span className="material-symbols-outlined text-5xl">image</span>
                                                <span className="text-xs mt-2">No image</span>
                                            </div>
                                        )}
                                        {badge && (
                                            <div className="absolute top-4 left-4">
                                                <span className={`${badge.color} text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider`}>
                                                    {badge.label}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <h3 className="font-bold text-gray-900 text-base leading-tight truncate flex-1">{property.title}</h3>
                                            <span className="text-blue-600 font-black text-sm whitespace-nowrap">{price}</span>
                                        </div>
                                        <p className="text-gray-500 text-xs flex items-center gap-1 mb-4 truncate">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            {address || 'Location not specified'}
                                        </p>
                                        <div className="flex items-center gap-3 py-4 border-y border-gray-100 mb-4 text-xs">
                                            {bhk && (
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-gray-400 text-base">bed</span>
                                                    <span className="font-bold">{bhk}</span>
                                                </div>
                                            )}
                                            {baths && (
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-gray-400 text-base">bathtub</span>
                                                    <span className="font-bold">{baths} Bath{baths > 1 ? 's' : ''}</span>
                                                </div>
                                            )}
                                            {area && (
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-gray-400 text-base">square_foot</span>
                                                    <span className="font-bold">{area} sqft</span>
                                                </div>
                                            )}
                                        </div>
                                        <button className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-blue-600 transition-all transform hover:scale-[1.02]">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

const HomeExtensions = () => {
    const router = useRouter();
    return (
        <>
            {/* Explore Categories */}
            <section className="w-full px-6 md:px-12 lg:px-16 py-16">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Explore Categories</h2>
                        <p className="text-gray-600 mt-1">Discover your perfect property by type</p>
                    </div>
                    <a className="text-blue-600 font-bold flex items-center gap-1 hover:underline" href="#">View All <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="group cursor-pointer p-8 rounded-2xl bg-white border border-gray-200 hover:border-blue-600 transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <span className="material-symbols-outlined text-3xl">apartment</span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900">Apartments</h3>
                        <p className="text-gray-600 text-sm mt-1">1,240+ Active Listings</p>
                    </div>
                    <div className="group cursor-pointer p-8 rounded-2xl bg-white border border-gray-200 hover:border-blue-600 transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-emerald-100 text-emerald-500 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            <span className="material-symbols-outlined text-3xl">home</span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900">Villas</h3>
                        <p className="text-gray-600 text-sm mt-1">850+ Premium Homes</p>
                    </div>
                    <div className="group cursor-pointer p-8 rounded-2xl bg-white border border-gray-200 hover:border-blue-600 transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-orange-100 text-orange-500 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all">
                            <span className="material-symbols-outlined text-3xl">storefront</span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900">Commercial</h3>
                        <p className="text-gray-600 text-sm mt-1">430+ Spaces</p>
                    </div>
                    <div className="group cursor-pointer p-8 rounded-2xl bg-white border border-gray-200 hover:border-blue-600 transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-purple-100 text-purple-500 mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all">
                            <span className="material-symbols-outlined text-3xl">landscape</span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900">Land Plots</h3>
                        <p className="text-gray-600 text-sm mt-1">120+ Opportunities</p>
                    </div>
                </div>
            </section>

            {/* Featured Listings */}
            <FeaturedListings />


            {/* Map Preview Section */}
            <section className="py-24 w-full px-6 md:px-12 lg:px-16">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <span className="inline-block py-1 px-4 bg-blue-100 text-blue-600 text-xs font-black uppercase tracking-wider rounded-full">Explore on Map</span>
                        <h2 className="text-4xl font-extrabold text-gray-900">Direct Google Maps Integration</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Direct Google Maps view is natively available for all properties. Visualize property prices, schools, and transportation in your desired neighborhoods with our interactive map link in property details.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                                <span className="font-medium text-gray-600">Real-time market data overlays</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                                <span className="font-medium text-gray-600">Interactive neighborhood boundaries</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push('/properties')}
                            className="mt-4 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">map</span>
                            Open Map View
                        </button>
                    </div>
                    <div className="flex-1 w-full h-[400px] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl relative group">
                        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Map Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </section >

            {/* Role-Based Entry Section */}
            < section className="bg-slate-900 py-16 text-white" >
                <div className="w-full px-6 md:px-12 lg:px-16">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Real Estate for Everyone</h2>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">Whether you're buying your first home, selling an investment, or managing rentals, we have the tools you need.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Buyer/Tenant */}
                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">home</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Buy or Rent</h3>
                            <p className="text-gray-300 mb-6 text-sm leading-relaxed">Find your dream home with AI-powered search and verified listings.</p>
                            <span className="text-blue-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Start Searching <span className="material-symbols-outlined text-xs">arrow_forward</span></span>
                        </div>

                        {/* Landlord/Seller */}
                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group">
                            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">sell</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Sell or Lease</h3>
                            <p className="text-gray-300 mb-6 text-sm leading-relaxed">List your property for free and reach millions of potential buyers.</p>
                            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Post Property <span className="material-symbols-outlined text-xs">arrow_forward</span></span>
                        </div>

                        {/* Agent */}
                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group">
                            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">support_agent</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Real Estate Agents</h3>
                            <p className="text-gray-300 mb-6 text-sm leading-relaxed">Boost your leads and manage clients with our pro dashboard.</p>
                            <span className="text-purple-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Join as Pro <span className="material-symbols-outlined text-xs">arrow_forward</span></span>
                        </div>
                    </div>
                </div>
            </section >

            {/* Smart Tools Highlights */}
            < section id="insights" className="w-full px-6 md:px-12 lg:px-16 py-16" >
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="bg-white border border-gray-200 p-10 rounded-[3rem] shadow-2xl relative">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <p className="text-blue-600 text-xs font-black uppercase tracking-widest mb-1">Market Trend</p>
                                    <h3 className="text-2xl font-bold text-gray-900">Residential Appreciation</h3>
                                </div>
                                <div className="bg-background px-4 py-2 rounded-xl text-sm font-bold">San Francisco</div>
                            </div>
                            <div className="h-64 flex items-end gap-3 mb-10">
                                <div className="flex-1 bg-slate-100 rounded-xl h-[40%] transition-all hover:h-[45%]"></div>
                                <div className="flex-1 bg-slate-100 rounded-xl h-[55%]"></div>
                                <div className="flex-1 bg-slate-100 rounded-xl h-[50%]"></div>
                                <div className="flex-1 bg-slate-100 rounded-xl h-[65%]"></div>
                                <div className="flex-1 bg-blue-600/40 rounded-xl h-[75%]"></div>
                                <div className="flex-1 bg-blue-600 rounded-xl h-[95%] relative">
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black py-1.5 px-3 rounded-lg whitespace-nowrap shadow-xl">
                                        +12.4% Forecast
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-gray-200">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Median Price</p>
                                    <p className="text-2xl font-black text-gray-900">$1.2M</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Avg. ROI</p>
                                    <p className="text-2xl font-black text-emerald-500">+8.2%</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Market</p>
                                    <p className="text-2xl font-black text-blue-600">Bullish</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 space-y-8">
                        <span className="inline-block py-1 px-4 bg-blue-100 text-blue-600 text-xs font-black uppercase tracking-wider rounded-full">AI Insights</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Data-Driven <span className="text-blue-600">Decision Making</span></h2>
                        <p className="text-lg text-gray-600 leading-relaxed">Our proprietary AI engines analyze millions of data points, from local zoning changes to global economic shifts, ensuring you invest with confidence.</p>
                        <div className="space-y-6 pt-4">
                            <div className="flex gap-5 items-start">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined">trending_up</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl text-gray-900">Price Appreciation Forecast</h4>
                                    <p className="text-gray-600 text-sm mt-1">94% historical accuracy in predicting property value growth over 3-year windows.</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div className="w-12 h-12 flex-shrink-0 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">analytics</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl text-gray-900">Neighborhood Vibe Index</h4>
                                    <p className="text-gray-600 text-sm mt-1">Quantitative analysis of safety, lifestyle, schools, and future infrastructure projects.</p>
                                </div>
                            </div>
                        </div>
                        <button className="mt-6 px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-600/40 transition-all">
                            Unlock Premium Reports
                        </button>
                    </div>
                </div>
            </section >

            {/* Booking & Payments Teaser */}
            < section id="faqs" className="bg-slate-50 py-16" >
                <div className="w-full px-6 md:px-12 lg:px-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Streamlined Transactions</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
                        From scheduling viewings to signing contracts, everything happens in one secure place.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-2xl">calendar_month</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Viewings</h3>
                            <p className="text-sm text-gray-600">Book visits directly with owners or agents. Syncs with your calendar automatically.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-2xl">chat</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Messaging</h3>
                            <p className="text-sm text-gray-600">Chat safely without sharing personal contact info until you're ready.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-2xl">payments</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Online Payments</h3>
                            <p className="text-sm text-gray-600">Pay token amounts, rent, or deposits securely through our escrow system.</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* Knowledge & Resources */}
            < section id="blog" className="py-24 w-full px-6 md:px-12 lg:px-16" >
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Knowledge Hub</h2>
                        <p className="text-gray-600">Guides, trends, and tips for every step of your journey.</p>
                    </div>
                    <button className="text-blue-600 font-bold hover:underline hidden md:block">Read all articles</button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="group cursor-pointer">
                        <div className="h-60 rounded-2xl overflow-hidden mb-6 relative">
                            <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Blog 1" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-800">Guide</div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">First-Time Home Buyer's Checklist</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">Everything you need to know before making your biggest investment, from credit scores to closing costs.</p>
                    </div>
                    <div className="group cursor-pointer">
                        <div className="h-60 rounded-2xl overflow-hidden mb-6 relative">
                            <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Blog 2" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-800">Analysis</div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">2024 Real Estate Market Forecast</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">Expert predictions on interest rates, housing supply, and the best cities for investment this year.</p>
                    </div>
                    <div className="group cursor-pointer">
                        <div className="h-60 rounded-2xl overflow-hidden mb-6 relative">
                            <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Blog 3" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-800">Tips</div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Staging Secrets to Sell Faster</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">Simple design tweaks that can increase your property's value and attract more offers.</p>
                    </div>
                </div>
            </section >

            {/* Subscribe / Footer Teaser */}
            < section className="py-24 bg-slate-900" >
                <div className="w-full max-w-5xl mx-auto px-6 md:px-12 lg:px-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Never Miss a Listing</h2>
                    <p className="text-slate-400 text-lg mb-12">Get early access to exclusive off-market properties and weekly AI-driven market trends delivered to your inbox.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white/5 p-2 rounded-[2rem] border border-white/10">
                        <input className="flex-1 px-6 py-4 rounded-2xl bg-transparent border-0 focus:ring-0 text-white placeholder:text-slate-500 focus:outline-none" placeholder="your@email.com" type="email" />
                        <button className="bg-blue-600 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-extrabold transition-all whitespace-nowrap">Subscribe Now</button>
                    </div>
                </div>
            </section >

            {/* Footer */}
            <footer id="about" className="bg-white py-20 border-t border-gray-200">
                <div className="w-full px-6 md:px-12 lg:px-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <img
                                    src="/images/Elite_Estates Logo.png"
                                    alt="SPRxElite Estate Logo"
                                    className="h-16 w-auto object-contain"
                                />
                                <span className="text-2xl font-extrabold text-blue-900 tracking-tight">SPRxElite Estate</span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-8">
                                Elevating the real estate experience through intelligent technology and user-focused design.
                            </p>
                            <div className="flex gap-4">
                                {/* Instagram - Vibrant Gradient */}
                                <a className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md hover:shadow-lg hover:scale-110 transition-all transform" href="#">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2"></line></svg>
                                </a>
                                {/* Facebook - Brand Blue */}
                                <a className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-md hover:shadow-lg hover:scale-110 transition-all transform" href="#">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                                </a>
                                {/* LinkedIn - Brand Blue */}
                                <a className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center text-white shadow-md hover:shadow-lg hover:scale-110 transition-all transform" href="#">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                </a>
                                {/* Twitter/X - Black */}
                                <a className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-md hover:shadow-lg hover:scale-110 transition-all transform" href="#">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-gray-900 uppercase text-xs tracking-widest">Buy & Rent</h4>
                            <ul className="space-y-4 text-sm text-gray-600">
                                <li><a className="hover:text-blue-600 transition-colors" href="#">Browse Homes</a></li>
                                <li><a className="hover:text-blue-600 transition-colors" href="#">Rentals</a></li>
                                <li><a className="hover:text-blue-600 transition-colors" href="#">Sell Property</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-gray-900 uppercase text-xs tracking-widest">Resources</h4>
                            <ul className="space-y-4 text-sm text-gray-600">
                                <li><a className="hover:text-blue-600 transition-colors" href="#">Market Trends</a></li>
                                <li><a className="hover:text-blue-600 transition-colors" href="#">Agent Directory</a></li>
                                <li><a className="hover:text-blue-600 transition-colors" href="#">Calculators</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-gray-900 uppercase text-xs tracking-widest">Company</h4>
                            <ul className="space-y-4 text-sm text-gray-600">
                                <li><a className="hover:text-blue-600 transition-colors" href="#">About SPRxElite</a></li>
                                <li><a className="hover:text-blue-600 transition-colors" href="#">Contact Us</a></li>
                                <li><a className="hover:text-blue-600 transition-colors" href="#">Careers</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-400 text-xs">© 2024 SPRxElite Estates. Built with Intelligence.</p>
                        <div className="flex gap-8 text-xs text-slate-400">
                            <a className="hover:text-blue-600 transition-colors" href="#">Terms of Service</a>
                            <a className="hover:text-blue-600 transition-colors" href="#">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer >
        </>
    );
};

export default HomeExtensions;
