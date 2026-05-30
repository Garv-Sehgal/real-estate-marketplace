"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';

const SellDetailsStep = ({ formData, handleInputChange, isActive }) => {
    const isCommercialOffice = formData.category === 'Commercial';

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

    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-6">

                {/* 1. LEGAL & OWNERSHIP */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Legal & Ownership</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectInput
                            label="Property Ownership"
                            name="propertyOwnership"
                            value={formData.propertyOwnership}
                            onChange={handleInputChange}
                            options={['First Owner', 'Second Owner', 'Third Owner', 'Multiple Owners']}
                            required
                        />
                        <TextInput
                            label="Possession Date"
                            name="possessionDate"
                            value={formData.possessionDate}
                            onChange={handleInputChange}
                            type="date"
                            required
                        />
                        {isCommercialOffice && (
                            <>
                                <SelectInput
                                    label="Property Age"
                                    name="propertyAge"
                                    value={formData.propertyAge}
                                    onChange={handleInputChange}
                                    options={['Under Construction', '0-5 Years', '5-10 Years', '10+ Years']}
                                    required
                                />
                                <SelectInput
                                    label="Title Clear"
                                    name="titleClear"
                                    value={formData.titleClear}
                                    onChange={handleInputChange}
                                    options={['Yes', 'No']}
                                    placeholder="Select"
                                    required
                                />
                                <SelectInput
                                    label="Any Active Loan on Property?"
                                    name="activeLoan"
                                    value={formData.activeLoan}
                                    onChange={handleInputChange}
                                    options={['Yes', 'No']}
                                    placeholder="Select"
                                    required
                                />
                                {formData.activeLoan === 'Yes' && (
                                    <TextInput
                                        label="Outstanding Loan Amount"
                                        name="outstandingLoanAmount"
                                        value={formData.outstandingLoanAmount}
                                        onChange={handleCurrencyChange}
                                        placeholder="e.g. 50,00,000"
                                        prefix="₹"
                                        required
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* 2. PRICING DETAILS */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Pricing Details</h3>
                    <div className="space-y-6">
                        <TextInput
                            label="Expected Price"
                            name="expectedPrice"
                            value={formData.expectedPrice}
                            onChange={handleCurrencyChange}
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
                            {isCommercialOffice ? (
                                <>
                                    <SelectInput
                                        label="Price Negotiable"
                                        name="priceNegotiable"
                                        value={formData.priceNegotiable}
                                        onChange={handleInputChange}
                                        options={['Yes', 'No']}
                                        placeholder="Select"
                                        required
                                    />
                                    <TextInput
                                        label="Monthly Maintenance Charges"
                                        name="monthlyMaintenanceCharges"
                                        value={formData.monthlyMaintenanceCharges}
                                        onChange={handleCurrencyChange}
                                        prefix="₹"
                                        placeholder="e.g. 15,000"
                                        required
                                    />
                                    <SelectInput
                                        label="Brokerage Applicable?"
                                        name="brokerageApplicable"
                                        value={formData.brokerageApplicable}
                                        onChange={handleInputChange}
                                        options={['Yes', 'No']}
                                        placeholder="Select"
                                        required
                                    />
                                    {formData.brokerageApplicable === 'Yes' && (
                                        <TextInput
                                            label="Brokerage Percentage or Amount"
                                            name="brokerageAmount"
                                            value={formData.brokerageAmount}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 2%"
                                            required
                                        />
                                    )}
                                </>
                            ) : (
                                <>
                                    <TextInput
                                        label="Maintenance Charges"
                                        name="maintenanceAmount"
                                        value={formData.maintenanceAmount}
                                        onChange={handleCurrencyChange}
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
                                    <TextInput
                                        label="Booking Amount"
                                        name="bookingAmount"
                                        value={formData.bookingAmount}
                                        onChange={handleCurrencyChange}
                                        prefix="₹"
                                        required
                                    />
                                </>
                            )}
                            <TextInput
                                label="Property Tax (Approx. per year)"
                                name="propertyTax"
                                value={formData.propertyTax}
                                onChange={handleCurrencyChange}
                                prefix="₹"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </StepWrapper>
    );
};

export default SellDetailsStep;
