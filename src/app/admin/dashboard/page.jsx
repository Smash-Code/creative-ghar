// // app/admin/dashboard/page.js
// "use client"
// import { useAuth } from '@/app/context/authContext';
// import Loader from '@/components/Loader';
// import { useProductApi } from '@/hooks/useProduct';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState, useMemo } from 'react';
// import toast from 'react-hot-toast';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// export default function Dashboard() {
//   const { getAllProducts, deleteProduct, updateProduct } = useProductApi();
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loadingProduct, setLoading] = useState(false);
//   const { user, loading, logout } = useAuth();
//   const router = useRouter();
//   const [updatingPriority, setUpdatingPriority] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   useEffect(() => {
//     if (!loading && !user && user?.role != 'admin') {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const res = await getAllProducts({ page: 1, limit: 1000 }); // Increased limit to get all products
//         setProducts(res.data);
//         setFilteredProducts(res.data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//       setLoading(false);
//     };

//     fetchProducts();
//   }, []);

//   // Get unique categories for filter dropdown
//   const categories = useMemo(() => {
//     const uniqueCategories = [...new Set(products.map(product => product.category))];
//     return ['all', ...uniqueCategories].filter(category => category);
//   }, [products]);

//   // Filter products based on search term and category
//   useEffect(() => {
//     let filtered = products;

//     // Filter by search term
//     if (searchTerm) {
//       filtered = filtered.filter(product =>
//         product.title.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Filter by category
//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(product => product.category === selectedCategory);
//     }

//     setFilteredProducts(filtered);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [searchTerm, selectedCategory, products]);

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };
//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

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
//   const productsByCategory = useMemo(() =>
//     filteredProducts.reduce((acc, product) => {
//       const category = product.category || 'Uncategorized';
//       if (!acc[category]) {
//         acc[category] = [];
//       }
//       acc[category].push(product);
//       return acc;
//     }, {}),
//     [filteredProducts]
//   );

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
//     <div className="flex h-screen bg-gray-100">
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


//           <div className='p-[20px] rounded-xl bg-white' >


//             {/* Search and Filter Section */}
//             <div className="mb-6  flex flex-col sm:flex-row items-end justify-between gap-4">
//               <div className="bg-[#F0F5F7] rounded-[6px] py-1 relative max-w-[50%]">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search products by title..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-13 pr-4 py-2 text-sm rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               <div className="w-full sm:w-38 bg-[#F0F5F7] px-2 rounded-md">
//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                   className="w-full py-2 text-gray-400 focus:outline-none focus:ring-0"
//                 >
//                   <option className='border-x-[1px] border-0 border-gray-400 outline-0 ring-0' value="all">All Categories</option>
//                   {categories.filter(cat => cat !== 'all').map((category) => (
//                     <option className='border-x-[1px] border-gray-400 outline-0 ring-0' key={category} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Products Count and Pagination Info */}
//             {/* <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center mb-4">
//             <div className="text-sm text-gray-600">
//               Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
//             </div>
//             {totalPages > 1 && (
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={prevPage}
//                   disabled={currentPage === 1}
//                   className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//                 >
//                   <ChevronLeft size={16} />
//                 </button>

//                 <span className="text-sm text-gray-600">
//                   Page {currentPage} of {totalPages}
//                 </span>

//                 <button
//                   onClick={nextPage}
//                   disabled={currentPage === totalPages}
//                   className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//                 >
//                   <ChevronRight size={16} />
//                 </button>
//               </div>
//             )}
//            </div> */}

//             {loadingProduct ? (
//               <Loader />
//             ) : (
//               <div className="bg-white rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y border-x-0 divide-gray-200">
//                     <thead className="bg-indigo-50 ">
//                       <tr className='h-[70px] rounded-t-xl ' >
//                         <th scope="col" className="px-6 py-3 text-left text-xs text-indigo-500 font-semibold uppercase tracking-wider">
//                           Product
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs text-indigo-500 font-semibold uppercase tracking-wider">
//                           Priority
//                         </th>
//                         {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Category
//                       </th> */}
//                         {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Price
//                       </th> */}
//                         {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Priority
//                       </th> */}
//                         {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Stock
//                       </th> */}
//                         <th scope="col" className="px-6 py-3 text-left text-xs text-indigo-500 font-semibold uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {currentProducts.length > 0 ? (
//                         currentProducts.map((item) => (
//                           <tr key={item.id} className="hover:bg-gray-50 transition">

//                             {/* Title + Image */}
//                             <td className="px-6 py-4">
//                               <div className="flex items-center">
//                                 <img
//                                   src={item.images[0] || '/no-image.png'}
//                                   alt={item.title}
//                                   className="h-12 w-12 rounded-md object-cover mr-3"
//                                 />
//                                 <div>
//                                   <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
//                                   <div className="flex items-center text-xs text-gray-500 space-x-3 mt-1">
//                                     <span className="flex items-center">
//                                       <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M4 7V4h16v3M4 7v13h16V7M9 11h6" />
//                                       </svg>
//                                       {item.category}
//                                     </span>
//                                     <span className="flex items-center gap-1">
//                                       <div className='text-[6px] font-bold rounded-full border-2 text-gray-400 border-gray-400 p-[2px]' >Rs</div>
//                                       {item.orignal_price}
//                                     </span>
//                                     <span className="flex items-center">
//                                       <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                                       </svg>
//                                       Stock: {item.stock}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>

//                             {/* Priority */}
//                             <td className="px-6 py-4 whitespace-nowrap text-sm">
//                               <select
//                                 value={item.priority || 0}
//                                 onChange={(e) => handlePriorityChange(item.id, e.target.value)}
//                                 disabled={updatingPriority === item.id}
//                                 className="text-sm border rounded px-2 py-1 border-gray-300"
//                               >
//                                 <option value="0">No Priority</option>
//                                 {[
//                                   { value: 4, label: "Priority 1" },
//                                   { value: 3, label: "Priority 2" },
//                                   { value: 2, label: "Priority 3" },
//                                   { value: 1, label: "Priority 4" },
//                                 ]
//                                   .filter(
//                                     (opt) =>
//                                       !isPriorityTaken(item.category, opt.value, item.id) ||
//                                       opt.value === item.priority
//                                   )
//                                   .map((opt) => (
//                                     <option key={opt.value} value={opt.value}>
//                                       {opt.label}
//                                     </option>
//                                   ))}
//                               </select>
//                               {updatingPriority === item.id && (
//                                 <span className="ml-2 text-xs text-gray-500">Updating...</span>
//                               )}
//                             </td>

//                             {/* Status */}
//                             {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
//                             <span className="text-green-600 font-medium">Active</span>
//                           </td> */}

//                             {/* Actions */}
//                             <td className="px-6  whitespace-nowrap text-sm font-medium flex items-center justify-center pt-[30px] space-x-3">
//                               <Link
//                                 href={`/admin/dashboard/product-form?id=${item.id}`}
//                                 className="p-2 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
//                               >
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 3.732z" />
//                                 </svg>
//                               </Link>
//                               <button
//                                 onClick={() => handleDelete(item.id)}
//                                 className="p-2 cursor-pointer rounded bg-red-100 hover:bg-red-200 text-red-600"
//                               >
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
//                                 </svg>
//                               </button>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
//                             No products found matching your criteria.
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>

//                     {/* <tbody className="bg-white divide-y divide-gray-200">
//                     {currentProducts.length > 0 ? (
//                       currentProducts.map((item) => (
//                         <tr key={item.id}>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex-shrink-0 h-10 w-10">
//                               <img
//                                 className="h-10 w-10 rounded object-cover"
//                                 src={item.images[0] || '/no-image.png'}
//                                 alt={item.title}
//                               />
//                             </div>
//                           </td>
//                           <td className="px-6 cursor-pointer transition-all duration-200 hover:text-blue-500 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {item.title}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {item.category}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             RS {item.orignal_price}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <select
//                               value={item.priority || 0}
//                               onChange={(e) => handlePriorityChange(item.id, e.target.value)}
//                               disabled={updatingPriority === item.id}
//                               className="text-sm border rounded px-2 py-1 border-gray-300"
//                             >
//                               <option value="0">No Priority</option>

//                               {[
//                                 { value: 4, label: "Priority 1" },
//                                 { value: 3, label: "Priority 2" },
//                                 { value: 2, label: "Priority 3" },
//                                 { value: 1, label: "Priority 4" },
//                               ]
//                                 .filter(
//                                   (opt) =>
//                                     // ✅ Show option if it's not taken OR if it's the current item's priority
//                                     !isPriorityTaken(item.category, opt.value, item.id) || opt.value === item.priority
//                                 )
//                                 .map((opt) => (
//                                   <option key={opt.value} value={opt.value}>
//                                     {opt.label}
//                                   </option>
//                                 ))}
//                             </select>
//                             {updatingPriority === item.id && (
//                               <span className="ml-2 text-xs text-gray-500">Updating...</span>
//                             )}
//                           </td>

//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {item.stock}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                             <Link href={`/admin/dashboard/product-form?id=${item.id}`}>
//                               <span className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</span>
//                             </Link>
//                             <button
//                               onClick={() => handleDelete(item.id)}
//                               className="text-red-600 hover:text-red-900"
//                             >
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
//                           No products found matching your criteria.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody> */}
//                   </table>
//                 </div>



//                 {/* Pagination Controls */}
//                 {totalPages > 1 && (
//                   <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
//                     <div className="text-sm text-gray-600">
//                       Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={prevPage}
//                         disabled={currentPage === 1}
//                         className="px-3 py-1 cursor-pointer rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center"
//                       >
//                         <ChevronLeft size={16} className="mr-1" />
//                         Previous
//                       </button>

//                       <div className="flex space-x-1">
//                         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                           <button
//                             key={page}
//                             onClick={() => paginate(page)}
//                             className={`px-3 py-1 rounded-md border ${currentPage === page
//                               ? 'bg-indigo-500 text-white border-indigo-500'
//                               : 'border-gray-300 hover:bg-gray-100'
//                               }`}
//                           >
//                             {page}
//                           </button>
//                         ))}
//                       </div>

//                       <button
//                         onClick={nextPage}
//                         disabled={currentPage === totalPages}
//                         className="px-3 cursor-pointer py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center"
//                       >
//                         Next
//                         <ChevronRight size={16} className="ml-1" />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }






'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProductApi } from '@/hooks/useProduct';
import { useOrder } from '@/hooks/useOrder';
import { useAuth } from '@/app/context/authContext';
import Link from 'next/link';
import OrderModal from '@/components/modals/orderModal';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { ChevronLeft, ChevronRight, Grid, Table, LogOut, LayoutGrid } from 'lucide-react';

export default function ProductManagementPage() {
  const { getAllProducts, deleteProduct, updateProduct } = useProductApi();
  const { createOrder, loading: orderLoading } = useOrder();
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentOrderingProduct, setCurrentOrderingProduct] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatingPriority, setUpdatingPriority] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Pagination states (for table view)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user && user?.role !== 'admin') {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts({ page: 1, limit: 1000 });
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    if (user) {
      fetchProducts();
    }
  }, [user]);

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
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, products]);

  // Pagination logic for table view
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Product actions
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (!confirm) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product Deleted!');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/dashboard/product-form?id=${id}`);
  };

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setShowOrderModal(true);
  };

  const handleOrderSuccess = () => {
    toast.success('Order placed successfully!');
  };

  const handleOrder = async (productId) => {
    setCurrentOrderingProduct(productId);
    try {
      // In a real app, you'd get the userId from auth context
      const userId = 'current-user-id';
      const product = products.find(p => p.id === productId);

      await createOrder({
        productId,
        userId,
        quantity: 1, // Default quantity
        totalPrice: product.discounted_price || product.orignal_price
      });

      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setCurrentOrderingProduct(null);
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

  if (authLoading || !user) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {viewMode === 'grid' ? 'All Products' : 'Products Management'}
            </h2>
            <div className="flex space-x-4 items-center">
              {/* View Toggle */}
              <div className="flex bg-gray-200 rounded-md p-1 relative ">
                {/* Sliding background */}
                <div
                  className={`absolute top-1 bottom-1 rounded-md bg-white shadow transition-all duration-300 ease-in-out ${viewMode === 'grid' ? 'left-1 w-[36px]' : 'left-[40px] w-[36px]'
                    }`}
                />

                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 relative z-10 rounded-md cursor-pointer transition-colors duration-200 ${viewMode === 'grid' ? ' ' : ' hover:text-gray-700'
                    }`}
                >
                  <LayoutGrid size={20} />
                </button>

                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 relative z-10 rounded-md cursor-pointer transition-colors duration-200 ${viewMode === 'table' ? ' ' : ' hover:text-gray-700'
                    }`}
                >
                  <Table size={20} />
                </button>
              </div>
              <Link
                href="/admin/dashboard/product-form"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </Link>
              <button
                onClick={() => logout()}
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 p-5 rounded-xl bg-white flex flex-col sm:flex-row items-end justify-between gap-4">
            <div className="bg-[#F0F5F7] rounded-[6px] py-1 relative w-full sm:max-w-[50%]">
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
                className="pl-13 pr-4 py-2 text-sm rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-transparent"
              />
            </div>

            <div className="w-full sm:w-38 bg-[#F0F5F7] px-2 rounded-md">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 text-gray-600 focus:outline-none focus:ring-0 bg-transparent"
              >
                <option className='border-x-[1px] border-0 border-gray-400 outline-0 ring-0' value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map((category) => (
                  <option className='border-x-[1px] border-gray-400 outline-0 ring-0' key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-gray-500">Get started by adding a new product</p>
              <div className="mt-6">
                <Link
                  href="/admin/dashboard/product-form"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Product
                </Link>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                  <div className="p-4">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                        </div>
                        <div className="text-right">
                          {product.discounted_price && product.discounted_price !== product.orignal_price ? (
                            <>
                              <span className="text-lg font-bold text-indigo-600">RS{product.discounted_price}</span>
                              <span className="ml-1 text-sm text-gray-500 line-through">RS{product.orignal_price}</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">RS{product.orignal_price}</span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                    </div>

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

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOrderClick(product)}
                          disabled={product.stock <= 0}
                          className={`px-3 py-1 rounded text-sm font-medium flex items-center ${product.stock > 0
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Order
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
                </div>
              ))}
            </div>
          ) : (
            // Table View
            <div className="bg-white p-[20px] rounded-lg overflow-hidden">
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y border-x-0 divide-gray-200">
                  <thead className="bg-indigo-50 ">
                    <tr className='h-[70px] rounded-t-xl ' >
                      <th scope="col" className="px-6 py-3 text-left text-xs text-indigo-500 font-semibold uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs text-indigo-500 font-semibold uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs text-indigo-500 font-semibold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProducts.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={item.images[0] || '/no-image.png'}
                              alt={item.title}
                              className="h-12 w-12 rounded-md object-cover mr-3"
                            />
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                              <div className="flex items-center text-xs text-gray-500 space-x-3 mt-1">
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7V4h16v3M4 7v13h16V7M9 11h6" />
                                  </svg>
                                  {item.category}
                                </span>
                                <span className="flex items-center gap-1">
                                  <div className='text-[6px] font-bold rounded-full border-2 text-gray-400 border-gray-400 p-[2px]' >Rs</div>
                                  {item.orignal_price}
                                </span>
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  Stock: {item.stock}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                                  !isPriorityTaken(item.category, opt.value, item.id) ||
                                  opt.value === item.priority
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

                        <td className="px-6 whitespace-nowrap text-sm font-medium flex items-center justify-center pt-[30px] space-x-3">
                          <Link
                            href={`/admin/dashboard/product-form?id=${item.id}`}
                            className="p-2 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 3.732z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 cursor-pointer rounded bg-red-100 hover:bg-red-200 text-red-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls for Table View */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="px-3 py-1 cursor-pointer rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Previous
                    </button>

                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`px-3 py-1 rounded-md border ${currentPage === page
                            ? 'bg-indigo-500 text-white border-indigo-500'
                            : 'border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="px-3 cursor-pointer py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center"
                    >
                      Next
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Modal */}
        {showOrderModal && selectedProduct && (
          <OrderModal
            product={selectedProduct}
            onClose={() => setShowOrderModal(false)}
            onOrderSubmit={handleOrderSuccess}
          />
        )}
      </div>
    </div>
  );
}