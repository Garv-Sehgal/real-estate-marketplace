"use client";
import React from 'react';
import { UploadCloud, X, FileText } from 'lucide-react';

const FileUpload = ({ label, accept, multiple = false, onChange, files = [], onRemove, hint, icon: Icon = UploadCloud }) => {

    const fileArray = Array.isArray(files) ? files : files ? [files] : [];

    return (
        <div className="space-y-3">
            {label && <label className="block text-sm font-bold text-slate-700 ml-1">{label}</label>}

            <div className="relative group cursor-pointer">
                <input
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    onChange={onChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="relative border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 group-hover:border-blue-400 group-hover:bg-blue-50 group-hover:shadow-sm">
                    <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center mb-3 shadow-sm border border-blue-100 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                        {multiple ? 'Drop files here or click to upload' : 'Click to upload your file'}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium">
                        {hint || 'Supports JPG, PNG, PDF'}
                    </p>
                </div>
            </div>

            {/* Preview Grid */}
            {fileArray.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {fileArray.map((fileObj, index) => (
                        <div key={fileObj.id || index} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white hover:shadow-md transition-shadow">
                            {fileObj.preview ? (
                                // Image Preview
                                <div className="aspect-square relative bg-slate-100">
                                    <img src={fileObj.preview} alt="Preview" className="w-full h-full object-cover" />
                                    {index === 0 && multiple && accept?.includes("image") && (
                                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold uppercase rounded backdrop-blur-sm">
                                            Cover
                                        </span>
                                    )}
                                </div>
                            ) : (
                                // File Document Preview
                                <div className="flex flex-col items-center justify-center aspect-square p-4 text-center gap-2">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 w-full">
                                        <p className="text-xs font-bold text-slate-900 truncate px-2">{fileObj.name || "File"}</p>
                                        <p className="text-[10px] text-slate-400">{fileObj.size || "Unknown size"}</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onRemove(fileObj.id || index); // Fallback to index if no ID
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-20 backdrop-blur-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
