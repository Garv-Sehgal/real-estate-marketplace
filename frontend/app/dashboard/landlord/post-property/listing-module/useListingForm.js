import { useState, useEffect } from 'react';
import { INITIAL_STATE } from './constants';
import { STEPS } from './config';
import { saveDraft, getDraft, clearDraft } from './utils/draftStorage';
import { compressImage } from './utils/imageCompression';

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
        if (formData.expectedPrice && formData.superArea) {
            const price = parseFloat(formData.expectedPrice.replace(/,/g, ''));
            const area = parseFloat(formData.superArea);
            if (!isNaN(price) && !isNaN(area) && area > 0) {
                setFormData(prev => ({
                    ...prev,
                    pricePerSqft: Math.round(price / area).toString()
                }));
            }
        }
    }, [formData.expectedPrice, formData.superArea]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Generic handler for non-event values (selects, custom inputs)
    const setFieldValue = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleAmenity = (id) => {
        setFormData(prev => {
            const current = prev.amenities;
            if (current.includes(id)) {
                return { ...prev, amenities: current.filter(item => item !== id) };
            } else {
                return { ...prev, amenities: [...current, id] };
            }
        });
    };

    const toggleFacility = (facility) => {
        setFormData(prev => {
            const current = prev.nearbyFacilities;
            if (current.includes(facility)) {
                return { ...prev, nearbyFacilities: current.filter(item => item !== facility) };
            } else {
                return { ...prev, nearbyFacilities: [...current, facility] };
            }
        });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        // Optimistic UI update could be added here

        const processedImages = await Promise.all(files.map(async (file) => {
            try {
                const compressed = await compressImage(file);
                return {
                    id: Math.random().toString(36).substr(2, 9),
                    file: compressed, // Store compressed file
                    preview: URL.createObjectURL(compressed)
                };
            } catch (err) {
                console.error('Compression failed', err);
                return null;
            }
        }));

        const validImages = processedImages.filter(Boolean);
        setFormData(prev => ({ ...prev, images: [...prev.images, ...validImages] }));
    };

    const removeImage = (id) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter(img => img.id !== id) }));
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
        if (isStepValid() && currentStep < STEPS.length) {
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
        if (currentStep === 1) return formData.title && formData.propertyType;

        // 2. Location (Common)
        if (currentStep === 2) return formData.city && formData.address;

        // Dynamic Validation based on Flow
        if (listingType === 'Sell') {
            if (currentStep === 3) return !!formData.expectedPrice; // Pricing
            if (currentStep === 4) return true; // Sell Details
            if (currentStep === 5) return true; // Amenities
            if (currentStep === 6) return true; // Media
            if (currentStep === 7) return formData.ownerName && formData.ownerPhone; // Owner
        }
        else if (listingType === 'Rent') {
            if (currentStep === 3) return !!formData.monthlyRent; // Rent Details
            if (currentStep === 4) return true; // Amenities
            if (currentStep === 5) return true; // Media
            if (currentStep === 6) return formData.ownerName && formData.ownerPhone; // Owner
        }
        else if (listingType === 'PG') {
            if (currentStep === 3) return !!formData.rentPerBed; // PG Details
            if (currentStep === 4) return true; // Amenities
            if (currentStep === 5) return true; // Media
            if (currentStep === 6) return formData.ownerName && formData.ownerPhone; // Owner
        }

        return true;
    };

    const submitForm = async () => {
        setIsSubmitting(true);

        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Finalize data
                const finalData = {
                    ...formData,
                    listingStatus: 'pending', // Pending Admin Review
                    updatedAt: new Date().toISOString()
                };

                console.log('Final Submission Data:', finalData);

                // UX Cleanup
                clearDraft(); // Remove draft on success
                setIsSubmitting(false);
                setShowSuccessModal(true);
                resolve(true);
            }, 2000);
        });
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
        toggleAmenity,
        toggleFacility,
        handleImageUpload,
        removeImage,
        handleFileUpload,
        removeFile,
        nextStep,
        prevStep,
        goToStep,
        isStepValid,
        submitForm
    };
}
