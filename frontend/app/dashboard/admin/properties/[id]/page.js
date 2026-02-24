"use client";

import React from 'react';
import {
    ShieldCheck, AlertTriangle, FileText, MapPin, IndianRupee, Home, Users,
    CheckCircle2, XCircle, AlertCircle, Calendar, Download, Building, Compass,
    Maximize, ArrowUp, Flag, Map, Info, Star, Copy, User, Mail, Phone,
    Clock, Activity
} from 'lucide-react';

// ---------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------
const user = {
    id: "USR-8891",
    name: "John Fernandes",
    role: "Agent",
    email: "john.agent@example.com",
    phone: "+91 9876543210",
    mobileVerified: true,
    emailVerified: false,
    kycStatus: "verified",
    accountCreatedAt: "2025-12-10T08:00:00Z",
    totalListings: 4,
    accountStatus: "active"
};

const property = {
    id: "PROP-10293",
    title: "Luxury 3 BHK Penthouse in Koramangala",
    category: "Residential",
    propertyType: "Flat",
    listingType: "Sell",
    listingStatus: "pending",
    bhk: "3 BHK",
    carpetArea: "1800 sq.ft.",
    superArea: "2200 sq.ft.",
    floorNumber: "12",
    totalFloors: "15",
    propertyAge: "New Construction",
    facing: "East",
    furnishingStatus: "Semi-Furnished",
    availabilityStatus: "Ready to Move",
    amenities: ["Power Backup", "Security", "Lift", "Gym", "Swimming Pool", "Parking", "CCTV Surveillance"],

    // Location Details
    address: "Skyview Apartments, 100 Feet Road",
    locality: "Koramangala",
    subLocality: "Block 3",
    city: "Bangalore",
    state: "Karnataka",
    country: "IN",
    pincode: "560034",
    landmark: "Near Oasis Mall",
    latitude: "12.9352",
    longitude: "77.6245",
    nearbyFacilities: ["Metro Station", "Hospital", "Mall", "Bus Stop", "super-market", "Bank", "Atm"],

    // Pricing Details
    expectedPrice: "₹ 4.5 Cr",
    maintenanceAmount: "₹ 8,000",
    maintenanceFrequency: "Monthly",
    bookingAmount: "₹ 5,00,000",
    propertyTax: "₹ 12,000/year",

    // Sell Specific (Conditional)
    propertyOwnership: "First Owner",
    possessionDate: "Immediate",
    activeLoan: "No",
    priceNegotiable: "Yes",

    // Media
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000",
    basicInfoMedia: [
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1598928506311-c55dd1b31bb6?auto=format&fit=crop&q=80&w=800"
    ],

    // Verification & Trust
    fraudRiskScore: 15, // Low
    duplicateFlag: false,
    listingScore: 85,
    verificationStatus: "unverified",
    geoTagConfirmed: true,
    liveLocationVerified: false,

    // Meta / Admin
    createdAt: "2026-02-23T10:00:00Z",
    updatedAt: "2026-02-23T10:30:00Z"
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

// ---------------------------------------------------------
// MAIN PAGE COMPONENT
// ---------------------------------------------------------
export default function PropertyReviewPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* 1. Top Header */}
                <HeaderSection property={property} user={user} />

                {/* 2. Media Gallery */}
                <MediaGallery property={property} />

                {/* 3. Main Content Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column (Main Info) */}
                    <div className="lg:col-span-2 space-y-6">
                        <ListingMetadata property={property} />
                        <BasicInfoCard property={property} />
                        <LocationCard property={property} />
                        <PricingCard property={property} />
                        <ConditionalCard property={property} />
                    </div>

                    {/* Right Column (Verification & Risk) */}
                    <div className="lg:col-span-1 space-y-6">
                        <UserIdentityPanel user={user} />
                        <VerificationPanel user={user} property={property} />
                        <AdminNotes />
                    </div>
                </div>

            </div>

            {/* 4. Sticky Bottom Action Bar */}
            <ActionBar property={property} />
        </div>
    );
}

// ---------------------------------------------------------
// REUSABLE COMPONENTS
// ---------------------------------------------------------

function Card({ children, className = "" }) {
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
            <span className="text-sm font-medium text-slate-900 mt-1">{value || "N/A"}</span>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        active: "bg-emerald-100 text-emerald-700 border-emerald-200",
        rejected: "bg-rose-100 text-rose-700 border-rose-200"
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status] || styles.pending}`}>
            {status}
        </span>
    );
}

function BooleanBadge({ condition, trueText = "Verified", falseText = "Pending" }) {
    if (condition) {
        return (
            <span className="flex w-fit items-center gap-1.5 text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">
                <CheckCircle2 size={14} /> {trueText}
            </span>
        );
    }
    return (
        <span className="flex w-fit items-center gap-1.5 text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded border border-slate-200">
            <AlertCircle size={14} /> {falseText}
        </span>
    );
}

// ---------------------------------------------------------
// SECTION COMPONENTS
// ---------------------------------------------------------

function HeaderSection({ property, user }) {
    return (
        <Card className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{property.title}</h1>
                    <StatusBadge status={property.listingStatus} />
                    {property.duplicateFlag && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 uppercase tracking-wide border border-rose-200 flex items-center gap-1">
                            <Flag size={12} /> Duplicate
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <MapPin size={16} />
                    {property.city}, {property.state}
                </div>
            </div>
            <div className="text-left md:text-right flex flex-col md:items-end gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Submitted by:</span>
                    <span className="text-sm font-bold text-slate-900">{user.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                        {user.role}
                    </span>
                </div>
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar size={14} /> {formatDate(property.createdAt)}
                </div>
            </div>
        </Card>
    );
}

function MediaGallery({ property }) {
    const hasMorePhotos = property.basicInfoMedia.length > 3;
    const additionalPhotosCount = property.basicInfoMedia.length - 2;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Cover Image */}
            <div className="md:col-span-3 rounded-2xl overflow-hidden aspect-video bg-slate-200 relative group cursor-pointer border border-slate-200 shadow-sm">
                <img
                    src={property.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-slate-800 shadow-sm">
                    Cover Image
                </div>
            </div>

            {/* Side Thumbnails */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                {property.basicInfoMedia.slice(0, 2).map((imgUrl, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden aspect-video bg-slate-200 relative group cursor-pointer border border-slate-200 shadow-sm">
                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                ))}

                {hasMorePhotos && (
                    <div className="rounded-xl overflow-hidden aspect-video bg-slate-200 relative group cursor-pointer border border-slate-200 shadow-sm flex items-center justify-center bg-slate-800">
                        <img src={property.basicInfoMedia[2]} alt="More photos" className="w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500" />
                        <span className="absolute text-white font-bold text-lg">+{additionalPhotosCount} Photos</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function ListingMetadata({ property }) {
    return (
        <Card className="bg-slate-50/50 border-dashed border-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <InfoItem label="Property ID" value={property.id} />
                <InfoItem label="Created At" value={formatDate(property.createdAt)} />
                <InfoItem label="Last Updated" value={formatDate(property.updatedAt)} />
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Listing Status</span>
                    <StatusBadge status={property.listingStatus} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Verification</span>
                    <span className="text-sm font-bold capitalize text-slate-800">{property.verificationStatus}</span>
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
                <InfoItem label="Floor" value={`${property.floorNumber} out of ${property.totalFloors}`} />
                <InfoItem label="Property Age" value={property.propertyAge} />

                <InfoItem label="Facing" value={property.facing} />
                <InfoItem label="Furnishing" value={property.furnishingStatus} />
                <InfoItem label="Availability" value={property.availabilityStatus} />
            </div>

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
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-3">Nearby Facilities Overview</span>
                    <div className="flex flex-wrap gap-2">
                        {property.nearbyFacilities.map((facility, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 capitalize"
                            >
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
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Expected Price</span>
                    <h2 className="text-3xl font-extrabold text-emerald-600 mt-1">{property.expectedPrice}</h2>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 bg-white rounded-lg border border-emerald-200 shadow-sm text-sm font-bold text-emerald-700">
                    Price Negotiable: {property.priceNegotiable}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <InfoItem label="Maintenance" value={`${property.maintenanceAmount} / ${property.maintenanceFrequency}`} />
                <InfoItem label="Booking Amount" value={property.bookingAmount} />
                <InfoItem label="Property Tax" value={property.propertyTax} />
            </div>
        </Card>
    );
}

function ConditionalCard({ property }) {
    if (property.listingType === "Sell") {
        return (
            <Card>
                <SectionHeading icon={<FileText className="text-indigo-500" size={20} />} title="Sell Specific Details" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <InfoItem label="Ownership" value={property.propertyOwnership} />
                    <InfoItem label="Possession Date" value={property.possessionDate} />
                    <InfoItem label="Active Loan" value={property.activeLoan} />
                    <InfoItem label="Price Negotiable" value={property.priceNegotiable} />
                </div>
            </Card>
        );
    }

    // Add logic for Rent/PG if needed
    return null;
}

function UserIdentityPanel({ user }) {
    return (
        <Card className="border-t-4 border-t-indigo-500">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <User size={24} className="text-slate-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                            {user.role}
                        </span>
                        <StatusBadge status={user.accountStatus} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={16} /> {user.email}
                    </div>
                    <BooleanBadge condition={user.emailVerified} />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={16} /> {user.phone}
                    </div>
                    <BooleanBadge condition={user.mobileVerified} />
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">KYC Status</span>
                        <span className={`text-sm font-bold ${user.kycStatus === 'verified' ? 'text-emerald-600' : 'text-slate-600'}`}>
                            {user.kycStatus.toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Total Listings</span>
                        <span className="text-sm font-bold text-slate-900">{user.totalListings}</span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Member Since</span>
                        <span className="text-sm font-medium text-slate-800">{formatDate(user.accountCreatedAt)}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function VerificationPanel({ user, property }) {
    return (
        <Card>
            <SectionHeading icon={<ShieldCheck className="text-indigo-500" size={20} />} title="Document Verifications" />

            <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium text-slate-700">Geo-Tagging</span>
                    <BooleanBadge condition={property.geoTagConfirmed} />
                </div>
                <div className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium text-slate-700">Live Location</span>
                    <BooleanBadge condition={property.liveLocationVerified} />
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Submitted Proofs</span>
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-indigo-500" /> Govt ID Proof.pdf
                    </div>
                    <Download size={16} className="text-slate-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-indigo-500" /> Ownership Docs.png
                    </div>
                    <Download size={16} className="text-slate-400" />
                </button>
            </div>
        </Card>
    );
}

function AdminNotes() {
    return (
        <Card>
            <SectionHeading icon={<FileText className="text-indigo-500" size={20} />} title="Admin Notes" />
            <div className="space-y-3">
                <textarea
                    className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                    placeholder="Add internal moderation notes here..."
                ></textarea>
                <button className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                    Save Notes
                </button>
            </div>
        </Card>
    );
}

function ActionBar({ property }) {
    return (
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.05)] z-20">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="hidden sm:block">
                    <p className="text-sm font-medium text-slate-500">Reviewing listing: <span className="font-bold text-slate-800">{property.id}</span></p>
                </div>
                <div className="flex w-full sm:w-auto items-center gap-3">
                    <button className="flex-1 sm:flex-none px-6 py-2.5 bg-rose-100 hover:bg-rose-200 border border-rose-200 text-rose-700 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                        <XCircle size={18} /> Reject
                    </button>
                    <button className="flex-1 sm:flex-none px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <AlertCircle size={18} /> Req. Changes
                    </button>
                    <button className="flex-1 sm:flex-none px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <CheckCircle2 size={18} /> Approve
                    </button>
                </div>
            </div>
        </div>
    );
}
