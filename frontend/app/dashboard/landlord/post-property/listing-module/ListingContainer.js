"use client";
import React from 'react';
import { ChevronLeft, Save, ShieldCheck } from 'lucide-react';
import { useListingForm } from './useListingForm';
import ListingStepper from './ListingStepper';
import BasicInfoStep from './steps/BasicInfoStep';
import LocationStep from './steps/LocationStep';
import PricingStep from './steps/PricingStep';
import SellDetailsStep from './steps/SellDetailsStep';
import RentDetailsStep from './steps/RentDetailsStep';
import PgDetailsStep from './steps/PgDetailsStep';
import AmenitiesStep from './steps/AmenitiesStep';
import MediaStep from './steps/MediaStep';
import OwnerDetailsStep from './steps/OwnerDetailsStep';
import VerificationStep from './steps/VerificationStep'; // Sprint 6
import { STEPS } from './config';

const ListingContainer = () => {
    const {
        currentStep,
        formData,
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
    } = useListingForm();

    // Filter visible steps based on listing type
    const visibleSteps = STEPS.filter(step => {

        if (step.key === 'pricing' && formData.listingType !== 'Sell') return false;

        // Sell Details -> Only Sell
        if (step.key === 'sell_details' && formData.listingType !== 'Sell') return false;

        // Rent Details -> Only Rent
        if (step.key === 'rent_details' && formData.listingType !== 'Rent') return false;

        // PG Details -> Only PG
        if (step.key === 'pg_details' && formData.listingType !== 'PG') return false;

        return true;
    });

    const activeStepObj = visibleSteps[currentStep - 1];

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
            <div className="max-w-4xl mx-auto">
                {/* Header & Stepper */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">List Your Property</h1>
                    <ListingStepper
                        steps={visibleSteps}
                        currentStep={currentStep}
                        setCurrentStep={goToStep}
                    />
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
                    <div className="p-6 md:p-8 flex-1">

                        {activeStepObj?.key === 'basic' && (
                            <BasicInfoStep
                                isActive={true}
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        {activeStepObj?.key === 'location' && (
                            <LocationStep
                                isActive={true}
                                formData={formData}
                                handleInputChange={handleInputChange}
                                toggleFacility={toggleFacility}
                            />
                        )}

                        {activeStepObj?.key === 'pricing' && (
                            <PricingStep
                                isActive={true}
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        {activeStepObj?.key === 'sell_details' && (
                            <SellDetailsStep
                                isActive={true}
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        {activeStepObj?.key === 'rent_details' && (
                            <RentDetailsStep
                                isActive={true}
                                formData={formData}
                                handleInputChange={handleInputChange}
                                setFieldValue={setFieldValue}
                            />
                        )}

                        {activeStepObj?.key === 'pg_details' && (
                            <PgDetailsStep
                                isActive={true}
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        {activeStepObj?.key === 'amenities' && (
                            <AmenitiesStep
                                isActive={true}
                                formData={formData}
                                toggleAmenity={toggleAmenity}
                            />
                        )}

                        {activeStepObj?.key === 'media' && (
                            <MediaStep
                                isActive={true}
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleFileUpload={handleFileUpload}
                                removeFile={removeFile}
                                handleImageUpload={handleImageUpload}
                                removeImage={removeImage}
                            />
                        )}

                        {activeStepObj?.key === 'owner' && (
                            <OwnerDetailsStep
                                isActive={true}
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        {activeStepObj?.key === 'verification' && (
                            <VerificationStep
                                isActive={true}
                                formData={formData}
                                handleFileUpload={handleFileUpload}
                                removeFile={removeFile}
                                setFieldValue={setFieldValue}
                            />
                        )}

                    </div>

                    {/* Footer / Navigation */}
                    <div className="bg-white/80 backdrop-blur-md px-6 py-4 border-t border-slate-200 flex justify-between items-center sticky bottom-0 z-20 md:relative md:bg-transparent md:backdrop-blur-none">
                        {currentStep === visibleSteps.length ? (
                            <>
                                <button
                                    onClick={prevStep}
                                    className="flex items-center gap-1 font-bold text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" /> Back
                                </button>
                                <button
                                    onClick={submitForm}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Saving...' : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Submit Verification
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 1 || isSubmitting}
                                    className={`flex items-center gap-1 font-bold text-slate-600 hover:text-slate-900 transition-colors
                                    ${(currentStep === 1 || isSubmitting) ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                                    `}
                                >
                                    <ChevronLeft className="w-5 h-5" /> Back
                                </button>

                                <button
                                    onClick={() => {
                                        if (currentStep < visibleSteps.length) {
                                            goToStep(currentStep + 1);
                                        }
                                    }}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 transform"
                                >
                                    Next Step
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl text-center max-w-sm mx-4 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Listing Submitted for Verification!</h2>
                        <p className="text-slate-600 mb-6">
                            Your property is now under review. We will notify you once the verification is complete (typically 2-4 hours).
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListingContainer;
