import { useState, useEffect } from 'react';
import { INITIAL_STATE } from './constants';
import { STEPS } from './config';
import { saveDraft, getDraft, clearDraft } from './utils/draftStorage';
import { compressImage } from './utils/imageCompression';
import { apiRequest } from '@/lib/api';

export function useListingForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState(INITIAL_STATE);

    // Load Draft on Mount
    useEffect(() => {
        const draft = getDraft();
        if (draft) {
            // Optional: Ask user (simplified here to auto-restore or could add UI prompt)
            // For MVP: Auto-restore if draft exists
            if (confirm('Found a saved draft. Do you want to restore it?')) {
                setFormData(prev => ({ ...prev, ...draft.data }));
                setCurrentStep(draft.step || 1);
            }
        }
    }, []);

    // Save Draft on Change (Debounced)
    useEffect(() => {
        const handler = setTimeout(() => {
            if (currentStep > 1 || Object.keys(formData).length > 5) { // Avoid saving empty init state
                saveDraft(formData, currentStep);
            }
        }, 800);

        return () => clearTimeout(handler);
    }, [formData, currentStep]);

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);


    // Auto-calculate Price per Sq.Ft
    useEffect(() => {
        const areaToUse = formData.superArea || formData.carpetArea;
        if (formData.expectedPrice && areaToUse) {
            const price = parseFloat(formData.expectedPrice.replace(/,/g, ''));
            const area = parseFloat(areaToUse);
            if (!isNaN(price) && !isNaN(area) && area > 0) {
                setFormData(prev => ({
                    ...prev,
                    pricePerSqft: Math.round(price / area).toString()
                }));
            }
        } else {
            // Clear if neither is present
            setFormData(prev => ({ ...prev, pricePerSqft: '' }));
        }
    }, [formData.expectedPrice, formData.superArea, formData.carpetArea]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Generic handler for non-event values (selects, custom inputs)
    const setFieldValue = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleFileUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            let fileToStore = file;

            // Compress if image (e.g. ID proof, selfie)
            if (file.type.startsWith('image/')) {
                try {
                    fileToStore = await compressImage(file, 800, 0.6); // Slightly lower quality for docs
                } catch (err) {
                    console.error('Doc compression failed', err);
                }
            }

            setFormData(prev => ({
                ...prev,
                [fieldName]: {
                    file: fileToStore,
                    preview: fileToStore.type.startsWith('image/') ? URL.createObjectURL(fileToStore) : null,
                    name: fileToStore.name,
                    size: (fileToStore.size / 1024 / 1024).toFixed(2) + ' MB'
                }
            }));
        }
    };

    const removeFile = (fieldName) => {
        setFormData(prev => ({ ...prev, [fieldName]: null }));
    };

    const nextStep = () => {
        if (isStepValid() && currentStep < 5) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const goToStep = (stepId) => {
        // Allow navigation if step is visited or less than current
        if (stepId < currentStep || isStepValid()) {
            setCurrentStep(stepId);
        }
    };

    const isStepValid = () => {
        const { listingType } = formData;

        // 1. Basic Info (Common)
        if (currentStep === 1) {
            const hasTitle = !!formData.title?.trim();
            const hasListingType = !!formData.listingType;
            const hasCoverImage = !!formData.coverImage;

            // Property Type or Gender Allowed depending on listing type
            const hasTypeInfo = listingType === 'PG'
                ? !!formData.genderAllowed
                : !!formData.propertyType;

            let isCommercialOfficeValid = true;
            if (formData.category === 'Commercial' && formData.propertyType === 'Office') {
                const hasCarpet = formData.carpetArea !== '' && formData.carpetArea !== null && formData.carpetArea !== undefined;
                const hasFurnish = !!formData.furnishingStatus;
                const hasPower = !!formData.powerBackup;

                isCommercialOfficeValid = hasCarpet && hasFurnish && hasPower;

                console.log("Office Validation Breakdown:", {
                    hasCarpet, hasFurnish, hasPower,
                    carpetAreaValue: formData.carpetArea,
                    furnishValue: formData.furnishingStatus,
                    powerValue: formData.powerBackup
                });
            }

            let isCommercialShopValid = true;
            if (formData.category === 'Commercial' && formData.propertyType === 'Shop') {
                const hasDesc = !!formData.description && formData.description.trim() !== '';
                const hasCarpet = formData.carpetArea !== '' && formData.carpetArea !== null && formData.carpetArea !== undefined;
                const hasFloor = formData.floorNumber !== '' && formData.floorNumber !== null && formData.floorNumber !== undefined;
                const hasTotalFloors = formData.totalFloors !== '' && formData.totalFloors !== null && formData.totalFloors !== undefined;
                const hasFurnish = !!formData.furnishingStatus;
                const hasLocation = !!formData.locatedIn;
                const hasWidth = formData.entranceWidth !== '' && formData.entranceWidth !== null && formData.entranceWidth !== undefined;
                const hasWashrooms = formData.washroomsCount !== '' && formData.washroomsCount !== null && formData.washroomsCount !== undefined;
                const hasParking = !!formData.parkingAvailability;

                // If parking is yes, parking Count is required
                const isParkingValid = formData.parkingAvailability === 'Yes' ? (formData.parkingCount !== '' && formData.parkingCount !== null && formData.parkingCount !== undefined) : true;

                isCommercialShopValid = hasDesc && hasCarpet && hasFloor && hasTotalFloors && hasFurnish && hasLocation && hasWidth && hasWashrooms && hasParking && isParkingValid;
            }

            let isCommercialShowroomValid = true;
            if (formData.category === 'Commercial' && formData.propertyType === 'Showroom') {
                const hasDesc = !!formData.description && formData.description.trim() !== '';
                const hasCarpet = formData.carpetArea !== '' && formData.carpetArea !== null && formData.carpetArea !== undefined && parseFloat(formData.carpetArea) > 0;
                const hasFurnish = !!formData.furnishingStatus;
                const hasLocation = !!formData.locatedIn;

                // Floor rules
                let isFloorValid = true;
                if (formData.locatedIn !== 'Standalone') {
                    const hasFloor = formData.floorNumber !== '' && formData.floorNumber !== null && formData.floorNumber !== undefined;
                    const hasTotalFloors = formData.totalFloors !== '' && formData.totalFloors !== null && formData.totalFloors !== undefined;
                    isFloorValid = hasFloor && hasTotalFloors;
                }

                const hasWidth = formData.entranceWidth !== '' && formData.entranceWidth !== null && formData.entranceWidth !== undefined && parseFloat(formData.entranceWidth) > 0;
                const hasCeiling = formData.ceilingHeight !== '' && formData.ceilingHeight !== null && formData.ceilingHeight !== undefined && parseFloat(formData.ceilingHeight) >= 8;
                const hasWashrooms = formData.washroomsCount !== '' && formData.washroomsCount !== null && formData.washroomsCount !== undefined && parseInt(formData.washroomsCount) >= 0;
                const hasParking = !!formData.parkingAvailability;

                // If parking is yes, parking Count is required
                const isParkingValid = formData.parkingAvailability === 'Yes' ? (formData.parkingCount !== '' && formData.parkingCount !== null && formData.parkingCount !== undefined) : true;
                const hasAge = !!formData.propertyAge;
                const hasMedia = formData.basicInfoMedia && formData.basicInfoMedia.length > 0;

                isCommercialShowroomValid = hasDesc && hasMedia && hasCarpet && hasFurnish && hasLocation && isFloorValid && hasWidth && hasCeiling && hasWashrooms && hasParking && isParkingValid && hasAge;

                console.log("Showroom Validation Breakdown:", {
                    hasDesc, hasMedia, hasCarpet, hasFurnish, hasLocation, isFloorValid, hasWidth, hasCeiling, hasWashrooms, hasParking, isParkingValid, hasAge
                });
            }

            console.log("Global Step 1 Breakdown:", {
                hasTitle, hasListingType, hasCoverImage, hasTypeInfo, isCommercialOfficeValid, isCommercialShopValid, isCommercialShowroomValid
            });

            return hasTitle && hasListingType && hasCoverImage && hasTypeInfo && isCommercialOfficeValid && isCommercialShopValid && isCommercialShowroomValid;
        }

        // 2. Location (Common)
        if (currentStep === 2) {
            return !!formData.country &&
                !!formData.state &&
                !!formData.city &&
                !!formData.pincode &&
                !!formData.address?.trim();
        }

        // 3. Dynamic Validation based on Flow
        if (listingType === 'Sell') {
            if (currentStep === 3) {
                // Base requirements for Sell Details
                if (formData.category === 'Commercial') {
                    const isShowroom = formData.propertyType === 'Showroom';
                    const hasLegalBasic = !!formData.propertyOwnership &&
                        !!formData.possessionDate &&
                        (isShowroom ? true : !!formData.propertyAge) && // Showroom age is in Step 1
                        !!formData.titleClear &&
                        !!formData.activeLoan;
                    const hasFinancialBasic = !!formData.expectedPrice &&
                        !!formData.priceNegotiable &&
                        !!formData.monthlyMaintenanceCharges &&
                        !!formData.brokerageApplicable;

                    const isLoanValid = formData.activeLoan === 'Yes' ? !!formData.outstandingLoanAmount : true;
                    const isBrokerageValid = formData.brokerageApplicable === 'Yes' ? !!formData.brokerageAmount : true;

                    const hasOwnership = !!formData.propertyOwnership;
                    const hasPossession = !!formData.possessionDate;
                    const hasAge = isShowroom ? true : !!formData.propertyAge;
                    const hasTitle = !!formData.titleClear;
                    const hasActiveLoan = !!formData.activeLoan;
                    const hasExpectedPrice = !!formData.expectedPrice;
                    const hasPriceNeg = !!formData.priceNegotiable;
                    const hasMaint = !!formData.monthlyMaintenanceCharges;
                    const hasBroker = !!formData.brokerageApplicable;

                    console.log("Commercial Sell Step 3 Validation:", {
                        hasLegalBasic,
                        hasFinancialBasic,
                        isLoanValid,
                        isBrokerageValid,
                        hasOwnership, hasPossession, hasAge, hasTitle, hasActiveLoan,
                        hasExpectedPrice, hasPriceNeg, hasMaint, hasBroker,
                        loanAmountValue: formData.outstandingLoanAmount,
                        brokerAmountValue: formData.brokerageAmount
                    });

                    return hasLegalBasic && hasFinancialBasic && isLoanValid && isBrokerageValid;
                } else {
                    return !!formData.propertyOwnership &&
                        !!formData.possessionDate &&
                        !!formData.expectedPrice &&
                        !!formData.bookingAmount; // Sell Details requirements for Residential
                }
            }
            if (currentStep === 4) return formData.govtId && formData.ownershipProof && formData.geoTagConfirmed; // Verification
            if (currentStep === 5) return true; // Review
        }
        else if (listingType === 'Rent') {
            if (currentStep === 3) {
                if (formData.category === 'Commercial') {
                    const hasRentBasic = !!formData.monthlyRent &&
                        !!formData.securityDeposit &&
                        !!formData.lockInPeriod;

                    const hasAvailBasic = !!formData.availableFrom;

                    const isBrokerageValid = formData.brokerageApplicable === 'Yes' ? !!formData.brokerageAmount : true;

                    return hasRentBasic && hasAvailBasic && isBrokerageValid;
                } else {
                    return !!formData.monthlyRent &&
                        !!formData.maintenanceIncluded &&
                        !!formData.electricityCharges &&
                        !!formData.waterCharges &&
                        (formData.preferredTenant && formData.preferredTenant.length > 0) &&
                        !!formData.occupancyStatus &&
                        !!formData.availableFrom; // Rent Details requirements for residential
                }
            }
            if (currentStep === 4) return formData.govtId && formData.ownershipProof && formData.geoTagConfirmed; // Verification
            if (currentStep === 5) return true; // Review
        }
        else if (listingType === 'PG') {
            if (currentStep === 3) {
                return !!formData.rentPerBed; // PG Details requirements
            }
            if (currentStep === 4) return formData.govtId && formData.ownershipProof && formData.geoTagConfirmed; // Verification
            if (currentStep === 5) return true; // Review
        }

        return true;
    };


    const toggleFacility = (facility) => {
        setFormData(prev => {
            const facilities = prev.nearbyFacilities || [];
            if (facilities.includes(facility)) {
                return { ...prev, nearbyFacilities: facilities.filter(f => f !== facility) };
            } else {
                return { ...prev, nearbyFacilities: [...facilities, facility] };
            }
        });
    };

    const submitForm = async () => {
        try {
            setIsSubmitting(true);

            // 1. Validate title presence
            if (!formData.title?.trim()) {
                throw new Error("Property title missing from payload");
            }

            // 2. Assemble FormData for flat parameters and file uploads
            const formPayload = new FormData();

            // Safely map all flat primitive fields
            Object.keys(formData).forEach(key => {
                const value = formData[key];

                // Exclude complex file objects or internal statics
                if (key === 'coverImage' || key === 'govtId' || key === 'ownershipProof' || key === 'basicInfoMedia') {
                    return;
                }

                if (key === 'bhkConfiguration') {
                    if (value) formPayload.append('bhk', value);
                } else if (key === 'nearbyFacilities' || key === 'amenities') {
                    if (Array.isArray(value)) {
                        formPayload.append(key, JSON.stringify(value));
                    }
                } else if (value !== null && value !== undefined && value !== '') {
                    formPayload.append(key, String(value));
                }
            });

            // Append Files
            if (formData.coverImage?.file) {
                formPayload.append("coverImage", formData.coverImage.file);
            }

            if (formData.govtId?.file) {
                formPayload.append("govtId", formData.govtId.file);
            }

            if (formData.ownershipProof?.file) {
                formPayload.append("ownershipProof", formData.ownershipProof.file);
            }

            if (formData.basicInfoMedia && formData.basicInfoMedia.length > 0) {
                formData.basicInfoMedia.forEach((mediaItem) => {
                    if (mediaItem.file) {
                        formPayload.append("images", mediaItem.file);
                    }
                });
            }

            console.log("FINAL FLAT PAYLOAD →", Object.fromEntries(formPayload.entries()));

            // 4. Send Request (FormData doesn't need Content-Type header manually set, browser does it)
            const response = await apiRequest('/property', {
                method: 'POST',
                body: formPayload,
                // Do NOT stringify FormData. Delete headers allowing browser boundary injection.
                headers: {}
            });

            console.log("Backend response:", response);

            clearDraft();
            setShowSuccessModal(true);

            return true;
        } catch (error) {
            console.error("Submission failed:", error);
            alert(error.message || "Failed to submit property");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        currentStep,
        formData,
        setFormData,
        isSubmitting,
        showSuccessModal,
        setShowSuccessModal,
        handleInputChange,
        setFieldValue,
        handleFileUpload,
        removeFile,
        nextStep,
        prevStep,
        goToStep,
        isStepValid,
        submitForm,
        toggleFacility
    };
}
