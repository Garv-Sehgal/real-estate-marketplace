"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, Users, BarChart3, Search, Settings, Filter, Check, X, Bell, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function AdminDashboard() {

    const [pendingProperties, setPendingProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectModal, setRejectModal] = useState({
    open: false,
    propertyId: null
});

const [rejectMessage, setRejectMessage] = useState("");
const [rejectLoading, setRejectLoading] = useState(false);
    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await apiRequest("/admin/properties/pending");
                console.log("Pending properties:", res);
                setPendingProperties(res.data || []);
            } catch (err) {
                console.error("Failed to fetch pending properties", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPending();
    }, []);

    const handleApprove = async (id) => {
    try {
        await apiRequest(`/admin/properties/${id}/approve`, {
            method: "PATCH"
        });

        setPendingProperties(prev => prev.filter(p => p.id !== id));

    } catch (err) {
        console.error("Approve failed", err);
        alert("Failed to approve property");
    }
};

const handleReject = (id) => {
    setRejectModal({ open: true, propertyId: id });
};
    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 w-full max-w-none">

            {/* 1. Control Tiles */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ControlTile
                    label="Pending Approvals"
                    value={loading ? "..." : pendingProperties.length}
                    trend="+ Live"
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

            <div className="flex flex-col gap-8">

                {/* Moderation Queue */}
                <div className="flex flex-col space-y-6 w-full">
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

                        <div className="w-full flex-1">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Property Details</th>
                                        <th className="px-6 py-4">Submitted By</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-6 text-center text-slate-500">
                                                Loading pending listings...
                                            </td>
                                        </tr>
                                    ) : pendingProperties.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-6 text-center text-slate-500">
                                                No pending properties
                                            </td>
                                        </tr>
                                    ) : (
                                    pendingProperties.map((property) => (
                                        <ApprovalRow
                                            key={property.id}
                                            propertyId={property.id}
                                            title={property.title}
                                            address={property.address || property.city || "N/A"}
                                            price={
                                                property.expectedPrice
                                                    ? `₹${property.expectedPrice}`
                                                    : property.monthlyRent
                                                        ? `₹${property.monthlyRent}/mo`
                                                        : "N/A"
                                            }
                                            user={property.ownerId || "Owner"}
                                            role="Landlord"
                                            date={new Date(property.createdAt).toLocaleDateString()}
                                            onApprove={handleApprove}
                                            onReject={handleReject}
                                        />
                                    ))     
                                )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center mt-auto">
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200 ease-in-out">
                                View all pending items
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        {rejectModal.open && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-semibold text-slate-900">
                Reject Property
            </h2>

            <p className="text-sm text-slate-500">
                Provide a reason for rejection. This will be shown to the owner.
            </p>

            <textarea
                value={rejectMessage}
                onChange={(e) => setRejectMessage(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                rows={4}
            />

            <div className="flex justify-end gap-2 pt-2">
                <button
                    onClick={() => {
                        setRejectModal({ open: false, propertyId: null });
                        setRejectMessage("");
                    }}
                    className="px-4 py-2 text-sm rounded-lg border border-slate-300 hover:bg-slate-100">
                    Cancel
                </button>

                <button
                    onClick={async () => {
                        if (!rejectMessage.trim()) return alert("Message required");

                        try {
                            setRejectLoading(true);

                            await apiRequest(`/admin/properties/${rejectModal.propertyId}/reject`, {
                                method: "PATCH",
                                body: { message: rejectMessage }
                            });

                            setPendingProperties(prev =>
                                prev.filter(p => p.id !== rejectModal.propertyId)
                            );

                            setRejectModal({ open: false, propertyId: null });
                            setRejectMessage("");

                        } catch (err) {
                            console.error(err);
                            alert("Failed to reject property");
                        } finally {
                            setRejectLoading(false);
                        }
                    }}
                    className="px-4 py-2 text-sm rounded-lg bg-rose-500 text-white hover:bg-rose-600">
                    {rejectLoading ? "Rejecting..." : "Confirm Reject"}
                </button>
            </div>
        </div>
    </div>
)}    
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

function ApprovalRow({ title, address, price, user, role, date, propertyId, onApprove, onReject }) {
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
                    <Link href={`/dashboard/admin/properties/${propertyId}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors duration-200 shadow-sm">
                        View
                    </Link>
                    <button
                        onClick={() => onApprove(propertyId)}
                        className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-200 shadow-sm gap-1.5 text-sm font-medium">
                        <Check size={16} /> Approve
                    </button>
                    <button
                        onClick={() => onReject(propertyId)}
                        className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors duration-200 shadow-sm gap-1.5 text-sm font-medium">
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
