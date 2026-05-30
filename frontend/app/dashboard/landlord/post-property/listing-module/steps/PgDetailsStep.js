"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';
import { Camera, Shield, Zap, Users, House } from 'lucide-react';

const PgDetailsStep = ({ formData, handleInputChange, isActive }) => {
    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-6">

                {/* 1. ROOM DETAILS */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                        <House className="w-5 h-5 text-blue-600" />
                        Room Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectInput
                            label="Sharing Type"
                            name="sharingType"
                            value={formData.sharingType}
                            onChange={handleInputChange}
                            options={[
                                'Single Sharing (1 Person)',
                                'Double Sharing (2 Persons)',
                                'Triple Sharing (3 Persons)',
                                '4 Sharing (4 Persons)',
                                'Dormitory (5+ Persons)'
                            ]}
                        />
                        <SelectInput
                            label="Bed Type"
                            name="bedType"
                            value={formData.bedType}
                            onChange={handleInputChange}
                            options={[
                                'Single Bed',
                                'Bunk Bed',
                                'Floor Mattress'
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <TextInput
                            label="Available Beds"
                            name="availableBeds"
                            value={formData.availableBeds}
                            onChange={handleInputChange}
                            type="number"
                        />
                        <SelectInput
                            label="Attached Bathroom"
                            name="attachedBathroom"
                            value={formData.attachedBathroom}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                    </div>
                </div>


                {/* 2. PRICING MODEL */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Pricing & Inclusions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                            label="Rent Per Bed (Monthly)"
                            name="rentPerBed"
                            value={formData.rentPerBed}
                            onChange={handleInputChange}
                            prefix="₹"
                            required
                        />
                        <TextInput
                            label="Security Deposit"
                            name="securityDepositPG"
                            value={formData.securityDepositPG}
                            onChange={handleInputChange}
                            prefix="₹"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">
                        <SelectInput
                            label="Electricity included"
                            name="electricityIncludedPG"
                            value={formData.electricityIncludedPG}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                        <SelectInput
                            label="Water included"
                            name="waterIncludedPG"
                            value={formData.waterIncludedPG}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <SelectInput
                            label="Food Provided"
                            name="foodIncluded"
                            value={formData.foodIncluded}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                        {formData.foodIncluded === 'Yes' && (
                            <SelectInput
                                label="Food Type"
                                name="foodType"
                                value={formData.foodType}
                                onChange={handleInputChange}
                                options={['Veg Only', 'Veg and Non-Veg both']} // Updated to be more specific
                            />
                        )}
                    </div>
                </div>

                {/* 3. HOUSE RULES */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        House Rules
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextInput
                            label="Gate Closing Time"
                            name="gateClosingTime"
                            value={formData.gateClosingTime}
                            onChange={handleInputChange}
                            placeholder="e.g. 10:00 PM"
                        />
                        <SelectInput
                            label="Visitors Allowed"
                            name="visitorAllowed"
                            value={formData.visitorAllowed}
                            onChange={handleInputChange}
                            options={['Yes', 'No', 'Day Only']}
                        />
                        <SelectInput label="Warden Available" name="wardenAvailable" value={formData.wardenAvailable} onChange={handleInputChange} options={['Yes', 'No']} />
                    </div>
                </div>

                {/* Hidden Safety Override Fix */}
                <SelectInput label="WiFi Included" name="fireSafety" value={formData.fireSafety} onChange={handleInputChange} options={['Yes', 'No']} className="hidden" />
            </div>
        </StepWrapper>
    );
};

export default PgDetailsStep;
