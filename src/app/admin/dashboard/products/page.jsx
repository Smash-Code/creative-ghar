'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProductApi } from '@/hooks/useProduct';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default function ProductListPage() {
  const { getAllProducts, deleteProduct } = useProductApi();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts({ page: 1, limit: 20 });
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (!confirm) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/dashboard/product-form?id=${id}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Consistent with other pages */}
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
            <Link 
              href="/dashboard/products/product-form" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </Link>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-gray-500">Get started by adding a new product</p>
              <div className="mt-6">
                <Link
                  href="/dashboard/products/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Product
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={product.images?.[0] || '/no-image.png'}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute w-fit top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      </div>
                      <div className="text-right">
                        {product.discounted_price && product.discounted_price !== product.orignal_price ? (
                          <>
                            <span className="text-lg font-bold text-indigo-600">${product.discounted_price}</span>
                            <span className="ml-1 text-sm text-gray-500 line-through">${product.orignal_price}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">${product.orignal_price}</span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm font-medium"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 flex items-center text-sm font-medium"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}