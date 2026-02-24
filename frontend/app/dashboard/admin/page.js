"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, Users, BarChart3, Search, Settings, Filter, Check, X, Bell, LayoutDashboard } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex font-sans">

            {/* Sidebar - Enterprise Style */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex-shrink-0 hidden lg:flex flex-col transition-all duration-200 ease-in-out">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-white text-xl font-semibold tracking-tight">
                        <LayoutDashboard className="text-indigo-500" size={24} />
                        SPRxElite<span className="text-slate-500">Admin</span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto w-full">
                    <NavItem icon={<BarChart3 size={18} />} label="Overview" active={true} />
                    <NavItem icon={<ShieldCheck size={18} />} label="Moderation" badge="5" />
                    <NavItem icon={<Users size={18} />} label="User Management" />
                    <NavItem icon={<AlertCircle size={18} />} label="System Alerts" badge="1" badgeColor="bg-rose-500 text-white" />
                    <div className="pt-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-3">Settings</div>
                    <NavItem icon={<Settings size={18} />} label="Configuration" />
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-white shadow-sm">AD</div>
                        <div>
                            <p className="text-sm font-semibold text-white">Admin User</p>
                            <p className="text-xs text-slate-400">admin@elite.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Simple Top Bar */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-10 transition-all duration-200 ease-in-out">
                    <div className="flex items-center gap-3 text-slate-400">
                        <Search size={18} className="text-slate-400" />
                        <input type="text" placeholder="Search approvals, users, or logs..." className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-72 text-slate-700 placeholder:text-slate-400 transition-all duration-200 ease-in-out" />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg transition-all duration-200 ease-in-out">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <main className="p-8 space-y-8 overflow-y-auto">

                    {/* 1. Control Tiles */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ControlTile
                            label="Pending Approvals"
                            value="12"
                            trend="+4 today"
                            trendColor="text-indigo-600"
                            icon={<ShieldCheck size={24} className="text-indigo-600" />}
                            iconBg="bg-indigo-100"
                        />
                        <ControlTile
                            label="Reported Listings"
                            value="3"
                            trend="Requires Action"
                            trendColor="text-rose-600"
                            icon={<AlertCircle size={24} className="text-rose-600" />}
                            iconBg="bg-rose-100"
                        />
                        <ControlTile
                            label="New Users Today"
                            value="128"
                            trend="+12% vs avg"
                            trendColor="text-emerald-600"
                            icon={<Users size={24} className="text-emerald-600" />}
                            iconBg="bg-emerald-100"
                        />
                        <ControlTile
                            label="Active Agents"
                            value="42"
                            trend="Stable"
                            trendColor="text-slate-500"
                            icon={<BarChart3 size={24} className="text-amber-600" />}
                            iconBg="bg-amber-100"
                        />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* 2. Moderation Queue (Left 2/3) */}
                        <div className="lg:col-span-2 flex flex-col space-y-6">
                            <Card className="p-0 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-200 ease-in-out">
                                <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white">
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900 tracking-tight">Listing Approvals</h2>
                                        <p className="text-sm text-slate-500 mt-1">Review and approve new property submissions.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-sm font-medium text-slate-600 flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors duration-200 ease-in-out">
                                            <Filter size={16} /> Filter
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto flex-1">
                                    <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                                        <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4">Property Details</th>
                                                <th className="px-6 py-4">Submitted By</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
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
                                <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center mt-auto">
                                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200 ease-in-out">View all pending items</button>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column: User Management & Platform Health */}
                        <div className="space-y-8 flex flex-col">

                            {/* 3. User Management */}
                            <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow duration-200 ease-in-out">
                                <div className="px-6 py-5 border-b border-slate-200">
                                    <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Signups</h2>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    <UserRow name="Michael Chen" email="michael@gm..." role="Buyer" />
                                    <UserRow name="Priya Patel" email="priya.p@est..." role="Agent" />
                                    <UserRow name="Robert Fox" email="rob@invest..." role="Landlord" />
                                    <UserRow name="Alice Smith" email="alice@outl..." role="Buyer" />
                                </div>
                                <div className="p-4 text-center border-t border-slate-100 bg-slate-50/50">
                                    <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 ease-in-out">Manage Users</button>
                                </div>
                            </Card>

                            {/* 4. Platform Health */}
                            <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow duration-200 ease-in-out">
                                <div className="px-6 py-5 border-b border-slate-200">
                                    <h2 className="text-base font-bold text-slate-900 tracking-tight">System Status</h2>
                                </div>
                                <div className="p-6 space-y-5">
                                    <SystemAlert label="Server Load" status="Normal" color="text-emerald-600" />
                                    <SystemAlert label="Database Backup" status="2h ago" color="text-slate-500" />
                                    <SystemAlert label="API Latency" status="45ms" color="text-emerald-600" />

                                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                                        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                        <p className="text-sm text-slate-700 leading-snug">
                                            <span className="font-semibold text-amber-700 block mb-0.5">Warning</span>
                                            High volume of image uploads detected. Review storage limits.
                                        </p>
                                    </div>
                                </div>
                            </Card>

                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

// Components

function Card({ children, className = "" }) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}>
            {children}
        </div>
    );
}

function NavItem({ icon, label, active, badge, badgeColor }) {
    return (
        <button className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
            <div className="flex items-center gap-3">
                {icon}
                <span>{label}</span>
            </div>
            {badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor || 'bg-slate-700 text-white'}`}>
                    {badge}
                </span>
            )}
        </button>
    )
}

function ControlTile({ label, value, trend, trendColor, icon, iconBg }) {
    return (
        <Card className="p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-in-out group cursor-default">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">{label}</h3>
                <div className={`p-2.5 rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
                <span className={`text-sm font-medium pb-1 ${trendColor}`}>{trend}</span>
            </div>
        </Card>
    )
}

function ApprovalRow({ title, address, price, user, role, date }) {
    return (
        <tr className="hover:bg-slate-50 group transition-colors duration-200 ease-in-out">
            <td className="px-6 py-4">
                <p className="font-semibold text-slate-900 truncate max-w-[250px]">{title}</p>
                <p className="text-sm text-slate-500 mt-0.5">{address}</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{price}</p>
            </td>
            <td className="px-6 py-4">
                <p className="text-sm font-medium text-slate-900">{user}</p>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {role}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-slate-500">{date}</td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                    <Link href="/dashboard/admin/properties/123" className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors duration-200 shadow-sm">
                        View
                    </Link>
                    <button className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-200 shadow-sm gap-1.5 text-sm font-medium">
                        <Check size={16} /> Approve
                    </button>
                    <button className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors duration-200 shadow-sm gap-1.5 text-sm font-medium">
                        <X size={16} /> Reject
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
        <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200 ease-in-out">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 shadow-sm">
                    {name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{email}</p>
                </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${roleColors}`}>
                {role}
            </span>
        </div>
    )
}

function SystemAlert({ label, status, color }) {
    return (
        <div className="flex items-center justify-between text-sm py-1">
            <span className="text-slate-600 font-medium">{label}</span>
            <span className={`font-mono font-semibold ${color}`}>{status}</span>
        </div>
    )
}
