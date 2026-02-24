"use client";

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import CountrySelector from '../CountrySelector';
import countryCodes from '../../utils/countryCodes';

export default function CreateAdminModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'admin'
    });
    const [countryCode, setCountryCode] = useState('+91');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({ fullName: '', email: '', phone: '', password: '', role: 'admin' });
            setCountryCode('+91');
            setIsSuccess(false);
            setErrors({});
            setIsLoading(false);
        }
    }, [isOpen]);

    // Handle body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.role) newErrors.role = 'Role selection is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);

        // Construct full phone number with country code
        const cleanCountryCode = countryCode.replace('+', '');
        const fullPhone = `+${cleanCountryCode}${formData.phone}`;

        const payload = {
            fullName: formData.fullName,
            phone: fullPhone,
            email: formData.email,
            password: formData.password,
            role: formData.role
        };
        console.log("Creating Admin payload:", payload);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);

            // Close modal after showing success message
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
            {/* Removed overflow-hidden to allow CountrySelector dropdown to show */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 rounded-t-2xl">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Create Admin</h3>
                        <p className="text-sm text-slate-500 mt-0.5">Create a new administrator account</p>
                    </div>
                    {!isSuccess && (
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in-95">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <CheckCircle size={32} className="animate-bounce" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Success!</h4>
                            <p className="text-slate-500 text-sm">Admin Account Created Successfully</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Full Name</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.fullName ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300'} rounded-xl text-sm transition-all duration-200 outline-none shadow-sm focus:bg-white`}
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                                {errors.fullName && <p className="text-xs text-red-500 font-medium mt-1">{errors.fullName}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Email Address</label>
                                <input
                                    type="email"
                                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.email ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300'} rounded-xl text-sm transition-all duration-200 outline-none shadow-sm focus:bg-white`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email}</p>}
                            </div>

                            {/* Phone - Updated with CountrySelector */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Phone Number</label>
                                <div className={`relative flex items-center bg-slate-50 border ${errors.phone ? 'border-red-500 focus-within:ring-4 focus-within:ring-red-500/10' : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 hover:border-slate-300'} rounded-xl shadow-sm transition-all duration-200 focus-within:bg-white`}>
                                    {/* Country Code Dropdown */}
                                    <div className="relative h-[46px] flex items-center bg-transparent border-r border-slate-200 rounded-l-xl z-20">
                                        <CountrySelector
                                            value={countryCode}
                                            onChange={setCountryCode}
                                            countryCodes={countryCodes}
                                        />
                                    </div>

                                    <input
                                        type="tel"
                                        className="block w-full h-[46px] px-4 border-none text-slate-900 placeholder-slate-400 focus:ring-0 focus:outline-none text-sm bg-transparent rounded-r-xl"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '' || /^[0-9\b]+$/.test(val)) {
                                                setFormData({ ...formData, phone: val });
                                            }
                                        }}
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-red-500 font-medium mt-1">{errors.phone}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`w-full px-4 py-3 bg-slate-50 border ${errors.password ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300'} rounded-xl text-sm transition-all duration-200 outline-none shadow-sm focus:bg-white pr-12`}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 font-medium mt-1">{errors.password}</p>}
                            </div>

                            {/* Role Selection - Auto-selected Admin */}
                            <div className="space-y-1.5 pt-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Role</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value="admin"
                                        disabled
                                        className="w-full px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium outline-none cursor-not-allowed shadow-inner"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 pb-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:via-indigo-700 hover:to-indigo-800 text-white font-bold text-sm lg:text-base rounded-xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Administrator'
                                    )}
                                </button>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
