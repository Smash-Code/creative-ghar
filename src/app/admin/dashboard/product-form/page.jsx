// 'use client';

// import { Suspense, useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// // import { useProductApi } from '@/hooks/useProductApi';
// import Link from 'next/link';
// import { useProductApi } from '@/hooks/useProduct';
// import Sidebar from '@/components/Sidebar';

//  function ProductFormPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const productId = searchParams.get('id');

//   const { getProductById, createProduct, updateProduct ,deleteProduct } = useProductApi();

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     orignal_price: '',
//     discounted_price: '',
//     stock: '',
//     estimated_delivery_time: '',
//     return_or_exchange_time: '',
//     category: '',
//     images: [''],
//   });

//   const [loading, setLoading] = useState(false);
//   const isEdit = !!productId;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };


//   useEffect(() => {
//     if (productId) {
//       (async () => {
//         setLoading(true);
//         try {
//           const res = await getProductById(productId);
//           setFormData({ ...res.data });
//         } catch (error) {
//           console.error('Failed to load product:', error);
//         }
//         setLoading(false);
//       })();
//     }
//   }, [productId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (isEdit) {
//         await updateProduct(productId, formData);
//         alert('Product updated!');
//       } else {
//         await createProduct({
//           ...formData,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//         alert('Product created!');
//       }
//       router.push('/admin/dashboard/products');
//     } catch (err) {
//       alert(err.message || 'Something went wrong.');
//     }
//     setLoading(false);
//   };


//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar - Same as dashboard */}
//       <Sidebar />


//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">
//               {isEdit ? 'Edit Product' : 'Add New Product'}
//             </h2>
//             <Link 
//               href="/admin/dashboard/products" 
//               className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Back to Products
//             </Link>
//           </div>

//           {/* Form */}
//           <div className="bg-white rounded-lg shadow overflow-hidden p-6">
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-6">
                // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                //   <div>
                //     <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                //     <input
                //       name="title"
                //       value={formData.title}
                //       onChange={handleChange}
                //       placeholder="Enter product title"
                //       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                //       required
                //     />
                //   </div>

                //   <div>
                //     <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                //     <input
                //       name="category"
                //       value={formData.category}
                //       onChange={handleChange}
                //       placeholder="Enter category"
                //       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                //       required
                //     />
                //   </div>

                //   <div>
                //     <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                //     <input
                //       name="orignal_price"
                //       value={formData.orignal_price}
                //       onChange={handleChange}
                //       placeholder="Enter original price"
                //       type="number"
                //       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                //       required
                //     />
                //   </div>

                //   <div>
                //     <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price</label>
                //     <input
                //       name="discounted_price"
                //       value={formData.discounted_price}
                //       onChange={handleChange}
                //       placeholder="Enter discounted price"
                //       type="number"
                //       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                //     />
                //   </div>

                //   <div>
                //     <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                //     <input
                //       name="stock"
                //       value={formData.stock}
                //       onChange={handleChange}
                //       placeholder="Enter stock quantity"
                //       type="number"
                //       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                //       required
                //     />
                //   </div>

                //   <div>
                //     <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Time</label>
                //     <input
                //       name="estimated_delivery_time"
                //       value={formData.estimated_delivery_time}
                //       onChange={handleChange}
                //       placeholder="e.g. 3-5 business days"
                //       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                //     />
                //   </div>

                //   <div>
                //     <label className="block text-sm font-medium text-gray-700 mb-1">Return/Exchange Time (days)</label>
                //     <input
                //       name="return_or_exchange_time"
                //       value={formData.return_or_exchange_time}
                //       onChange={handleChange}
                //       placeholder="Enter return/exchange period"
                //       type="number"
                //       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                //     />
                //   </div>

                //   <div>
                //     <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                //     <input
                //       name="images"
                //       value={formData.images[0]}
                //       onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                //       placeholder="Enter image URL"
                //       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                //     />
                //   </div>

                //   <div className="md:col-span-2">
                //     <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                //     <textarea
                //       name="description"
                //       value={formData.description}
                //       onChange={handleChange}
                //       placeholder="Enter detailed product description"
                //       rows={4}
                //       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                //       required
                //     />
                //   </div>
                // </div>

                // <div className="flex justify-end space-x-4 pt-4">
                //   <button
                //     type="button"
                //     onClick={() => router.push('/dashboard/products')}
                //     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                //   >
                //     Cancel
                //   </button>
                //   <button
                //     type="submit"
                //     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                //     disabled={loading}
                //   >
                //     {loading ? (
                //       <span className="flex items-center">
                //         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                //           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                //           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                //         </svg>
                //         Processing...
                //       </span>
                //     ) : isEdit ? (
                //       'Update Product'
                //     ) : (
                //       'Create Product'
                //     )}
                //   </button>
                // </div>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// export default function page(){
//   return(
//     <Suspense fallback={
//     <div className="flex justify-center items-center h-64">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//     </div>
//     }>
//       <ProductFormPage/>
//     </Suspense>
//   )
// } 




'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProductApi } from '@/hooks/useProduct';
import Sidebar from '@/components/Sidebar';

function ProductFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const { getProductById, createProduct, updateProduct, deleteProduct } = useProductApi();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    orignal_price: '',
    discounted_price: '',
    stock: '',
    estimated_delivery_time: '',
    return_or_exchange_time: '',
    category: '',
    images: [],
  });

  const [loading, setLoading] = useState(false);
const [uploadProgress, setUploadProgress] = useState({});
  const [uploading , setUploading] = useState(false)
  const MAX_IMAGES = 5;

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check total images won't exceed limit
    if (formData.images.length + files.length > MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images total`);
      return;
    }

    setUploading(true);
    setUploadProgress({});
    
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await fetch('/api/product/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      // Add new images to existing ones
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...data.images.map(img => img.url)].filter(Boolean)
      }));
    } catch (error) {
      alert('Image upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  const isEdit = !!productId;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  useEffect(() => {
    if (productId) {
      (async () => {
        setLoading(true);
        try {
          const res = await getProductById(productId);
          setFormData({ ...res.data });
        } catch (error) {
          console.error('Failed to load product:', error);
        }
        setLoading(false);
      })();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateProduct(productId, formData);
        alert('Product updated!');
      } else {
        await createProduct({
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        alert('Product created!');
      }
      router.push('/admin/dashboard/products');
    } catch (err) {
      alert(err.message || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <Link 
              href="/admin/dashboard/products" 
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Products
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Images ({formData.images.length}/{MAX_IMAGES})
                    </label>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      { formData.images.length > 0 && formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img} 
                            alt={`Product preview ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      
                      {formData.images.length < MAX_IMAGES && (
                        <label className="cursor-pointer">
                          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center hover:bg-gray-50">
                            {uploading ? (
                              <div className="text-center">
                                <svg className="animate-spin mx-auto h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-xs mt-1">Uploading...</span>
                              </div>
                            ) : (
                              <>
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-xs mt-1">Add Image</span>
                              </>
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageUpload}
                              className="hidden"
                              multiple
                              disabled={uploading || formData.images.length >= MAX_IMAGES}
                            />
                          </div>
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Upload up to {MAX_IMAGES} images (JPG, PNG up to 5MB each)
                    </p>
                  </div>
      
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter product title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Enter category"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                    <input
                      name="orignal_price"
                      value={formData.orignal_price}
                      onChange={handleChange}
                      placeholder="Enter original price"
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price</label>
                    <input
                      name="discounted_price"
                      value={formData.discounted_price}
                      onChange={handleChange}
                      placeholder="Enter discounted price"
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="Enter stock quantity"
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Time</label>
                    <input
                      name="estimated_delivery_time"
                      value={formData.estimated_delivery_time}
                      onChange={handleChange}
                      placeholder="e.g. 3-5 business days"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return/Exchange Time (days)</label>
                    <input
                      name="return_or_exchange_time"
                      value={formData.return_or_exchange_time}
                      onChange={handleChange}
                      placeholder="Enter return/exchange period"
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      name="images"
                      value={formData.images[0]}
                      onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                      placeholder="Enter image URL"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div> */}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter detailed product description"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard/products')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : isEdit ? (
                      'Update Product'
                    ) : (
                      'Create Product'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <ProductFormPage/>
    </Suspense>
  );
}