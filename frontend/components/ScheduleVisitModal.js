"use client";

import React, { useState } from 'react';
import { X, Calendar, Clock, MessageSquare, CheckCircle, Loader } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function ScheduleVisitModal({ propertyId, propertyTitle, existingMeeting, onClose }) {
    const [preferredDate, setPreferredDate] = useState(existingMeeting?.preferredDate || '');
    const [preferredTime, setPreferredTime] = useState(existingMeeting?.preferredTime || '');
    const [message, setMessage] = useState(existingMeeting?.message || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!preferredDate) {
            setError('Please select a preferred date.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            if (existingMeeting && existingMeeting.metadata?.meetingId) {
                await apiRequest(`/meetings/${existingMeeting.metadata.meetingId}/reschedule`, {
                    method: 'POST',
                    body: { preferredDate, preferredTime, message }
                });
            } else {
                await apiRequest('/meetings', {
                    method: 'POST',
                    body: { propertyId, preferredDate, preferredTime, message }
                });
            }
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{existingMeeting ? 'Reschedule Visit' : 'Schedule a Visit'}</h2>
                        <p className="text-sm text-slate-500 mt-0.5 truncate max-w-[260px]">{propertyTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {success ? (
                    <div className="p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="text-emerald-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Request Sent!</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            The property owner will review your request and respond shortly.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Preferred Date */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                <span className="flex items-center gap-1.5"><Calendar size={15} /> Preferred Date *</span>
                            </label>
                            <input
                                type="date"
                                value={preferredDate}
                                min={today}
                                onChange={(e) => setPreferredDate(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50"
                                required
                            />
                        </div>

                        {/* Preferred Time */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                <span className="flex items-center gap-1.5"><Clock size={15} /> Preferred Time (optional)</span>
                            </label>
                            <select
                                value={preferredTime}
                                onChange={(e) => setPreferredTime(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50"
                            >
                                <option value="">Select a time slot</option>
                                <option value="9:00 AM">9:00 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="12:00 PM">12:00 PM</option>
                                <option value="1:00 PM">1:00 PM</option>
                                <option value="2:00 PM">2:00 PM</option>
                                <option value="3:00 PM">3:00 PM</option>
                                <option value="4:00 PM">4:00 PM</option>
                                <option value="5:00 PM">5:00 PM</option>
                                <option value="6:00 PM">6:00 PM</option>
                            </select>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                <span className="flex items-center gap-1.5"><MessageSquare size={15} /> Message (optional)</span>
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tell the owner anything about your visit..."
                                rows={3}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 resize-none placeholder:text-slate-400"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Footer note */}
                        <p className="text-xs text-slate-400">
                            You must be logged in to request a visit. The owner will confirm or reject your request.
                        </p>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? <><Loader size={16} className="animate-spin" /> Sending...</> : (existingMeeting ? 'Send New Request' : 'Request Visit')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
