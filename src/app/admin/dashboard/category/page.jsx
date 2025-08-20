// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { useCategory } from '@/hooks/useCategory';
// import CategoryForm from '@/components/products/categoryForm';
// import Link from 'next/link';

// export default function CategoryEditPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { id } = params;
//   const { loading, error, createCategory, updateCategory, getAllCategories } = useCategory();
//   const [category, setCategory] = useState(null);

//   useEffect(() => {
//     if (id && id !== 'new') {
//       const fetchCategory = async () => {
//         try {
//           const categories = await getAllCategories();
//           const foundCategory = categories.find(cat => cat.id === id);
//           if (foundCategory) {
//             setCategory(foundCategory);
//           }
//         } catch (err) {
//           console.error('Failed to load category:', err);
//         }
//       };
//       fetchCategory();
//     }
//   }, [id]);

//   const handleSubmit = async (formData) => {
//     try {
//       if (id && id !== 'new') {
//         await updateCategory(id, formData);
//       } else {
//         await createCategory(formData);
//       }
//     } catch (err) {
//       console.error('Failed to save category:', err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className='flex gap-8' >
//         <h1 className="text-2xl font-bold mb-6">
//           Add New Category
//         </h1>
//         <Link href="/admin/dashboard/category/list" >
//           <button 
//             className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//             All Categories
//           </button>
//         </Link>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <CategoryForm 
//         category={category} 
//         onSuccess={handleSubmit}
//       />
//     </div>
//   );
// }



'use client';
import { useState, useEffect } from 'react';
import { useCategory } from '@/hooks/useCategory';
import CategoryForm from '@/components/products/categoryForm';
import Modal from '@/components/ui/Modal';
import ManageTopCategories from '../banner/Banners-Manage';
import Banners from '../banner/Banners'
// import Modal from '@/components/ui/modal'; // You'll need to create or import a Modal component

export default function CategoriesPage() {
  const { loading, error, getAllCategories, deleteCategory, createCategory, updateCategory } = useCategory();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [category, setCategory] = useState(false);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    // setDeleteLoading(true);
    try {
      await deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Failed to delete category:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleNewCategory = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    // setFormLoading(true);
    try {
      if (currentCategory) {
        await updateCategory(currentCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      // Refresh the list
      const data = await getAllCategories();
      setCategories(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save category:', err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={handleNewCategory}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add New Category
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : ( */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={deleteLoading}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* )} */}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {currentCategory ? 'Edit Category' : 'Create New Category'}
          </h2>

          <CategoryForm
            category={currentCategory}
            onSuccess={handleSubmit}
            isLoading={formLoading}
            setModal={setIsModalOpen}
            id="category-form" // Add this to your CategoryForm component
          />

          {/* <div className="mt-4 flex justify-end space-x-3">
      <button
        onClick={() => setIsModalOpen(false)}
        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="category-form"
        disabled={formLoading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {formLoading ? 'Saving...' : currentCategory ? 'Update' : 'Create'}
      </button>
    </div> */}
        </div>
      </Modal>
      <ManageTopCategories hitCategory={category} />
      <Banners setCategory={setCategory} />
    </div>
  );
}