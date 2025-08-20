// 'use client';

// import { useEffect, useState } from 'react';
// import { useOrder } from '@/hooks/useOrder';
// import { ChevronDownIcon } from 'lucide-react';

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

//   useEffect(() => {
//     getAllOrders();
//   }, []);

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
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Order ID
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Quantity
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Size
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Color
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
//             {orders.map((order) => (
//               <>
//                 <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" >
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     #{order.id.slice(0, 8)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {order.quantity}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {order.size}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
//                       style={{ backgroundColor: order.color, color: getContrastColor(order.color) }}
//                     >
//                       {order.color}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     ${order.totalPrice.toFixed(2)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {editingStatus === order.id ? (
//                       <div className='relative' >
//                         <span
//                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setEditingStatus(editingStatus == order.id ? null : order.id);
//                           }}
//                         >
//                           {order.status}
//                         </span>

//                         <div className='absolute top-6 z-50 bg-white w-20 rounded-[6px] border-[1px] border-gray-300' >
//                           {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
//                             return (
//                               <div className='hover:bg-gray-300 p-2 text-[9px] border-b-[1px] border-gray-300' onClick={() => handleStatusChange(order.id, status)} >{status}</div>
//                             )
//                           })}
//                         </div>

//                       </div>
//                     ) : (
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setEditingStatus(order.id);
//                         }}
//                       >
//                         {order.status}
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {editingPaymentStatus === order.id ? (
//                       <div className='relative' >
//                         <span
//                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[order.paymentStatus || 'pending']}`}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setEditingPaymentStatus(editingPaymentStatus == order.id ? null : order.id);
//                           }}
//                         >
//                           {order.paymentStatus || 'pending'}
//                         </span>

//                         <div className='absolute top-6 z-50 bg-white w-20 rounded-[6px] border-[1px] border-gray-300' >
//                           {['pending', 'paid', 'failed'].map((status) => {
//                             return (
//                               <div className='hover:bg-gray-300 p-2 text-[9px] border-b-[1px] border-gray-300' onClick={() => handlePaymentStatusChange(order.id, status)} >{status}</div>
//                             )
//                           })}
//                         </div>

//                       </div>
//                     ) : (
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[order.paymentStatus || 'pending']}`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setEditingPaymentStatus(order.id);
//                         }}
//                       >
//                         {order.paymentStatus || 'pending'}
//                       </span>
//                     )}
//                   </td>
//                   <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500' >
//                     {(order.orderFulfillment != undefined && order.orderFulfillment.trackingNumber.trim().length != 0) ? order.orderFulfillment.trackingNumber : "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       className="text-indigo-600 hover:text-indigo-900 mr-3"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleExpandOrder(order);
//                       }}
//                     >
//                       {expandedOrderId === order.id ? 'Collapse' : 'View'}
//                     </button>
//                   </td>
//                 </tr>

//                 {expandedOrderId === order.id && (
//                   <tr className="bg-gray-50">
//                     <td colSpan="9" className="px-6 py-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <h4 className="font-medium mb-2">Customer Details</h4>
//                           <div className="text-sm space-y-1">
//                             <p><span className="font-medium">Name:</span> {order.username}</p>
//                             <p><span className="font-medium">Email:</span> {order.email}</p>
//                             <p><span className="font-medium">Phone:</span> {order.phone}</p>
//                             <p><span className="font-medium">Address:</span> {order.address}, {order.city}, {order.country}</p>
//                           </div>
//                         </div>

//                         <div>
//                           <h4 className="font-medium mb-2">Order Fulfillment</h4>
//                           <div className="space-y-3">
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
//                               <input
//                                 type="text"
//                                 name="trackingNumber"
//                                 value={trackingInfo.trackingNumber}
//                                 onChange={handleTrackingInfoChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 placeholder="Enter tracking number"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Link</label>
//                               <input
//                                 type="url"
//                                 name="trackingLink"
//                                 value={trackingInfo.trackingLink}
//                                 onChange={handleTrackingInfoChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 placeholder="https://example.com/tracking/123"
//                               />
//                             </div>
//                             <button
//                               onClick={() => handleUpdateFulfillment(order.id)}
//                               className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             >
//                               Update Fulfillment
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </>
//             ))}
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




'use client';

import { useEffect, useState } from 'react';
import { useOrder } from '@/hooks/useOrder';
import { ChevronDownIcon } from 'lucide-react';

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

  useEffect(() => {
    getAllOrders();
  }, []);

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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th> */}
              {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Items
              </th> */}
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
            {orders.map((order) => {
              const variants = getProductVariants(order);
              return (
                <>
                  <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {/* #{order.id.slice(0, 8)} */}
                      #{order.count_id}
                    </td>
                    {/* <td className="px-6 py-4 text-sm text-gray-500">
                      {order.products && order.products.length > 0 ? (
                        <div>
                          {order.products.slice(0, 2).map((product, index) => (
                            <div key={index} className="mb-1">
                              {product.title || `Product: ${product.productId}`} (x{product.quantity})
                            </div>
                          ))}
                          {order.products.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{order.products.length - 2} more products
                            </div>
                          )}
                        </div>
                      ) : (
                        'No products'
                      )}
                    </td> */}
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getTotalItems(order)}
                    </td> */}
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
                    </td>
                  </tr>

                  {expandedOrderId === order.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="9" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Customer Details</h4>
                            <div className="text-sm space-y-1">
                              <p><span className="font-medium">Name:</span> {order.username}</p>
                              <p><span className="font-medium">Email:</span> {order.email}</p>
                              <p><span className="font-medium">Phone:</span> {order.phone}</p>
                              <p><span className="font-medium">Address:</span> {order.address}, {order.city}, {order.country}</p>
                            </div>

                            {/* <h4 className="font-medium mb-2 mt-4">Order Summary</h4>
                            <div className="text-sm space-y-2">
                              <p><span className="font-medium">Total Items:</span> {getTotalItems(order)}</p>
                              <p><span className="font-medium">Total Price:</span> RS{order.totalPrice?.toFixed(2) || '0.00'}</p>
                            </div> */}
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
                                    <div>Price: RS{product.price?.toFixed(2) || '0.00'}</div>
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

                            {/* <h4 className="font-medium mb-2 mt-4">Order Fulfillment</h4>
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
                            </div> */}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getContrastColor(hexColor) {
  if (!hexColor || hexColor.startsWith('#')) return '#fff';
  const darkColors = ['black', 'navy', 'blue', 'darkgreen', 'maroon'];
  return darkColors.includes(hexColor.toLowerCase()) ? '#fff' : '#000';
}