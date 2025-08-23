// // OrdersList component
// 'use client';

// import { useEffect, useState } from 'react';
// import { useOrder } from '@/hooks/useOrder';
// import { ChevronDownIcon, FilterIcon, X, Trash2 } from 'lucide-react';

// const statusColors = {
//   pending: 'bg-yellow-100 text-yellow-800',
//   processing: 'bg-blue-100 text-blue-800',
//   shipped: 'bg-purple-100 text-purple-800',
//   delivered: 'bg-green-100 text-green-800',
//   cancelled: 'bg-red-100 text-red-800'
// };

// const paymentStatusColors = {
//   pending: 'bg-yellow-100 text-yellow-800',
//   paid: 'bg-green-100 text-green-800',
//   failed: 'bg-red-100 text-red-800'
// };

// export default function OrdersList() {
//   const { orders, getAllOrders, loading, error, updateOrder } = useOrder();
//   const [expandedOrderId, setExpandedOrderId] = useState(null);
//   const [trackingInfo, setTrackingInfo] = useState({
//     trackingNumber: '',
//     trackingLink: ''
//   });
//   const [editingStatus, setEditingStatus] = useState(null);
//   const [editingPaymentStatus, setEditingPaymentStatus] = useState(null);
//   const [deletingOrderId, setDeletingOrderId] = useState(null);

//   // Filter states
//   const [showFilters, setShowFilters] = useState(false);
//   const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
//   const [orderStatusFilter, setOrderStatusFilter] = useState('all');

//   useEffect(() => {
//     getAllOrders();
//   }, []);

//   // Filter orders based on selected filters
//   const filteredOrders = orders.filter(order => {
//     const matchesPaymentStatus = paymentStatusFilter === 'all' ||
//       order.paymentStatus === paymentStatusFilter;
//     const matchesOrderStatus = orderStatusFilter === 'all' ||
//       order.status === orderStatusFilter;
//     return matchesPaymentStatus && matchesOrderStatus;
//   });

//   const handleExpandOrder = (order) => {
//     setExpandedOrderId(expandedOrderId === order.id ? null : order.id);
//     if (order.orderFulfillment) {
//       setTrackingInfo({
//         trackingNumber: order.orderFulfillment.trackingNumber || '',
//         trackingLink: order.orderFulfillment.trackingLink || ''
//       });
//     } else {
//       setTrackingInfo({
//         trackingNumber: '',
//         trackingLink: ''
//       });
//     }
//   };

//   const handleTrackingInfoChange = (e) => {
//     const { name, value } = e.target;
//     setTrackingInfo(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleUpdateFulfillment = async (orderId) => {
//     try {
//       await updateOrder(orderId, {
//         orderFulfillment: {
//           trackingNumber: trackingInfo.trackingNumber,
//           trackingLink: trackingInfo.trackingLink
//         },
//       });
//       setExpandedOrderId(null);
//       getAllOrders();
//     } catch (err) {
//       console.error('Failed to update order:', err);
//     }
//   };

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       await updateOrder(orderId, { status: newStatus });
//       setEditingStatus(null);
//       getAllOrders();
//     } catch (err) {
//       console.error('Failed to update status:', err);
//     }
//   };

//   const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
//     try {
//       await updateOrder(orderId, { paymentStatus: newPaymentStatus });
//       setEditingPaymentStatus(null);
//       getAllOrders();
//     } catch (err) {
//       console.error('Failed to update payment status:', err);
//     }
//   };

//   // Handle order deletion
//   const handleDeleteOrder = async (orderId) => {
//     if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
//       return;
//     }

//     setDeletingOrderId(orderId);
//     try {
//       const response = await fetch(`/api/order/${orderId}`, {
//         method: 'DELETE',
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Refresh the orders list
//         getAllOrders();
//       } else {
//         console.error('Failed to delete order:', data.error);
//         alert('Failed to delete order: ' + data.error);
//       }
//     } catch (err) {
//       console.error('Error deleting order:', err);
//       alert('Error deleting order: ' + err.message);
//     } finally {
//       setDeletingOrderId(null);
//     }
//   };

//   // Reset all filters
//   const resetFilters = () => {
//     setPaymentStatusFilter('all');
//     setOrderStatusFilter('all');
//   };

//   // Calculate total items in an order
//   const getTotalItems = (order) => {
//     if (!order.products || !Array.isArray(order.products)) return 0;
//     return order.products.reduce((total, product) => total + product.quantity, 0);
//   };

//   // Get unique sizes and colors for display
//   const getProductVariants = (order) => {
//     if (!order.products || !Array.isArray(order.products)) return { sizes: [], colors: [] };

//     const sizes = [...new Set(order.products.map(p => p.size).filter(Boolean))];
//     const colors = [...new Set(order.products.map(p => p.color).filter(Boolean))];

//     return { sizes, colors };
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     )
//   }

//   if (error) return (
//     <div className="bg-red-50 border-l-4 border-red-400 p-4">
//       <div className="flex">
//         <div className="flex-shrink-0">
//           <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//           </svg>
//         </div>
//         <div className="ml-3">
//           <p className="text-sm text-red-700">Error loading orders: {error}</p>
//         </div>
//       </div>
//     </div>
//   );

//   if (!orders || orders.length === 0) {
//     return (
//       <div className="bg-white rounded-lg shadow p-8 text-center">
//         <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//         </svg>
//         <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
//         <p className="mt-1 text-gray-500">Get started by placing a new order</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       {/* Filter Header */}
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-medium text-gray-900">Orders</h2>
//           <div className="flex items-center space-x-2">
//             {(paymentStatusFilter !== 'all' || orderStatusFilter !== 'all') && (
//               <button
//                 onClick={resetFilters}
//                 className="flex items-center text-sm text-gray-600 hover:text-gray-800"
//               >
//                 <X size={16} className="mr-1" />
//                 Clear filters
//               </button>
//             )}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               <FilterIcon size={16} className="mr-2" />
//               Filter
//               {(paymentStatusFilter !== 'all' || orderStatusFilter !== 'all') && (
//                 <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
//                   {[paymentStatusFilter, orderStatusFilter].filter(f => f !== 'all').length}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Filter Dropdown */}
//         {showFilters && (
//           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Payment Status
//               </label>
//               <select
//                 value={paymentStatusFilter}
//                 onChange={(e) => setPaymentStatusFilter(e.target.value)}
//                 className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//               >
//                 <option value="all">All Payment Statuses</option>
//                 <option value="pending">Pending</option>
//                 <option value="paid">Paid</option>
//                 <option value="failed">Failed</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Order Status
//               </label>
//               <select
//                 value={orderStatusFilter}
//                 onChange={(e) => setOrderStatusFilter(e.target.value)}
//                 className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//               >
//                 <option value="all">All Order Statuses</option>
//                 <option value="pending">Pending</option>
//                 <option value="processing">Processing</option>
//                 <option value="shipped">Shipped</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Orders Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Order ID
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Total Price
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Payment Status
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Tracking ID
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Date
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredOrders.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
//                   No orders match the selected filters
//                 </td>
//               </tr>
//             ) : (
//               filteredOrders.map((order) => {
//                 const variants = getProductVariants(order);
//                 return (
//                   <>
//                     <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         #{order.count_id}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         RS{order.totalPrice?.toFixed(2) || '0.00'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {editingStatus === order.id ? (
//                           <div className='relative' >
//                             <span
//                               className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setEditingStatus(editingStatus == order.id ? null : order.id);
//                               }}
//                             >
//                               {order.status}
//                             </span>

//                             <div className='absolute top-6 z-50 bg-white w-20 rounded-[6px] border-[1px] border-gray-300' >
//                               {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
//                                 return (
//                                   <div
//                                     key={status}
//                                     className='hover:bg-gray-300 p-2 text-[9px] border-b-[1px] border-gray-300'
//                                     onClick={() => handleStatusChange(order.id, status)}
//                                   >
//                                     {status}
//                                   </div>
//                                 )
//                               })}
//                             </div>
//                           </div>
//                         ) : (
//                           <span
//                             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setEditingStatus(order.id);
//                             }}
//                           >
//                             {order.status}
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {editingPaymentStatus === order.id ? (
//                           <div className='relative' >
//                             <span
//                               className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[order.paymentStatus || 'pending']}`}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setEditingPaymentStatus(editingPaymentStatus == order.id ? null : order.id);
//                               }}
//                             >
//                               {order.paymentStatus || 'pending'}
//                             </span>

//                             <div className='absolute top-6 z-50 bg-white w-20 rounded-[6px] border-[1px] border-gray-300' >
//                               {['pending', 'paid', 'failed'].map((status) => {
//                                 return (
//                                   <div
//                                     key={status}
//                                     className='hover:bg-gray-300 p-2 text-[9px] border-b-[1px] border-gray-300'
//                                     onClick={() => handlePaymentStatusChange(order.id, status)}
//                                   >
//                                     {status}
//                                   </div>
//                                 )
//                               })}
//                             </div>
//                           </div>
//                         ) : (
//                           <span
//                             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[order.paymentStatus || 'pending']}`}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setEditingPaymentStatus(order.id);
//                             }}
//                           >
//                             {order.paymentStatus || 'pending'}
//                           </span>
//                         )}
//                       </td>
//                       <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500' >
//                         {(order.orderFulfillment != undefined && order.orderFulfillment.trackingNumber && order.orderFulfillment.trackingNumber.trim().length !== 0)
//                           ? order.orderFulfillment.trackingNumber
//                           : "N/A"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {new Date(order.createdAt?.seconds * 1000 || order.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           className="text-indigo-600 hover:text-indigo-900 mr-3"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleExpandOrder(order);
//                           }}
//                         >
//                           {expandedOrderId === order.id ? 'Collapse' : 'View'}
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDeleteOrder(order.id);
//                           }}
//                           disabled={deletingOrderId === order.id}
//                           className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
//                           title="Delete order"
//                         >
//                           {deletingOrderId === order.id ? (
//                             <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
//                           ) : (
//                             <Trash2 size={16} />
//                           )}
//                         </button>
//                       </td>
//                     </tr>

//                     {expandedOrderId === order.id && (
//                       <tr className="bg-gray-50">
//                         <td colSpan="7" className="px-6 py-4">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                               <h4 className="font-medium mb-2">Customer Details</h4>
//                               <div className="text-sm space-y-1">
//                                 <p><span className="font-medium">Name:</span> {order.username}</p>
//                                 <p><span className="font-medium">Email:</span> {order.email}</p>
//                                 <p><span className="font-medium">Phone:</span> {order.phone}</p>
//                                 <p><span className="font-medium">Address:</span> {order.address}, {order.city}, {order.country}</p>
//                               </div>

//                               <h4 className="font-medium mb-2 mt-4">Order Fulfillment</h4>
//                               <div className="space-y-3">
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
//                                   <input
//                                     type="text"
//                                     name="trackingNumber"
//                                     value={trackingInfo.trackingNumber}
//                                     onChange={handleTrackingInfoChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                     placeholder="Enter tracking number"
//                                   />
//                                 </div>
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Link</label>
//                                   <input
//                                     type="url"
//                                     name="trackingLink"
//                                     value={trackingInfo.trackingLink}
//                                     onChange={handleTrackingInfoChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                     placeholder="https://example.com/tracking/123"
//                                   />
//                                 </div>
//                                 <button
//                                   onClick={() => handleUpdateFulfillment(order.id)}
//                                   className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 >
//                                   Update Fulfillment
//                                 </button>
//                               </div>
//                             </div>

//                             <div>
//                               <h4 className="font-medium mb-2">Products</h4>
//                               <div className="text-sm space-y-3">
//                                 {order.products && order.products.map((product, index) => (
//                                   <div key={index} className="border-b pb-2 last:border-b-0">
//                                     <p className="font-medium">{product.title || `Product: ${product.productId}`}</p>
//                                     <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
//                                       <div>Quantity: {product.quantity}</div>
//                                       <div>Price: RS {product.price?.toFixed(2) || '0.00'}</div>
//                                       {product.size && <div>Size: {product.size}</div>}
//                                       {product.color && (
//                                         <div className="flex items-center">
//                                           Color:
//                                           <span
//                                             className="ml-1 w-3 h-3 inline-block rounded-full border border-gray-300"
//                                             style={{ backgroundColor: product.color }}
//                                           ></span>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function getContrastColor(hexColor) {
//   if (!hexColor || hexColor.startsWith('#')) return '#fff';
//   const darkColors = ['black', 'navy', 'blue', 'darkgreen', 'maroon'];
//   return darkColors.includes(hexColor.toLowerCase()) ? '#fff' : '#000';
// }


// OrdersList component
'use client';

import { useEffect, useState } from 'react';
import { useOrder } from '@/hooks/useOrder';
import { ChevronDownIcon, FilterIcon, X, Trash2, ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800'
};

export default function OrdersList() {
  const { orders, getAllOrders, loading, error, updateOrder } = useOrder();
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState({
    trackingNumber: '',
    trackingLink: ''
  });
  const [editingStatus, setEditingStatus] = useState(null);
  const [editingPaymentStatus, setEditingPaymentStatus] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  useEffect(() => {
    getAllOrders();
  }, []);

  // Filter orders based on selected filters
  const filteredOrders = orders.filter(order => {
    const matchesPaymentStatus = paymentStatusFilter === 'all' ||
      order.paymentStatus === paymentStatusFilter;
    const matchesOrderStatus = orderStatusFilter === 'all' ||
      order.status === orderStatusFilter;
    return matchesPaymentStatus && matchesOrderStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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

  const handleExpandOrder = (order) => {
    setExpandedOrderId(expandedOrderId === order.id ? null : order.id);
    if (order.orderFulfillment) {
      setTrackingInfo({
        trackingNumber: order.orderFulfillment.trackingNumber || '',
        trackingLink: order.orderFulfillment.trackingLink || ''
      });
    } else {
      setTrackingInfo({
        trackingNumber: '',
        trackingLink: ''
      });
    }
  };

  const handleTrackingInfoChange = (e) => {
    const { name, value } = e.target;
    setTrackingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateFulfillment = async (orderId) => {
    try {
      await updateOrder(orderId, {
        orderFulfillment: {
          trackingNumber: trackingInfo.trackingNumber,
          trackingLink: trackingInfo.trackingLink
        },
      });
      setExpandedOrderId(null);
      getAllOrders();
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      setEditingStatus(null);
      getAllOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      await updateOrder(orderId, { paymentStatus: newPaymentStatus });
      setEditingPaymentStatus(null);
      getAllOrders();
    } catch (err) {
      console.error('Failed to update payment status:', err);
    }
  };

  // Handle order deletion
  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    setDeletingOrderId(orderId);
    try {
      const response = await fetch(`/api/order/${orderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the orders list
        getAllOrders();
      } else {
        console.error('Failed to delete order:', data.error);
        alert('Failed to delete order: ' + data.error);
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Error deleting order: ' + err.message);
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setPaymentStatusFilter('all');
    setOrderStatusFilter('all');
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Calculate total items in an order
  const getTotalItems = (order) => {
    if (!order.products || !Array.isArray(order.products)) return 0;
    return order.products.reduce((total, product) => total + product.quantity, 0);
  };

  // Get unique sizes and colors for display
  const getProductVariants = (order) => {
    if (!order.products || !Array.isArray(order.products)) return { sizes: [], colors: [] };

    const sizes = [...new Set(order.products.map(p => p.size).filter(Boolean))];
    const colors = [...new Set(order.products.map(p => p.color).filter(Boolean))];

    return { sizes, colors };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Error loading orders: {error}</p>
        </div>
      </div>
    </div>
  );

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
        <p className="mt-1 text-gray-500">Get started by placing a new order</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Filter Header */}
      {/* <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Orders</h2>
          <div className="flex items-center space-x-2">
            {(paymentStatusFilter !== 'all' || orderStatusFilter !== 'all') && (
              <button
                onClick={resetFilters}
                className="flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                <X size={16} className="mr-1" />
                Clear filters
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FilterIcon size={16} className="mr-2" />
              Filter
              {(paymentStatusFilter !== 'all' || orderStatusFilter !== 'all') && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                  {[paymentStatusFilter, orderStatusFilter].filter(f => f !== 'all').length}
                </span>
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Status
              </label>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Order Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        )}
      </div> */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Orders</h2>

        <div className="flex items-center space-x-3">
          {/* Payment Status Dropdown */}
          <div className="relative ">
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="appearance-none cursor-pointer pl-4 pr-10 py-1.5 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <ArrowDown />
            </span>
          </div>

          {/* Order Status Dropdown */}
          <div className="relative">
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="appearance-none cursor-pointer pl-4 pr-10 py-1.5 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <ArrowDown />
            </span>
          </div>

          {/* Clear Filters Button (only show if filters active) */}
          {(paymentStatusFilter !== "all" || orderStatusFilter !== "all") && (
            <button
              onClick={resetFilters}
              className="flex bg-red-500 rounded-lg cursor-pointer px-4 py-[10px] text-white hover:bg-red-600 items-center text-xs font-medium transition"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Orders Count and Pagination Info */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
        </div>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracking ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No orders match the selected filters
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => {
                const variants = getProductVariants(order);
                return (
                  <>
                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.count_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        RS{order.totalPrice?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingStatus === order.id ? (
                          <div className='relative' >
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingStatus(editingStatus == order.id ? null : order.id);
                              }}
                            >
                              {order.status}
                            </span>

                            <div className='absolute top-6 z-50 bg-white w-20 rounded-[6px] border-[1px] border-gray-300' >
                              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
                                return (
                                  <div
                                    key={status}
                                    className='hover:bg-gray-300 p-2 text-[9px] border-b-[1px] border-gray-300'
                                    onClick={() => handleStatusChange(order.id, status)}
                                  >
                                    {status}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ) : (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingStatus(order.id);
                            }}
                          >
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingPaymentStatus === order.id ? (
                          <div className='relative' >
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[order.paymentStatus || 'pending']}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPaymentStatus(editingPaymentStatus == order.id ? null : order.id);
                              }}
                            >
                              {order.paymentStatus || 'pending'}
                            </span>

                            <div className='absolute top-6 z-50 bg-white w-20 rounded-[6px] border-[1px] border-gray-300' >
                              {['pending', 'paid', 'failed'].map((status) => {
                                return (
                                  <div
                                    key={status}
                                    className='hover:bg-gray-300 p-2 text-[9px] border-b-[1px] border-gray-300'
                                    onClick={() => handlePaymentStatusChange(order.id, status)}
                                  >
                                    {status}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ) : (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[order.paymentStatus || 'pending']}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPaymentStatus(order.id);
                            }}
                          >
                            {order.paymentStatus || 'pending'}
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500' >
                        {(order.orderFulfillment != undefined && order.orderFulfillment.trackingNumber && order.orderFulfillment.trackingNumber.trim().length !== 0)
                          ? order.orderFulfillment.trackingNumber
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt?.seconds * 1000 || order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExpandOrder(order);
                          }}
                        >
                          {expandedOrderId === order.id ? 'Collapse' : 'View'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOrder(order.id);
                          }}
                          disabled={deletingOrderId === order.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete order"
                        >
                          {deletingOrderId === order.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </td>
                    </tr>

                    {expandedOrderId === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="7" className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-2">Customer Details</h4>
                              <div className="text-sm space-y-1">
                                <p><span className="font-medium">Name:</span> {order.username}</p>
                                <p><span className="font-medium">Email:</span> {order.email}</p>
                                <p><span className="font-medium">Phone:</span> {order.phone}</p>
                                <p><span className="font-medium">Address:</span> {order.address}, {order.city}, {order.country}</p>
                              </div>

                              <h4 className="font-medium mb-2 mt-4">Order Fulfillment</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                                  <input
                                    type="text"
                                    name="trackingNumber"
                                    value={trackingInfo.trackingNumber}
                                    onChange={handleTrackingInfoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter tracking number"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Link</label>
                                  <input
                                    type="url"
                                    name="trackingLink"
                                    value={trackingInfo.trackingLink}
                                    onChange={handleTrackingInfoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="https://example.com/tracking/123"
                                  />
                                </div>
                                <button
                                  onClick={() => handleUpdateFulfillment(order.id)}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                  Update Fulfillment
                                </button>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Products</h4>
                              <div className="text-sm space-y-3">
                                {order.products && order.products.map((product, index) => (
                                  <div key={index} className="border-b pb-2 last:border-b-0">
                                    <p className="font-medium">{product.title || `Product: ${product.productId}`}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                      <div>Quantity: {product.quantity}</div>
                                      <div>Price: RS {product.price?.toFixed(2) || '0.00'}</div>
                                      {product.size && <div>Size: {product.size}</div>}
                                      {product.color && (
                                        <div className="flex items-center">
                                          Color:
                                          <span
                                            className="ml-1 w-3 h-3 inline-block rounded-full border border-gray-300"
                                            style={{ backgroundColor: product.color }}
                                          ></span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {/* {totalPages > 1 && ( */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center"
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
                  ? 'bg-indigo-600 text-white border-indigo-600'
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
            className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center"
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}

function getContrastColor(hexColor) {
  if (!hexColor || hexColor.startsWith('#')) return '#fff';
  const darkColors = ['black', 'navy', 'blue', 'darkgreen', 'maroon'];
  return darkColors.includes(hexColor.toLowerCase()) ? '#fff' : '#000';
}