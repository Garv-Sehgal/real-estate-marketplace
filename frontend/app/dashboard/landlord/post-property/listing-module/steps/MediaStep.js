"use client";
import React from 'react';
import StepWrapper from '@/components/property/StepWrapper';
import TextInput from '@/components/property/inputs/TextInput';
import FileUpload from '@/components/property/inputs/FileUpload';
import { Video, Globe, FileText, Image as ImageIcon } from 'lucide-react';

const MediaStep = ({ formData, handleInputChange, handleFileUpload, removeFile, handleImageUpload, removeImage, isActive }) => {
    return (
        <StepWrapper isActive={isActive}>
            <div className="space-y-8">

                {/* 1. Cover Image */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Cover Image</h3>
                    {formData.coverImage ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group max-w-md">
                            <img src={formData.coverImage.preview} alt="Cover" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeFile('coverImage')}
                                className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Remove Cover
                            </button>
                        </div>
                    ) : (
                        <FileUpload
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'coverImage')}
                            hint="Upload a high-quality cover image."
                            icon={ImageIcon}
                        />
                    )}
                </div>

                {/* 2. Multiple Images */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Gallery Images</h3>
                    <FileUpload
                        multiple
                        accept="image/*"
                        files={formData.images}
                        onChange={handleImageUpload}
                        onRemove={removeImage}
                        hint="Upload multiple images of bedrooms, kitchen, bathroom etc."
                    />
                </div>

                {/* 3. URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                        label="Video URL"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                        placeholder="YouTube/Vimeo Link"
                        prefix={<Video className="w-4 h-4" />}
                    />
                    <TextInput
                        label="360° Tour URL"
                        name="tour360Url"
                        value={formData.tour360Url}
                        onChange={handleInputChange}
                        placeholder="Matterport/Virtual Tour Link"
                        prefix={<Globe className="w-4 h-4" />}
                    />
                </div>

                {/* 4. Documents */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Floor Plan</label>
                        {formData.floorPlan ? (
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 truncate">{formData.floorPlan.name}</span>
                                </div>
                                <button
                                    onClick={() => removeFile('floorPlan')}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <span className="sr-only">Remove</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ) : (
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.png"
                                    onChange={(e) => handleFileUpload(e, 'floorPlan')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center gap-3 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 group-hover:border-blue-500 group-hover:bg-blue-50/10 group-hover:text-blue-600 transition-all">
                                    <FileText className="w-5 h-5" />
                                    <span className="text-sm font-medium">Upload Floor Plan</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Brochure</label>
                        {formData.brochure ? (
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 truncate">{formData.brochure.name}</span>
                                </div>
                                <button
                                    onClick={() => removeFile('brochure')}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <span className="sr-only">Remove</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ) : (
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleFileUpload(e, 'brochure')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center gap-3 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 group-hover:border-blue-500 group-hover:bg-blue-50/10 group-hover:text-blue-600 transition-all">
                                    <FileText className="w-5 h-5" />
                                    <span className="text-sm font-medium">Upload Brochure</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </StepWrapper>
    );
};

export default MediaStep;
