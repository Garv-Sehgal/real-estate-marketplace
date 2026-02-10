"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Check,
    ChevronRight,
    ChevronLeft,
    MapPin,
    Home,
    Building,
    DollarSign,
    Grid,
    Type,
    Zap,
    ArrowUp,
    Dumbbell,
    Droplets,
    Shield,
    Car,
    Coffee,
    Sofa,
    UploadCloud,
    X,
    FileText,
    Eye,
    CheckCircle2,
    Wifi,
    Pencil,
    Save,
    Utensils
} from 'lucide-react';

export default function PostPropertyPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showReview, setShowReview] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1
        title: '',
        description: '',
        category: 'Residential',
        propertyType: 'Flat',
        listingType: 'Sell',
        // Step 2
        city: '',
        state: '',
        pincode: '',
        address: '',
        // Step 3
        carpetArea: '',
        superArea: '',
        areaUnit: 'sqft',
        expectedPrice: '',
        pricePerSqft: '',
        maintenanceAmount: '',
        maintenanceFrequency: 'Monthly',
        possessionStatus: 'Ready to Move',
        bhk: '2 BHK',
        bathrooms: '2',
        balconies: '1',
        // Step 4
        amenities: [],
        furnishingStatus: 'Semi-Furnished',
        facing: 'East',
        // Step 5
        images: [],
        // Step 6
        documents: [],
        // PG Specific
        roomType: [], // Single, Double, Triple
        genderPreference: 'Anyone', // Male, Female, Anyone
        foodIncluded: false,
        foodOptions: [], // Breakfast, Lunch, Dinner
        securityDeposit: '',
        noticePeriod: '1 Month'
    });

    // Auto-calculate Price per Sq.Ft
    useEffect(() => {
        if (formData.expectedPrice && formData.superArea) {
            const price = parseFloat(formData.expectedPrice.replace(/,/g, ''));
            const area = parseFloat(formData.superArea);
            if (!isNaN(price) && !isNaN(area) && area > 0) {
                setFormData(prev => ({
                    ...prev,
                    pricePerSqft: Math.round(price / area).toString()
                }));
            }
        }
    }, [formData.expectedPrice, formData.superArea]);

    const steps = [
        { id: 1, label: 'Basic Info' },
        { id: 2, label: 'Location' },
        { id: 3, label: 'Pricing & Area' },
        { id: 4, label: 'Amenities' },
        { id: 5, label: 'Media' },
        { id: 6, label: 'Verification' },
        { id: 7, label: 'Review' }
    ];

    const AMENITIES_LIST = [
        { id: 'power_backup', label: 'Power Backup', icon: Zap },
        { id: 'lift', label: 'Lift', icon: ArrowUp },
        { id: 'gym', label: 'Gymnasium', icon: Dumbbell },
        { id: 'pool', label: 'Swimming Pool', icon: Droplets },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'parking', label: 'Reserved Parking', icon: Car },
        { id: 'club_house', label: 'Club House', icon: Coffee },
        { id: 'wifi', label: 'Wifi', icon: Wifi },
    ];

    const PG_AMENITIES_LIST = [
        { id: 'wifi', label: 'Wifi', icon: Wifi },
        { id: 'ac', label: 'AC', icon: Zap },
        { id: 'laundry', label: 'Laundry', icon: Droplets },
        { id: 'housekeeping', label: 'Housekeeping', icon: CheckCircle2 },
        { id: 'cctv', label: 'CCTV', icon: Shield },
        { id: 'power_backup', label: 'Power Backup', icon: Zap },
    ];

    const toggleAmenity = (id) => {
        setFormData(prev => {
            const current = prev.amenities;
            if (current.includes(id)) {
                return { ...prev, amenities: current.filter(item => item !== id) };
            } else {
                return { ...prev, amenities: [...current, id] };
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file)
        }));
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    const removeImage = (id) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter(img => img.id !== id) }));
    };

    const handleDocUpload = (e) => {
        const files = Array.from(e.target.files);
        const newDocs = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        }));
        setFormData(prev => ({ ...prev, documents: [...prev.documents, ...newDocs] }));
    };

    const removeDoc = (id) => {
        setFormData(prev => ({ ...prev, documents: prev.documents.filter(doc => doc.id !== id) }));
    };

    const nextStep = () => {
        if (currentStep < steps.length) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccessModal(true);
        }, 2000);
    };

    // Validation
    const isStepValid = () => {
        if (currentStep === 1) return formData.title && formData.description && formData.category && formData.propertyType;
        if (currentStep === 2) return formData.city && formData.state && formData.pincode && formData.address;
        if (currentStep === 3) {
            if (formData.listingType === 'PG') {
                return formData.roomType.length > 0 && formData.expectedPrice && formData.securityDeposit;
            }
            return formData.carpetArea && formData.superArea && formData.expectedPrice && formData.bhk;
        }
        if (currentStep === 5) return formData.images.length > 0;
        if (currentStep === 6) return formData.documents.length > 0;
        return true;
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
            <div className="max-w-4xl mx-auto">

                {/* Header & Stepper */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">List Your Property</h1>

                    <div className="relative flex justify-between items-center w-full px-2">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0 -translate-y-1/2 rounded-full"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-0 -translate-y-1/2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {steps.map((step) => (
                            <div key={step.id} className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={() => currentStep > step.id && setCurrentStep(step.id)}>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-4 transition-all duration-300
                                    ${currentStep > step.id
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : currentStep === step.id
                                                ? 'bg-white border-blue-600 text-blue-600 shadow-md scale-110'
                                                : 'bg-white border-slate-200 text-slate-400'
                                        }`}
                                >
                                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                                </div>
                                <span className={`absolute top-10 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap transition-colors duration-300 hidden sm:block
                                    ${currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'}
                                `}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
                    <div className="p-6 md:p-8 flex-1">

                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-slate-100 p-1 rounded-xl inline-flex relative shadow-inner">
                                            <div
                                                className={`absolute top-1 bottom-1 w-[33%] bg-blue-600 rounded-lg shadow-sm transition-all duration-300 ease-out
                                                ${formData.listingType === 'Sell' ? 'translate-x-0' :
                                                        formData.listingType === 'Rent' ? 'translate-x-[100%]' : 'translate-x-[200%]'}
                                                `}
                                            ></div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, listingType: 'Sell' }))}
                                                className={`relative z-10 px-6 py-2 text-sm font-bold rounded-lg transition-colors duration-300
                                                ${formData.listingType === 'Sell' ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                For Sale
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, listingType: 'Rent' }))}
                                                className={`relative z-10 px-6 py-2 text-sm font-bold rounded-lg transition-colors duration-300
                                                ${formData.listingType === 'Rent' ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                For Rent
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, listingType: 'PG' }))}
                                                className={`relative z-10 px-6 py-2 text-sm font-bold rounded-lg transition-colors duration-300
                                                ${formData.listingType === 'PG' ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                PG / Hostel
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Property Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Luxury 3BHK Apartment" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all placeholder:text-slate-300 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Describe key features..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all placeholder:text-slate-300 font-medium resize-none"></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                            <div className="relative">
                                                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none bg-white appearance-none font-medium">
                                                    <option value="Residential">Residential</option>
                                                    <option value="Commercial">Commercial</option>
                                                    <option value="Land">Land</option>
                                                </select>
                                                <Grid className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
                                            <div className="relative">
                                                <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none bg-white appearance-none font-medium">
                                                    <option value="Flat">Apartment / Flat</option>
                                                    <option value="Villa">Independent House / Villa</option>
                                                    <option value="Plot">Plot / Land</option>
                                                </select>
                                                <Type className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Location */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Address</label><input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Street Address" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none font-medium" /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-2">City</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none font-medium" /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-2">State</label><input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none font-medium" /></div>
                                    <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Pin Code</label><input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none font-medium" /></div>
                                </div>
                                <div className="relative w-full h-48 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center group hover:border-blue-400 transition-colors cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg mb-2 animate-bounce"><MapPin className="w-5 h-5 text-red-500" /></div>
                                        <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg">Pin Location</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Pricing & Area */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                {formData.listingType === 'PG' ? (
                                    // PG Specific Fields
                                    <div className="space-y-6">
                                        {/* Room Type */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-3">Room Type Available</label>
                                            <div className="flex flex-wrap gap-3">
                                                {['Single Room', 'Double Sharing', 'Triple Sharing', '4+ Sharing'].map(type => (
                                                    <button
                                                        key={type}
                                                        onClick={() => {
                                                            const current = formData.roomType;
                                                            if (current.includes(type)) {
                                                                setFormData(prev => ({ ...prev, roomType: current.filter(t => t !== type) }));
                                                            } else {
                                                                setFormData(prev => ({ ...prev, roomType: [...current, type] }));
                                                            }
                                                        }}
                                                        className={`px-4 py-2 text-sm font-bold rounded-full border transition-all
                                                        ${formData.roomType.includes(type)
                                                                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                                                : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400'}`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Gender Preference */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-3">Gender Preference</label>
                                            <div className="flex gap-4">
                                                {['Male', 'Female', 'Anyone'].map(gender => (
                                                    <label key={gender} className="flex items-center gap-2 cursor-pointer group">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.genderPreference === gender ? 'border-blue-600' : 'border-slate-300'}`}>
                                                            {formData.genderPreference === gender && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                                        </div>
                                                        <input type="radio" name="genderPreference" value={gender} checked={formData.genderPreference === gender} onChange={handleInputChange} className="hidden" />
                                                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{gender}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Rent */}
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Rent (starts from)</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input type="text" name="expectedPrice" value={formData.expectedPrice} onChange={handleInputChange} placeholder="15,000" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none font-bold text-lg" />
                                                </div>
                                            </div>

                                            {/* Security Deposit */}
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Security Deposit</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input type="text" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} placeholder="30,000" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none font-medium" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Food Included */}
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Utensils className="w-5 h-5" /></div>
                                                    <span className="font-bold text-slate-900">Food Included?</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={formData.foodIncluded} onChange={(e) => setFormData(prev => ({ ...prev, foodIncluded: e.target.checked }))} className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                            {formData.foodIncluded && (
                                                <div className="flex gap-4 pl-12 animate-in slide-in-from-top-2">
                                                    {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                                                        <label key={meal} className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.foodOptions.includes(meal)}
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked;
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        foodOptions: checked
                                                                            ? [...prev.foodOptions, meal]
                                                                            : prev.foodOptions.filter(m => m !== meal)
                                                                    }));
                                                                }}
                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="text-sm font-medium text-slate-700">{meal}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Notice Period */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Notice Period</label>
                                            <select name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none font-medium">
                                                <option>15 Days</option>
                                                <option>1 Month</option>
                                                <option>2 Months</option>
                                                <option>None</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    // Standard Sell/Rent Fields
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Carpet Area */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Carpet Area</label>
                                            <div className="flex gap-2">
                                                <input type="number" name="carpetArea" value={formData.carpetArea} onChange={handleInputChange} placeholder="1200" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none transition-all font-medium" />
                                                <div className="px-4 py-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm flex items-center">Sq.Ft</div>
                                            </div>
                                        </div>

                                        {/* Super Built Up Area */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Super Built-up Area</label>
                                            <div className="flex gap-2">
                                                <input type="number" name="superArea" value={formData.superArea} onChange={handleInputChange} placeholder="1500" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none transition-all font-medium" />
                                                <div className="px-4 py-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm flex items-center">Sq.Ft</div>
                                            </div>
                                        </div>

                                        {/* Expected Price */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Expected Price</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input type="text" name="expectedPrice" value={formData.expectedPrice} onChange={handleInputChange} placeholder="1.5 Cr" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none font-bold text-lg" />
                                            </div>
                                            {formData.pricePerSqft && <p className="text-xs text-slate-500 mt-1 ml-1">₹ {formData.pricePerSqft} / sq.ft</p>}
                                        </div>

                                        {/* Maintenance */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Maintenance</label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input type="text" name="maintenanceAmount" value={formData.maintenanceAmount} onChange={handleInputChange} placeholder="5000" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none font-medium" />
                                                </div>
                                                <select name="maintenanceFrequency" value={formData.maintenanceFrequency} onChange={handleInputChange} className="px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none font-medium text-sm">
                                                    <option>Monthly</option>
                                                    <option>Quarterly</option>
                                                    <option>Yearly</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Badges for Status */}
                                        <div className="col-span-full">
                                            <label className="block text-sm font-bold text-slate-700 mb-3">Possession Status</label>
                                            <div className="flex gap-3">
                                                {['Ready to Move', 'Under Construction'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => setFormData(prev => ({ ...prev, possessionStatus: status }))}
                                                        className={`px-4 py-2 text-sm font-bold rounded-full border transition-all
                                                        ${formData.possessionStatus === status
                                                                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                                                : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400'
                                                            }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Configuration */}
                                        <div className="col-span-full border-t border-slate-100 pt-6 mt-2">
                                            <h3 className="font-bold text-slate-900 mb-4">Configuration</h3>
                                            <div className="flex gap-4 flex-wrap">
                                                {/* BHK */}
                                                <div className="flex-1 min-w-[120px]">
                                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Bedrooms</label>
                                                    <select name="bhk" value={formData.bhk} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none font-bold">
                                                        {['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'].map(opt => <option key={opt}>{opt}</option>)}
                                                    </select>
                                                </div>
                                                {/* Bathrooms */}
                                                <div className="flex-1 min-w-[120px]">
                                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Bathrooms</label>
                                                    <select name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none font-bold">
                                                        {['1', '2', '3', '4+'].map(opt => <option key={opt}>{opt}</option>)}
                                                    </select>
                                                </div>
                                                {/* Balconies */}
                                                <div className="flex-1 min-w-[120px]">
                                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Balconies</label>
                                                    <select name="balconies" value={formData.balconies} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none font-bold">
                                                        {['0', '1', '2', '3+'].map(opt => <option key={opt}>{opt}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Amenities */}
                        {currentStep === 4 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-4">Amenities</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {AMENITIES_LIST.map((item) => {
                                            const Icon = item.icon;
                                            const isSelected = formData.amenities.includes(item.id);
                                            return (
                                                <div key={item.id} onClick={() => toggleAmenity(item.id)} className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-3 transition-all ${isSelected ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                                                    <Icon className={`w-8 h-8 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                                    <span className="text-xs font-bold text-center">{item.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3">Furnishing</label>
                                        <div className="space-y-3">
                                            {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map(status => (
                                                <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.furnishingStatus === status ? 'border-blue-600' : 'border-slate-300'}`}>{formData.furnishingStatus === status && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}</div>
                                                    <input type="radio" name="furnishingStatus" value={status} checked={formData.furnishingStatus === status} onChange={handleInputChange} className="hidden" />
                                                    <span className="text-sm font-medium">{status}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3">Facing</label>
                                        <div className="relative"><select name="facing" value={formData.facing} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none font-medium appearance-none">{['North', 'South', 'East', 'West'].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select><Grid className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" /></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Media Upload */}
                        {currentStep === 5 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-lg font-bold text-slate-900 mb-2">Property Photos</label>
                                    <p className="text-slate-500 text-sm mb-6">Upload high-quality images to attract more buyers. First image will be the cover photo.</p>

                                    <div className="relative border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition-colors group">
                                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <UploadCloud className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">Drag & Drop Photos Here</h3>
                                        <p className="text-slate-500 text-sm">or click to browse from your device</p>
                                    </div>
                                </div>

                                {/* Image Preview Grid */}
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {formData.images.map((img, index) => (
                                            <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm aspect-square bg-slate-100">
                                                <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                                                <button onClick={() => removeImage(img.id)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                                                    <X className="w-4 h-4" />
                                                </button>
                                                {index === 0 && <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold uppercase rounded backdrop-blur-sm">Cover Image</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 6: Legal Verification & Submission */}
                        {currentStep === 6 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">

                                {/* Document Upload */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Shield className="w-6 h-6 text-green-600" />
                                        <h2 className="text-lg font-bold text-slate-900">Ownership Verification</h2>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                        <p className="text-amber-800 text-sm font-medium flex gap-2">
                                            <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                                            Note: These documents are for internal admin verification only and will NOT be shown publicly.
                                        </p>
                                    </div>

                                    <div className="relative border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors">
                                        <input type="file" multiple accept=".pdf,.jpg,.png" onChange={handleDocUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        <FileText className="w-10 h-10 text-slate-400 mb-3" />
                                        <p className="font-bold text-slate-700">Upload Ownership Proof</p>
                                        <p className="text-xs text-slate-500 mt-1">Index II, Title Deed, or Utility Bill</p>
                                    </div>

                                    {/* Document List */}
                                    {formData.documents.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {formData.documents.map(doc => (
                                                <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">DOC</div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{doc.name}</p>
                                                            <p className="text-xs text-slate-500">{doc.size}</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => removeDoc(doc.id)} className="text-slate-400 hover:text-red-500"><X className="w-5 h-5" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}

                        {/* Step 7: Final Review */}
                        {currentStep === 7 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
                                    <div className="w-full md:w-32 h-32 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                                        {formData.images[0] ? (
                                            <img src={formData.images[0].preview} alt="Cover" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon className="w-8 h-8" /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded">{formData.listingType}</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">{formData.possessionStatus}</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-1">{formData.title}</h2>
                                        <p className="text-slate-500 text-sm mb-2">{formData.city}, {formData.state}</p>
                                        <div className="text-2xl font-bold text-blue-600">₹ {formData.expectedPrice}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Basic Details */}
                                    <div className="border border-slate-200 rounded-xl p-5 relative group">
                                        <button onClick={() => setCurrentStep(1)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Basic Details</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between"><span className="text-slate-500">Category</span><span className="font-medium">{formData.category}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-500">Property Type</span><span className="font-medium">{formData.propertyType}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-500">Listing Type</span><span className="font-medium">{formData.listingType}</span></div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="border border-slate-200 rounded-xl p-5 relative group">
                                        <button onClick={() => setCurrentStep(2)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Location</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between"><span className="text-slate-500">City</span><span className="font-medium">{formData.city}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-500">State</span><span className="font-medium">{formData.state}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-500">Pincode</span><span className="font-medium">{formData.pincode}</span></div>
                                        </div>
                                    </div>

                                    {/* Pricing & Area / PG Details */}
                                    <div className="border border-slate-200 rounded-xl p-5 relative group">
                                        <button onClick={() => setCurrentStep(3)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                                            {formData.listingType === 'PG' ? 'PG Details' : 'Pricing & Area'}
                                        </h3>

                                        {formData.listingType === 'PG' ? (
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between"><span className="text-slate-500">Room Type</span><span className="font-medium text-right">{formData.roomType.join(', ')}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-500">Rent</span><span className="font-medium">₹ {formData.expectedPrice}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-500">Deposit</span><span className="font-medium">₹ {formData.securityDeposit}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-500">Food</span><span className="font-medium">{formData.foodIncluded ? 'Yes (' + formData.foodOptions.join(', ') + ')' : 'No'}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-500">Gender</span><span className="font-medium">{formData.genderPreference}</span></div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between"><span className="text-slate-500">Price</span><span className="font-medium">₹ {formData.expectedPrice}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-500">Super Area</span><span className="font-medium">{formData.superArea} Sq.Ft</span></div>
                                                <div className="flex justify-between"><span className="text-slate-500">Configuration</span><span className="font-medium">{formData.bhk}</span></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Amenities */}
                                    <div className="border border-slate-200 rounded-xl p-5 relative group">
                                        <button onClick={() => setCurrentStep(4)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Amenities</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.amenities.map(amenity => (
                                                <span key={amenity} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded">
                                                    {(formData.listingType === 'PG' ? PG_AMENITIES_LIST : AMENITIES_LIST).find(a => a.id === amenity)?.label || amenity}
                                                </span>
                                            ))}
                                            {formData.amenities.length === 0 && <span className="text-slate-400 text-xs italic">No amenities selected</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Media Preview */}
                                <div className="border border-slate-200 rounded-xl p-5 relative group">
                                    <button onClick={() => setCurrentStep(5)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Media Gallary</h3>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {formData.images.map(img => (
                                            <div key={img.id} className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                                                <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer / Navigation */}
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center sticky bottom-0 z-10">
                        {currentStep === 7 ? (
                            <button
                                onClick={() => setShowSuccessModal(true)} // Example save draft action
                                className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <Save className="w-4 h-4" />
                                Save Draft
                            </button>
                        ) : (
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1 || isSubmitting}
                                className={`flex items-center gap-1 font-bold text-slate-600 hover:text-slate-900 transition-colors
                                ${(currentStep === 1 || isSubmitting) ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                                `}
                            >
                                <ChevronLeft className="w-5 h-5" /> Back
                            </button>
                        )}

                        {currentStep === 7 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                            >
                                {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                                {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                disabled={!isStepValid()}
                                className={`flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all
                                ${!isStepValid() ? 'opacity-50 cursor-not-allowed transform-none' : ''}
                                `}
                            >
                                Next Step
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform animate-in zoom-in-95 duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Submitted Successfully!</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">Your property has been sent for verification. You will be notified once it's live.</p>
                        <div className="space-y-3">
                            <Link href="/dashboard/landlord" className="block w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-transform hover:scale-105">
                                Go to Dashboard
                            </Link>
                            <button onClick={() => window.location.reload()} className="block w-full py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Post Another Property
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
