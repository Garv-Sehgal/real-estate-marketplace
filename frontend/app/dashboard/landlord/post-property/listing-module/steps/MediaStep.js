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
                            <div className="flex items-center justify-between p-3 border rounded-xl bg-slate-50">
                                <span className="text-sm font-medium truncate">{formData.floorPlan.name}</span>
                                <button onClick={() => removeFile('floorPlan')} className="text-red-500 text-xs font-bold">Remove</button>
                            </div>
                        ) : (
                            <input
                                type="file"
                                accept=".pdf,.jpg,.png"
                                onChange={(e) => handleFileUpload(e, 'floorPlan')}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Brochure</label>
                        {formData.brochure ? (
                            <div className="flex items-center justify-between p-3 border rounded-xl bg-slate-50">
                                <span className="text-sm font-medium truncate">{formData.brochure.name}</span>
                                <button onClick={() => removeFile('brochure')} className="text-red-500 text-xs font-bold">Remove</button>
                            </div>
                        ) : (
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleFileUpload(e, 'brochure')}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        )}
                    </div>
                </div>

            </div>
        </StepWrapper>
    );
};

export default MediaStep;
