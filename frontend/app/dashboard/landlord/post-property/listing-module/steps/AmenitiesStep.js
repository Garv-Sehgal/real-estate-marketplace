"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';

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
                <h3 className="text-lg font-bold text-slate-900">Select Amenities</h3>

                <div className="flex flex-wrap gap-3">
                    {AMENITIES_LIST.map((item) => {
                        const Icon = item.icon;
                        const isSelected = formData.amenities.includes(item.id);
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleAmenity(item.id)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-2
                                    ${isSelected
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105'
                                        : 'bg-white border-slate-300 text-slate-600 hover:border-blue-400 hover:bg-blue-50'
                                    }
                                `}
                            >
                                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                                {item.label}
                                {isSelected && <span className="ml-1 text-blue-100">✓</span>}
                            </button>
                        );
                    })}
                </div>
                <p className="text-xs text-slate-500">
                    Select all the amenities available at the property.
                </p>
            </div>
        </StepWrapper>
    );
};

export default AmenitiesStep;
