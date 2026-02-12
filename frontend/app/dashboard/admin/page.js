"use client";

import React from 'react';
import { ShieldCheck, AlertCircle, Users, BarChart3, Search, Settings, Filter, Check, X, Bell, MoreVertical, LayoutDashboard } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">

            {/* Sidebar - Enterprise Style */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden lg:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
                        <LayoutDashboard className="text-blue-500" size={24} />
                        SPRxElite<span className="text-slate-500">Admin</span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <NavItem icon={<BarChart3 size={18} />} label="Overview" active={true} />
                    <NavItem icon={<ShieldCheck size={18} />} label="Moderation" badge="5" />
                    <NavItem icon={<Users size={18} />} label="User Management" />
                    <NavItem icon={<AlertCircle size={18} />} label="System Alerts" badge="1" badgeColor="bg-red-500 text-white" />
                    <div className="pt-6 pb-2 text-xs font-semibold text-slate-600 uppercase tracking-wider pl-3">Settings</div>
                    <NavItem icon={<Settings size={18} />} label="Configuration" />
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-xs font-bold text-white">AD</div>
                        <div>
                            <p className="text-sm font-medium text-white">Admin User</p>
                            <p className="text-xs text-slate-500">admin@elite.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Simple Top Bar */}
                <header className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4 text-slate-400">
                        <Search size={18} />
                        <input type="text" placeholder="Search approvals, users, or logs..." className="bg-transparent border-none text-sm focus:ring-0 w-64 text-slate-700 placeholder:text-slate-400" />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative text-slate-400 hover:text-slate-600">
                            <Bell size={18} />
                            <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                <main className="p-6 md:p-8 space-y-8 overflow-y-auto">

                    {/* 1. Control Tiles */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ControlTile
                            label="Pending Approvals"
                            value="12"
                            trend="+4 today"
                            icon={<ShieldCheck size={20} className="text-blue-600" />}
                            status="normal"
                        />
                        <ControlTile
                            label="Reported Listings"
                            value="3"
                            trend="Requires Action"
                            icon={<AlertCircle size={20} className="text-red-600" />}
                            status="alert"
                        />
                        <ControlTile
                            label="New Users Today"
                            value="128"
                            trend="+12% vs avg"
                            icon={<Users size={20} className="text-emerald-600" />}
                            status="good"
                        />
                        <ControlTile
                            label="Active Agents"
                            value="42"
                            trend="Stable"
                            icon={<BarChart3 size={20} className="text-purple-600" />}
                            status="normal"
                        />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* 2. Moderation Queue (Left 2/3) */}
                        <section className="bg-white border border-slate-200 rounded-lg shadow-sm lg:col-span-2 flex flex-col">
                            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Listing Approvals</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Review and approve new property submissions.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-xs font-medium text-slate-600 flex items-center gap-1 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50">
                                        <Filter size={14} /> Filter
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 w-1/2">Property Details</th>
                                            <th className="px-6 py-3">Submitted By</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <ApprovalRow
                                            title="Luxury Penthouse in Koramangala"
                                            address="12 Main Rd, Bangalore"
                                            price="₹4.5 Cr"
                                            user="John Agent"
                                            role="Agent"
                                            date="2h ago"
                                        />
                                        <ApprovalRow
                                            title="Cozy 2BHK Apartment"
                                            address="Whitefield, Bangalore"
                                            price="₹45,000/mo"
                                            user="Sarah Owner"
                                            role="Landlord"
                                            date="5h ago"
                                        />
                                        <ApprovalRow
                                            title="Commercial Office Space"
                                            address="Indiranagar, Bangalore"
                                            price="₹1.2 L/mo"
                                            user="Tech Parks Inc"
                                            role="Landlord"
                                            date="Yesterday"
                                        />
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-slate-200 bg-slate-50/30 text-center">
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View all pending items</button>
                            </div>
                        </section>

                        {/* Right Column: User Management & Platform Health */}
                        <div className="space-y-8">

                            {/* 3. User Management */}
                            <section className="bg-white border border-slate-200 rounded-lg shadow-sm">
                                <div className="px-5 py-3 border-b border-slate-200">
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Recent Signups</h2>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    <UserRow name="Michael Chen" email="michael@gm..." role="Buyer" />
                                    <UserRow name="Priya Patel" email="priya.p@est..." role="Agent" />
                                    <UserRow name="Robert Fox" email="rob@invest..." role="Landlord" />
                                    <UserRow name="Alice Smith" email="alice@outl..." role="Buyer" />
                                </div>
                                <div className="p-3 text-center border-t border-slate-200">
                                    <button className="text-xs font-semibold text-slate-500 hover:text-slate-800">Manage Users</button>
                                </div>
                            </section>

                            {/* 4. Platform Health */}
                            <section className="bg-white border border-slate-200 rounded-lg shadow-sm">
                                <div className="px-5 py-3 border-b border-slate-200">
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">System Status</h2>
                                </div>
                                <div className="p-5 space-y-4">
                                    <SystemAlert label="Server Load" status="Normal" color="text-emerald-600" />
                                    <SystemAlert label="Database Backup" status="2h ago" color="text-slate-500" />
                                    <SystemAlert label="API Latency" status="45ms" color="text-emerald-600" />
                                    <div className="pt-2 border-t border-slate-100 flex items-start gap-3 mt-2">
                                        <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-slate-600">
                                            <span className="font-semibold text-amber-600">Warning:</span> High volume of image uploads detected. Review storage limits.
                                        </p>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

// Components

function NavItem({ icon, label, active, badge, badgeColor }) {
    return (
        <button className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
            <div className="flex items-center gap-3">
                {icon}
                <span>{label}</span>
            </div>
            {badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeColor || 'bg-slate-700 text-white'}`}>
                    {badge}
                </span>
            )}
        </button>
    )
}

function ControlTile({ label, value, trend, icon, status }) {
    const statusStyles = {
        normal: "border-slate-200",
        alert: "border-red-200 bg-red-50/50",
        good: "border-emerald-200 bg-emerald-50/50"
    }[status];

    return (
        <div className={`bg-white p-5 rounded-lg border shadow-sm ${statusStyles}`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</h3>
                {icon}
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{value}</span>
                <span className="text-xs font-medium text-slate-500">{trend}</span>
            </div>
        </div>
    )
}

function ApprovalRow({ title, address, price, user, role, date }) {
    return (
        <tr className="hover:bg-slate-50 group">
            <td className="px-6 py-4">
                <p className="font-semibold text-slate-900 truncate max-w-[200px]">{title}</p>
                <p className="text-xs text-slate-500">{address}</p>
                <p className="text-xs font-medium text-slate-700 mt-1">{price}</p>
            </td>
            <td className="px-6 py-4">
                <p className="text-sm text-slate-900">{user}</p>
                <span className="inline-block text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-600 font-medium">
                    {role}
                </span>
            </td>
            <td className="px-6 py-4 text-xs text-slate-500">{date}</td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded hover:bg-slate-50">View</button>
                    <button className="flex items-center justify-center w-8 h-8 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                        <Check size={16} />
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 rounded bg-red-100 text-red-700 hover:bg-red-200">
                        <X size={16} />
                    </button>
                </div>
            </td>
        </tr>
    )
}

function UserRow({ name, email, role }) {
    const roleColors = {
        Buyer: "bg-blue-100 text-blue-700",
        Agent: "bg-purple-100 text-purple-700",
        Landlord: "bg-amber-100 text-amber-700"
    }[role];

    return (
        <div className="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    {name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[120px]">{email}</p>
                </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColors}`}>
                {role}
            </span>
        </div>
    )
}

function SystemAlert({ label, status, color }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{label}</span>
            <span className={`font-mono font-medium ${color}`}>{status}</span>
        </div>
    )
}
