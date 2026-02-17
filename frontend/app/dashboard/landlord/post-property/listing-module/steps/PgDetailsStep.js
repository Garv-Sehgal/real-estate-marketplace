"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';
import { Camera, Shield, Zap, Users, House } from 'lucide-react';

const PgDetailsStep = ({ formData, handleInputChange, isActive }) => {
    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-8">

                {/* 1. ROOM DETAILS */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">
                        <House className="w-5 h-5 text-blue-600" />
                        Room Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectInput
                            label="Sharing Type"
                            name="sharingType"
                            value={formData.sharingType}
                            onChange={handleInputChange}
                            options={['Single', 'Double', 'Triple', 'Quad', 'Dormitory']}
                        />
                        <SelectInput
                            label="Bed Type"
                            name="bedType"
                            value={formData.bedType}
                            onChange={handleInputChange}
                            options={['Single Bed', 'Bunk Bed', 'Double Bed']}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <TextInput
                            label="Total Rooms"
                            name="totalRooms"
                            value={formData.totalRooms}
                            onChange={handleInputChange}
                            type="number"
                        />
                        <TextInput
                            label="Total Beds"
                            name="totalBeds"
                            value={formData.totalBeds}
                            onChange={handleInputChange}
                            type="number"
                        />
                        <TextInput
                            label="Available Beds"
                            name="availableBeds"
                            value={formData.availableBeds}
                            onChange={handleInputChange}
                            type="number"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SelectInput
                        label="Attached Bathroom"
                        name="attachedBathroom"
                        value={formData.attachedBathroom}
                        onChange={handleInputChange}
                        options={['Yes', 'No']}
                    />
                    <SelectInput
                        label="AC Room"
                        name="acRoom"
                        value={formData.acRoom}
                        onChange={handleInputChange}
                        options={['Yes', 'No']}
                    />
                    <SelectInput
                        label="Balcony"
                        name="balcony"
                        value={formData.balcony}
                        onChange={handleInputChange}
                        options={['Yes', 'No']}
                    />
                </div>

                {/* 2. PRICING MODEL */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Pricing & Inclusions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <SelectInput
                            label="Electricity"
                            name="electricityIncludedPG"
                            value={formData.electricityIncludedPG}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                        <SelectInput
                            label="Water"
                            name="waterIncludedPG"
                            value={formData.waterIncludedPG}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                        <SelectInput
                            label="Laundry"
                            name="laundryIncluded"
                            value={formData.laundryIncluded}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                        <SelectInput
                            label="Housekeeping"
                            name="housekeepingIncluded"
                            value={formData.housekeepingIncluded}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
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
                                options={['Veg Only', 'Non-Veg Allowed', 'Both']} // Updated to be more specific
                            />
                        )}
                    </div>
                </div>

                {/* 3. HOUSE RULES */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        House Rules
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TextInput
                            label="Curfew Time"
                            name="curfewTime"
                            value={formData.curfewTime}
                            onChange={handleInputChange}
                            placeholder="e.g. 10:00 PM"
                        />
                        <TextInput
                            label="Gate Closing Time"
                            name="gateClosingTime"
                            value={formData.gateClosingTime}
                            onChange={handleInputChange}
                            placeholder="e.g. 11:00 PM"
                        />
                        <SelectInput
                            label="Visitors Allowed"
                            name="visitorAllowed"
                            value={formData.visitorAllowed}
                            onChange={handleInputChange}
                            options={['Yes', 'No', 'Day Only']}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <SelectInput
                            label="ID Verification Required"
                            name="idVerificationRequired"
                            value={formData.idVerificationRequired}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                        <SelectInput
                            label="Allowed Gender"
                            name="genderAllowed"
                            value={formData.genderAllowed}
                            onChange={handleInputChange}
                            options={['Male', 'Female', 'Co-Living']}
                        />
                    </div>
                </div>

                {/* 4. SAFETY FEATURES */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Safety Features
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <SelectInput label="CCTV Camera" name="cctvPG" value={formData.cctvPG} onChange={handleInputChange} options={['Yes', 'No']} />
                        <SelectInput label="Biometric Entry" name="biometricEntry" value={formData.biometricEntry} onChange={handleInputChange} options={['Yes', 'No']} />
                        <SelectInput label="Warden Available" name="wardenAvailable" value={formData.wardenAvailable} onChange={handleInputChange} options={['Yes', 'No']} />
                        <SelectInput label="Fire Safety" name="fireSafety" value={formData.fireSafety} onChange={handleInputChange} options={['Yes', 'No']} />
                        <SelectInput label="Power Backup" name="powerBackupPG" value={formData.powerBackupPG} onChange={handleInputChange} options={['Yes', 'No']} />
                    </div>
                    <div className="mt-6">
                        <TextInput
                            label="Emergency Contact Number"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleInputChange}
                            placeholder="+91 XXXXX XXXXX"
                        />
                    </div>
                </div>

            </div>
        </StepWrapper>
    );
};

export default PgDetailsStep;
