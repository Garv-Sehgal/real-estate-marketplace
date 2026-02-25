"use client";
import { apiRequest } from '../../lib/api';
import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle, AlertOctagon } from 'lucide-react';

export default function SuspendAdminModal({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setIsSuccess(false);
            setError('');
            setIsLoading(false);
        }
    }, [isOpen]);

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
        if (!email.trim()) {
            setError('Email is required');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email is invalid');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);

       const payload = { identifier: email };
        console.log("Suspending Admin payload:", payload);
try {
    const response = await apiRequest('/admin/suspend', {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });

    console.log("Suspend Success:", response);

    setIsLoading(false);
    setIsSuccess(true);

    setTimeout(() => {
        onClose();
    }, 2000);

} catch (error) {
    console.error("Suspend Error:", error.message);

    setIsLoading(false);

    setError(error.message); // show backend error in UI
}
        
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                            <AlertOctagon size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Suspend Admin</h3>
                            <p className="text-sm text-slate-500 mt-0.5">Revoke administrator access</p>
                        </div>
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
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <CheckCircle size={32} className="animate-bounce" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Suspended!</h4>
                            <p className="text-slate-500 text-sm">Admin Account Suspended Successfully</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5 pt-2 mb-4">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Admin Email Address</label>
                                <input
                                    type="email"
                                    className={`w-full px-4 py-3 bg-slate-50 border ${error ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 hover:border-slate-300'} rounded-xl text-sm transition-all duration-200 outline-none shadow-sm focus:bg-white`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {error && <p className="text-xs text-red-500 font-medium mt-1">{error}</p>}
                            </div>

                            {/* Actions */}
                            <div className="pt-2 pb-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 hover:from-red-700 hover:via-rose-700 hover:to-rose-800 text-white font-bold text-sm lg:text-base rounded-xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(225,29,72,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(225,29,72,0.6)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Suspending...
                                        </>
                                    ) : (
                                        'Suspend Admin'
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
