// 'use client';

// import { useState, useEffect } from 'react';
// import { useCategory } from '@/hooks/useCategory';
// import { useRouter } from 'next/navigation';

// export default function TopCategoriesUpload({ setCategory }) {
//     const { category: categories, loading: categoriesLoading, getAllCategories } = useCategory();
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [image, setImage] = useState(null);
//     const [preview, setPreview] = useState('');
//     const [uploading, setUploading] = useState(false);
//     const [message, setMessage] = useState('');
//     const router = useRouter();

//     // Load categories on component mount
//     useEffect(() => {
//         getAllCategories();
//     }, []);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Validate file type and size
//             if (!file.type.startsWith('image/')) {
//                 setMessage('Please select an image file');
//                 return;
//             }
//             if (file.size > 5 * 1024 * 1024) { // 5MB limit
//                 setMessage('Image size must be less than 5MB');
//                 return;
//             }

//             setImage(file);
//             setPreview(URL.createObjectURL(file));
//             setMessage('');
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!selectedCategory || !image) {
//             setMessage('Please select a category and upload an image');
//             return;
//         }

//         setUploading(true);
//         setMessage('');

//         try {
//             const formData = new FormData();
//             formData.append('image', image);
//             formData.append('category', selectedCategory);

//             const response = await fetch('/api/top-category', {
//                 method: 'POST',
//                 body: formData,
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 setMessage('Image uploaded successfully!');
//                 setCategory(true)
//                 setTimeout(() => {
//                     // router.push('/admin/top-categories/manage');
//                 }, 1500);
//             } else {
//                 setMessage(data.error || 'Upload failed');
//             }
//         } catch (error) {
//             setMessage('Upload failed. Please try again.');
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl font-bold text-gray-800">
//                     Upload Top Category Image
//                 </h1>
//                 {/* <a
//                     href="/admin/top-categories/manage"
//                     className="text-blue-500 hover:text-blue-700 text-sm"
//                 >
//                     View All
//                 </a> */}
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* Category Dropdown */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Select Category
//                     </label>
//                     <select
//                         value={selectedCategory}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                         disabled={categoriesLoading}
//                     >
//                         <option value="">Select a category</option>
//                         {categories?.map((cat) => (
//                             <option key={cat.id} value={cat.name}>
//                                 {cat.name}
//                             </option>
//                         ))}
//                     </select>
//                     {categoriesLoading && (
//                         <p className="text-sm text-gray-500 mt-1">Loading categories...</p>
//                     )}
//                 </div>

//                 {/* Image Upload */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Upload Image
//                     </label>
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                         required
//                     />
//                     <p className="text-xs text-gray-500 mt-1">
//                         Supported formats: JPG, PNG, WEBP. Max size: 5MB
//                     </p>
//                 </div>

//                 {/* Image Preview */}
//                 {preview && (
//                     <div className="mt-4">
//                         <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
//                         <div className="relative w-full h-48 border rounded-md overflow-hidden">
//                             <img
//                                 src={preview}
//                                 alt="Preview"
//                                 className="w-full h-full object-cover"
//                             />
//                         </div>
//                     </div>
//                 )}

//                 {/* Submit Button */}
//                 <button
//                     type="submit"
//                     disabled={uploading || categoriesLoading}
//                     className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//                 >
//                     {uploading ? 'Uploading...' : 'Upload Image'}
//                 </button>

//                 {/* Message */}
//                 {message && (
//                     <p
//                         className={`text-sm mt-4 p-2 rounded-md ${message.includes('success')
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                             }`}
//                     >
//                         {message}
//                     </p>
//                 )}
//             </form>
//         </div>
//     );
// }

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Add categories as a prop
export default function TopCategoriesUpload({ setCategory, categories }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    // Function to reset the form
    const resetForm = () => {
        setSelectedCategory('');
        setImage(null);
        setPreview('');
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            if (!file.type.startsWith('image/')) {
                setMessage('Please select an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setMessage('Image size must be less than 5MB');
                return;
            }

            setImage(file);
            setPreview(URL.createObjectURL(file));
            setMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCategory || !image) {
            setMessage('Please select a category and upload an image');
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('category', selectedCategory);

            const response = await fetch('/api/top-category', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Image uploaded successfully!');
                setCategory(true);
                resetForm(); // Reset the form on success
                setTimeout(() => {
                    setMessage("")
                }, 2500);
            } else {
                setMessage(data.error || 'Upload failed');
            }
        } catch (error) {
            setMessage('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-full p-6 bg-white rounded-lg ">
            <div className="flex justify-between items-center mb-6">
                {/* <h1 className="text-2xl font-bold text-gray-800">
                    Upload Top Category Image
                </h1> */}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Category
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories?.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Supported formats: JPG, PNG, WEBP. Max size: 5MB
                    </p>
                </div>

                {/* Image Preview - Only show if there's a preview */}
                {preview && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <div className="relative w-full h-48 border rounded-md overflow-hidden">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                </button>

                {/* Message */}
                {message && (
                    <p
                        className={`text-sm mt-4 p-2 rounded-md ${message.includes('success')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}