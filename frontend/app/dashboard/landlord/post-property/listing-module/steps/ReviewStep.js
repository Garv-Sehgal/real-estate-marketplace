"use client";
import React, { useMemo, useState } from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import { Pencil, CheckCircle2 } from 'lucide-react';
import { FIELD_CONFIG } from '../reviewConfig';
import { PROPERTY_RULES } from '../propertyRules';

const ReviewStep = ({ formData, goToStep, submitForm, isSubmitting, isActive }) => {

    // Internal helper simulating BasicInfoStep's conditional rendering requirement
    const isFieldVisible = (fieldName) => {
        if (formData.listingType === 'PG') return true;
        const rules = PROPERTY_RULES[formData.category]?.[formData.propertyType];
        return rules ? rules.includes(fieldName) : true;
    };

    // Memoized processing of sections and fields to avoid recalculating on every render
    const displaySections = useMemo(() => {
        return FIELD_CONFIG.map(section => {
            // Check if section itself is visible (e.g. SellDetails vs RentDetails)
            if (section.visibleIfSection && !section.visibleIfSection(formData)) {
                return null;
            }

            // Filter visible fields based on data condition and `isFieldVisible` property rules helper
            const visibleFields = section.fields.filter(f => {
                const isVis = f.visibleIf(formData, isFieldVisible);
                if (!isVis) return false;

                // Edge case handling: If array empty -> Hide field
                if (f.type === 'array') {
                    const val = formData[f.name];
                    if (!val || (Array.isArray(val) && val.length === 0)) {
                        return false;
                    }
                }
                return true;
            });

            if (visibleFields.length === 0) return null;

            return {
                ...section,
                fields: visibleFields
            };
        }).filter(Boolean); // removes nulls
    }, [formData]);

    // Format utility functions
    const formatValue = (field, value) => {
        if (value === null || value === undefined || value === '') {
            return <span className="text-slate-400 italic">Not Provided</span>;
        }

        switch (field.type) {
            case 'currency':
                return `₹ ${value} ${field.suffix || ''}`;
            case 'area':
                return `${value} sq.ft`;
            case 'boolean':
                return value ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Yes
                    </span>
                ) : <span className="text-slate-500">No</span>;
            case 'array':
                if (Array.isArray(value) && value.length > 0) {
                    return value.join(', ');
                } else if (typeof value === 'string' && value.trim()) {
                    return value;
                }
                return <span className="text-slate-400 italic">Not Provided</span>;
            case 'file':
                return value?.name ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> {value.name}
                    </span>
                ) : <span className="text-slate-400 italic">Not Provided</span>;
            case 'date':
                // simple YYYY-MM-DD to cleaner layout
                return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            default:
                return `${value} ${field.suffix || ''}`;
        }
    };

    const navigateTo = (stepIndex) => {
        goToStep(stepIndex);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-6 pb-24">

                <h2 className="text-2xl font-bold text-slate-800 mb-1">Review Your Listing</h2>
                <p className="text-slate-500 mb-6">Please carefully review the details. Click the edit icon to modify any section.</p>

                {displaySections.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative group overflow-hidden">
                        <button
                            onClick={() => navigateTo(section.stepIndex)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-colors"
                            title={`Edit ${section.title}`}
                        >
                            <Pencil className="w-4 h-4" />
                        </button>

                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
                            {section.title}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                            {section.fields.map((field, fIdx) => (
                                <div key={fIdx} className={(field.type === 'text' && String(formData[field.name])?.length > 40) ? 'sm:col-span-2 lg:col-span-3' : ''}>
                                    <p className="text-sm text-slate-500 mb-1">{field.label}</p>
                                    <div className="text-slate-900 font-medium">
                                        {formatValue(field, formData[field.name])}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

            </div>

            {/* FIXED BOTTOM ACTION BAR FOR FINAL STEP ONLY */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 md:left-64">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <button
                        onClick={() => goToStep(4)}
                        disabled={isSubmitting}
                        className="px-6 py-3 font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                        Back
                    </button>

                    <button
                        onClick={submitForm}
                        disabled={isSubmitting}
                        className="px-8 py-3 font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-600/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Submit Property
                            </>
                        )}
                    </button>
                </div>
            </div>

        </StepWrapper>
    );
};

export default ReviewStep;
