"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Eye, MessageSquare, PlusCircle, LayoutDashboard, Settings, LogOut, CheckCircle, XCircle, Clock, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

export default function LandlordDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Top Navigation Bar Placeholder (Assuming main layout handles this, but adding a localized header) */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Landlord Dashboard</h1>
                    <p className="text-slate-500 text-sm">Manage your listings and viewing requests.</p>
                </div>
                <Link
                    href="/dashboard/landlord/post-property"
                    className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm"
                >
                    <PlusCircle size={18} />
                    List New Property
                </Link>
            </header>

            <main className="p-8 max-w-7xl mx-auto space-y-8">

                {/* Stats Overview */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Listings"
                        value="12"
                        trend="+2 this month"
                        icon={<Home size={24} className="text-blue-600" />}
                        color="bg-blue-50 border-blue-100"
                    />
                    <StatCard
                        title="Active Leads"
                        value="48"
                        trend="12 new today"
                        icon={<MessageSquare size={24} className="text-emerald-600" />}
                        color="bg-emerald-50 border-emerald-100"
                    />
                    <StatCard
                        title="Total Views"
                        value="1.2k"
                        trend="+18% vs last month"
                        icon={<Eye size={24} className="text-indigo-600" />}
                        color="bg-indigo-50 border-indigo-100"
                    />
                    <StatCard
                        title="Pending Approvals"
                        value="3"
                        trend="Needs attention"
                        icon={<Clock size={24} className="text-amber-600" />}
                        color="bg-amber-50 border-amber-100"
                    />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Property Management Table */}
                    <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800">Your Properties</h2>
                            <button className="text-sm text-blue-700 font-medium hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-900 uppercase font-semibold text-xs transition-colors">
                                    <tr>
                                        <th className="px-6 py-3">Property</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3">Date Added</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <PropertyRow
                                        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200"
                                        title="Modern Apartment in Downtown"
                                        location="New York, NY"
                                        status="Live"
                                        price="$3,500/mo"
                                        date="Oct 24, 2024"
                                    />
                                    <PropertyRow
                                        image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200"
                                        title="Luxury Villa with Pool"
                                        location="Los Angeles, CA"
                                        status="Pending"
                                        price="$12,000/mo"
                                        date="Nov 02, 2024"
                                    />
                                    <PropertyRow
                                        image="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=200"
                                        title="Cozy Studio Loft"
                                        location="Brooklyn, NY"
                                        status="Rejected"
                                        price="$2,100/mo"
                                        date="Nov 05, 2024"
                                    />
                                    <PropertyRow
                                        image="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=200"
                                        title="Suburban Family Home"
                                        location="Austin, TX"
                                        status="Live"
                                        price="$850,000"
                                        date="Sep 15, 2024"
                                    />
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Booking Requests */}
                    <section className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800">Booking Requests</h2>
                            <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-bold">5 New</span>
                        </div>
                        <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[500px]">
                            <BookingRequestCard
                                name="Sarah Jenkins"
                                property="Modern Apartment"
                                time="Tomorrow, 10:00 AM"
                                avatar="SJ"
                                bg="bg-purple-100 text-purple-600"
                            />
                            <BookingRequestCard
                                name="Michael Chen"
                                property="Luxury Villa"
                                time="Nov 12, 2:00 PM"
                                avatar="MC"
                                bg="bg-orange-100 text-orange-600"
                            />
                            <BookingRequestCard
                                name="Priya Patel"
                                property="Cozy Studio"
                                time="Nov 14, 11:30 AM"
                                avatar="PP"
                                bg="bg-pink-100 text-pink-600"
                            />
                        </div>
                        <div className="p-4 border-t border-slate-100 text-center">
                            <button className="text-sm font-semibold text-blue-700 hover:text-blue-800">View All Bookings</button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, trend, icon, color }) {
    return (
        <div className={`p-6 rounded-xl border bg-white shadow-sm flex items-start justify-between transition-transform hover:-translate-y-1 duration-200`}>
            <div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
                <p className="text-xs font-semibold text-slate-500">{trend}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
        </div>
    );
}

function PropertyRow({ image, title, location, status, price, date }) {
    const statusStyles = {
        Live: "bg-emerald-100 text-emerald-700 border-emerald-200",
        Pending: "bg-amber-100 text-amber-700 border-amber-200",
        Rejected: "bg-red-100 text-red-700 border-red-200",
    };

    return (
        <tr className="hover:bg-slate-50 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <img src={image} alt={title} className="w-12 h-12 rounded-lg object-cover bg-slate-200" />
                    <div>
                        <p className="font-semibold text-slate-900 text-sm">{title}</p>
                        <p className="text-xs text-slate-500">{location}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusStyles[status] || "bg-slate-100 text-slate-600"}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 font-medium text-slate-800">{price}</td>
            <td className="px-6 py-4 text-slate-500 text-xs">{date}</td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function BookingRequestCard({ name, property, time, avatar, bg }) {
    return (
        <div className="p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all bg-slate-50/50 hover:bg-white cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${bg}`}>
                    {avatar}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500">Wants to visit</p>
                </div>
            </div>
            <div className="text-xs text-slate-600 mb-2">
                <span className="font-medium">Property:</span> {property}
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                    <Clock size={12} /> {time}
                </div>
                <div className="flex gap-1">
                    <button className="p-1.5 rounded bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors">
                        <XCircle size={16} />
                    </button>
                    <button className="p-1.5 rounded bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors">
                        <CheckCircle size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
