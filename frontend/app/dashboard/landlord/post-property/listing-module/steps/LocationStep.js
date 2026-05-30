"use client";
import React, { useMemo } from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';
import { NEARBY_FACILITIES } from '../constants';
import { Country, State, City } from 'country-state-city';

const LocationStep = ({ formData, handleInputChange, toggleFacility, isActive }) => {

    // 1. Fetch Countries
    const countries = useMemo(() => {
        return Country.getAllCountries().map(country => ({
            label: country.name,
            value: country.isoCode
        }));
    }, []);

    // 2. Fetch States based on selected country
    const states = useMemo(() => {
        if (!formData.country) return [];
        return State.getStatesOfCountry(formData.country).map(state => ({
            label: state.name,
            value: state.isoCode
        }));
    }, [formData.country]);

    // 3. Fetch Cities based on selected state
    const cities = useMemo(() => {
        if (!formData.country || !formData.state) return [];
        return City.getCitiesOfState(formData.country, formData.state).map(city => ({
            label: city.name,
            value: city.name
        }));
    }, [formData.country, formData.state]);

    // Handlers to manage resets
    const handleCountryChange = (e) => {
        const newCountry = e.target.value;
        handleInputChange({
            target: { name: 'country', value: newCountry }
        });
        // Reset State and City whenever country changes
        handleInputChange({ target: { name: 'state', value: '' } });
        handleInputChange({ target: { name: 'city', value: '' } });
    };

    const handleStateChange = (e) => {
        const newState = e.target.value;
        handleInputChange({
            target: { name: 'state', value: newState }
        });
        // Reset City whenever state changes
        handleInputChange({ target: { name: 'city', value: '' } });
    };

    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-6">

                {/* SECTION 1: PROPERTY ADDRESS */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                        Property Address
                    </h3>

                    <div className="space-y-4">
                        {/* Row 1: Country & State */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectInput
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleCountryChange}
                                options={countries}
                                placeholder="Select Country"
                                required
                            />
                            <SelectInput
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleStateChange}
                                options={states}
                                placeholder="Select State"
                                required
                                disabled={!formData.country}
                            />
                        </div>

                        {/* Row 2: City & Pincode */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectInput
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                options={cities}
                                placeholder="Select City"
                                required
                                disabled={!formData.state}
                            />
                            <TextInput
                                label="Pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                type="number"
                                required
                            />
                        </div>

                        {/* Row 3: Locality & Sub-locality */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                label="Locality / Area"
                                name="locality"
                                value={formData.locality}
                                onChange={handleInputChange}
                                placeholder="e.g. Indiranagar"
                            />
                            <TextInput
                                label="Sub-locality / Street"
                                name="subLocality"
                                value={formData.subLocality}
                                onChange={handleInputChange}
                                placeholder="e.g. 1st Main Road"
                            />
                        </div>

                        {/* Row 4: Landmark */}
                        <TextInput
                            label="Landmark"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleInputChange}
                            placeholder="e.g. Near Metro Station"
                        />

                        {/* Row 5: Full Address */}
                        <div>
                            <TextInput
                                label="Full Address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                placeholder="#123, Sunshine Apartments..."
                            />
                            <p className="text-xs text-slate-500 mt-1.5 ml-1">
                                Enter complete building / society / house number for better reach.
                            </p>
                        </div>
                    </div>
                </div>


                {/* SECTION 3: NEARBY FACILITIES (Chips) */}
                <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Nearby Facilities</h3>
                    <div className="flex flex-wrap gap-3">
                        {NEARBY_FACILITIES.map(facility => {
                            const isSelected = formData.nearbyFacilities?.includes(facility);
                            return (
                                <button
                                    key={facility}
                                    type="button"
                                    onClick={() => toggleFacility(facility)}
                                    className={`
                                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                                        ${isSelected
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105'
                                            : 'bg-white border-slate-300 text-slate-600 hover:border-blue-400 hover:bg-blue-50'
                                        }
                                    `}
                                >
                                    {isSelected && <span className="mr-1.5">✓</span>}
                                    {facility}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                        Select all facilities that are within 2km of the property.
                    </p>
                </div>

            </div>
        </StepWrapper>
    );
};

export default LocationStep;
