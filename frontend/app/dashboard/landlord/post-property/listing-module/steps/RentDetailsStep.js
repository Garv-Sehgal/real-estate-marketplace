"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';
import CheckboxGroup from '@/components/property/inputs/CheckboxGroup';

const RentDetailsStep = ({ formData, handleInputChange, setFieldValue, isActive }) => {
    const isCommercial = formData.category === 'Commercial';
    const isResidential = formData.category === 'Residential';

    const handleCurrencyChange = (e) => {
        let { name, value } = e.target;
        const numericValue = value.replace(/\D/g, '');
        if (numericValue) {
            const formattedValue = new Intl.NumberFormat('en-IN').format(numericValue);
            handleInputChange({ target: { name, value: formattedValue } });
        } else {
            handleInputChange({ target: { name, value: '' } });
        }
    };

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
                            onChange={handleCurrencyChange}
                            prefix="₹"
                            placeholder="e.g. 25,000"
                            required
                        />
                        <TextInput
                            label="Security Deposit"
                            name="securityDeposit"
                            value={formData.securityDeposit}
                            onChange={handleCurrencyChange}
                            prefix="₹"
                            placeholder="e.g. 1,00,000"
                            required
                        />
                    </div>

                    {isCommercial ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <TextInput
                                label="Monthly Maintenance Charges"
                                name="monthlyMaintenanceCharges"
                                value={formData.monthlyMaintenanceCharges}
                                onChange={handleCurrencyChange}
                                prefix="₹"
                                placeholder="e.g. 5,000"
                            />
                            <TextInput
                                label="Lock-in Period (Months)"
                                name="lockInPeriod"
                                value={formData.lockInPeriod}
                                onChange={handleInputChange}
                                type="number"
                                placeholder="e.g. 11"
                                required
                            />
                            <SelectInput
                                label="Brokerage Applicable?"
                                name="brokerageApplicable"
                                value={formData.brokerageApplicable}
                                onChange={handleInputChange}
                                options={['Yes', 'No']}
                                placeholder="Select"
                            />
                            {formData.brokerageApplicable === 'Yes' && (
                                <TextInput
                                    label="Brokerage Percentage or Amount"
                                    name="brokerageAmount"
                                    value={formData.brokerageAmount}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 1 Month Rent"
                                    required
                                />
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Residential Rent fields */}
                            {isResidential && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <SelectInput
                                            label="Maintenance Included"
                                            name="maintenanceIncluded"
                                            value={formData.maintenanceIncluded}
                                            onChange={handleInputChange}
                                            options={['Included', 'Separate']}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <SelectInput
                                            label="Electricity Charges"
                                            name="electricityCharges"
                                            value={formData.electricityCharges}
                                            onChange={handleInputChange}
                                            options={['Included', 'Separate']}
                                            required
                                        />
                                        <SelectInput
                                            label="Water Charges"
                                            name="waterCharges"
                                            value={formData.waterCharges}
                                            onChange={handleInputChange}
                                            options={['Included', 'Separate']}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                        </>
                    )}
                </div>

                {/* 2. TENANT PREFERENCES (Only for Residential) */}
                {isResidential && (
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Tenant Preferences</h3>

                        <div className="mb-6">
                            <CheckboxGroup
                                label="Preferred Tenants"
                                options={tenantOptions}
                                selectedValues={formData.preferredTenant || []}
                                onChange={(newVal) => setFieldValue('preferredTenant', newVal)}
                                required
                            />
                        </div>
                    </div>
                )}

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
                        {isCommercial ? (
                            <TextInput
                                label="Notice Period"
                                name="noticePeriod"
                                value={formData.noticePeriod || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 1 Month"
                            />
                        ) : (
                            <>
                                <SelectInput
                                    label="Occupancy Status"
                                    name="occupancyStatus"
                                    value={formData.occupancyStatus}
                                    onChange={handleInputChange}
                                    options={['Vacant', 'Currently Occupied', 'Under Renovation']}
                                    required={isResidential}
                                />
                                <TextInput
                                    label="Visiting Hours"
                                    name="visitingHours"
                                    value={formData.visitingHours}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 10 AM - 6 PM"
                                />
                            </>
                        )}
                    </div>
                </div>

            </div>
        </StepWrapper >
    );
};

export default RentDetailsStep;
