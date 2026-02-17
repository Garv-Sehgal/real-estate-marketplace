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
        role: 'Admin'
    });
    const [countryCode, setCountryCode] = useState('+91');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({ fullName: '', email: '', phone: '', password: '', role: 'Admin' });
            setCountryCode('+91');
            setIsSuccess(false);
            setErrors({});
            setIsLoading(false);
        }
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

        console.log("Creating Admin:", { ...formData, phone: fullPhone });

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
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                    <h3 className="text-lg font-bold text-slate-900">Create New Admin</h3>
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
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sarah Connor"
                                    className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'} rounded-lg text-sm transition-all outline-none`}
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                                {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="admin@sprxelite.com"
                                    className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'} rounded-lg text-sm transition-all outline-none`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                            </div>

                            {/* Phone - Updated with CountrySelector */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone Number</label>
                                <div className={`relative flex items-center border ${errors.phone ? 'border-red-500' : 'border-slate-200'} focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-100 bg-white rounded-lg transition-colors duration-200`}>
                                    {/* Country Code Dropdown */}
                                    <div className="relative h-[42px] flex items-center bg-slate-50 border-r border-slate-200 rounded-l-lg z-20">
                                        <CountrySelector
                                            value={countryCode}
                                            onChange={setCountryCode}
                                            countryCodes={countryCodes}
                                        />
                                    </div>

                                    <input
                                        type="tel"
                                        placeholder="98765 43210"
                                        className="block w-full h-[42px] px-4 border-none text-slate-900 placeholder-slate-400 focus:ring-0 focus:outline-none text-sm bg-transparent rounded-r-lg"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '' || /^[0-9\b]+$/.test(val)) {
                                                setFormData({ ...formData, phone: val });
                                            }
                                        }}
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'} rounded-lg text-sm transition-all outline-none pr-10`}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
                            </div>

                            {/* Role Selection - Auto-selected Admin */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Role</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value="Admin"
                                        readOnly
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium outline-none cursor-default"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Admin'
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
