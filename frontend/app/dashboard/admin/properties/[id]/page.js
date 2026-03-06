"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiRequest } from '../../../../../lib/api';
import {
    ShieldCheck, AlertTriangle, FileText, MapPin, IndianRupee, Home, Users,
    CheckCircle2, XCircle, AlertCircle, Calendar, Download, Building, Compass,
    Maximize, ArrowUp, Flag, Map, Info, Star, Copy, User, Mail, Phone,
    Clock, Activity
} from 'lucide-react';

// ---------------------------------------------------------
// MAPPING FUNCTIONS
// ---------------------------------------------------------
const mapUser = (backendUser) => {
    if (!backendUser) return {};
    return {
        id: backendUser._id || backendUser.id || "N/A",
        name: backendUser.name || "N/A",
        role: backendUser.role || "N/A",
        email: backendUser.email || "N/A",
        phone: backendUser.phone || "N/A",
        mobileVerified: !!backendUser.mobileVerified,
        emailVerified: !!backendUser.emailVerified,
        kycStatus: backendUser.kycStatus || "unverified",
        accountCreatedAt: backendUser.createdAt || backendUser.accountCreatedAt || new Date().toISOString(),
        totalListings: backendUser.totalListings || 0,
        accountStatus: backendUser.status || backendUser.accountStatus || "active"
    };
};

const mapProperty = (backendProperty) => {
    if (!backendProperty) return null;
    return {
        id: backendProperty._id || backendProperty.id || "N/A",
        title: backendProperty.title || "N/A",
        category: backendProperty.category || "N/A",
        propertyType: backendProperty.details?.propertyType || backendProperty.propertyType || backendProperty.category || "N/A",
        listingType: backendProperty.listingType || "N/A",
        listingStatus: backendProperty.review?.status || backendProperty.status || backendProperty.listingStatus || "pending",
        bhk: backendProperty.details?.bhk || (backendProperty.details?.bedrooms ? `${backendProperty.details.bedrooms} BHK` : (backendProperty.bhk || "N/A")),
        carpetArea: backendProperty.details?.carpetArea ? `${backendProperty.details.carpetArea} sq.ft.` : (backendProperty.carpetArea ? `${backendProperty.carpetArea} sq.ft.` : "N/A"),
        superArea: backendProperty.details?.superArea ? `${backendProperty.details.superArea} sq.ft.` : (backendProperty.superArea ? `${backendProperty.superArea} sq.ft.` : "N/A"),
        floorNumber: backendProperty.details?.floorNumber !== undefined ? String(backendProperty.details.floorNumber) : (backendProperty.details?.floor !== undefined ? String(backendProperty.details.floor) : (backendProperty.floorNumber !== undefined ? String(backendProperty.floorNumber) : "N/A")),
        totalFloors: backendProperty.details?.totalFloors !== undefined ? String(backendProperty.details.totalFloors) : (backendProperty.totalFloors !== undefined ? String(backendProperty.totalFloors) : "N/A"),
        propertyAge: backendProperty.details?.propertyAge || backendProperty.propertyAge || "N/A",
        facing: backendProperty.details?.facing || backendProperty.facing || "N/A",
        furnishingStatus: backendProperty.details?.furnishingStatus || backendProperty.furnishingStatus || "N/A",
        availabilityStatus: backendProperty.details?.availabilityStatus || backendProperty.availabilityStatus || backendProperty.availability || "N/A",
        amenities: Array.isArray(backendProperty.amenities) ? backendProperty.amenities : [],

        // Location Details
        address: backendProperty.location?.address || backendProperty.address || "N/A",
        locality: backendProperty.location?.locality || backendProperty.locality || "N/A",
        subLocality: backendProperty.location?.subLocality || backendProperty.subLocality || "",
        city: backendProperty.location?.city || backendProperty.city || "N/A",
        state: backendProperty.location?.state || backendProperty.state || "N/A",
        country: backendProperty.location?.country || backendProperty.country || "IN",
        pincode: backendProperty.location?.pincode || backendProperty.pincode || "N/A",
        landmark: backendProperty.location?.landmark || backendProperty.landmark || "N/A",
        latitude: backendProperty.location?.coordinates?.[1] || backendProperty.latitude || "N/A",
        longitude: backendProperty.location?.coordinates?.[0] || backendProperty.longitude || "N/A",
        nearbyFacilities: Array.isArray(backendProperty.nearbyFacilities) ? backendProperty.nearbyFacilities : [],

        // Pricing Details
        expectedPrice: backendProperty.pricing?.monthlyRent ? `₹${backendProperty.pricing.monthlyRent}` : (backendProperty.pricing?.expectedPrice ? `₹${backendProperty.pricing.expectedPrice}` : (backendProperty.expectedPrice || backendProperty.price ? `₹${backendProperty.price || backendProperty.expectedPrice}` : "N/A")),
        maintenanceAmount: backendProperty.pricing?.maintenanceAmount ? `₹${backendProperty.pricing.maintenanceAmount}` : (backendProperty.pricing?.maintenance ? `₹${backendProperty.pricing.maintenance}` : (backendProperty.maintenanceAmount ? `₹${backendProperty.maintenanceAmount}` : "N/A")),
        maintenanceFrequency: backendProperty.pricing?.maintenanceFrequency || backendProperty.maintenanceFrequency || "N/A",
        bookingAmount: backendProperty.pricing?.bookingAmount ? `₹${backendProperty.pricing.bookingAmount}` : (backendProperty.pricing?.securityDeposit ? `₹${backendProperty.pricing.securityDeposit}` : (backendProperty.bookingAmount ? `₹${backendProperty.bookingAmount}` : "N/A")),
        propertyTax: backendProperty.pricing?.propertyTax ? `₹${backendProperty.pricing.propertyTax}/year` : (backendProperty.propertyTax ? `₹${backendProperty.propertyTax}/year` : "N/A"),

        // Sell Specific (Conditional)
        propertyOwnership: backendProperty.details?.propertyOwnership || backendProperty.propertyOwnership || backendProperty.ownership || "N/A",
        possessionDate: backendProperty.details?.possessionDate || backendProperty.possessionDate || "N/A",
        activeLoan: backendProperty.details?.activeLoan !== undefined ? (backendProperty.details.activeLoan ? "Yes" : "No") : (backendProperty.activeLoan ? "Yes" : "No"),
        priceNegotiable: backendProperty.pricing?.priceNegotiable !== undefined ? (backendProperty.pricing.priceNegotiable ? "Yes" : "No") : (backendProperty.priceNegotiable ? "Yes" : "No"),

        // Media
        // The backend `createProperty` controller now returns absolute URLs like `http://localhost:5000/uploads/properties/xyz.jpg`
        coverImage: backendProperty.coverImage || (backendProperty.images && backendProperty.images.length > 0 ? backendProperty.images[0] : "/images/demo-property.jpg"),
        basicInfoMedia: Array.isArray(backendProperty.images) && backendProperty.images.length > 0
            ? backendProperty.images
            : (Array.isArray(backendProperty.basicInfoMedia) ? backendProperty.basicInfoMedia : []),

        // Verification & Trust
        fraudRiskScore: backendProperty.fraudRiskScore || 0,
        duplicateFlag: !!backendProperty.duplicateFlag,
        listingScore: backendProperty.listingScore || 0,
        verificationStatus: backendProperty.verificationStatus || "unverified",
        geoTagConfirmed: !!backendProperty.verification?.geoTagConfirmed || !!backendProperty.geoTagConfirmed,
        liveLocationVerified: !!backendProperty.liveLocationVerified,
        govtIdUpload: backendProperty.verification?.govtId || null,
        ownershipProofUpload: backendProperty.verification?.ownershipProof || null,

        // Meta / Admin
        createdAt: backendProperty.createdAt || new Date().toISOString(),
        updatedAt: backendProperty.updatedAt || new Date().toISOString()
    };
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
    const params = useParams();
    const [property, setProperty] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchProperty() {
            if (!params?.id) return;

            try {
                setLoading(true);
                const data = await apiRequest(`/admin/properties/${params.id}`);
                console.log("PROPERTY API RESPONSE:", data);
                if (!isMounted) return;

                const fetchedProperty = data.data || data; // handle generic responses
                const fetchedUser = fetchedProperty.user || fetchedProperty.owner || data.user || {};

                setProperty(mapProperty(fetchedProperty));
                setUser(mapUser(fetchedUser));
                setError(null);
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Failed to fetch property details');
                    console.error("Error fetching property:", err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchProperty();

        return () => { isMounted = false; };
    }, [params?.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Loading property details...</p>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center">
                    <XCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Property Not Found</h2>
                <p className="text-slate-500 text-center max-w-md">
                    {error || "The property you are looking for does not exist or has been removed."}
                </p>
            </div>
        );
    }

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

                {property.govtIdUpload ? (
                    <a href={property.govtIdUpload} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-sm font-semibold text-slate-700">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-indigo-500" /> Govt ID Proof
                        </div>
                        <Download size={16} className="text-indigo-600 hover:text-indigo-800 transition-colors" />
                    </a>
                ) : (
                    <div className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-400 cursor-not-allowed">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-300" /> Govt ID Proof
                        </div>
                        <span className="text-xs">Missing</span>
                    </div>
                )}

                {property.ownershipProofUpload ? (
                    <a href={property.ownershipProofUpload} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-sm font-semibold text-slate-700">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-indigo-500" /> Ownership Docs
                        </div>
                        <Download size={16} className="text-indigo-600 hover:text-indigo-800 transition-colors" />
                    </a>
                ) : (
                    <div className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-400 cursor-not-allowed">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-300" /> Ownership Docs
                        </div>
                        <span className="text-xs">Missing</span>
                    </div>
                )}
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
