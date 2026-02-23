"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import FileUpload from '@/components/property/inputs/FileUpload';
import { ShieldCheck, MapPin, BadgeCheck, FileCheck, FileText, X } from 'lucide-react';

const VerificationStep = ({ formData, handleFileUpload, removeFile, setFieldValue, isActive }) => {
    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-8">

                <div className="bg-blue-50/50 rounded-xl p-4 flex items-start gap-4 border border-blue-100">
                    <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
                    <div>
                        <h4 className="font-bold text-blue-900 border-b border-blue-200 pb-1 mb-2">Trust & Safety First</h4>
                        <p className="text-sm text-blue-700 leading-relaxed">
                            Verified listings get <strong>3x more enquiries</strong>. Please provide valid documents and proof of ownership.
                            Your documents are encrypted and shared only with verified tenants/buyers upon request.
                        </p>
                    </div>
                </div>

                {/* 1. IDENTITY VERIFICATION */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">
                        <BadgeCheck className="w-5 h-5 text-purple-600" />
                        Identity Verification
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Government ID (Aadhaar/PAN)</label>
                            {formData.govtId ? (
                                <div className="flex items-center justify-between p-3 border rounded-xl bg-green-50 border-green-200">
                                    <span className="text-sm font-bold text-green-700 truncate">{formData.govtId.name}</span>
                                    <button onClick={() => removeFile('govtId')} className="text-red-500 text-xs font-bold hover:underline">Change</button>
                                </div>
                            ) : (
                                <FileUpload
                                    accept=".jpg,.png,.pdf"
                                    onChange={(e) => handleFileUpload(e, 'govtId')}
                                    hint="Upload Aadhaar, PAN, or Passport"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Selfie Verification</label>
                            {formData.selfie ? (
                                <div className="flex items-center justify-between p-3 border rounded-xl bg-green-50 border-green-200">
                                    <div className="flex items-center gap-2">
                                        <img src={formData.selfie.preview} alt="Selfie" className="w-8 h-8 rounded-full object-cover border" />
                                        <span className="text-sm font-bold text-green-700 truncate">Uploaded</span>
                                    </div>
                                    <button onClick={() => removeFile('selfie')} className="text-red-500 text-xs font-bold hover:underline">Change</button>
                                </div>
                            ) : (
                                <FileUpload
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, 'selfie')}
                                    hint="Take a clear selfie to verify identity"
                                    icon={BadgeCheck}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. PROPERTY PROOF */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-indigo-600" />
                        Property Proof
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Proof of Ownership</label>
                            {formData.ownershipProof ? (
                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 truncate">{formData.ownershipProof.name}</span>
                                    </div>
                                    <button onClick={() => removeFile('ownershipProof')} className="text-red-500 hover:text-red-700">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.png"
                                        onChange={(e) => handleFileUpload(e, 'ownershipProof')}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex items-center gap-3 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 group-hover:border-indigo-500 group-hover:bg-indigo-50/10 group-hover:text-indigo-600 transition-all">
                                        <FileCheck className="w-5 h-5" />
                                        <span className="text-sm font-medium">Upload Deed / Bill</span>
                                    </div>
                                </div>
                            )}
                            <p className="text-xs text-slate-400 mt-2 ml-1">Sale Deed, Mutation Certificate, or Tax Receipt</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Latest Utility Bill</label>
                            {formData.utilityBill ? (
                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 truncate">{formData.utilityBill.name}</span>
                                    </div>
                                    <button onClick={() => removeFile('utilityBill')} className="text-red-500 hover:text-red-700">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.png"
                                        onChange={(e) => handleFileUpload(e, 'utilityBill')}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex items-center gap-3 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 group-hover:border-indigo-500 group-hover:bg-indigo-50/10 group-hover:text-indigo-600 transition-all">
                                        <FileText className="w-5 h-5" />
                                        <span className="text-sm font-medium">Upload Bill</span>
                                    </div>
                                </div>
                            )}
                            <p className="text-xs text-slate-400 mt-2 ml-1">Electricity, Water, or Gas Bill (Max 3 months old)</p>
                        </div>
                    </div>
                </div>

                {/* 3. GEO VERIFICATION */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-600" />
                        Geo Verification
                    </h3>
                    <div className="p-4 border rounded-xl bg-white hover:border-blue-500 transition-colors cursor-pointer group" onClick={() => setFieldValue('geoTagConfirmed', !formData.geoTagConfirmed)}>
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.geoTagConfirmed ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                {formData.geoTagConfirmed && <ShieldCheck className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Confirm Property Location</h5>
                                <p className="text-sm text-slate-500 mt-1">
                                    I certify that the property is located at the address and coordinates provided in the Location Step.
                                    I understand that providing false location data may lead to listing removal.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </StepWrapper>
    );
};

export default VerificationStep;
