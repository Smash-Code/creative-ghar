'use client';
import { useState, useEffect } from 'react';
import { useCategory } from '@/hooks/useCategory';
import CategoryForm from '@/components/products/categoryForm';
import Modal from '@/components/ui/Modal';
import ManageTopCategories from '../banner/Banners-Manage';
import Banners from '../banner/Banners'
import TopCategoriesUpload from '../banner/Banners';
import toast, { Toaster } from 'react-hot-toast';

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

    setDeleteLoading(true);
    try {
      await deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
      // Optionally show success message
    } catch (err) {
      // Show the specific error message from the API
      toast.error(err.message);
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
      <Toaster />
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
        </div>
      </Modal>
      <ManageTopCategories hitCategory={category} />
      <TopCategoriesUpload setCategory={setCategory} categories={categories} />
    </div>
  );
}