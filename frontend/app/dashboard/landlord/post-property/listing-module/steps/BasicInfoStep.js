"use client";
import React, { useMemo, useEffect, useState, useRef } from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import SelectInput from '@/components/property/inputs/SelectInput';
import TextArea from '@/components/property/inputs/TextArea';
import MultiSelectInput from '@/components/property/inputs/MultiSelectInput';
import { PROPERTY_CATEGORIES, PROPERTY_TYPES, getVisibleFields } from '../propertyRules';
import { AMENITIES_LIST, COMMERCIAL_AMENITIES } from '../constants';
import { X, Image as ImageIcon, Video, Check, UploadCloud } from 'lucide-react';

const BasicInfoStep = ({ formData, handleInputChange, isActive }) => {
    const isCommercialOffice = formData.category === 'Commercial' && formData.propertyType === 'Office';
    const isCommercialShop = formData.category === 'Commercial' && formData.propertyType === 'Shop';
    const isCommercialShowroom = formData.category === 'Commercial' && formData.propertyType === 'Showroom';

    // 1. Get available property types based on category
    const currentPropertyTypes = useMemo(() => {
        let types = [];
        switch (formData.category) {
            case PROPERTY_CATEGORIES.RESIDENTIAL:
                if (formData.listingType === 'Sell') {
                    types = [PROPERTY_TYPES.FLAT, PROPERTY_TYPES.HOUSE, PROPERTY_TYPES.VILLA];
                } else {
                    types = [PROPERTY_TYPES.FLAT, PROPERTY_TYPES.HOUSE, PROPERTY_TYPES.VILLA];
                }
                break;
            case PROPERTY_CATEGORIES.COMMERCIAL:
                types = [PROPERTY_TYPES.OFFICE, PROPERTY_TYPES.SHOP, PROPERTY_TYPES.SHOWROOM];
                break;
            default:
                types = [];
        }

        return types;
    }, [formData.category, formData.listingType]);

    // 2. Auto-select default property type when category changes
    useEffect(() => {
        if (currentPropertyTypes.length > 0 && !currentPropertyTypes.includes(formData.propertyType)) {
            handleInputChange({
                target: {
                    name: 'propertyType',
                    value: currentPropertyTypes[0]
                }
            });
        }
    }, [formData.category, currentPropertyTypes, formData.propertyType, handleInputChange]);

    // Cleanup Object URLs on unmount
    useEffect(() => {
        return () => {
            if (formData.basicInfoMedia) {
                formData.basicInfoMedia.forEach(media => {
                    if (media.url && media.url.startsWith('blob:')) {
                        URL.revokeObjectURL(media.url);
                    }
                });
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 3. Get visible fields based on current selection
    const visibleFields = useMemo(() => {
        return getVisibleFields(formData.category, formData.propertyType);
    }, [formData.category, formData.propertyType]);

    const isVisible = (fieldName) => visibleFields.includes(fieldName);

    // Media Upload State & Handlers
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const updateMediaState = (newMedia, newCoverImage) => {
        handleInputChange({ target: { name: 'basicInfoMedia', value: newMedia } });
        if (newCoverImage !== undefined) {
            handleInputChange({ target: { name: 'coverImage', value: newCoverImage } });
        }
    };

    const processFiles = (files) => {
        const validFiles = Array.from(files).filter(file => {
            return file.type.startsWith('image/') || file.type.startsWith('video/');
        });

        if (validFiles.length === 0) return;

        const newMediaItems = validFiles.map(file => {
            const isImage = file.type.startsWith('image/');
            return {
                id: Math.random().toString(36).substring(7) + Date.now(),
                url: URL.createObjectURL(file), // Internal preview url
                fileType: isImage ? 'image' : 'video',
                file: file, // Store the actual file object for upload later
                isCover: false
            };
        });

        const currentMedia = formData.basicInfoMedia || [];
        let updatedMedia = [...currentMedia, ...newMediaItems];
        let currentCover = formData.coverImage;

        // Ensure there is a cover image if one is an image and none is selected
        if (!currentCover) {
            const firstImage = updatedMedia.find(m => m.fileType === 'image');
            if (firstImage) {
                updatedMedia.forEach(m => m.isCover = (m.id === firstImage.id));
                currentCover = firstImage.id;
            }
        }

        updateMediaState(updatedMedia, currentCover);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
            // reset input
            e.target.value = null;
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const removeMedia = (idToRemove) => {
        const currentMedia = formData.basicInfoMedia || [];
        const updatedMedia = currentMedia.filter(m => m.id !== idToRemove);
        let currentCover = formData.coverImage;

        if (currentCover === idToRemove) {
            // Find another image to be cover
            const nextImage = updatedMedia.find(m => m.fileType === 'image');
            if (nextImage) {
                updatedMedia.forEach(m => m.isCover = (m.id === nextImage.id));
                currentCover = nextImage.id;
            } else {
                currentCover = '';
            }
        }

        updateMediaState(updatedMedia, currentCover);
    };

    const setAsCover = (idToSet) => {
        const currentMedia = formData.basicInfoMedia || [];
        const updatedMedia = currentMedia.map(m => ({
            ...m,
            isCover: m.id === idToSet
        }));
        updateMediaState(updatedMedia, idToSet);
    };

    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-3">

                {/* 1. TEXT INPUTS (Always Visible) */}
                <div className="space-y-3">
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
                        required={isCommercialOffice || isCommercialShop || isCommercialShowroom}
                    />
                </div>



                {/* 3. LISTING TYPE (Always Visible) & BHK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.listingType === 'PG' ? (
                        <SelectInput
                            label="Available For"
                            name="genderAllowed"
                            value={formData.genderAllowed}
                            onChange={handleInputChange}
                            options={['Boys', 'Girls', 'For All']}
                            required
                        />
                    ) : (
                        <SelectInput
                            label="Property Category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            options={Object.values(PROPERTY_CATEGORIES)}
                            required
                        />
                    )}
                    <SelectInput
                        label="Listing Type"
                        name="listingType"
                        value={formData.listingType}
                        onChange={handleInputChange}
                        options={formData.category === 'Commercial' ? ['Sell', 'Rent'] : ['Sell', 'Rent', 'PG']}
                        required
                    />
                </div>

                {/* 2. CATEGORY & TYPE */}
                {formData.listingType !== 'PG' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <SelectInput
                            label="Property Type"
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleInputChange}
                            options={currentPropertyTypes}
                            required
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
                        {!isVisible('bhk') && isVisible('carpetArea') && (
                            <TextInput
                                label="Carpet Area"
                                name="carpetArea"
                                value={formData.carpetArea}
                                onChange={handleInputChange}
                                placeholder="1000"
                                suffix="sq.ft"
                                type="number"
                                required={isCommercialOffice || isCommercialShop || isCommercialShowroom}
                            />
                        )}
                    </div>
                )}
                {/* 4. AREA DETAILS */}
                {formData.listingType !== 'PG' && (isVisible('bhk') || isVisible('superArea')) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {isVisible('bhk') && isVisible('carpetArea') && (
                            <TextInput
                                label="Carpet Area"
                                name="carpetArea"
                                value={formData.carpetArea}
                                onChange={handleInputChange}
                                placeholder="1000"
                                suffix="sq.ft"
                                type="number"
                                required={isCommercialOffice || isCommercialShop || isCommercialShowroom}
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
                    </div>
                )}

                {/* 5 & 6. FLOOR, AMENITIES, STATUS */}
                {formData.listingType === 'PG' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {isVisible('amenities') && (
                            <MultiSelectInput
                                label="Amenities"
                                value={formData.amenities || []}
                                onChange={(newVal) => handleInputChange({ target: { name: 'amenities', value: newVal } })}
                                options={formData.category === 'Commercial' ? AMENITIES_LIST.filter(a => COMMERCIAL_AMENITIES.includes(a.id)) : AMENITIES_LIST}
                                placeholder="Select amenities"
                            />
                        )}
                        {isVisible('furnishingStatus') && (
                            <SelectInput
                                label="Furnishing Status"
                                name="furnishingStatus"
                                value={formData.furnishingStatus}
                                onChange={handleInputChange}
                                options={
                                    formData.category === 'Commercial' && formData.propertyType === 'Office'
                                        ? ['Bare Shell', 'Warm Shell', 'Fully Furnished']
                                        : ['Unfurnished', 'Semi-Furnished', 'Fully Furnished']
                                }
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
                ) : (
                    <>
                        {/* 5. FLOOR & AMENITIES */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {isVisible('floorNumber') && (
                                <TextInput
                                    label="Floor Number"
                                    name="floorNumber"
                                    value={formData.floorNumber}
                                    onChange={handleInputChange}
                                    placeholder={formData.locatedIn === 'Standalone' ? '0 (Ground)' : 'e.g. 4'}
                                    type="number"
                                    required={
                                        (isCommercialShowroom && formData.locatedIn !== 'Standalone') ||
                                        (!isCommercialShowroom && !isCommercialShop) // Original behavior for others
                                    }
                                // if Standalone, disabled or just default 0. We'll leave it editable but hint 0.
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
                                    required={isCommercialShowroom && formData.locatedIn !== 'Standalone'}
                                />
                            )}
                            {isVisible('amenities') && (
                                <MultiSelectInput
                                    label="Amenities"
                                    value={formData.amenities || []}
                                    onChange={(newVal) => handleInputChange({ target: { name: 'amenities', value: newVal } })}
                                    options={formData.category === 'Commercial' ? AMENITIES_LIST.filter(a => COMMERCIAL_AMENITIES.includes(a.id)) : AMENITIES_LIST}
                                    placeholder="Select amenities"
                                />
                            )}
                        </div>

                        {/* 6. STATUS */}
                        <div className={`grid grid-cols-1 md:grid-cols-${formData.category === 'Commercial' ? '2' : '3'} gap-3`}>
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
                                    options={
                                        (isCommercialOffice || isCommercialShop || isCommercialShowroom)
                                            ? ['Bare Shell', 'Warm Shell', 'Fully Furnished']
                                            : ['Unfurnished', 'Semi-Furnished', 'Fully Furnished']
                                    }
                                    required={isCommercialOffice || isCommercialShop || isCommercialShowroom}
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

                        {/* OFFICE CONFIGURATION */}
                        {isCommercialOffice && (
                            <div className="mt-6 border border-slate-200 rounded-xl p-5 bg-slate-50">
                                <h3 className="text-[16px] font-semibold text-slate-800 mb-4">Office Configuration</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TextInput label="Number of Cabins" name="cabins" value={formData.cabins} onChange={handleInputChange} type="number" placeholder="e.g. 2" />
                                    <TextInput label="Workstations Count" name="workstations" value={formData.workstations} onChange={handleInputChange} type="number" placeholder="e.g. 10" />
                                    <SelectInput label="Conference Room" name="conferenceRoom" value={formData.conferenceRoom ? 'Yes' : 'No'} onChange={(e) => handleInputChange({ target: { name: 'conferenceRoom', value: e.target.value === 'Yes' } })} options={['Yes', 'No']} />
                                    <SelectInput label="Pantry" name="pantry" value={formData.pantry ? 'Yes' : 'No'} onChange={(e) => handleInputChange({ target: { name: 'pantry', value: e.target.value === 'Yes' } })} options={['Yes', 'No']} />
                                    <TextInput label="Washrooms Count" name="washroomsCount" value={formData.washroomsCount} onChange={handleInputChange} type="number" placeholder="e.g. 2" />
                                    <TextInput label="Car Parking Count" name="parkingCount" value={formData.parkingCount} onChange={handleInputChange} type="number" placeholder="e.g. 1" />
                                    <SelectInput label="Power Backup" name="powerBackup" value={formData.powerBackup} onChange={handleInputChange} options={['Full', 'Partial', 'No']} required />
                                </div>
                            </div>
                        )}

                        {/* SHOP CONFIGURATION */}
                        {isCommercialShop && (
                            <div className="mt-6 border border-slate-200 rounded-xl p-5 bg-slate-50">
                                <h3 className="text-[16px] font-semibold text-slate-800 mb-4">Shop Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectInput
                                        label="Located In"
                                        name="locatedIn"
                                        value={formData.locatedIn}
                                        onChange={handleInputChange}
                                        options={['Mall', 'Market', 'Standalone', 'Commercial Complex']}
                                        required
                                    />
                                    <div>
                                        <TextInput
                                            label="Entrance Width (in feet)"
                                            name="entranceWidth"
                                            value={formData.entranceWidth}
                                            onChange={handleInputChange}
                                            type="number"
                                            placeholder="e.g. 15"
                                            required
                                        />
                                        <div className="text-xs text-slate-500 px-1 mt-1">Front width of shop entrance in feet.</div>
                                    </div>
                                    <SelectInput
                                        label="Road Facing"
                                        name="roadFacing"
                                        value={formData.roadFacing}
                                        onChange={handleInputChange}
                                        options={['Yes', 'No']}
                                    />
                                    <TextInput
                                        label="Washrooms Count"
                                        name="washroomsCount"
                                        value={formData.washroomsCount}
                                        onChange={handleInputChange}
                                        type="number"
                                        placeholder="e.g. 1"
                                        required
                                    />
                                    <SelectInput
                                        label="Parking Availability"
                                        name="parkingAvailability"
                                        value={formData.parkingAvailability}
                                        onChange={handleInputChange}
                                        options={['Yes', 'No']}
                                        required
                                    />
                                    {formData.parkingAvailability === 'Yes' && (
                                        <TextInput
                                            label="Parking Spaces Count"
                                            name="parkingCount"
                                            value={formData.parkingCount}
                                            onChange={handleInputChange}
                                            type="number"
                                            placeholder="e.g. 2"
                                            required
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SHOWROOM CONFIGURATION */}
                        {isCommercialShowroom && (
                            <div className="mt-6 border border-slate-200 rounded-xl p-5 bg-slate-50">
                                <h3 className="text-[16px] font-semibold text-slate-800 mb-4">Showroom Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectInput
                                        label="Property Age"
                                        name="propertyAge"
                                        value={formData.propertyAge}
                                        onChange={handleInputChange}
                                        options={['Under Construction', '0-5 Years', '5-10 Years', '10+ Years']}
                                        required
                                    />
                                    <SelectInput
                                        label="Located In"
                                        name="locatedIn"
                                        value={formData.locatedIn}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            // Handle cross-cutting Floor Logic reset naturally here via useEffect if complex, but simple overwrite here
                                            if (e.target.value === 'Standalone') {
                                                handleInputChange({ target: { name: 'floorNumber', value: '0' } });
                                            }
                                        }}
                                        options={['Mall', 'Commercial Building', 'Standalone']}
                                        placeholder="Select Location"
                                        required
                                    />
                                    <TextInput
                                        label="Entrance Width (in feet)"
                                        name="entranceWidth"
                                        value={formData.entranceWidth}
                                        onChange={handleInputChange}
                                        type="number"
                                        placeholder="e.g. 20"
                                        required
                                    />
                                    <div>
                                        <TextInput
                                            label="Ceiling Height (in feet)"
                                            name="ceilingHeight"
                                            value={formData.ceilingHeight}
                                            onChange={handleInputChange}
                                            type="number"
                                            placeholder="e.g. 12"
                                            required
                                        />
                                        <div className="text-xs text-slate-500 px-1 mt-1">Minimum 8 ft.</div>
                                    </div>
                                    <SelectInput
                                        label="Road Facing"
                                        name="roadFacing"
                                        value={formData.roadFacing}
                                        onChange={handleInputChange}
                                        options={['Yes', 'No']}
                                        placeholder="Select"
                                    />
                                    <TextInput
                                        label="Washrooms Count"
                                        name="washroomsCount"
                                        value={formData.washroomsCount}
                                        onChange={handleInputChange}
                                        type="number"
                                        placeholder="e.g. 2"
                                        required
                                    />
                                    <SelectInput
                                        label="Parking Availability"
                                        name="parkingAvailability"
                                        value={formData.parkingAvailability}
                                        onChange={handleInputChange}
                                        options={['Yes', 'No']}
                                        placeholder="Select"
                                        required
                                    />
                                    {formData.parkingAvailability === 'Yes' && (
                                        <TextInput
                                            label="Parking Spaces Count"
                                            name="parkingCount"
                                            value={formData.parkingCount}
                                            onChange={handleInputChange}
                                            type="number"
                                            placeholder="e.g. 5"
                                            required
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* 7. ADD MEDIA SECTION */}
                <div className="mt-6 pt-5 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                                Property Media
                                <span className="text-red-500 ml-1">*</span>
                            </h3>
                            <p className="text-sm text-slate-500">Add photos/videos for a quick preview card.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Dropzone */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
                                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}
                            `}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                multiple
                                accept="image/*,video/*"
                                required

                            />
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <div className={`p-3 rounded-full ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-400 shadow-sm'}`}>
                                    <UploadCloud size={24} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-slate-700">
                                        <span className="text-blue-600">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-slate-500">Images (JPG, PNG, WebP) and Videos (MP4, MOV)</p>
                                </div>
                            </div>
                        </div>

                        {/* Preview Grid */}
                        {formData.basicInfoMedia && formData.basicInfoMedia.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                {formData.basicInfoMedia.map((media) => (
                                    <div
                                        key={media.id}
                                        className={`
                                                relative group aspect-square rounded-xl overflow-hidden border-2 transition-all
                                                ${media.isCover ? 'border-blue-500 shadow-md ring-2 ring-blue-500 ring-offset-2' : 'border-slate-200'}
                                            `}
                                    >
                                        {/* Preview */}
                                        {media.fileType === 'image' ? (
                                            <img src={media.url} alt="preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                                                <video src={media.url} className="w-full h-full object-cover opacity-60" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Video className="text-white w-8 h-8 drop-shadow-md" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Top badges */}
                                        {media.isCover && (
                                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center shadow-sm z-10">
                                                <Check size={12} className="mr-1" /> Cover Image
                                            </div>
                                        )}

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeMedia(media.id);
                                            }}
                                            className="absolute top-2 right-2 bg-white/90 text-slate-600 p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 z-10"
                                        >
                                            <X size={14} />
                                        </button>

                                        {/* Hover Actions (Set as cover) */}
                                        {media.fileType === 'image' && !media.isCover && (
                                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAsCover(media.id);
                                                    }}
                                                    className="w-full py-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center"
                                                >
                                                    <ImageIcon size={12} className="mr-1" />
                                                    Set as Cover
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Validation Message */}
                        {(!formData.coverImage && formData.basicInfoMedia && formData.basicInfoMedia.length > 0) && (
                            <p className="text-sm text-amber-600 flex items-center mt-2 bg-amber-50 p-2 rounded-lg border border-amber-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>
                                Please select a cover image before proceeding.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </StepWrapper>
    );
};

export default BasicInfoStep;
