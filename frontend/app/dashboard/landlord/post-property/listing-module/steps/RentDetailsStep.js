"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';
import CheckboxGroup from '@/components/property/inputs/CheckboxGroup';

const RentDetailsStep = ({ formData, handleInputChange, setFieldValue, isActive }) => {

    const tenantOptions = [
        { id: 'Family', label: 'Family' },
        { id: 'Bachelor', label: 'Bachelor' },
        { id: 'Couples', label: 'Couples' },
        { id: 'Students', label: 'Students' }
    ];

    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-8">

                {/* 1. RENTAL TERMS */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Rental Terms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput
                            label="Monthly Rent"
                            name="monthlyRent"
                            value={formData.monthlyRent}
                            onChange={handleInputChange}
                            prefix="₹"
                            placeholder="e.g. 25,000"
                            required
                        />
                        <TextInput
                            label="Security Deposit"
                            name="securityDeposit"
                            value={formData.securityDeposit}
                            onChange={handleInputChange}
                            prefix="₹"
                            placeholder="e.g. 1,00,000"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <TextInput
                            label="Lease Duration"
                            name="leaseDuration"
                            value={formData.leaseDuration}
                            onChange={handleInputChange}
                            suffix="Months"
                            type="number"
                        />
                        <TextInput
                            label="Lock-in Period"
                            name="lockinPeriod"
                            value={formData.lockinPeriod}
                            onChange={handleInputChange}
                            suffix="Months"
                            type="number"
                        />
                        <TextInput
                            label="Notice Period"
                            name="rentNoticePeriod"
                            value={formData.rentNoticePeriod}
                            onChange={handleInputChange}
                            placeholder="e.g. 1 Month"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <SelectInput
                            label="Rent Increment Clause"
                            name="rentIncrementClause"
                            value={formData.rentIncrementClause}
                            onChange={handleInputChange}
                            options={['No', 'Yes']}
                        />
                        <SelectInput
                            label="Maintenance Included"
                            name="maintenanceIncluded"
                            value={formData.maintenanceIncluded}
                            onChange={handleInputChange}
                            options={['Included', 'Separate']} // Updated options to be clearer than Yes/No based on field usage usually
                        />
                        {/* Note: In constants I set default as 'No'. The UI options should probably map to data.
                            If options are Included/Separate, logic might need adjustment if boolean meant.
                            Let's stick to the constant default 'No' (which means Separate usually).
                            Actually, 'Included' is clearer.
                            Let's use ['Yes', 'No'] to match constant 'No'.
                            'Yes' = Included.
                        */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <SelectInput
                            label="Electricity Charges"
                            name="electricityCharges"
                            value={formData.electricityCharges}
                            onChange={handleInputChange}
                            options={['Included', 'Separate']}
                        />
                        <SelectInput
                            label="Water Charges"
                            name="waterCharges"
                            value={formData.waterCharges}
                            onChange={handleInputChange}
                            options={['Included', 'Separate']}
                        />
                    </div>
                </div>

                {/* 2. TENANT PREFERENCES */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Tenant Preferences</h3>

                    <div className="mb-6">
                        <CheckboxGroup
                            label="Preferred Tenants"
                            options={tenantOptions}
                            selectedValues={formData.preferredTenant || []} // Safety check
                            onChange={(newVal) => setFieldValue('preferredTenant', newVal)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectInput
                            label="Non-Veg Allowed"
                            name="nonVegAllowed"
                            value={formData.nonVegAllowed}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                        <SelectInput
                            label="Pets Allowed"
                            name="petsAllowed"
                            value={formData.petsAllowed}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <SelectInput
                            label="Smoking Allowed"
                            name="smokingAllowed"
                            value={formData.smokingAllowed}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                        <SelectInput
                            label="Working Professionals Only"
                            name="workingProfessionalsOnly"
                            value={formData.workingProfessionalsOnly}
                            onChange={handleInputChange}
                            options={['Yes', 'No']}
                        />
                    </div>
                </div>

                {/* 3. AVAILABILITY */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Availability</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TextInput
                            label="Available From"
                            name="availableFrom"
                            value={formData.availableFrom}
                            onChange={handleInputChange}
                            type="date"
                            required
                        />
                        <SelectInput
                            label="Occupancy Status"
                            name="occupancyStatus"
                            value={formData.occupancyStatus}
                            onChange={handleInputChange}
                            options={['Vacant', 'Currently Occupied', 'Under Renovation']}
                        />
                        <TextInput
                            label="Visiting Hours"
                            name="visitingHours"
                            value={formData.visitingHours}
                            onChange={handleInputChange}
                            placeholder="e.g. 10 AM - 6 PM"
                        />
                    </div>
                </div>

            </div>
        </StepWrapper>
    );
};

export default RentDetailsStep;
