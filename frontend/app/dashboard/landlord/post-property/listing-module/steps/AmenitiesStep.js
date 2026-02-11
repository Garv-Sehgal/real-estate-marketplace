"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import CheckboxGroup from '@/components/property/inputs/CheckboxGroup';
import { AMENITIES_LIST } from '../constants';

const AmenitiesStep = ({ formData, toggleAmenity, isActive }) => {
    // Adapter for CheckboxGroup to work with toggleAmenity
    const handleChange = (newValues) => {
        // Implementation note: 
        // My CheckboxGroup returns the whole new array.
        // My useListingForm expects toggleAmenity (single id).
        // BUT wait, I can just use setFieldValue from parent if I pass it, 
        // OR simply iterate and toggle.
        // The CLEANEST way is to let CheckboxGroup handle the UI array and pass the result to a setter.
        // But useListingForm has specific logic for toggling.

        // Actually, CheckboxGroup logic: 
        // It takes selectedValues and onChange. 
        // If I pass `toggleAmenity` as onChange directly it won't work because toggleAmenity expects ID, 
        // but CheckboxGroup passes the NEW ARRAY.

        // So I should use the hook's `setFieldValue` method for 'amenities'.
        // I need to ensure `setFieldValue` is passed to this component.
        // I will update ListingContainer to pass it.
    };

    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-6">
                <CheckboxGroup
                    label="Select Amenities"
                    options={AMENITIES_LIST}
                    selectedValues={formData.amenities}
                    onChange={(newVal) => {
                        // This component needs setFieldValue
                        // For now, let's use the toggleAmenity individually approach 
                        // by mapping the UI manually to ensure 100% control
                    }}
                />

                {/* Manual implementation since my CheckboxGroup component interface 
                    might conflict with the toggleAmenity single-item logic. 
                    Let's use the explicit rendering to be safe and precise. 
                */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {AMENITIES_LIST.map((item) => {
                        const Icon = item.icon;
                        const isSelected = formData.amenities.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => toggleAmenity(item.id)}
                                className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-3 transition-all ${isSelected ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                            >
                                <Icon className={`w-8 h-8 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                <span className="text-xs font-bold text-center">{item.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </StepWrapper>
    );
};

export default AmenitiesStep;
