"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';

const PricingStep = ({ formData, handleInputChange, isActive }) => {
    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-6">

                <TextInput
                    label="Expected Price"
                    name="expectedPrice"
                    value={formData.expectedPrice}
                    onChange={handleInputChange}
                    placeholder="e.g. 50,00,000"
                    prefix="₹"
                    required
                />

                {formData.pricePerSqft && (
                    <div className="text-sm text-slate-500 font-medium px-1">
                        Calculated: ₹ {formData.pricePerSqft} / sq.ft
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                        label="Maintenance Charges"
                        name="maintenanceAmount"
                        value={formData.maintenanceAmount}
                        onChange={handleInputChange}
                        prefix="₹"
                        placeholder="e.g. 2000"
                    />
                    <SelectInput
                        label="Frequency"
                        name="maintenanceFrequency"
                        value={formData.maintenanceFrequency}
                        onChange={handleInputChange}
                        options={['Monthly', 'Quarterly', 'Yearly', 'One Time']}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                        label="Booking Amount"
                        name="bookingAmount"
                        value={formData.bookingAmount}
                        onChange={handleInputChange}
                        prefix="₹"
                    />
                    <TextInput
                        label="Token Amount"
                        name="tokenAmount"
                        value={formData.tokenAmount}
                        onChange={handleInputChange}
                        prefix="₹"
                    />
                </div>

                <TextInput
                    label="Property Tax (Approx. per year)"
                    name="propertyTax"
                    value={formData.propertyTax}
                    onChange={handleInputChange}
                    prefix="₹"
                />

            </div>
        </StepWrapper>
    );
};

export default PricingStep;
