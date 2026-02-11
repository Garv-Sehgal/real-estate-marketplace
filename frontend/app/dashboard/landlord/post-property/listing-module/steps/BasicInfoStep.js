"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';
import TextArea from '@/components/property/inputs/TextArea';

const BasicInfoStep = ({ formData, handleInputChange, isActive }) => {
    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-6">

                {/* 1. TEXT INPUTS */}
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

                {/* 2. CATEGORY & TYPE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectInput
                        label="Property Category"
                        name="category"
                        value={formData.category} // Residential, Commercial
                        onChange={handleInputChange}
                        options={['Residential', 'Commercial', 'Land', 'Industrial']}
                    />
                    <SelectInput
                        label="Property Type"
                        name="propertyType"
                        value={formData.propertyType} // Flat, Villa, Plot
                        onChange={handleInputChange}
                        options={['Flat', 'Villa', 'Plot', 'Office', 'Shop', 'Warehouse']}
                        required
                    />
                </div>

                {/* 3. LISTING TYPE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectInput
                        label="Listing Type"
                        name="listingType"
                        value={formData.listingType}
                        onChange={handleInputChange}
                        options={['Sell', 'Rent', 'PG']}
                    />
                    <SelectInput
                        label="BHK Configuration"
                        name="bhk"
                        value={formData.bhk}
                        onChange={handleInputChange}
                        options={['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK']}
                    />
                </div>

                {/* 4. AREA DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TextInput
                        label="Built-up Area"
                        name="builtUpArea"
                        value={formData.builtUpArea}
                        onChange={handleInputChange}
                        placeholder="1200"
                        suffix="sq.ft"
                        type="number"
                    />
                    <TextInput
                        label="Carpet Area"
                        name="carpetArea"
                        value={formData.carpetArea}
                        onChange={handleInputChange}
                        placeholder="1000"
                        suffix="sq.ft"
                        type="number"
                    />
                    <TextInput
                        label="Super Built-up Area"
                        name="superArea"
                        value={formData.superArea}
                        onChange={handleInputChange}
                        placeholder="1500"
                        suffix="sq.ft"
                        type="number"
                    />
                </div>

                {/* 5. FLOOR & AGE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TextInput
                        label="Floor Number"
                        name="floorNumber"
                        value={formData.floorNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. 4"
                        type="number"
                    />
                    <TextInput
                        label="Total Floors"
                        name="totalFloors"
                        value={formData.totalFloors}
                        onChange={handleInputChange}
                        placeholder="e.g. 10"
                        type="number"
                    />
                    <SelectInput
                        label="Property Age"
                        name="propertyAge"
                        value={formData.propertyAge}
                        onChange={handleInputChange}
                        options={['New Construction', '0-1 Years', '1-5 Years', '5-10 Years', '10+ Years']}
                    />
                </div>

                {/* 6. STATUS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SelectInput
                        label="Facing Direction"
                        name="facing"
                        value={formData.facing}
                        onChange={handleInputChange}
                        options={['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']}
                    />
                    <SelectInput
                        label="Furnishing Status"
                        name="furnishingStatus"
                        value={formData.furnishingStatus}
                        onChange={handleInputChange}
                        options={['Unfurnished', 'Semi-Furnished', 'Fully Furnished']}
                    />
                    <SelectInput
                        label="Availability Status"
                        name="availabilityStatus"
                        value={formData.availabilityStatus}
                        onChange={handleInputChange}
                        options={['Ready to Move', 'Under Construction']}
                    />
                </div>

            </div>
        </StepWrapper>
    );
};

export default BasicInfoStep;
