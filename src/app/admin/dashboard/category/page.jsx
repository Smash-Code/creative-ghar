// 'use client';
// import { useState, useEffect } from 'react';
// import { useCategory } from '@/hooks/useCategory';
// import CategoryForm from '@/components/products/categoryForm';
// import Modal from '@/components/ui/Modal';
// import ManageTopCategories from '../banner/Banners-Manage';
// import Banners from '../banner/Banners'
// import TopCategoriesUpload from '../banner/Banners';
// import toast, { Toaster } from 'react-hot-toast';

// export default function CategoriesPage() {
//   const { loading, error, getAllCategories, deleteCategory, createCategory, updateCategory } = useCategory();
//   const [categories, setCategories] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [formLoading, setFormLoading] = useState(false);
//   const [category, setCategory] = useState(false);


//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const data = await getAllCategories();
//         setCategories(data);
//       } catch (err) {
//         console.error('Failed to load categories:', err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this category?')) return;

//     setDeleteLoading(true);
//     try {
//       await deleteCategory(id);
//       setCategories(categories.filter(cat => cat.id !== id));
//       // Optionally show success message
//     } catch (err) {
//       // Show the specific error message from the API
//       toast.error(err.message);
//       console.error('Failed to delete category:', err);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleEdit = (category) => {
//     setCurrentCategory(category);
//     setIsModalOpen(true);
//   };

//   const handleNewCategory = () => {
//     setCurrentCategory(null);
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (formData) => {
//     // setFormLoading(true);
//     try {
//       if (currentCategory) {
//         await updateCategory(currentCategory.id, formData);
//       } else {
//         await createCategory(formData);
//       }
//       // Refresh the list
//       const data = await getAllCategories();
//       setCategories(data);
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error('Failed to save category:', err);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <Toaster />
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Categories</h1>
//         <button
//           onClick={handleNewCategory}
//           className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//         >
//           Add New Category
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {/* {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//       ) : ( */}
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {categories.map((category) => (
//               <tr key={category.id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   {category.name}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button
//                     onClick={() => handleEdit(category)}
//                     className="text-indigo-600 hover:text-indigo-900 mr-3"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(category.id)}
//                     disabled={deleteLoading}
//                     className="text-red-600 hover:text-red-900 disabled:opacity-50"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* )} */}

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <div className="p-6">
//           <h2 className="text-xl font-bold mb-4">
//             {currentCategory ? 'Edit Category' : 'Create New Category'}
//           </h2>

//           <CategoryForm
//             category={currentCategory}
//             onSuccess={handleSubmit}
//             isLoading={formLoading}
//             setModal={setIsModalOpen}
//             id="category-form" // Add this to your CategoryForm component
//           />
//         </div>
//       </Modal>
//       <ManageTopCategories hitCategory={category} />
//       <TopCategoriesUpload setCategory={setCategory} categories={categories} />
//     </div>
//   );
// }













// 'use client';
// import { useState, useEffect } from 'react';
// import { useCategory } from '@/hooks/useCategory';
// import CategoryForm from '@/components/products/categoryForm';
// import Modal from '@/components/ui/Modal';
// import ManageTopCategories from '../banner/Banners-Manage';
// import Banners from '../banner/Banners';
// import TopCategoriesUpload from '../banner/Banners';
// import toast, { Toaster } from 'react-hot-toast';
// import ConfirmationModal from '@/components/modals/DeleteModal';

// // 1. Import your custom confirmation modal component

// export default function CategoriesPage() {
//   const { loading, error, getAllCategories, deleteCategory, createCategory, updateCategory } = useCategory();
//   const [categories, setCategories] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [formLoading, setFormLoading] = useState(false);
//   const [category, setCategory] = useState(false);

//   // 2. Add state for the confirmation modal
//   const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
//   const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const data = await getAllCategories();
//         setCategories(data);
//       } catch (err) {
//         console.error('Failed to load categories:', err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // 3. New function to open the confirmation modal
//   const handleInitiateDelete = (id) => {
//     setCategoryIdToDelete(id);
//     setIsConfirmationModalOpen(true);
//   };

//   // 4. The actual delete function, now called from the modal
//   const handleDelete = async () => {
//     if (!categoryIdToDelete) return; // Guard clause

//     setIsConfirmationModalOpen(false); // Close the modal first
//     setDeleteLoading(true);

//     try {
//       await deleteCategory(categoryIdToDelete);
//       setCategories(categories.filter(cat => cat.id !== categoryIdToDelete));
//       toast.success('Category deleted successfully!');
//     } catch (err) {
//       toast.error(err.message || 'Failed to delete category.');
//       console.error('Failed to delete category:', err);
//     } finally {
//       setDeleteLoading(false);
//       setCategoryIdToDelete(null); // Reset the ID
//     }
//   };

//   const handleEdit = (category) => {
//     setCurrentCategory(category);
//     setIsModalOpen(true);
//   };

//   const handleNewCategory = () => {
//     setCurrentCategory(null);
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (formData) => {
//     setFormLoading(true);
//     try {
//       if (currentCategory) {
//         await updateCategory(currentCategory.id, formData);
//         toast.success('Category updated successfully!');
//       } else {
//         await createCategory(formData);
//         toast.success('Category created successfully!');
//       }
//       const data = await getAllCategories();
//       setCategories(data);
//       setIsModalOpen(false);
//     } catch (err) {
//       toast.error(err.message || 'Failed to save category.');
//       console.error('Failed to save category:', err);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <Toaster />
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Categories</h1>
//         <button
//           onClick={handleNewCategory}
//           className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//         >
//           Add New Category
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {categories.map((category) => (
//               <tr key={category.id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   {category.name}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button
//                     onClick={() => handleEdit(category)}
//                     className="text-indigo-600 hover:text-indigo-900 mr-3"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     // 5. Update the button to use the new handleInitiateDelete function
//                     onClick={() => handleInitiateDelete(category.id)}
//                     disabled={deleteLoading}
//                     className="text-red-600 hover:text-red-900 disabled:opacity-50"
//                   >
//                     {deleteLoading ? 'Deleting...' : 'Delete'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <div className="p-6">
//           <h2 className="text-xl font-bold mb-4">
//             {currentCategory ? 'Edit Category' : 'Create New Category'}
//           </h2>
//           <CategoryForm
//             category={currentCategory}
//             onSuccess={handleSubmit}
//             isLoading={formLoading}
//             setModal={setIsModalOpen}
//             id="category-form"
//           />
//         </div>
//       </Modal>

//       {/* 6. Render the Confirmation Modal here */}
//       {
//         isConfirmationModalOpen &&
//         <ConfirmationModal
//           isOpen={isConfirmationModalOpen}
//           onClose={() => setIsConfirmationModalOpen(false)}
//           onConfirm={handleDelete}
//           title="Confirm Deletion"
//           message={`Are you sure you want to delete the category? This action cannot be undone.`}
//         />
//       }

//       <ManageTopCategories hitCategory={category} />
//       <TopCategoriesUpload setCategory={setCategory} categories={categories} />
//     </div>
//   );
// }
















'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCategory } from '@/hooks/useCategory';
import CategoryForm from '@/components/products/categoryForm';
import Modal from '@/components/ui/Modal';
import ManageTopCategories from '../banner/Banners-Manage';
import TopCategoriesUpload from '../banner/Banners';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmationModal from '@/components/modals/DeleteModal';
import { Plus, Edit3, Trash2, Grid, Table, Search, LayoutGrid } from 'lucide-react';
import Loader from '@/components/Loader';

export default function CategoriesPage() {
  const { loading, error, getAllCategories, deleteCategory, createCategory, updateCategory } = useCategory();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [category, setCategory] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

  // Memoized fetch function to prevent infinite re-renders
  const fetchCategories = useCallback(async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  // Fetch categories only once on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInitiateDelete = useCallback((id) => {
    setCategoryIdToDelete(id);
    setIsConfirmationModalOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!categoryIdToDelete) return;

    setIsConfirmationModalOpen(false);
    setDeleteLoading(true);

    try {
      await deleteCategory(categoryIdToDelete);
      setCategories(prev => prev.filter(cat => cat.id !== categoryIdToDelete));
      toast.success('Category deleted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to delete category.');
      console.error('Failed to delete category:', err);
    } finally {
      setDeleteLoading(false);
      setCategoryIdToDelete(null);
    }
  }, [categoryIdToDelete, deleteCategory]);

  const handleEdit = useCallback((category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  }, []);

  const handleNewCategory = useCallback(() => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  }, []);

  const handleSubmit = useCallback(async (formData) => {
    setFormLoading(true);
    try {
      if (currentCategory) {
        await updateCategory(currentCategory.id, formData);
        toast.success('Category updated successfully!');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully!');
      }
      // Refetch categories after successful operation
      fetchCategories();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save category.');
      console.error('Failed to save category:', err);
    } finally {
      setFormLoading(false);
    }
  }, [currentCategory, createCategory, updateCategory]);

  // Memoized filtered categories to prevent unnecessary recalculations
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);
  useEffect(() => {
    console.log('modal view')
  }, [isConfirmationModalOpen])


  // Loading state
  if (loading) {
    return (
      <Loader />
    );
  }



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product categories</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-200 rounded-md p-1 relative ">
            {/* Sliding background */}
            <div
              className={`absolute top-1 bottom-1 rounded-md bg-white shadow transition-all duration-300 ease-in-out ${viewMode === 'grid' ? 'left-1 w-[36px]' : 'left-[40px] w-[36px]'
                }`}
            />

            <button
              aria-label='Stat'
              onClick={() => setViewMode('grid')}
              className={`p-2 relative z-10 rounded-md cursor-pointer transition-colors duration-200 ${viewMode === 'grid' ? ' ' : ' hover:text-gray-700'
                }`}
            >
              <LayoutGrid size={20} />
            </button>

            <button
              aria-label='Stat'
              onClick={() => setViewMode('table')}
              className={`p-2 relative z-10 rounded-md cursor-pointer transition-colors duration-200 ${viewMode === 'table' ? ' ' : ' hover:text-gray-700'
                }`}
            >
              <Table size={20} />
            </button>
          </div>

          <button
            aria-label='Stat'
            onClick={handleNewCategory}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Categories Content */}
      {viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <div className="flex gap-2">
                  <button
                    aria-label='Stat'
                    onClick={() => handleEdit(category)}
                    className="cursor-pointer text-indigo-500 hover:text-indigo-700 p-1 rounded-md bg-indigo-100 hover:bg-indigo-200 transition-colors"
                    title="Edit category"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    aria-label='Stat'
                    onClick={() => handleInitiateDelete(category.id)}
                    disabled={deleteLoading}
                    className="cursor-pointer bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded-md transition-colors disabled:opacity-50"
                    title="Delete category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                <p>ID: {category.id}</p>
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search term' : 'Get started by creating a new category'}
              </p>
            </div>
          )}
        </div>
      ) : (
        // Table View
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        aria-label='Stat'
                        onClick={() => handleEdit(category)}
                        className="text-indigo-500 cursor-pointer bg-indigo-100 px-[10px] rounded hover:text-indigo-700 flex items-center gap-1"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleInitiateDelete(category.id)}
                        disabled={deleteLoading}
                        className="p-2 cursor-pointer rounded bg-red-100 hover:bg-red-200 text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
                        </svg>
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search term' : 'Get started by creating a new category'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Top Categories Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className='pl-6' >
            <h2 className="text-xl font-semibold text-gray-800">Top Categories</h2>
            <p className="text-sm text-gray-500 mt-1">Manage featured categories displayed on your homepage</p>
          </div>
        </div>

        <TopCategoriesUpload setCategory={setCategory} categories={categories} />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <ManageTopCategories hitCategory={category} />
      </div>

      {/* Category Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {currentCategory ? 'Edit Category' : 'Create New Category'}
          </h2>
          <CategoryForm
            category={currentCategory}
            onSuccess={handleSubmit}
            isLoading={formLoading}
            setModal={setIsModalOpen}
            id="category-form"
          />
        </div>
      </Modal>

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onCancel={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this category? This action cannot be undone."
        />
      )}
    </div>
  );
}