"use client";
import React, { useMemo } from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';
import { Country } from 'country-state-city';
import CountrySelector from '@/components/CountrySelector';

const OwnerDetailsStep = ({ formData, handleInputChange, isActive }) => {

    const countryCodes = useMemo(() => {
        const allCountries = Country.getAllCountries();
        return allCountries.map(country => ({
            name: country.name,
            iso2: country.isoCode,
            dialCode: `+${country.phonecode}`,
            code: country.isoCode // Unique key
        }));
    }, []);
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

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">
                            Owner Phone <span className="text-red-500">*</span>
                        </label>

                        <div className="relative flex items-center border border-slate-200 focus-within:border-blue-600 bg-white rounded-xl h-[46px] transition-colors duration-200 w-full">
                            {/* Country Code Dropdown */}
                            <div className="relative h-full flex items-center bg-slate-50 border-r border-slate-200 rounded-l-xl">
                                <CountrySelector
                                    value={formData.ownerCountryCode || '+91'}
                                    onChange={(val) => handleInputChange({ target: { name: 'ownerCountryCode', value: val } })}
                                    countryCodes={countryCodes}
                                />
                            </div>

                            {/* Phone Number Input */}
                            <input
                                type="tel"
                                name="ownerPhone"
                                value={formData.ownerPhone}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Allow strictly visual typing; validation happens on submit/blur if needed
                                    // Or reuse regex from Register page if strictness desired: /^[0-9\b]+$/
                                    if (val === '' || /^[0-9\b]+$/.test(val)) {
                                        handleInputChange(e);
                                    }
                                }}
                                required
                                placeholder="98765 43210"
                                className="block w-full h-full px-4 border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none bg-transparent font-medium"
                            />
                        </div>
                    </div>
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
                        options={['Owner', 'Agent']}
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
