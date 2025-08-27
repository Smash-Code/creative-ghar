

// 'use client';

// import { useEffect, useState, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { useProductApi } from '@/hooks/useProduct';
// import { useOrder } from '@/hooks/useOrder';
// import { useAuth } from '@/app/context/authContext';
// import Link from 'next/link';
// import OrderModal from '@/components/modals/orderModal';
// import toast from 'react-hot-toast';
// import Loader from '@/components/Loader';
// import { ChevronLeft, ChevronRight, Grid, Table, LogOut, LayoutGrid, MessageSquareDashed } from 'lucide-react';
// import ConfirmationModal from '@/components/modals/DeleteModal';
// // Adjust the import path as needed

// export default function ProductManagementPage() {
//   const { getAllProducts, deleteProduct, updateProduct } = useProductApi();
//   const { createOrder, loading: orderLoading } = useOrder();
//   const { user, loading: authLoading, logout } = useAuth();
//   const router = useRouter();

//   // State management
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentOrderingProduct, setCurrentOrderingProduct] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [updatingPriority, setUpdatingPriority] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

//   // Pagination states (for table view)
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // 1. Add state for the delete confirmation modal
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [productIdToDelete, setProductIdToDelete] = useState(null);

//   // Check authentication
//   useEffect(() => {
//     if (!authLoading && !user && user?.role !== 'admin') {
//       router.push('/login');
//     }
//   }, [user, authLoading, router]);

//   // Fetch products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const res = await getAllProducts({ page: 1, limit: 1000 });
//         setProducts(res.data);
//         setFilteredProducts(res.data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//       setLoading(false);
//     };

//     if (user) {
//       fetchProducts();
//     }
//   }, [user]);

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

//   // Pagination logic for table view
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

//   // Product actions
//   // 2. New function to initiate the delete process
//   const handleInitiateDelete = (id) => {
//     setProductIdToDelete(id);
//     setIsDeleteModalOpen(true);
//   };

//   // 3. The actual delete function, called from the modal
//   const handleDelete = async () => {
//     setIsDeleteModalOpen(false); // Close the modal
//     if (!productIdToDelete) return;

//     try {
//       await deleteProduct(productIdToDelete);
//       setProducts((prev) => prev.filter((p) => p.id !== productIdToDelete));
//       toast.success('Product Deleted!');
//     } catch (err) {
//       toast.error(err.message || 'Failed to delete');
//     } finally {
//       setProductIdToDelete(null); // Clear the stored product ID
//     }
//   };

//   const handleEdit = (id) => {
//     router.push(`/admin/dashboard/product-form?id=${id}`);
//   };

//   const handleOrderClick = (product) => {
//     setSelectedProduct(product);
//     setShowOrderModal(true);
//   };

//   const handleOrderSuccess = () => {
//     toast.success('Order placed successfully!');
//   };

//   const handleOrder = async (productId) => {
//     setCurrentOrderingProduct(productId);
//     try {
//       // In a real app, you'd get the userId from auth context
//       const userId = 'current-user-id';
//       const product = products.find(p => p.id === productId);

//       await createOrder({
//         productId,
//         userId,
//         quantity: 1, // Default quantity
//         totalPrice: product.discounted_price || product.orignal_price
//       });

//       toast.success('Order placed successfully!');
//     } catch (error) {
//       toast.error(error.message || 'Failed to place order');
//     } finally {
//       setCurrentOrderingProduct(null);
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

//   if (authLoading || !user) {
//     return <Loader />;
//   }

//   return (
//     <div className=" h-full bg-gray-100 px-[40px] pt-[20px]">
//       <div className='' >
//         <div className='text-[44px] font-bold' >
//           Dashboard Home
//         </div>
//         <div className='text-gray-400 py-2' >Let's customize store to get more sales.</div>
//       </div>

//       <div className='flex flex-wrap gap-[34px]' >
//         <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
//           <div className='flex items-center flex-wrap gap-[22px] ' >
//             <div className=' flex items-center justify-between gap-10' >
//               <div className='p-3 rounded-lg bg-indigo-200 text-indigo-500' >
//                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//               </div>
//               <div className='flex flex-col text-lg items-end' >
//                 <div className='text-[30px] font-bold text-indigo-500' >22</div>
//                 <div>Total Porducts</div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
//           <div className='flex items-center flex-wrap gap-[22px] ' >
//             <div className=' flex items-center justify-between gap-10' >
//               <div className='p-3 rounded-lg bg-indigo-200 text-indigo-500' >
//                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//               </div>
//               <div className='flex flex-col text-lg items-end' >
//                 <div className='text-[30px] font-bold text-indigo-500' >22</div>
//                 <div>Total Porducts</div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
//           <div className='flex items-center flex-wrap gap-[22px] ' >
//             <div className=' flex items-center justify-between gap-10' >
//               <div className='p-3 rounded-lg bg-indigo-200 text-indigo-500' >
//                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//               </div>
//               <div className='flex flex-col text-lg items-end' >
//                 <div className='text-[30px] font-bold text-indigo-500' >22</div>
//                 <div>Total Porducts</div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
//           <div className='flex items-center flex-wrap gap-[22px] ' >
//             <div className=' flex items-center justify-between gap-10' >
//               <div className='p-3 rounded-lg bg-indigo-200 text-indigo-500' >
//                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//               </div>
//               <div className='flex flex-col text-lg items-end' >
//                 <div className='text-[30px] font-bold text-indigo-500' >22</div>
//                 <div>Total Porducts</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// 'use client'
// import { useAuth } from '@/app/context/authContext';
// import Loader from '@/components/Loader';
// import { useCategory } from '@/hooks/useCategory';
// import { useOrder } from '@/hooks/useOrder';
// import { useProductApi } from '@/hooks/useProduct';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';


// const DashboardHome = () => {
//   const { getAllOrders, orders } = useOrder();
//   const { getAllProducts } = useProductApi();
//   const { getAllCategories, category } = useCategory();
//   const { user, loading: authLoading, logout } = useAuth();
//   const router = useRouter()

//   const [products, setProducts] = useState([]);
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     totalOrders: 0,
//     totalCategories: 0,
//     totalSales: 0,
//     totalRevenue: 0
//   });
//   const [loading, setLoading] = useState(true);

//   // Check authentication
//   useEffect(() => {
//     if (!authLoading && !user && user?.role !== 'admin') {
//       router.push('/login');
//     }
//   }, [user, authLoading, router]);


//   if (authLoading || !user) {
//     return <Loader />;
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         // Fetch all data in parallel
//         const [ordersData, productsData] = await Promise.all([
//           getAllOrders(),
//           getAllProducts()
//         ]);

//         // Categories are already fetched via the hook and stored in 'category'
//         await getAllCategories();

//         setProducts(productsData.data || []);

//         // Calculate total revenue from orders
//         const revenue = ordersData.reduce((total, order) => {
//           return total + (order.total_price || 0);
//         }, 0);

//         // Calculate total sales (count of completed orders)
//         const sales = ordersData.filter(order =>
//           order.status === 'completed' || order.status === 'delivered'
//         ).length;

//         setStats({
//           totalProducts: productsData.data?.length || 0,
//           totalOrders: ordersData.length || 0,
//           totalCategories: category?.length || 0,
//           totalSales: sales,
//           totalRevenue: revenue
//         });
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Get latest 10 orders
//   const latestOrders = orders
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, 10);

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(amount);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <Loader />
//     );
//   }

//   return (
//     <div className="h-auto bg-gray-100 px-[40px] pt-[20px] pb-10">
//       <div>
//         <div className='text-[32px] font-bold'>Dashboard Home</div>
//         <div className='text-gray-400 py-2'>Let's customize store to get more sales.</div>
//       </div>

//       {/* Stats Cards */}
//       <div className='flex flex-wrap gap-[34px] my-8'>
//         {/* Total Products Card */}
//         <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
//           <div className='flex items-center flex-wrap gap-[22px] '>
//             <div className='flex items-center justify-between gap-10'>
//               <div className='p-3 rounded-lg bg-indigo-200 text-indigo-500'>
//                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//               </div>
//               <div className='flex flex-col text-lg items-end'>
//                 <div className='text-[30px] font-bold text-indigo-500'>{stats.totalProducts}</div>
//                 <div>Total Products</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Total Orders Card */}
//         <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
//           <div className='flex items-center flex-wrap gap-[22px] '>
//             <div className='flex items-center justify-between gap-10'>
//               <div className='p-3 rounded-lg bg-green-200 text-green-500'>
//                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                 </svg>
//               </div>
//               <div className='flex flex-col text-lg items-end'>
//                 <div className='text-[30px] font-bold text-green-500'>{stats.totalOrders}</div>
//                 <div>Total Orders</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Total Categories Card */}
//         <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
//           <div className='flex items-center flex-wrap gap-[22px] '>
//             <div className='flex items-center justify-between gap-10'>
//               <div className='p-3 rounded-lg bg-blue-200 text-blue-500'>
//                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
//                 </svg>
//               </div>
//               <div className='flex flex-col text-lg items-end'>
//                 <div className='text-[30px] font-bold text-blue-500'>{stats.totalCategories}</div>
//                 <div>Total Categories</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Total Sales Card */}
//         <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
//           <div className='flex items-center flex-wrap gap-[22px] '>
//             <div className='flex items-center justify-between gap-10'>
//               <div className='p-3 rounded-lg bg-purple-200 text-purple-500'>
//                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//               </div>
//               <div className='flex flex-col text-lg items-end'>
//                 <div className='text-[30px] font-bold text-purple-500'>{stats.totalSales}</div>
//                 <div>Total Sales</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Revenue Card */}
//         <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
//           <div className='flex items-center flex-wrap gap-[22px] '>
//             <div className='flex items-center justify-between gap-10'>
//               <div className='p-3 rounded-lg bg-yellow-200 text-yellow-500'>
//                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className='flex flex-col text-lg items-end'>
//                 <div className='text-[30px] font-bold text-yellow-500'>{formatCurrency(stats.totalRevenue)}</div>
//                 <div>Total Revenue</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Latest Orders Section */}
//       {/* Latest Orders Section - Simplified */}
//       <div className='grid grid-cols-12 gap-8' >
//         <div className='col-span-12 md:col-span-8' >

//         </div>
//         <div className=' col-span-12 md:col-span-4' >
//           <div className="bg-white p-6 shadow-xl rounded-xl mt-8">
//             <h2 className="text-2xl font-bold mb-4">Latest Orders</h2>
//             {latestOrders.length > 0 ? (
//               <div className="space-y-4">
//                 {latestOrders.map((order) => (
//                   <div key={order.id} className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50">
//                     <div className="flex-1">
//                       <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
//                       <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
//                     </div>
//                     <div className="text-right">
//                       <div className="font-bold">{formatCurrency(order.total_price || 0)}</div>
//                       <div className={`text-xs px-2 py-1 rounded-full inline-block ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
//                         order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                           order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                             'bg-blue-100 text-blue-800'
//                         }`}>
//                         {order.status}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500">No orders found.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;

"use client"
import Loader from '@/components/Loader';
import { useOrder } from '@/hooks/useOrder';
import { useProductApi } from '@/hooks/useProduct';
import { useState, useEffect } from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const DashboardHome = () => {
  const { getAllOrders, orders } = useOrder();
  const { getAllProducts } = useProductApi();

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    totalPending: 0,
    paidOrdersRevenue: 0,
    totalRevenue: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('today'); // 'today', 'yesterday', 'week', 'month', 'all'
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [ordersData, productsData] = await Promise.all([
          getAllOrders(),
          getAllProducts()
        ]);

        // Categories are already fetched via the hook and stored in 'category'

        setProducts(productsData.data || []);

        const revenue = ordersData.reduce((total, order) => {
          return total + (order.total_price || 0);
        }, 0);

        // Order status counts
        const totalPending = ordersData.filter(o => o.status === "pending").length;
        const totalShipped = ordersData.filter(o => o.status === "shipped").length;
        const totalPaid = ordersData.filter(o => o.paymentStatus === "paid").length;
        const paymentPending = ordersData.filter(o => o.paymentStatus === "pending").length;
        const paymentFailed = ordersData.filter(o => o.paymentStatus === "failed").length;
        const sales = ordersData.filter(o => o.status === 'delivered').length;

        const paidOrdersRevenue = ordersData.reduce((total, order) => {
          if (order.paymentStatus === "paid") {
            // console.log(order.totalPrice)
            const paid = total + (order.totalPrice);
            console.log(paid)
            return paid
          }
          console.log(total)
          return total;
        }, 0);

        console.log(paidOrdersRevenue, "totals")

        setStats({
          totalProducts: productsData.data?.length || 0,
          totalOrders: ordersData.length || 0,
          totalSales: sales,
          totalRevenue: paidOrdersRevenue,   // delivered + paid only
          totalPaid,
          paidOrdersRevenue,                    // <-- all paid orders revenue
          totalPending,
          totalShipped,
          paymentFailed,
          paymentPending
        });

        // Prepare chart data
        prepareChartData(productsData.data || [], ordersData);

        // Apply initial date filter (today)
        filterOrdersByDate(ordersData, 'today');
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter orders by date
  const filterOrdersByDate = (ordersList, filterType) => {
    const now = new Date();
    let filtered = [];

    switch (filterType) {
      case 'today':
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filtered = ordersList.filter(order =>
          new Date(order.createdAt) >= todayStart
        );
        break;

      case 'yesterday':
        const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filtered = ordersList.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= yesterdayStart && orderDate < yesterdayEnd;
        });
        break;

      case 'week':
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        filtered = ordersList.filter(order =>
          new Date(order.createdAt) >= weekStart
        );
        break;

      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = ordersList.filter(order =>
          new Date(order.createdAt) >= monthStart
        );
        break;

      case 'all':
      default:
        filtered = ordersList;
        break;
    }

    setFilteredOrders(filtered);
  };

  // Handle date filter change
  const handleDateFilterChange = (filterType) => {
    setDateFilter(filterType);
    filterOrdersByDate(orders, filterType);
    setIsDropdownOpen(false);
  };

  // Prepare data for the chart
  const prepareChartData = (products, orders) => {
    // For simplicity, we'll show monthly data for the current year
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const currentYear = new Date().getFullYear();

    // Initialize data for each month
    const monthlyData = months.map(month => ({
      name: month,
      products: 0,
      orders: 0
    }));

    // Count products by month (assuming products have a createdAt field)
    products.forEach(product => {
      if (product.createdAt) {
        const date = new Date(product.createdAt);
        if (date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          monthlyData[monthIndex].products += 1;
        }
      }
    });

    // Count orders by month
    orders.forEach(order => {
      if (order.createdAt) {
        const date = new Date(order.createdAt);
        if (date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          monthlyData[monthIndex].orders += 1;
        }
      }
    });

    setChartData(monthlyData);
  };

  // Get display text for the selected filter
  const getFilterDisplayText = (filterType) => {
    switch (filterType) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'all': return 'All Orders';
      default: return 'Today';
    }
  };

  // Get latest 10 orders from filtered orders
  const latestOrders = filteredOrders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="h-full bg-gray-100 px-[40px] pt-[20px] pb-10">
      <div>
        <div className='text-[44px] font-bold'>Dashboard Home</div>
        <div className='text-gray-400 py-2'>Let's customize store to get more sales.</div>
      </div>

      {/* Stats Cards */}
      <div className='flex flex-wrap gap-[34px] my-8'>
        {/* Total Products Card */}
        <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
          <div className='flex items-center flex-wrap gap-[22px] '>
            <div className='flex items-center justify-between gap-10'>
              <div className='p-3 rounded-lg bg-indigo-200 text-indigo-500'>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className='flex flex-col text-lg items-end'>
                <div className='text-[30px] font-bold text-indigo-500'>{stats.totalProducts}</div>
                <div>Total Products</div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
          <div className='flex items-center flex-wrap gap-[22px] '>
            <div className='flex items-center justify-between gap-10'>
              <div className='p-3 rounded-lg bg-green-200 text-green-500'>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className='flex flex-col text-lg items-end'>
                <div className='text-[30px] font-bold text-green-500'>{stats.totalOrders}</div>
                <div>Total Orders</div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Sales Card */}
        <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
          <div className='flex items-center flex-wrap gap-[22px] '>
            <div className='flex items-center justify-between gap-10'>
              <div className='p-3 rounded-lg bg-purple-200 text-purple-500'>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className='flex flex-col text-lg items-end'>
                <div className='text-[30px] font-bold text-purple-500'>{stats.totalSales}</div>
                <div>Total Sales</div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className='bg-white h-fit w-fit p-6 shadow-xl rounded-xl '>
          <div className='flex items-center flex-wrap gap-[22px] '>
            <div className='flex items-center justify-between gap-10'>
              <div className='p-3 rounded-lg bg-yellow-200 text-yellow-500'>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className='flex flex-col text-lg items-end'>
                <div className='text-[30px] font-bold text-yellow-500'>{formatCurrency(stats.totalRevenue)}</div>
                <div>Total Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 shadow-xl rounded-xl mt-8">
        <h2 className="text-2xl font-bold mb-4">Orders Delivery Status</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: "Pending", value: stats.totalPending },
                { name: "Shipped", value: stats.totalShipped },
                { name: "Paid", value: stats.totalPaid },
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              label
            >
              <Cell fill="#facc15" /> {/* yellow */}
              <Cell fill="#3b82f6" /> {/* blue */}
              <Cell fill="#22c55e" /> {/* green */}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-6 shadow-xl rounded-xl mt-8">
        <h2 className="text-2xl font-bold mb-4">Orders Payment Status</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: "Pending", value: stats.paymentPending },
                { name: "Failed", value: stats.paymentFailed },
                { name: "Paid", value: stats.totalPaid },
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              label
            >
              <Cell fill="#facc15" /> {/* yellow */}
              <Cell fill="#FF0000" /> {/* blue */}
              <Cell fill="#22c55e" /> {/* green */}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>


      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          {/* Analytics Charts Section */}

          <div className="bg-white p-6 shadow-xl rounded-xl mt-8">
            <h2 className="text-2xl font-bold mb-4">Orders Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="orders" stroke="#8884d8" name="Orders" />
                  <Line type="monotone" dataKey="products" stroke="#82ca9d" name="Products" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
        <div className='col-span-12 lg:col-span-4 ' >
          <div className="flex flex-col mb-4 shadow-xl ">

            {/* Latest Orders Section - Simplified */}
            <div className="bg-white p-2 flex justify-between w-full  rounded-xl mt-8">
              <button className="px-2 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold">
                Pending: {stats.totalPending}
              </button>
              <button className="px-2 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                Shipped: {stats.totalShipped}
              </button>
              <button className="px-2 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
                Paid: {stats.totalPaid}
              </button>
            </div>

            {/* Date Filter Dropdown */}
            <div className="bg-white p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Latest Orders</h2>
              <div className="relative">
                <button
                  className="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{getFilterDisplayText(dateFilter)}</span>
                  <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
                    <div className="py-1">
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${dateFilter === 'today' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => handleDateFilterChange('today')}
                      >
                        Today
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${dateFilter === 'yesterday' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => handleDateFilterChange('yesterday')}
                      >
                        Yesterday
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${dateFilter === 'week' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => handleDateFilterChange('week')}
                      >
                        This Week
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${dateFilter === 'month' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => handleDateFilterChange('month')}
                      >
                        This Month
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${dateFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => handleDateFilterChange('all')}
                      >
                        All Orders
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {latestOrders.length > 0 ? (
              <div className="space-y-4 bg-white p-4">
                {latestOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                      <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(order.total_price || 0)}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 p-4 bg-white">No orders found for the selected date range.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;