"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import {
    User,
    Settings,
    Shield,
    Camera,
    Loader2,
    Mail,
    Phone,
    Briefcase,
    Eye,
    EyeOff,
    Bookmark,
    MessageSquare,
    Sliders,
    Building,
    BarChart,
    PlusCircle,
    List,
    Wrench,
    Users,
    Server,
    Activity
} from 'lucide-react';

import CountrySelector from '@/components/CountrySelector';
import countryCodes from '@/utils/countryCodes';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [previewImage, setPreviewImage] = useState(null);

    // Edit Profile State
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    const [tempName, setTempName] = useState('');
    const [tempPhone, setTempPhone] = useState('');
    const [tempEmail, setTempEmail] = useState('');

    const [phoneStep, setPhoneStep] = useState('edit'); // 'edit', 'otp', 'verified'
    const [emailStep, setEmailStep] = useState('edit'); // 'edit', 'otp', 'verified'

    const [phoneOTP, setPhoneOTP] = useState('');
    const [emailOTP, setEmailOTP] = useState('');
    const [countryCode, setCountryCode] = useState('+91');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editError, setEditError] = useState(null);

    // Password State
    const [passwords, setPasswords] = useState({ current: '', new: '' });
    const [showPass, setShowPass] = useState({ current: false, new: false });
    const [passError, setPassError] = useState('');

    const fileInputRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // The API endpoint is likely /auth/me based on previous analysis
                const res = await apiRequest('/auth/me');
                if (res.success && res.data) {
                    setUser(res.data);
                } else {
                    throw new Error('Failed to load profile');
                }
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load user data');
                // Could theoretically redirect to login here if 401
                if (err.message.includes('Unauthorized') || err.message.includes('token')) {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
        } else {
            fetchUser();
        }
    }, [router]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setPassError('');
        if (!passwords.current || !passwords.new) {
            setPassError('All fields are required.');
            return;
        }
        if (passwords.new.length < 8) {
            setPassError('New password must be at least 8 characters long.');
            return;
        }

        // Success UI-only
        alert("Password change simulated successfully!");
        setPasswords({ current: '', new: '' });
    };

    // --- Inline Edit Handlers ---

    // Name
    const handleEditNameClick = () => {
        setTempName(user?.fullName || '');
        setIsEditingName(true);
    };
    const handleCancelName = () => setIsEditingName(false);
    const handleSaveName = async () => {
        if (tempName === user?.fullName) return;
        setIsSubmitting(true);
        setEditError(null);
        try {
            const res = await apiRequest('/users/profile/name', {
                method: 'PATCH',
                body: JSON.stringify({ fullName: tempName }),
            });
            if (res.success) {
                setUser(prev => ({ ...prev, fullName: tempName }));
                setIsEditingName(false);
            } else {
                throw new Error(res.message || 'Failed to update name');
            }
        } catch (err) {
            setEditError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Phone Flow
    const handleEditPhoneClick = () => {
        let phoneVal = user?.phone || '';
        let currentCC = '+91'; // default
        if (phoneVal) {
            const matchedRule = countryCodes.find(c => phoneVal.startsWith(c.dialCode));
            if (matchedRule) {
                currentCC = matchedRule.dialCode;
                phoneVal = phoneVal.slice(matchedRule.dialCode.length);
            }
        }
        setCountryCode(currentCC);
        setTempPhone(phoneVal);
        setPhoneStep('edit');
        setIsEditingPhone(true);
    };
    const handleCancelPhone = () => setIsEditingPhone(false);
    const handleSendPhoneOTP = async () => {
        if (!tempPhone) return;
        const fullPhone = `+${countryCode.replace('+', '')}${tempPhone.replace(/\D/g, '')}`;
        if (fullPhone === user?.phone) return;
        setIsSubmitting(true);
        setEditError(null);
        try {
            // Simulated OTP Send for now, replace endpoint later
            const res = await apiRequest('/auth/send-otp', {
                method: 'POST',
                body: JSON.stringify({ phone: fullPhone }),
            });
            if (res.success) {
                setPhoneStep('otp');
            }
        } catch (err) {
            setEditError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleVerifyPhoneOTP = async () => {
        if (!phoneOTP || phoneOTP.length !== 6) {
            setEditError("Please enter a valid 6-digit OTP");
            return;
        }
        setIsSubmitting(true);
        setEditError(null);
        try {
            const fullPhone = `+${countryCode.replace('+', '')}${tempPhone.replace(/\D/g, '')}`;
            // Simulated Verify OTP
            const res = await apiRequest('/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ phone: fullPhone, otp: phoneOTP }),
            });
            if (res.success) {
                // If success, update user profile phone too
                const updateRes = await apiRequest('/users/profile/phone', {
                    method: 'PATCH',
                    body: JSON.stringify({ phone: fullPhone }),
                });

                setUser(prev => ({ ...prev, phone: fullPhone }));
                setPhoneStep('verified');
                setIsEditingPhone(false);
                setPhoneOTP('');
            }
        } catch (err) {
            setEditError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Email Flow
    const handleEditEmailClick = () => {
        setTempEmail(user?.email || '');
        setEmailStep('edit');
        setIsEditingEmail(true);
    };
    const handleCancelEmail = () => setIsEditingEmail(false);
    const handleSendEmailOTP = async () => {
        if (!tempEmail || tempEmail === user?.email) return;
        setIsSubmitting(true);
        setEditError(null);
        try {
            const res = await apiRequest('/auth/send-otp', {
                method: 'POST',
                body: JSON.stringify({ email: tempEmail }),
            });
            if (res.success) {
                setEmailStep('otp');
            }
        } catch (err) {
            setEditError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleVerifyEmailOTP = async () => {
        if (!emailOTP || emailOTP.length !== 6) {
            setEditError("Please enter a valid 6-digit OTP");
            return;
        }
        setIsSubmitting(true);
        setEditError(null);
        try {
            const res = await apiRequest('/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ email: tempEmail, otp: emailOTP }),
            });
            if (res.success) {
                const updateRes = await apiRequest('/users/profile/email', {
                    method: 'PATCH',
                    body: JSON.stringify({ email: tempEmail }),
                });
                setUser(prev => ({ ...prev, email: tempEmail }));
                setEmailStep('verified');
                setIsEditingEmail(false);
                setEmailOTP('');
            }
        } catch (err) {
            setEditError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center text-blue-600">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    const getTabs = () => {
        const baseTabs = [
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'edit', label: 'Edit Profile', icon: Settings },
            { id: 'security', label: 'Change Password', icon: Shield }
        ];

        if (!user?.role) return baseTabs;

        const role = user.role.toLowerCase();

        if (role === 'buyer' || role === 'tenant' || role === 'buyer/tenant') {
            return [
                ...baseTabs,
                { id: 'saved', label: 'Saved Properties', icon: Bookmark },
                { id: 'inquiries', label: 'My Inquiries', icon: MessageSquare },
                { id: 'preferences', label: 'Preferences', icon: Sliders }
            ];
        }
        if (role === 'landlord') {
            return [
                ...baseTabs,
                { id: 'my-properties', label: 'My Properties', icon: Building },
                { id: 'property-stats', label: 'Property Stats', icon: BarChart }
            ];
        }
        if (role === 'agent' || role === 'staff') {
            return [
                ...baseTabs,
                { id: 'listings', label: 'Listings', icon: List }
            ];
        }
        if (role === 'admin') {
            return [
                ...baseTabs,
                { id: 'admin-tools', label: 'Admin Tools', icon: Wrench },
                { id: 'managed-users', label: 'Managed Users', icon: Users }
            ];
        }
        if (role === 'super_admin' || role === 'super admin') {
            return [
                ...baseTabs,
                { id: 'system-controls', label: 'System Controls', icon: Server },
                { id: 'admin-management', label: 'Admin Management', icon: Users },
                { id: 'platform-stats', label: 'Platform Stats', icon: Activity }
            ];
        }

        return baseTabs;
    };

    const tabs = getTabs();

    const formatRole = (role) => {
        if (!role) return '';
        return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your account settings and preferences.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-28">
                            {/* Profile Card Header */}
                            <div className="p-8 text-center border-b border-gray-100">
                                <div className="relative inline-block mb-6 group">
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-blue-50 text-blue-600 flex items-center justify-center overflow-hidden mx-auto">
                                        {previewImage ? (
                                            <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-5xl font-bold">
                                                {user?.fullName?.charAt(0).toUpperCase() || <User className="w-12 h-12" />}
                                            </span>
                                        )}
                                    </div>

                                    {/* Upload Overlay */}
                                    <button
                                        onClick={triggerFileInput}
                                        className="absolute inset-0 bg-black/50 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <Camera className="w-6 h-6 mb-1" />
                                        <span className="text-xs font-bold">Change</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/jpg"
                                    />
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 truncate px-2">
                                    {user?.fullName || 'User'}
                                </h2>

                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                        <Briefcase className="w-3 h-3 mr-1" />
                                        {formatRole(user?.role)}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${user?.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {user?.status ? formatRole(user.status) : 'Unknown'}
                                    </span>
                                </div>

                                {previewImage && (
                                    <button className="mt-6 w-full py-2.5 px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-sm transition-colors border border-blue-100">
                                        Save New Photo
                                    </button>
                                )}
                            </div>

                            {/* Navigation Tabs */}
                            <nav className="p-4 space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-100' : 'text-gray-400'}`} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 min-h-[500px]">

                            {/* Overview Tab Content */}
                            {activeTab === 'overview' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Profile Overview</h3>
                                            <p className="text-sm text-gray-500 font-medium">Your personal information at a glance.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-center col-span-1 h-full">
                                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-sm bg-blue-50 text-blue-600 flex items-center justify-center overflow-hidden mb-4">
                                                {previewImage ? (
                                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-4xl font-bold">
                                                        {user?.fullName?.charAt(0).toUpperCase() || <User className="w-8 h-8" />}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">{user?.fullName || 'User'}</h3>
                                            <div className="mt-3 flex flex-wrap justify-center gap-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                    <Briefcase className="w-3 h-3 mr-1" />
                                                    {formatRole(user?.role)}
                                                </span>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${user?.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    {user?.status ? formatRole(user.status) : 'Unknown'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 col-span-1 flex flex-col justify-center h-full">
                                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</p>
                                                </div>
                                                <p className="text-gray-900 font-semibold">{user?.email || 'Not provided'}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</p>
                                                </div>
                                                <p className="text-gray-900 font-semibold">{user?.phone || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Edit Profile Tab */}
                            {activeTab === 'edit' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                            <Settings className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                                            <p className="text-sm text-gray-500 font-medium">Update your basic profile information inline.</p>
                                        </div>
                                    </div>

                                    {editError && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                                            {editError}
                                        </div>
                                    )}

                                    <div className="space-y-6">

                                        {/* 1) Full Name */}
                                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</p>
                                                </div>

                                                {!isEditingName ? (
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-gray-900 font-semibold text-lg">{user?.fullName || 'Not provided'}</p>
                                                        <button onClick={handleEditNameClick} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                                                        <input
                                                            autoFocus
                                                            type="text"
                                                            value={tempName}
                                                            onChange={(e) => setTempName(e.target.value)}
                                                            className="w-full min-h-[44px] px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                                        />
                                                        <div className="flex w-full sm:w-auto items-center gap-2 shrink-0">
                                                            <button
                                                                onClick={handleCancelName}
                                                                disabled={isSubmitting}
                                                                className="flex-1 sm:flex-none min-h-[44px] px-4 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors disabled:opacity-50"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                            </button>
                                                            <button
                                                                onClick={handleSaveName}
                                                                disabled={tempName === user?.fullName || isSubmitting}
                                                                className="flex-1 sm:flex-none min-h-[44px] px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:bg-indigo-300"
                                                            >
                                                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 2) Phone Number */}
                                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col transition-all">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</p>
                                            </div>

                                            {!isEditingPhone ? (
                                                <div className="flex items-center justify-between">
                                                    <p className="text-gray-900 font-semibold text-lg">{user?.phone || 'Not provided'}</p>
                                                    <button onClick={handleEditPhoneClick} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="mt-2 space-y-4">
                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <div className="relative flex items-center border border-gray-300 bg-white rounded-lg h-[44px] w-full focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                                            <div className="relative h-full flex items-center bg-gray-50 border-r border-gray-200 rounded-l-lg shrink-0">
                                                                <CountrySelector
                                                                    value={countryCode}
                                                                    onChange={setCountryCode}
                                                                    countryCodes={countryCodes}
                                                                />
                                                            </div>
                                                            <input
                                                                autoFocus
                                                                type="tel"
                                                                value={tempPhone}
                                                                onChange={(e) => setTempPhone(e.target.value)}
                                                                disabled={phoneStep === 'otp' || isSubmitting}
                                                                placeholder="9876543210"
                                                                className="block w-full h-full px-3 border-none text-sm font-medium bg-transparent focus:outline-none disabled:opacity-50"
                                                            />
                                                        </div>
                                                        {phoneStep === 'edit' && (
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <button onClick={handleCancelPhone} disabled={isSubmitting} className="min-h-[44px] px-4 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-bold w-full sm:w-auto flex items-center justify-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                                </button>
                                                                <button onClick={handleSendPhoneOTP} disabled={isSubmitting || tempPhone === user?.phone} className="min-h-[44px] px-6 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto disabled:opacity-50 flex items-center justify-center">
                                                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : ''} Send OTP
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {phoneStep === 'otp' && (
                                                        <div className="flex flex-col sm:flex-row gap-3 animate-in slide-in-from-top-2">
                                                            <input
                                                                type="text"
                                                                value={phoneOTP}
                                                                onChange={(e) => setPhoneOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                                placeholder="Enter 6-digit OTP"
                                                                className="w-full min-h-[44px] px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-center tracking-widest text-lg"
                                                            />
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <button onClick={() => setPhoneStep('edit')} disabled={isSubmitting} className="min-h-[44px] px-4 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-bold w-full sm:w-auto">
                                                                    Cancel
                                                                </button>
                                                                <button onClick={handleVerifyPhoneOTP} disabled={isSubmitting || phoneOTP.length !== 6} className="min-h-[44px] px-6 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto disabled:opacity-50 flex items-center justify-center">
                                                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : ''} Verify OTP
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* 3) Email Address */}
                                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col transition-all">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</p>
                                            </div>

                                            {!isEditingEmail ? (
                                                <div className="flex items-center justify-between">
                                                    <p className="text-gray-900 font-semibold text-lg">{user?.email || 'Not provided'}</p>
                                                    <button onClick={handleEditEmailClick} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="mt-2 space-y-4">
                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <input
                                                            autoFocus
                                                            type="email"
                                                            value={tempEmail}
                                                            onChange={(e) => setTempEmail(e.target.value)}
                                                            disabled={emailStep === 'otp' || isSubmitting}
                                                            placeholder="yourname@example.com"
                                                            className="w-full min-h-[44px] px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50 disabled:bg-gray-50"
                                                        />
                                                        {emailStep === 'edit' && (
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <button onClick={handleCancelEmail} disabled={isSubmitting} className="min-h-[44px] px-4 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-bold w-full sm:w-auto flex items-center justify-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                                </button>
                                                                <button onClick={handleSendEmailOTP} disabled={isSubmitting || tempEmail === user?.email} className="min-h-[44px] px-6 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto disabled:opacity-50 flex items-center justify-center">
                                                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : ''} Send OTP
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {emailStep === 'otp' && (
                                                        <div className="flex flex-col sm:flex-row gap-3 animate-in slide-in-from-top-2">
                                                            <input
                                                                type="text"
                                                                value={emailOTP}
                                                                onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                                placeholder="Enter 6-digit OTP"
                                                                className="w-full min-h-[44px] px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-center tracking-widest text-lg"
                                                            />
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <button onClick={() => setEmailStep('edit')} disabled={isSubmitting} className="min-h-[44px] px-4 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-bold w-full sm:w-auto">
                                                                    Cancel
                                                                </button>
                                                                <button onClick={handleVerifyEmailOTP} disabled={isSubmitting || emailOTP.length !== 6} className="min-h-[44px] px-6 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto disabled:opacity-50 flex items-center justify-center">
                                                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : ''} Verify OTP
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* Security Tab Workspace */}
                            {activeTab === 'security' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xl">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                                            <p className="text-sm text-gray-500 font-medium">Update your password securely.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handlePasswordSubmit} className="space-y-5">
                                        {passError && (
                                            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium">
                                                {passError}
                                            </div>
                                        )}

                                        {/* Current Password */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPass.current ? "text" : "password"}
                                                    value={passwords.current}
                                                    onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                                                    className="w-full min-h-[48px] px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                    placeholder="Enter current password"
                                                />
                                                <button type="button" onClick={() => setShowPass(prev => ({ ...prev, current: !prev.current }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                    {showPass.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPass.new ? "text" : "password"}
                                                    value={passwords.new}
                                                    onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                                                    className="w-full min-h-[48px] px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                    placeholder="Min. 8 characters"
                                                />
                                                <button type="button" onClick={() => setShowPass(prev => ({ ...prev, new: !prev.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                    {showPass.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!passwords.current || passwords.new.length < 8}
                                            className="w-full min-h-[48px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Set New Password
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Role-Based Tabs (Placeholders) */}
                            {activeTab === 'saved' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Saved Properties</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center py-12 col-span-full">
                                            <Bookmark className="w-12 h-12 text-gray-300 mb-3" />
                                            <h4 className="text-gray-900 font-bold">No Saved Properties</h4>
                                            <p className="text-sm text-gray-500 mt-1">Properties you save will appear here.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'inquiries' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">My Inquiries</h3>
                                    <div className="overflow-x-auto w-full">
                                        <table className="w-full text-left border-collapse min-w-[500px]">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Property Name</th>
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td colSpan="3" className="py-8 text-center text-gray-500 border-b border-gray-100">No inquiries found.</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'preferences' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Preferences</h3>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-60 pointer-events-none">
                                        <p className="font-semibold text-gray-700">Location: <span className="font-normal text-gray-500">Not set</span></p>
                                        <p className="font-semibold text-gray-700 mt-2">Budget: <span className="font-normal text-gray-500">Not set</span></p>
                                        <p className="font-semibold text-gray-700 mt-2">Type: <span className="font-normal text-gray-500">Not set</span></p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'my-properties' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                        <h3 className="text-xl font-bold text-gray-900">My Properties</h3>
                                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold min-h-[44px]">
                                            <PlusCircle className="w-4 h-4" />
                                            Add Property
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center py-12 col-span-full">
                                            <Building className="w-12 h-12 text-gray-300 mb-3" />
                                            <h4 className="text-gray-900 font-bold">No Properties Listed</h4>
                                            <p className="text-sm text-gray-500 mt-1">You haven't added any properties yet.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'property-stats' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Property Stats</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                                            <p className="text-sm font-bold text-blue-600 mb-1">Total Properties</p>
                                            <p className="text-3xl font-extrabold text-blue-900">0</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                                            <p className="text-sm font-bold text-emerald-600 mb-1">Total Views</p>
                                            <p className="text-3xl font-extrabold text-emerald-900">0</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100">
                                            <p className="text-sm font-bold text-purple-600 mb-1">Total Leads</p>
                                            <p className="text-3xl font-extrabold text-purple-900">0</p>
                                        </div>
                                    </div>
                                </div>
                            )}



                            {activeTab === 'listings' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Listings</h3>
                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center py-12">
                                        <List className="w-12 h-12 text-gray-300 mb-3" />
                                        <h4 className="text-gray-900 font-bold">No Listings</h4>
                                        <p className="text-sm text-gray-500 mt-1">Your listings will appear here.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'admin-tools' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Admin Tools</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                                            <p className="font-bold text-gray-900">Review Properties</p>
                                            <p className="text-sm text-gray-500 mt-1">Approve or reject new listings.</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                                            <p className="font-bold text-gray-900">Manage Reports</p>
                                            <p className="text-sm text-gray-500 mt-1">View flagged content by users.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'managed-users' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Managed Users</h3>
                                    <div className="overflow-x-auto w-full">
                                        <table className="w-full text-left border-collapse min-w-[500px]">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Name</th>
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td colSpan="4" className="py-8 text-center text-gray-500 border-b border-gray-100">No managed users found.</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'system-controls' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">System Controls</h3>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-60">
                                        <p className="font-semibold text-gray-700">Global Settings placeholder</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'admin-management' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                        <h3 className="text-xl font-bold text-gray-900">Admin Management</h3>
                                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold min-h-[44px]">
                                            <PlusCircle className="w-4 h-4" />
                                            Create Admin
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto w-full">
                                        <table className="w-full text-left border-collapse min-w-[500px]">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Name</th>
                                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr><td colSpan="2" className="py-8 text-center text-gray-500 border-b border-gray-100">No admins.</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'platform-stats' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Stats</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                                            <p className="text-sm font-bold text-blue-600 mb-1">Total Users</p>
                                            <p className="text-3xl font-extrabold text-blue-900">0</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                                            <p className="text-sm font-bold text-emerald-600 mb-1">Total Properties</p>
                                            <p className="text-3xl font-extrabold text-emerald-900">0</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100">
                                            <p className="text-sm font-bold text-orange-600 mb-1">Active Listings</p>
                                            <p className="text-3xl font-extrabold text-orange-900">0</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100">
                                            <p className="text-sm font-bold text-purple-600 mb-1">Revenue</p>
                                            <p className="text-3xl font-extrabold text-purple-900">$0</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
