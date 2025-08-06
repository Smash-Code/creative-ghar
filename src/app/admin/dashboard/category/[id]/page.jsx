'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCategory } from '@/hooks/useCategory';
import CategoryForm from '@/components/products/categoryForm';

export default function CategoryEditPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { loading, error, createCategory, updateCategory, getAllCategories } = useCategory();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchCategory = async () => {
        try {
          const categories = await getAllCategories();
          const foundCategory = categories.find(cat => cat.id === id);
          if (foundCategory) {
            setCategory(foundCategory);
          }
        } catch (err) {
          console.error('Failed to load category:', err);
        }
      };
      fetchCategory();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      if (id && id !== 'new') {
        await updateCategory(id, formData);
      } else {
        await createCategory(formData);
      }
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Edit Category
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <CategoryForm 
        category={category} 
        onSuccess={handleSubmit}
      />
    </div>
  );
}