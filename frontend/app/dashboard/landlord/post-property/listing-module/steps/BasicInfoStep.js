"use client";
import React, { useMemo, useEffect } from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';
import TextArea from '@/components/property/inputs/TextArea';
import { PROPERTY_CATEGORIES, PROPERTY_TYPES, getVisibleFields } from '../propertyRules';

const BasicInfoStep = ({ formData, handleInputChange, isActive }) => {

    // 1. Get available property types based on category
    const currentPropertyTypes = useMemo(() => {
        switch (formData.category) {
            case PROPERTY_CATEGORIES.RESIDENTIAL:
                return [PROPERTY_TYPES.FLAT, PROPERTY_TYPES.VILLA, PROPERTY_TYPES.RESIDENTIAL_PLOT];
            case PROPERTY_CATEGORIES.COMMERCIAL:
                return [PROPERTY_TYPES.OFFICE, PROPERTY_TYPES.SHOP, PROPERTY_TYPES.SHOWROOM, PROPERTY_TYPES.COMMERCIAL_PLOT];
            case PROPERTY_CATEGORIES.LAND:
                return [PROPERTY_TYPES.AGRICULTURAL_LAND, PROPERTY_TYPES.VACANT_LAND, PROPERTY_TYPES.PLOT_LAND];
            case PROPERTY_CATEGORIES.INDUSTRIAL:
                return [PROPERTY_TYPES.WAREHOUSE, PROPERTY_TYPES.FACTORY, PROPERTY_TYPES.INDUSTRIAL_PLOT];
            default:
                return [];
        }
    }, [formData.category]);

    // 2. Auto-select default property type when category changes
    useEffect(() => {
        // If the current property type is NOT in the valid list for the selected category,
        // automatically select the first valid option.
        if (currentPropertyTypes.length > 0 && !currentPropertyTypes.includes(formData.propertyType)) {
            handleInputChange({
                target: {
                    name: 'propertyType',
                    value: currentPropertyTypes[0]
                }
            });
        }
    }, [formData.category, currentPropertyTypes, formData.propertyType, handleInputChange]);

    // 3. Get visible fields based on current selection
    const visibleFields = useMemo(() => {
        return getVisibleFields(formData.category, formData.propertyType);
    }, [formData.category, formData.propertyType]);

    const isVisible = (fieldName) => visibleFields.includes(fieldName);

    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-6">

                {/* 1. TEXT INPUTS (Always Visible) */}
                <div className="space-y-6">
                    <TextInput
                        label="Property Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g. Luxury 3BHK Apartment in Indiranagar"
                        required
                    />

                    <TextArea
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe key features, nearby landmarks, etc..."
                    />
                </div>

                {/* 2. CATEGORY & TYPE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <SelectInput
                        label="Property Category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        options={Object.values(PROPERTY_CATEGORIES)}
                    />
                    <SelectInput
                        label="Property Type"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        options={currentPropertyTypes}
                        required
                    />
                </div>

                {/* 3. LISTING TYPE (Always Visible) & BHK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectInput
                        label="Listing Type"
                        name="listingType"
                        value={formData.listingType}
                        onChange={handleInputChange}
                        options={['Sell', 'Rent', 'PG']}
                    />

                    {isVisible('bhk') && (
                        <SelectInput
                            label="BHK Configuration"
                            name="bhk"
                            value={formData.bhk}
                            onChange={handleInputChange}
                            options={['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK']}
                        />
                    )}
                </div>

                {/* 4. AREA DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isVisible('builtUpArea') && (
                        <TextInput
                            label="Built-up Area"
                            name="builtUpArea"
                            value={formData.builtUpArea}
                            onChange={handleInputChange}
                            placeholder="1200"
                            suffix="sq.ft"
                            type="number"
                        />
                    )}
                    {isVisible('carpetArea') && (
                        <TextInput
                            label="Carpet Area"
                            name="carpetArea"
                            value={formData.carpetArea}
                            onChange={handleInputChange}
                            placeholder="1000"
                            suffix="sq.ft"
                            type="number"
                        />
                    )}
                    {isVisible('superArea') && (
                        <TextInput
                            label="Super Built-up Area"
                            name="superArea"
                            value={formData.superArea}
                            onChange={handleInputChange}
                            placeholder="1500"
                            suffix="sq.ft"
                            type="number"
                        />
                    )}
                    {isVisible('plotArea') && (
                        <TextInput
                            label="Plot Area"
                            name="plotArea"
                            value={formData.plotArea}
                            onChange={handleInputChange}
                            placeholder="2400"
                            suffix="sq.ft"
                            type="number"
                        />
                    )}
                </div>

                {/* 5. FLOOR & AGE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isVisible('floorNumber') && (
                        <TextInput
                            label="Floor Number"
                            name="floorNumber"
                            value={formData.floorNumber}
                            onChange={handleInputChange}
                            placeholder="e.g. 4"
                            type="number"
                        />
                    )}
                    {isVisible('totalFloors') && (
                        <TextInput
                            label="Total Floors"
                            name="totalFloors"
                            value={formData.totalFloors}
                            onChange={handleInputChange}
                            placeholder="e.g. 10"
                            type="number"
                        />
                    )}
                    {/* Property Age is not explicitly in the rules list but usually goes with floors/building info. Keeping if needed or removing if strictly adhering to list. 
                        The user list didn't explicitly forbid 'Property Age' but didn't list it in 'Show'. 
                        I will hide it for now to be strict, or check if it fits 'Building Details'.
                        Actually, let's keep it visible for built properties if not explicitly hidden, 
                        BUT user said "Hide all other fields" for some. 
                        To be safe, I will only render what is in the list + common fields.
                        'propertyAge' was NOT in the user's explicit lists. I will comment it out or leave it if it's considered 'basic'.
                        Re-reading: User said "Hide: ...". 
                        I will assume fields NOT in 'Show' are hidden. 'propertyAge' is missing. I'll omit it for strictness.
                    */}
                </div>

                {/* 6. STATUS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isVisible('facing') && (
                        <SelectInput
                            label="Facing Direction"
                            name="facing"
                            value={formData.facing}
                            onChange={handleInputChange}
                            options={['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']}
                        />
                    )}
                    {isVisible('furnishingStatus') && (
                        <SelectInput
                            label="Furnishing Status"
                            name="furnishingStatus"
                            value={formData.furnishingStatus}
                            onChange={handleInputChange}
                            options={['Unfurnished', 'Semi-Furnished', 'Fully Furnished']}
                        />
                    )}
                    {isVisible('availabilityStatus') && (
                        <SelectInput
                            label="Availability Status"
                            name="availabilityStatus"
                            value={formData.availabilityStatus}
                            onChange={handleInputChange}
                            options={['Ready to Move', 'Under Construction']}
                        />
                    )}
                </div>

            </div>
        </StepWrapper>
    );
};

export default BasicInfoStep;
