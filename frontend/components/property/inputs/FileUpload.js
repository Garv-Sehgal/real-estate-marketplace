"use client";
import React from 'react';
import { UploadCloud, X, FileText } from 'lucide-react';

const FileUpload = ({ label, accept, multiple = false, onChange, files = [], onRemove, hint, icon: Icon = UploadCloud }) => {

    // Helper to format file size
    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4">
            {label && <label className="block text-lg font-bold text-slate-900 mb-2">{label}</label>}
            {hint && <p className="text-slate-500 text-sm mb-4">{hint}</p>}

            <div className="relative border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition-colors group">
                <input
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    onChange={onChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                    {multiple ? 'Drag & Drop Files Here' : 'Click to Upload File'}
                </h3>
                <p className="text-slate-500 text-sm">or click to browse from your device</p>
            </div>

            {/* Preview Grid */}
            {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {files.map((fileObj, index) => (
                        <div key={fileObj.id || index} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
                            {fileObj.preview ? (
                                // Image Preview
                                <div className="aspect-square relative">
                                    <img src={fileObj.preview} alt="Preview" className="w-full h-full object-cover" />
                                    {index === 0 && multiple && accept.includes("image") && (
                                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold uppercase rounded backdrop-blur-sm">
                                            Cover
                                        </span>
                                    )}
                                </div>
                            ) : (
                                // File Document Preview
                                <div className="flex items-center gap-3 p-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                        DOC
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{fileObj.name || "File"}</p>
                                        <p className="text-xs text-slate-500">{fileObj.size || "Unknown size"}</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => onRemove(fileObj.id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
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
