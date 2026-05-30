"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Globe, Settings, Lock, Activity, Database, Shield, DollarSign,
    TrendingUp, Users, AlertTriangle, Power, UserPlus, FileCheck,
    Building, Zap, Search, MoreVertical, CheckCircle, XCircle, AlertOctagon,
    Flag, FileText, UserMinus
} from 'lucide-react';
import CreateAdminModal from '../../../components/admin-management/CreateAdminModal';
import SuspendAdminModal from '../../../components/admin-management/SuspendAdminModal';

export default function SuperAdminDashboard() {
    const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
    const [isSuspendAdminOpen, setIsSuspendAdminOpen] = useState(false);
    const [revokeModal, setRevokeModal] = useState({ isOpen: false, adminName: '' });

    const handleRevokeClick = (name) => {
        setRevokeModal({ isOpen: true, adminName: name });
    };

    const confirmRevoke = () => {
        // Logic to revoke access would go here
        setRevokeModal({ isOpen: false, adminName: '' });
    };

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">

            {/* Stat Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="₹ 1,42,40,000"
                    change="+12.5%"
                    icon={<DollarSign size={24} className="text-emerald-600" />}
                    bg="bg-emerald-50"
                    trend="up"
                />
                <StatCard
                    title="Live Listings"
                    value="1,240"
                    change="+8.2%"
                    icon={<Building size={24} className="text-blue-600" />}
                    bg="bg-blue-50"
                    trend="up"
                />
                <StatCard
                    title="Admin Team"
                    value="12"
                    change="Active"
                    icon={<Users size={24} className="text-violet-600" />}
                    bg="bg-violet-50"
                    trend="neutral"
                />
                <StatCard
                    title="Verification Queue"
                    value="45"
                    change="Pending Requests"
                    icon={<FileCheck size={24} className="text-amber-600" />}
                    bg="bg-amber-50"
                    trend="alert"
                />
            </section>

            {/* Governance Hub */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Shield size={20} className="text-blue-600" />
                            Governance & Authority
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Manage platform administrators and access controls</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsSuspendAdminOpen(true)}
                            className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 px-5 py-2.5 rounded-lg transition-all font-medium text-sm group"
                        >
                            <UserMinus size={18} className="group-hover:scale-110 transition-transform" />
                            Suspend Admin
                        </button>
                        <button
                            onClick={() => setIsCreateAdminOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/30 transition-all font-medium text-sm group"
                        >
                            <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                            Create New Admin
                        </button>
                    </div>
                </div>

                {/* Enhanced Admin Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4 hidden md:table-cell">Email Address</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            <AdminRow
                                name="Sarah Connor"
                                email="sarah@sprxelite.com"
                                role="SUPER_ADMIN"
                                status="Active"
                                image="SC"
                                isCurrentUser={true}
                            />
                            <AdminRow
                                name="John Wick"
                                email="john@sprxelite.com"
                                role="MODERATOR"
                                status="Active"
                                image="JW"
                                onRevoke={() => handleRevokeClick("John Wick")}
                            />
                            <AdminRow
                                name="Bruce Wayne"
                                email="bruce@sprxelite.com"
                                role="FINANCE"
                                status="Suspended"
                                image="BW"
                                onRevoke={() => handleRevokeClick("Bruce Wayne")}
                            />
                            <AdminRow
                                name="Diana Prince"
                                email="diana@sprxelite.com"
                                role="SUPPORT"
                                status="Active"
                                image="DP"
                                onRevoke={() => handleRevokeClick("Diana Prince")}
                            />
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span>Showing 4 of 12 admins</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors">Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors">Next</button>
                    </div>
                </div>
            </section>

            {/* System Config & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Settings size={18} className="text-slate-400" /> System Configuration
                    </h3>
                    <div className="space-y-4">
                        <ConfigRow label="Global Maintenance Mode" value="Disabled" />
                        <ConfigRow label="New User Registration" value="Open" />
                        <ConfigRow label="Payment Gateway" value="Stripe (Live)" status="success" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-slate-400" /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        <ActivityRow action="New listing approved" user="John Wick" time="2 mins ago" />
                        <ActivityRow action="Suspicious login attempt blocked" user="System" time="15 mins ago" alert />
                        <ActivityRow action="Monthly report generated" user="Automated" time="1 hour ago" />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreateAdminModal
                isOpen={isCreateAdminOpen}
                onClose={() => setIsCreateAdminOpen(false)}
            />

            <SuspendAdminModal
                isOpen={isSuspendAdminOpen}
                onClose={() => setIsSuspendAdminOpen(false)}
            />

            {/* Revoke Confirmation Modal */}
            {
                revokeModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertOctagon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Revoke Access?</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                Are you sure you want to suspend <span className="font-bold text-slate-900">{revokeModal.adminName}</span>? They will lose access immediately.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setRevokeModal({ isOpen: false, adminName: '' })}
                                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRevoke}
                                    className="flex-1 py-2.5 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                                >
                                    Yes, Revoke
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

// --- Sub-Components ---

function MenuLink({ icon, label, active }) {
    return (
        <a href="#" className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            {React.cloneElement(icon, { size: 18, className: active ? 'text-white' : 'text-slate-400 group-hover:text-white' })}
            <span className="hidden lg:block font-medium text-sm">{label}</span>
        </a>
    )
}

function StatCard({ title, value, change, icon, bg, trend }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${bg} transition-colors group-hover:bg-opacity-80`}>
                    {icon}
                </div>
                {trend === 'up' && <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold gap-1"><TrendingUp size={12} /> {change}</span>}
                {trend === 'alert' && <span className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-bold gap-1"><AlertTriangle size={12} /> {change}</span>}
                {trend === 'neutral' && <span className="text-slate-500 bg-slate-50 px-2 py-1 rounded text-xs font-bold">{change}</span>}
            </div>
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{value}</h3>
            </div>
        </div>
    )
}

function AdminRow({ name, email, role, status, image, isCurrentUser, onRevoke }) {
    const isActive = status === 'Active';

    // Role Badge Styles
    const getRoleBadge = (role) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'MODERATOR': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'FINANCE': return 'bg-green-50 text-green-700 border-green-200';
            case 'SUPPORT': return 'bg-purple-50 text-purple-700 border-purple-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <tr className="hover:bg-slate-50/80 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 uppercase">
                        {image}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900">{name}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-slate-500 hidden md:table-cell">{email}</td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getRoleBadge(role)}`}>
                    {role.replace('_', ' ')}
                </span>
            </td>
            <td className="px-6 py-4">
                {/* Status Toggle */}
                <div className="flex items-center cursor-pointer">
                    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                    <span className="ml-2 text-xs font-medium text-slate-600">{status}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                {!isCurrentUser && (
                    <button
                        onClick={onRevoke}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    >
                        Revoke Access
                    </button>
                )}
            </td>
        </tr>
    )
}

function ConfigRow({ label, value, status }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
            <span className="text-slate-600 text-sm font-medium">{label}</span>
            <span className={`text-sm font-bold ${status === 'success' ? 'text-emerald-600' : 'text-slate-800'}`}>{value}</span>
        </div>
    )
}

function ActivityRow({ action, user, time, alert }) {
    return (
        <div className="flex items-start gap-3 py-1">
            <div className={`mt-1 w-2 h-2 rounded-full ${alert ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <div>
                <p className="text-sm text-slate-800 font-medium">{action}</p>
                <p className="text-xs text-slate-500">{user} • {time}</p>
            </div>
        </div>
    )
}
