// // app/admin/dashboard/page.js
// "use client"
// import { useAuth } from '@/app/context/authContext';
// import Loader from '@/components/Loader';
// import { useProductApi } from '@/hooks/useProduct';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';

// export default function Dashboard() {
//   const { getAllProducts, deleteProduct, updateProduct } = useProductApi();
//   const [products, setProducts] = useState([]);
//   const [loadingProduct, setLoading] = useState(false);
//   const { user, loading, logout } = useAuth();
//   const router = useRouter();
//   const [updatingPriority, setUpdatingPriority] = useState(null);

//   useEffect(() => {
//     if (!loading && !user && user?.role != 'admin') {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const res = await getAllProducts({ page: 1, limit: 20 });
//         setProducts(res.data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//       setLoading(false);
//     };

//     fetchProducts();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirm = window.confirm('Are you sure you want to delete this product?');
//     if (!confirm) return;

//     try {
//       await deleteProduct(id);
//       setProducts((prev) => prev.filter((p) => p.id !== id));
//       toast.success('Product Deleted!')
//     } catch (err) {
//       toast.error(err.message || 'Failed to delete');
//     }
//   };

//   const handlePriorityChange = async (productId, newPriority) => {
//     setUpdatingPriority(productId);
//     try {
//       await updateProduct(productId, { priority: parseInt(newPriority) });

//       // Update local state
//       setProducts(prev => prev.map(product =>
//         product.id === productId
//           ? { ...product, priority: parseInt(newPriority) }
//           : product
//       ));

//       toast.success('Priority updated!');
//     } catch (err) {
//       toast.error(err.message || 'Failed to update priority');
//     } finally {
//       setUpdatingPriority(null);
//     }
//   };

//   // Group products by category for priority validation
//   const productsByCategory = products.reduce((acc, product) => {
//     const category = product.category || 'Uncategorized';
//     if (!acc[category]) {
//       acc[category] = [];
//     }
//     acc[category].push(product);
//     return acc;
//   }, {});

//   // Check if a priority is already taken in a category
//   const isPriorityTaken = (category, priority, currentProductId) => {
//     if (!priority || priority === '0') return false;
//     return productsByCategory[category]?.some(
//       product => product.priority === parseInt(priority) && product.id !== currentProductId
//     );
//   };

//   if (loading || !user) {
//     return <Loader />;
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <div className="flex-1 overflow-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
//             <div className="flex space-x-4">
//               <Link
//                 href="/admin/dashboard/product-form"
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//                 Add Product
//               </Link>
//               <Link
//                 href="/admin/dashboard/products"
//                 className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//                 </svg>
//                 Show All Products
//               </Link>
//               <button
//                 onClick={() => logout()}
//                 className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 Logout
//               </button>
//             </div>
//           </div>

//           {loadingProduct ? (
//             <Loader />
//           ) : (
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Image
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Title
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Category
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Price
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Priority
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Stock
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {products.map((item) => (
//                       <tr key={item.id}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex-shrink-0 h-10 w-10">
//                             <img
//                               className="h-10 w-10 rounded object-cover"
//                               src={item.images[0] || '/no-image.png'}
//                               alt={item.title}
//                             />
//                           </div>
//                         </td>
//                         <td className="px-6 cursor-pointer transition-all duration-200 hover:text-blue-500 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {item.title}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {item.category}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           RS {item.orignal_price}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <select
//                             value={item.priority || 0}
//                             onChange={(e) => handlePriorityChange(item.id, e.target.value)}
//                             disabled={updatingPriority === item.id}
//                             className="text-sm border rounded px-2 py-1 border-gray-300"
//                           >
//                             <option value="0">No Priority</option>

//                             {[
//                               { value: 4, label: "Priority 1" },
//                               { value: 3, label: "Priority 2" },
//                               { value: 2, label: "Priority 3" },
//                               { value: 1, label: "Priority 4" },
//                             ]
//                               .filter(
//                                 (opt) =>
//                                   // ✅ Show option if it's not taken OR if it's the current item's priority
//                                   !isPriorityTaken(item.category, opt.value, item.id) || opt.value === item.priority
//                               )
//                               .map((opt) => (
//                                 <option key={opt.value} value={opt.value}>
//                                   {opt.label}
//                                 </option>
//                               ))}
//                           </select>
//                           {updatingPriority === item.id && (
//                             <span className="ml-2 text-xs text-gray-500">Updating...</span>
//                           )}
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {item.stock}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <Link href={`/admin/dashboard/product-form?id=${item.id}`}>
//                             <span className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</span>
//                           </Link>
//                           <button
//                             onClick={() => handleDelete(item.id)}
//                             className="text-red-600 hover:text-red-900"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// app/admin/dashboard/page.js
"use client"
import { useAuth } from '@/app/context/authContext';
import Loader from '@/components/Loader';
import { useProductApi } from '@/hooks/useProduct';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { getAllProducts, deleteProduct, updateProduct } = useProductApi();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingProduct, setLoading] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [updatingPriority, setUpdatingPriority] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (!loading && !user && user?.role != 'admin') {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts({ page: 1, limit: 20 });
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return ['all', ...uniqueCategories].filter(category => category);
  }, [products]);

  // Filter products based on search term and category
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (!confirm) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product Deleted!')
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const handlePriorityChange = async (productId, newPriority) => {
    setUpdatingPriority(productId);
    try {
      await updateProduct(productId, { priority: parseInt(newPriority) });

      // Update local state
      setProducts(prev => prev.map(product =>
        product.id === productId
          ? { ...product, priority: parseInt(newPriority) }
          : product
      ));

      toast.success('Priority updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update priority');
    } finally {
      setUpdatingPriority(null);
    }
  };

  // Group products by category for priority validation
  const productsByCategory = useMemo(() =>
    filteredProducts.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {}),
    [filteredProducts]
  );

  // Check if a priority is already taken in a category
  const isPriorityTaken = (category, priority, currentProductId) => {
    if (!priority || priority === '0') return false;
    return productsByCategory[category]?.some(
      product => product.priority === parseInt(priority) && product.id !== currentProductId
    );
  };

  if (loading || !user) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
            <div className="flex space-x-4">
              <Link
                href="/admin/dashboard/product-form"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </Link>
              <Link
                href="/admin/dashboard/products"
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Show All Products
              </Link>
              <button
                onClick={() => logout()}
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 flex flex-col sm:flex-row items-end justify-between gap-4">
            <div className="relative max-w-[50%]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="w-full sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingProduct ? (
            <Loader />
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded object-cover"
                                src={item.images[0] || '/no-image.png'}
                                alt={item.title}
                              />
                            </div>
                          </td>
                          <td className="px-6 cursor-pointer transition-all duration-200 hover:text-blue-500 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            RS {item.orignal_price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={item.priority || 0}
                              onChange={(e) => handlePriorityChange(item.id, e.target.value)}
                              disabled={updatingPriority === item.id}
                              className="text-sm border rounded px-2 py-1 border-gray-300"
                            >
                              <option value="0">No Priority</option>

                              {[
                                { value: 4, label: "Priority 1" },
                                { value: 3, label: "Priority 2" },
                                { value: 2, label: "Priority 3" },
                                { value: 1, label: "Priority 4" },
                              ]
                                .filter(
                                  (opt) =>
                                    // ✅ Show option if it's not taken OR if it's the current item's priority
                                    !isPriorityTaken(item.category, opt.value, item.id) || opt.value === item.priority
                                )
                                .map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                            </select>
                            {updatingPriority === item.id && (
                              <span className="ml-2 text-xs text-gray-500">Updating...</span>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link href={`/admin/dashboard/product-form?id=${item.id}`}>
                              <span className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</span>
                            </Link>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                          No products found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}