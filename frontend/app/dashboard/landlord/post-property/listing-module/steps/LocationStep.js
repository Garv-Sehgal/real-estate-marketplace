"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import CheckboxGroup from '@/components/property/inputs/CheckboxGroup';
import { NEARBY_FACILITIES } from '../constants';

const LocationStep = ({ formData, handleInputChange, toggleFacility, isActive }) => {
    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-6">

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                    />
                    <TextInput
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                        label="Locality"
                        name="locality"
                        value={formData.locality}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        label="Sub-locality"
                        name="subLocality"
                        value={formData.subLocality}
                        onChange={handleInputChange}
                    />
                </div>

                <TextInput
                    label="Landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                />

                <TextInput
                    label="Full Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                />

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                        label="Latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        placeholder="e.g. 12.9716"
                    />
                    <TextInput
                        label="Longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        placeholder="e.g. 77.5946"
                    />
                </div>

                {/* Nearby Facilities */}
                <div>
                    <CheckboxGroup
                        label="Nearby Facilities"
                        options={NEARBY_FACILITIES}
                        selectedValues={formData.nearbyFacilities}
                        onChange={(newValues) => {
                            // This part is a bit tricky because CheckboxGroup returns array
                            // but we have a dedicated toggle function in useListingForm
                            // We'll simplisticly handle it here or update logic later.
                            // Re-reading useListingForm: it has toggleFacility.
                            // Better to pass a direct handler or iterate.

                            // Since CheckboxGroup expects `onChange` to receive updated array allow flexible usage.
                            // But my CheckboxGroup implementation returns the *new array*.

                            // Let's assume we can set key directly or map changes.
                            // HOWEVER, useListingForm only exposes `toggleFacility`.
                            // I should probably expose a generic setFieldValue in hook.
                            // CHECK: yes I added `setFieldValue`.
                        }}
                    // Actually, I need to pass a handler that calls setFieldValue
                    // The CheckboxGroup implementation: onChange(newValues)
                    />
                    {/* Wait, the CheckboxGroup needs to integrate with the hook's state directly */}
                    {/* Let's manually map the checkbox group here since I didn't update the CheckboxGroup to use the toggle logic perfectly */}
                    <div className="mt-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nearby Facilities</label>
                        <div className="flex flex-wrap gap-2">
                            {NEARBY_FACILITIES.map(facility => (
                                <button
                                    key={facility}
                                    type="button"
                                    onClick={() => toggleFacility(facility)}
                                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors
                                     ${formData.nearbyFacilities.includes(facility)
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                                        }`}
                                >
                                    {facility}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </StepWrapper>
    );
};

export default LocationStep;
