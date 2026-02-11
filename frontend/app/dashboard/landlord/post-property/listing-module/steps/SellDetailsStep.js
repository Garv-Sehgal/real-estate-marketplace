"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';

const SellDetailsStep = ({ formData, handleInputChange, isActive }) => {
    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-8">

                {/* 1. LEGAL & OWNERSHIP */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Legal & Ownership</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectInput
                            label="Property Ownership"
                            name="propertyOwnership"
                            value={formData.propertyOwnership}
                            onChange={handleInputChange}
                            options={['First Owner', 'Second Owner', 'Third+ Owner']}
                        />
                        <SelectInput
                            label="Encumbrance Status"
                            name="encumbranceStatus"
                            value={formData.encumbranceStatus}
                            onChange={handleInputChange}
                            options={['No', 'Yes']}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <SelectInput
                            label="RERA Approved"
                            name="reraApproved"
                            value={formData.reraApproved}
                            onChange={handleInputChange}
                            options={['No', 'Yes']}
                        />
                        <TextInput
                            label="Approval Authority"
                            name="approvalAuthority"
                            value={formData.approvalAuthority}
                            onChange={handleInputChange}
                            placeholder="e.g. BDA, BBMP"
                        />
                    </div>

                    {formData.reraApproved === 'Yes' && (
                        <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                            <TextInput
                                label="RERA Registration Number"
                                name="reraRegistrationNumber"
                                value={formData.reraRegistrationNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <TextInput
                            label="Possession Date"
                            name="possessionDate"
                            value={formData.possessionDate}
                            onChange={handleInputChange}
                            type="date"
                        />
                        <TextInput
                            label="Society Name"
                            name="societyName"
                            value={formData.societyName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-6">
                        <TextInput
                            label="Property ID / Survey Number"
                            name="propertyId"
                            value={formData.propertyId}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* 2. PLOT SPECIFIC (Conditional) */}
                {formData.propertyType === 'Plot' && (
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Plot Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextInput
                                label="Plot Area"
                                name="plotArea"
                                value={formData.plotArea}
                                onChange={handleInputChange}
                                suffix="sq.ft" // or sq.yrd
                                required
                            />
                            <div className="flex gap-4">
                                <TextInput
                                    label="Length"
                                    name="plotLength"
                                    value={formData.plotLength}
                                    onChange={handleInputChange}
                                    placeholder="Ft"
                                />
                                <TextInput
                                    label="Width"
                                    name="plotWidth"
                                    value={formData.plotWidth}
                                    onChange={handleInputChange}
                                    placeholder="Ft"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <SelectInput
                                label="Corner Plot"
                                name="cornerPlot"
                                value={formData.cornerPlot}
                                onChange={handleInputChange}
                                options={['No', 'Yes']}
                            />
                            <SelectInput
                                label="Gated Community"
                                name="gatedCommunity"
                                value={formData.gatedCommunity}
                                onChange={handleInputChange}
                                options={['No', 'Yes']}
                            />
                        </div>
                    </div>
                )}

                {/* 3. FINANCIAL DETAILS */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Financial Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectInput
                            label="Home Loan Available"
                            name="homeLoanAvailable"
                            value={formData.homeLoanAvailable}
                            onChange={handleInputChange}
                            options={['No', 'Yes']}
                        />
                        <TextInput
                            label="Bank Approvals"
                            name="bankApprovedBy"
                            value={formData.bankApprovedBy}
                            onChange={handleInputChange}
                            placeholder="e.g. HDFC, SBI, ICICI"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <TextInput
                            label="Estimated EMI"
                            name="emiEstimate"
                            value={formData.emiEstimate}
                            onChange={handleInputChange}
                            prefix="₹"
                        />
                        <TextInput
                            label="Stamp Duty"
                            name="stampDuty"
                            value={formData.stampDuty}
                            onChange={handleInputChange}
                            suffix="%"
                            type="number"
                        />
                        <TextInput
                            label="Registration Cost"
                            name="registrationCost"
                            value={formData.registrationCost}
                            onChange={handleInputChange}
                            suffix="%"
                            type="number"
                        />
                    </div>
                </div>

            </div>
        </StepWrapper>
    );
};

export default SellDetailsStep;
