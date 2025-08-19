'use client';

import { useState, useEffect } from 'react';
import { useCategory } from '@/hooks/useCategory';
import toast from 'react-hot-toast';

export default function Banners() {
    const [selectedFiles, setSelectedFiles] = useState([null, null]);
    const [previewUrls, setPreviewUrls] = useState(['', '']);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [uploading, setUploading] = useState(false);
    const { category, getAllCategories, loading } = useCategory();

    useEffect(() => {
        getAllCategories();
    }, []);

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Update selected files
        const newFiles = [...selectedFiles];
        newFiles[index] = file;
        setSelectedFiles(newFiles);

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            const newPreviews = [...previewUrls];
            newPreviews[index] = reader.result;
            setPreviewUrls(newPreviews);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedCategory) {
            toast.error('Please select a category');
            return;
        }

        if (selectedFiles.every(file => file === null)) {
            toast.error('Please select at least one image');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('category', selectedCategory);

            // Add both images if they exist
            selectedFiles.forEach((file, index) => {
                if (file) {
                    formData.append(`images`, file);
                }
            });

            const response = await fetch('/api/top-category/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload images');
            }

            toast.success('Images uploaded successfully!');

            // Reset form
            setSelectedFiles([null, null]);
            setPreviewUrls(['', '']);
            setSelectedCategory('');

            // Clear file inputs
            document.querySelectorAll('input[type="file"]').forEach(input => {
                input.value = '';
            });

        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        const newFiles = [...selectedFiles];
        newFiles[index] = null;
        setSelectedFiles(newFiles);

        const newPreviews = [...previewUrls];
        newPreviews[index] = '';
        setPreviewUrls(newPreviews);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Upload Category Banner Images</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Category Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Category
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={loading}
                    >
                        <option value="">Select a category</option>
                        {category?.map((cat) => (
                            <option key={cat._id || cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Image Upload Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {[0, 1].map((index) => (
                        <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="text-center">
                                {previewUrls[index] ? (
                                    <div className="relative">
                                        <img
                                            src={previewUrls[index]}
                                            alt={`Preview ${index + 1}`}
                                            className="mx-auto h-40 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-40">
                                        <div className="text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="mt-1 text-sm text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(index, e)}
                                    className="hidden"
                                    id={`file-upload-${index}`}
                                />
                                <label
                                    htmlFor={`file-upload-${index}`}
                                    className="mt-2 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
                                >
                                    {previewUrls[index] ? 'Change Image' : 'Select Image'}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={uploading || !selectedCategory || selectedFiles.every(file => file === null)}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium ${uploading || !selectedCategory || selectedFiles.every(file => file === null)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                >
                    {uploading ? 'Uploading...' : 'Upload Images'}
                </button>
            </div>
        </div>
    );
}