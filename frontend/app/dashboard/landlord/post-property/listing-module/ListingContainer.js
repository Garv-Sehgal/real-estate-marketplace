"use client";
import React from 'react';
import { ChevronLeft, Save, ShieldCheck, ArrowRight } from 'lucide-react';
import { useListingForm } from './useListingForm';
import ListingStepper from './ListingStepper';
import BasicInfoStep from './steps/BasicInfoStep';
import LocationStep from './steps/LocationStep';
import SellDetailsStep from './steps/SellDetailsStep';
import RentDetailsStep from './steps/RentDetailsStep';
import PgDetailsStep from './steps/PgDetailsStep';
import VerificationStep from './steps/VerificationStep'; // Sprint 6
import ReviewStep from './steps/ReviewStep'; // Review Step
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
        submitForm,
        // Navigation & Validation
        goToStep,
        prevStep,
        isStepValid,
        // File Handling
        handleFileUpload,
        removeFile,
        // Helpers
        toggleFacility

    } = useListingForm();

    // Filter visible steps based on listing type
    const visibleSteps = STEPS.filter(step => {
        if (step.key === 'pricing' && formData.listingType !== 'Sell') return false;
        if (step.key === 'sell_details' && formData.listingType !== 'Sell') return false;
        if (step.key === 'rent_details' && formData.listingType !== 'Rent') return false;
        if (step.key === 'pg_details' && formData.listingType !== 'PG') return false;
        return true;
    });

    const activeStepObj = visibleSteps[currentStep - 1];

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
            <div className="max-w-3xl mx-auto">
                {/* Header & Stepper */}
                <div className="mb-8">
                    <ListingStepper
                        steps={visibleSteps}
                        currentStep={currentStep}
                        setCurrentStep={goToStep}
                    />
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden min-h-[400px] flex flex-col relative transition-all duration-300">

                    {/* Content Area */}
                    <div className="p-6 md:p-8 flex-1">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activeStepObj?.key === 'basic' && (
                                <BasicInfoStep
                                    isActive={true}
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    setFieldValue={setFieldValue}
                                />
                            )}
                            {activeStepObj?.key === 'location' && (
                                <LocationStep isActive={true} formData={formData} handleInputChange={handleInputChange} toggleFacility={toggleFacility} />
                            )}
                            {activeStepObj?.key === 'sell_details' && (
                                <SellDetailsStep isActive={true} formData={formData} handleInputChange={handleInputChange} />
                            )}
                            {activeStepObj?.key === 'rent_details' && (
                                <RentDetailsStep isActive={true} formData={formData} handleInputChange={handleInputChange} setFieldValue={setFieldValue} />
                            )}
                            {activeStepObj?.key === 'pg_details' && (
                                <PgDetailsStep isActive={true} formData={formData} handleInputChange={handleInputChange} />
                            )}
                            {activeStepObj?.key === 'verification' && (
                                <VerificationStep isActive={true} formData={formData} handleFileUpload={handleFileUpload} removeFile={removeFile} setFieldValue={setFieldValue} />
                            )}
                            {activeStepObj?.key === 'review' && (
                                <ReviewStep
                                    isActive={true}
                                    formData={formData}
                                    goToStep={goToStep}
                                    submitForm={submitForm}
                                    isSubmitting={isSubmitting}
                                />
                            )}          
              </div>
                    </div>

                    {/* INLINE BOTTOM NAVIGATION */}
                    {activeStepObj?.key !== 'review' && (
                        <div className="bg-white px-6 py-4 border-t border-slate-100 flex justify-between items-center sticky bottom-0 z-20">
                            {currentStep === 1 ? (
                                <div className="w-24"></div>
                            ) : (
                                <button
                                    onClick={prevStep}
                                    disabled={isSubmitting}
                                    className="group flex items-center gap-2 text-slate-500 font-semibold hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
                                >
                                    <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                    Back
                                </button>
                            )}

                            {currentStep === visibleSteps.length ? (
                                <button
                                    onClick={submitForm}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                                >
                                    {isSubmitting ? 'Submitting...' : (
                                        <>
                                            Submit Property
                                            <Save className="w-4 h-4 ml-1" />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (currentStep < visibleSteps.length) {
                                            goToStep(currentStep + 1);
                                        }
                                    }}
                                    disabled={isSubmitting || !isStepValid()}
                                    className={`
                                flex items-center gap-2 px-8 py-3.5 font-bold rounded-xl transition-all duration-200
                                ${(isSubmitting || !isStepValid())
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70 shadow-none'
                                            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 cursor-pointer'
                                        }
                            `}
                                >
                                    Next Step
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* SUCCESS MODAL - Refined */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-10 rounded-3xl text-center max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Verification Pending</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            Your listing has been submitted! Our team will verify your documents within 2-4 hours.
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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
