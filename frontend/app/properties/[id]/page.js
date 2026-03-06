"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import ScheduleVisitModal from '@/components/ScheduleVisitModal';
import {
    MapPin, IndianRupee, Home, FileText, Calendar,
    Building, User, Mail, Phone, CheckCircle2, AlertCircle, Copy, Check
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const BACKEND_BASE = API_BASE.replace('/api/v1', '');

// -------------------------------------------------------
// MAPPING (same as admin page, adapted for public fields)
// -------------------------------------------------------
const mapProperty = (backendProperty) => {
    if (!backendProperty) return null;
    return {
        id: backendProperty._id || backendProperty.id || 'N/A',
        title: backendProperty.title || 'N/A',
        category: backendProperty.category || 'N/A',
        propertyType: backendProperty.details?.propertyType || backendProperty.propertyType || backendProperty.category || 'N/A',
        listingType: backendProperty.listingType || 'N/A',
        bhk: backendProperty.details?.bhk || (backendProperty.details?.bedrooms ? `${backendProperty.details.bedrooms} BHK` : 'N/A'),
        carpetArea: backendProperty.details?.carpetArea ? `${backendProperty.details.carpetArea} sq.ft.` : 'N/A',
        superArea: backendProperty.details?.superArea ? `${backendProperty.details.superArea} sq.ft.` : 'N/A',
        floorNumber: backendProperty.details?.floorNumber !== undefined ? String(backendProperty.details.floorNumber) : 'N/A',
        totalFloors: backendProperty.details?.totalFloors !== undefined ? String(backendProperty.details.totalFloors) : 'N/A',
        facing: backendProperty.details?.facing || 'N/A',
        furnishingStatus: backendProperty.details?.furnishingStatus || 'N/A',
        availabilityStatus: backendProperty.details?.availabilityStatus || backendProperty.details?.availableFrom || 'N/A',
        bathrooms: backendProperty.details?.bathrooms || null,
        balconies: backendProperty.details?.balconies || null,
        parkingCount: backendProperty.details?.parkingCount || null,
        amenities: Array.isArray(backendProperty.amenities) ? backendProperty.amenities : [],

        // Location
        address: backendProperty.location?.address || 'N/A',
        locality: backendProperty.location?.locality || 'N/A',
        subLocality: backendProperty.location?.subLocality || '',
        city: backendProperty.location?.city || 'N/A',
        state: backendProperty.location?.state || 'N/A',
        country: backendProperty.location?.country || 'IN',
        pincode: backendProperty.location?.pincode || 'N/A',
        landmark: backendProperty.location?.landmark || 'N/A',
        nearbyFacilities: Array.isArray(backendProperty.location?.nearbyFacilities) ? backendProperty.location.nearbyFacilities : [],

        // Pricing
        expectedPrice: backendProperty.pricing?.monthlyRent
            ? `₹${backendProperty.pricing.monthlyRent}/month`
            : backendProperty.pricing?.expectedPrice
                ? `₹${backendProperty.pricing.expectedPrice}`
                : backendProperty.pricing?.rentPerBed
                    ? `₹${backendProperty.pricing.rentPerBed}/bed`
                    : 'N/A',
        securityDeposit: backendProperty.pricing?.securityDeposit ? `₹${backendProperty.pricing.securityDeposit}` : null,
        bookingAmount: backendProperty.pricing?.bookingAmount ? `₹${backendProperty.pricing.bookingAmount}` : null,
        propertyTax: backendProperty.pricing?.propertyTax ? `₹${backendProperty.pricing.propertyTax}/year` : null,
        maintenanceIncluded: backendProperty.pricing?.maintenanceIncluded || null,
        electricityCharges: backendProperty.pricing?.electricityCharges || null,
        waterCharges: backendProperty.pricing?.waterCharges || null,
        priceNegotiable: backendProperty.pricing?.priceNegotiable !== undefined
            ? (backendProperty.pricing.priceNegotiable ? 'Yes' : 'No')
            : 'N/A',

        // Sell specific
        propertyOwnership: backendProperty.details?.propertyOwnership || null,
        possessionDate: backendProperty.details?.possessionDate || null,

        // Media
        coverImage: backendProperty.coverImage
            ? (backendProperty.coverImage.startsWith('http') ? backendProperty.coverImage : `${BACKEND_BASE}${backendProperty.coverImage}`)
            : null,
        basicInfoMedia: Array.isArray(backendProperty.images) && backendProperty.images.length > 0
            ? backendProperty.images.map(img => img.startsWith('http') ? img : `${BACKEND_BASE}${img}`)
            : [],

        description: backendProperty.description || null,
        createdAt: backendProperty.createdAt || new Date().toISOString(),
        updatedAt: backendProperty.updatedAt || new Date().toISOString(),

        // Owner info (enriched by the backend service layer)
        ownerName: backendProperty.ownerName || 'Property Owner',
        ownerPhone: backendProperty.ownerPhone || null,
    };
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

// -------------------------------------------------------
// SHARED UI COMPONENTS (same as admin page)
// -------------------------------------------------------
function Card({ children, className = '' }) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 ${className}`}>
            {children}
        </div>
    );
}

function SectionHeading({ icon, title }) {
    return (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            {icon}
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
            <span className="text-sm font-medium text-slate-900 mt-1">{value || 'N/A'}</span>
        </div>
    );
}

function ListingTypeBadge({ type }) {
    const map = {
        rent: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        sell: 'bg-blue-100 text-blue-700 border-blue-200',
        pg: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    const label = { rent: 'For Rent', sell: 'For Sale', pg: 'PG / Hostel' };
    const t = type?.toLowerCase();
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${map[t] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {label[t] || type}
        </span>
    );
}

// -------------------------------------------------------
// SECTION COMPONENTS
// -------------------------------------------------------
function MediaGallery({ property }) {
    const [activeImg, setActiveImg] = useState(0);
    const allImages = [];
    if (property.coverImage) allImages.push(property.coverImage);
    property.basicInfoMedia.forEach(img => {
        if (!allImages.includes(img)) allImages.push(img);
    });

    if (allImages.length === 0) {
        return (
            <div className="h-72 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 shadow-sm">
                <span className="material-symbols-outlined text-5xl mb-2">image_not_supported</span>
                <p className="text-sm font-medium">No images uploaded</p>
            </div>
        );
    }

    const hasMorePhotos = allImages.length > 3;
    const additionalPhotosCount = allImages.length - 2;

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Main Image */}
                <div className="md:col-span-3 rounded-2xl overflow-hidden aspect-video bg-slate-200 relative group cursor-pointer border border-slate-200 shadow-sm">
                    <img
                        src={allImages[activeImg] || allImages[0]}
                        alt="Cover"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-slate-800 shadow-sm">
                        Cover Image
                    </div>
                </div>

                {/* Side Thumbnails */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    {allImages.slice(1, 3).map((imgUrl, idx) => (
                        <div
                            key={idx}
                            onClick={() => setActiveImg(idx + 1)}
                            className="rounded-xl overflow-hidden aspect-video bg-slate-200 relative group cursor-pointer border border-slate-200 shadow-sm"
                        >
                            <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    ))}
                    {hasMorePhotos && (
                        <div
                            onClick={() => setActiveImg(2)}
                            className="rounded-xl overflow-hidden aspect-video bg-slate-200 relative group cursor-pointer border border-slate-200 shadow-sm flex items-center justify-center bg-slate-800"
                        >
                            <img src={allImages[2]} alt="More photos" className="w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500" />
                            <span className="absolute text-white font-bold text-lg">+{additionalPhotosCount} Photos</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveImg(idx)}
                            className={`flex-shrink-0 h-14 w-20 rounded-lg overflow-hidden border-2 transition-all ${activeImg === idx ? 'border-indigo-500 shadow-md' : 'border-transparent opacity-50 hover:opacity-75'}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function HeaderSection({ property }) {
    return (
        <Card className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{property.title}</h1>
                    <ListingTypeBadge type={property.listingType} />
                    {property.category && property.category !== 'N/A' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border bg-slate-100 text-slate-700 border-slate-200">
                            {property.category}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <MapPin size={16} />
                    {property.city}, {property.state}
                </div>
            </div>
            <div className="text-left md:text-right">
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1 md:justify-end">
                    <Calendar size={14} /> Listed on {formatDate(property.createdAt)}
                </div>
            </div>
        </Card>
    );
}

function BasicInfoCard({ property }) {
    return (
        <Card>
            <SectionHeading icon={<Home className="text-indigo-500" size={20} />} title="Basic Information" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 mb-8">
                <InfoItem label="Category" value={property.category} />
                <InfoItem label="Property Type" value={property.propertyType} />
                <InfoItem label="Listing Type" value={property.listingType} />
                <InfoItem label="BHK" value={property.bhk} />

                <InfoItem label="Carpet Area" value={property.carpetArea} />
                <InfoItem label="Super Area" value={property.superArea} />
                {(property.floorNumber !== 'N/A' || property.totalFloors !== 'N/A') && (
                    <InfoItem label="Floor" value={`${property.floorNumber} out of ${property.totalFloors}`} />
                )}
                {property.bathrooms && <InfoItem label="Bathrooms" value={`${property.bathrooms} Bath${property.bathrooms > 1 ? 's' : ''}`} />}
                {property.balconies && <InfoItem label="Balconies" value={`${property.balconies}`} />}
                {property.parkingCount && <InfoItem label="Parking" value={`${property.parkingCount} spot${property.parkingCount > 1 ? 's' : ''}`} />}

                <InfoItem label="Facing" value={property.facing} />
                <InfoItem label="Furnishing" value={property.furnishingStatus} />
                <InfoItem label="Availability" value={property.availabilityStatus} />
            </div>

            {property.description && (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Description</span>
                    <p className="text-sm text-slate-700 leading-relaxed">{property.description}</p>
                </div>
            )}

            {property.amenities.length > 0 && (
                <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-3">Amenities Overview</span>
                    <div className="flex flex-wrap gap-2">
                        {property.amenities.map((item, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}

function LocationCard({ property }) {
    return (
        <Card>
            <SectionHeading icon={<MapPin className="text-indigo-500" size={20} />} title="Location Details" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 mb-8">
                <div className="col-span-2">
                    <InfoItem label="Full Address" value={property.address} />
                </div>
                <div className="col-span-2">
                    <InfoItem label="Locality Info" value={`${property.subLocality ? property.subLocality + ', ' : ''}${property.locality || 'N/A'}`} />
                </div>

                <InfoItem label="City" value={property.city} />
                <InfoItem label="State & Country" value={`${property.state}, ${property.country || 'IN'}`} />

                <InfoItem label="Pincode" value={property.pincode} />
                <InfoItem label="Landmark" value={property.landmark} />
            </div>

            {property.nearbyFacilities && property.nearbyFacilities.length > 0 && (
                <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-3">Nearby Facilities</span>
                    <div className="flex flex-wrap gap-2">
                        {property.nearbyFacilities.map((facility, index) => (
                            <span key={index} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 capitalize">
                                {facility.replace(/-/g, ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}

function PricingCard({ property }) {
    return (
        <Card>
            <SectionHeading icon={<IndianRupee className="text-emerald-500" size={20} />} title="Pricing Details" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-6">
                <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                        {property.listingType?.toLowerCase() === 'rent' ? 'Monthly Rent' :
                            property.listingType?.toLowerCase() === 'pg' ? 'Rent Per Bed' : 'Expected Price'}
                    </span>
                    <h2 className="text-3xl font-extrabold text-emerald-600 mt-1">{property.expectedPrice}</h2>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 bg-white rounded-lg border border-emerald-200 shadow-sm text-sm font-bold text-emerald-700">
                    Price Negotiable: {property.priceNegotiable}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {property.securityDeposit && <InfoItem label="Security Deposit" value={property.securityDeposit} />}
                {property.bookingAmount && <InfoItem label="Booking Amount" value={property.bookingAmount} />}
                {property.propertyTax && <InfoItem label="Property Tax" value={property.propertyTax} />}
                {property.maintenanceIncluded && <InfoItem label="Maintenance" value={property.maintenanceIncluded} />}
                {property.electricityCharges && <InfoItem label="Electricity" value={property.electricityCharges} />}
                {property.waterCharges && <InfoItem label="Water" value={property.waterCharges} />}
            </div>
        </Card>
    );
}

function ConditionalCard({ property }) {
    if (property.listingType?.toLowerCase() === 'sell' && (property.propertyOwnership || property.possessionDate)) {
        return (
            <Card>
                <SectionHeading icon={<FileText className="text-indigo-500" size={20} />} title="Sale Details" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {property.propertyOwnership && <InfoItem label="Ownership" value={property.propertyOwnership} />}
                    {property.possessionDate && <InfoItem label="Possession Date" value={property.possessionDate} />}
                    <InfoItem label="Price Negotiable" value={property.priceNegotiable} />
                </div>
            </Card>
        );
    }
    return null;
}

function ContactSidebar({ onScheduleVisit, ownerName, ownerPhone }) {
    const [showPhone, setShowPhone] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (ownerPhone) {
            navigator.clipboard.writeText(ownerPhone);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card className="border-t-4 border-t-indigo-500 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <User size={24} className="text-slate-400" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-slate-900">{ownerName || 'Property Owner'}</h3>
                    <span className="text-xs text-slate-500">Listed this property</span>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                {ownerPhone ? (
                    showPhone ? (
                        <div className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                            <div className="flex items-center gap-2 text-indigo-700 font-bold tracking-wide">
                                <Phone size={16} />
                                {ownerPhone}
                            </div>
                            <button
                                onClick={handleCopy}
                                className="p-2 rounded-lg text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors shadow-sm"
                                title="Copy to clipboard"
                            >
                                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowPhone(true)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm text-sm"
                        >
                            <Phone size={16} /> View Phone Number
                        </button>
                    )
                ) : (
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed text-sm">
                        <Phone size={16} /> No Phone Available
                    </button>
                )}
                <button
                    onClick={onScheduleVisit}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors text-sm"
                >
                    <Calendar size={16} /> Schedule Visit
                </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 text-center leading-relaxed">
                    {ownerPhone ? 'Contact the owner directly or schedule a visit.' : 'Contact details will be shared after you connect with the owner.'}
                </p>
            </div>
        </Card>
    );
}

function QuickInfoSidebar({ property }) {
    return (
        <Card>
            <h3 className="font-bold text-slate-900 mb-4">Quick Info</h3>
            <div className="space-y-3">
                {property.listingType !== 'N/A' && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Listing Type</span>
                        <span className="font-semibold capitalize text-slate-800">{property.listingType}</span>
                    </div>
                )}
                {property.category !== 'N/A' && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Category</span>
                        <span className="font-semibold capitalize text-slate-800">{property.category}</span>
                    </div>
                )}
                {property.propertyType !== 'N/A' && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Type</span>
                        <span className="font-semibold text-slate-800">{property.propertyType}</span>
                    </div>
                )}
                {property.bhk !== 'N/A' && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">BHK</span>
                        <span className="font-semibold text-slate-800">{property.bhk}</span>
                    </div>
                )}
                {property.superArea !== 'N/A' && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Area</span>
                        <span className="font-semibold text-slate-800">{property.superArea}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Listed On</span>
                    <span className="font-semibold text-slate-800">{formatDate(property.createdAt)}</span>
                </div>
            </div>
        </Card>
    );
}

// -------------------------------------------------------
// MAIN PAGE
// -------------------------------------------------------
export default function PropertyDetailPage() {
    const params = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showVisitModal, setShowVisitModal] = useState(false);

    useEffect(() => {
        let isMounted = true;
        async function fetchProperty() {
            if (!params?.id) return;
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/property/${params.id}`, { cache: 'no-store' });
                if (!res.ok) throw new Error('Property not found');
                const data = await res.json();
                if (!isMounted) return;
                const fetched = data.data || data;
                setProperty(mapProperty(fetched));
                setError(null);
            } catch (err) {
                if (isMounted) setError(err.message || 'Failed to load property');
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchProperty();
        return () => { isMounted = false; };
    }, [params?.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Property Not Found</h2>
                    <p className="text-slate-500 text-center max-w-md">{error || 'This listing may have been removed.'}</p>
                    <Link href="/" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            <Header />

            {/* Schedule Visit Modal */}
            {showVisitModal && (
                <ScheduleVisitModal
                    propertyId={property.id}
                    propertyTitle={property.title}
                    onClose={() => setShowVisitModal(false)}
                />
            )}

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <Link href="/properties" className="hover:text-indigo-600 transition-colors">Properties</Link>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-slate-800 font-medium truncate max-w-xs">{property.title}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {/* 1. Top Header */}
                <HeaderSection property={property} />

                {/* 2. Media Gallery */}
                <MediaGallery property={property} />

                {/* 3. Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <BasicInfoCard property={property} />
                        <LocationCard property={property} />
                        <PricingCard property={property} />
                        <ConditionalCard property={property} />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-4">
                        <ContactSidebar onScheduleVisit={() => setShowVisitModal(true)} ownerName={property.ownerName} ownerPhone={property.ownerPhone} />
                        <QuickInfoSidebar property={property} />
                    </div>
                </div>
            </div>
        </div>
    );
}
