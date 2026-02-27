"use client";

import React from 'react';
import { Users, Calendar, TrendingUp, ClipboardList, Phone, Mail, MoreVertical, ArrowRight, MapPin, Clock } from 'lucide-react';

export default function AgentDashboard() {
    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Agent Workspace</h1>
                    <p className="text-sm text-gray-500 mt-1">Good Morning, Alex. You have <span className="font-semibold text-blue-600">3 priority tasks</span> today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm">View Schedule</button>
                    <button className="px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 text-sm shadow-lg shadow-gray-200">Log Activity</button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                {/* Main Content: Pipeline & Properties */}
                <div className="xl:col-span-3 space-y-8">

                    {/* Performance Chart Placeholder */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-purple-600" /> Performance
                                </h2>
                            </div>
                            <select className="text-sm border-none bg-gray-100 rounded-md px-3 py-1 text-gray-600 font-medium focus:ring-0 cursor-pointer">
                                <option>Last 30 Days</option>
                                <option>This Quarter</option>
                            </select>
                        </div>
                        {/* Mock Chart Area */}
                        <div className="h-64 w-full bg-gradient-to-r from-purple-50 via-white to-blue-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                            <svg className="absolute bottom-0 left-0 right-0 h-48 w-full text-purple-100" fill="currentColor" viewBox="0 0 400 100" preserveAspectRatio="none">
                                <path d="M0,80 C50,90 100,20 150,50 C200,80 250,90 300,60 C350,30 400,80 400,100 L400,100 L0,100 Z" opacity="0.5" />
                                <path d="M0,90 C80,100 160,50 240,70 C320,90 400,60 400,100 L400,100 L0,100 Z" />
                            </svg>
                            <div className="relative z-10 text-center">
                                <p className="text-3xl font-bold text-gray-900">42%</p>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Conversion Rate</p>
                            </div>
                            <div className="absolute top-8 right-8 flex gap-4">
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span> Leads
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Closed
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Lead Pipeline */}
                    <section>
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Users size={20} className="text-blue-600" /> Active Leads
                            </h2>
                            <button className="text-sm text-blue-600 font-semibold hover:underline">Manage Pipeline</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <PipelineColumn title="New Inquiries" count={5} statusColor="bg-blue-100 text-blue-800">
                                <LeadCard name="John Doe" interest="2BHK in Indiranagar" budget="₹45k" priority="High" time="2h ago" />
                                <LeadCard name="Alice Smith" interest="Villa Purchase" budget="₹3.5Cr" priority="Medium" time="5h ago" />
                            </PipelineColumn>

                            <PipelineColumn title="In Progress" count={3} statusColor="bg-amber-100 text-amber-800">
                                <LeadCard name="Roberta C." interest="Viewing Scheduled" budget="₹25k" priority="Low" time="1d ago" />
                                <LeadCard name="Tech Corp" interest="Office Space Lease" budget="₹1.2L" priority="High" time="2d ago" />
                            </PipelineColumn>

                            <PipelineColumn title="Negotiation" count={2} statusColor="bg-emerald-100 text-emerald-800">
                                <LeadCard name="Dr. Kumar" interest="Penthouse Finalization" budget="₹5.2Cr" priority="High" time="3d ago" />
                            </PipelineColumn>
                        </div>
                    </section>

                    {/* Assigned Properties */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ClipboardList size={20} className="text-gray-600" /> Assigned Portfolio
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <PropertyCard
                                title="Sunnyvale Heights"
                                type="Apartment"
                                price="$2,400"
                                status="Active"
                                image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=300"
                            />
                            <PropertyCard
                                title="Oakwood Commercial"
                                type="Office"
                                price="$5,000"
                                status="Viewing"
                                image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300"
                            />
                            <PropertyCard
                                title="Lakeside Villa"
                                type="Villa"
                                price="$1.2M"
                                status="Offer Made"
                                image="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=300"
                            />
                        </div>
                    </section>
                </div>

                {/* Sidebar: Interaction History */}
                <aside className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
                        <h3 className="font-bold text-gray-900 mb-5">Recent Interactions</h3>

                        <div className="space-y-6 relative border-l-2 border-gray-100 ml-3 pl-6 pb-2">
                            <TimelineItem
                                icon={<Phone size={14} />}
                                color="bg-blue-100 text-blue-600"
                                title="Call with John Doe"
                                desc="Discussed budget constraints."
                                time="10:30 AM"
                            />
                            <TimelineItem
                                icon={<Mail size={14} />}
                                color="bg-purple-100 text-purple-600"
                                title="Email to Alice"
                                desc="Sent brochure for Villa #42."
                                time="Yesterday"
                            />
                            <TimelineItem
                                icon={<Calendar size={14} />}
                                color="bg-orange-100 text-orange-600"
                                title="Viewing: Tech Corp"
                                desc="Rescheduled to Friday."
                                time="2 days ago"
                            />
                            <TimelineItem
                                icon={<Phone size={14} />}
                                color="bg-gray-100 text-gray-600"
                                title="Follow up: Dr. Kumar"
                                desc="No answer, left voicemail."
                                time="3 days ago"
                            />
                        </div>

                        <div className="mt-auto pt-6 border-t border-gray-100">
                            <button className="w-full py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">View All History</button>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}

// Components
function PipelineColumn({ title, count, statusColor, children }) {
    return (
        <div className="bg-gray-100/50 rounded-xl p-3 h-full">
            <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor}`}>{count}</span>
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
}

function LeadCard({ name, interest, budget, priority, time }) {
    const priorityColors = {
        High: "bg-red-50 text-red-600 border-red-100",
        Medium: "bg-amber-50 text-amber-600 border-amber-100",
        Low: "bg-blue-50 text-blue-600 border-blue-100"
    };

    return (
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${priorityColors[priority]}`}>{priority}</span>
                <span className="text-gray-400 text-xs">{time}</span>
            </div>
            <h4 className="font-bold text-gray-900 text-sm mb-0.5">{name}</h4>
            <p className="text-xs text-gray-500 mb-2 truncate">{interest}</p>
            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <span className="text-xs font-semibold text-gray-700">{budget}</span>
                <button className="text-gray-400 hover:text-black">
                    <MoreVertical size={14} />
                </button>
            </div>
        </div>
    );
}

function PropertyCard({ title, type, price, status, image }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex hover:shadow-md transition-shadow">
            <div className="w-24 h-full bg-gray-200 shrink-0">
                <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{title}</h4>
                </div>
                <p className="text-xs text-gray-500 mb-1">{type}</p>
                <div className="flex justify-between items-center mt-1">
                    <span className="font-semibold text-gray-800 text-xs">{price}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{status}</span>
                </div>
            </div>
        </div>
    )
}

function TimelineItem({ icon, color, title, desc, time }) {
    return (
        <div className="relative">
            <div className={`absolute -left-[37px] w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10 ${color}`}>
                {icon}
            </div>
            <div>
                <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-semibold text-gray-900 text-sm">{title}</span>
                    <span className="text-xs text-gray-400">{time}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
