"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';

const OwnerDetailsStep = ({ formData, handleInputChange, isActive }) => {
    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                        label="Owner Name"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        required
                    />
                    <TextInput
                        label="Owner Phone"
                        name="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={handleInputChange}
                        type="tel"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                        label="Owner Email"
                        name="ownerEmail"
                        value={formData.ownerEmail}
                        onChange={handleInputChange}
                        type="email"
                    />
                    <SelectInput
                        label="Ownership Type"
                        name="ownershipType"
                        value={formData.ownershipType}
                        onChange={handleInputChange}
                        options={['Freehold', 'Leasehold', 'Co-operative Society', 'Power of Attorney']}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectInput
                        label="I am (Role)"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        options={['Owner', 'Agent', 'Builder']}
                    />

                    {formData.role === 'Builder' && (
                        <TextInput
                            label="RERA Number"
                            name="reraNumber"
                            value={formData.reraNumber}
                            onChange={handleInputChange}
                            placeholder="e.g. PRM/KA/RERA/..."
                            required
                        />
                    )}
                </div>

            </div>
        </StepWrapper>
    );
};

export default OwnerDetailsStep;
