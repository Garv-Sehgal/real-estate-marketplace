"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import FileUpload from '@/components/property/inputs/FileUpload';
import { ShieldCheck, MapPin, BadgeCheck, FileCheck, FileText, X } from 'lucide-react';

const VerificationStep = ({ formData, handleFileUpload, removeFile, setFieldValue, isActive }) => {
    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-6">


                {/* 1. IDENTITY VERIFICATION */}
                {/* 1. IDENTITY VERIFICATION */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                        <BadgeCheck className="w-5 h-5 text-purple-600" />
                        Identity Verificationgit add .
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 1.1 Government ID */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Government ID (Aadhaar/PAN) <span className="text-red-500">*</span></label>
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

                        {/* 1.2 Proof of Ownership */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Proof of Ownership <span className="text-red-500">*</span></label>
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
                                <FileUpload
                                    accept=".jpg,.png,.pdf"
                                    onChange={(e) => handleFileUpload(e, 'ownershipProof')}
                                    hint="Upload your Proof of Ownership"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. GEO VERIFICATION */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <div>
                            Geo Verification
                            <span className="text-red-500 ml-1">*</span>
                        </div>
                    </h3>
                    <label
                        className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 
                            ${formData.geoTagConfirmed
                                ? 'bg-blue-50/50 border-blue-600 shadow-sm shadow-blue-100'
                                : 'bg-white border-slate-200 hover:border-blue-300'
                            }`}
                    >
                        <div className="relative flex items-center justify-center pt-0.5">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={formData.geoTagConfirmed || false}
                                onChange={() => setFieldValue('geoTagConfirmed', !formData.geoTagConfirmed)}
                            />
                            <div className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-200 border-2
                                ${formData.geoTagConfirmed
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'bg-white border-slate-300 peer-focus:border-blue-500 peer-hover:border-blue-400'
                                }`}
                            >
                                <ShieldCheck className={`w-4 h-4 text-white transition-opacity duration-200 ${formData.geoTagConfirmed ? 'opacity-100' : 'opacity-0'}`} />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h5 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                Confirm Property Location
                            </h5>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                I certify that the property is located at the address provided in the Location Step.
                                I understand that providing false location data may lead to listing removal.
                            </p>
                        </div>
                    </label>
                </div>

            </div>
        </StepWrapper>
    );
};

export default VerificationStep;
