// OrdersList component
'use client';

import { useEffect, useState } from 'react';
import { useOrder } from '@/hooks/useOrder';
import { Trash2, ChevronLeft, ChevronRight, ArrowDown, Search, Eye, EyeOff } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmationModal from '@/components/modals/DeleteModal';
import Loader from '@/components/Loader';

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
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDeleteId, setOrderToDeleteId] = useState(null);

  useEffect(() => {
    getAllOrders();
  }, []);

  // Filter orders based on selected filters and search term
  const filteredOrders = orders.filter(order => {
    const matchesPaymentStatus = paymentStatusFilter === 'all' ||
      order.paymentStatus === paymentStatusFilter;
    const matchesOrderStatus = orderStatusFilter === 'all' ||
      order.status === orderStatusFilter;

    // Search by order ID (count_id)
    const matchesSearch = searchTerm === '' ||
      (order.count_id && order.count_id.toString().toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesPaymentStatus && matchesOrderStatus && matchesSearch;
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
      if (trackingInfo.trackingNumber.trim().length <= 0) {
        toast.error('Please fill the tracking number!')
        return;
      }
      if (trackingInfo.trackingLink.trim().length <= 0) {
        toast.error('Please fill the tracking link!')
        return;
      }
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
  const handleInitiateDelete = (orderId) => {
    setOrderToDeleteId(orderId);
    setIsModalOpen(true);
  };

  // Handle order deletion
  const handleDeleteOrder = async () => {
    if (!orderToDeleteId) return;

    setIsModalOpen(false);
    setDeletingOrderId(orderToDeleteId);
    setDeletingOrderId(orderToDeleteId);
    try {
      const response = await fetch(`/api/order/${orderToDeleteId}`, {
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
    setSearchTerm('');
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

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setOrderToDeleteId(null);
  };

  if (loading) {
    return (
      <Loader />
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
      <Toaster />
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="bg-indigo-50 rounded-[6px] py-1 relative max-w-[50%]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products by Order ID"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8  pr-4 py-2 text-sm rounded-md w-full focus:outline-none focus:ring-0"
            />
          </div>
          {/* <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when search changes
              }}
              className="pl-10 pr-4 py-1.5 w-full text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div> */}

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Payment Status Dropdown */}
            <div className="relative w-full sm:w-auto bg-indigo-50 px-2 rounded-md">
              <select
                value={paymentStatusFilter}
                onChange={(e) => {
                  setPaymentStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none cursor-pointer pl-4 pr-10 py-3 w-full text-sm border-0 rounded-lg bg-transparent focus:outline-none focus:ring-0 transition"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <ArrowDown size={14} />
              </span>
            </div>

            {/* Order Status Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={orderStatusFilter}
                onChange={(e) => {
                  setOrderStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none cursor-pointer pl-4 pr-10 py-3 w-full text-sm border-0 rounded-lg bg-indigo-50 focus:outline-none focus:ring-0 transition"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <ArrowDown size={14} />
              </span>
            </div>

            {/* Clear Filters Button (only show if filters active) */}
            {(paymentStatusFilter !== "all" || orderStatusFilter !== "all" || searchTerm !== "") && (
              <button
                aria-label='Stat'
                onClick={resetFilters}
                className="flex bg-red-500 rounded-lg cursor-pointer px-4 py-[10px] text-white hover:bg-red-600 items-center text-xs font-medium transition w-full sm:w-auto justify-center"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Count and Pagination Info */}
      {/* <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
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
      </div> */}

      {/* Orders Table */}
      <div className="overflow-x-auto p-[20px] bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50 rounded-xl font-semibold">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                Total Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                Tracking ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? `No orders found matching "${searchTerm}"` : 'No orders match the selected filters'}
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
                        {/* {new Date(order.createdAt?.seconds * 1000 || order.createdAt).toLocaleDateString()} */}
                        {new Date(order.createdAt?.seconds * 1000 || order.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })}

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          aria-label='Stat'
                          className="bg-indigo-100 hover:bg-indigo-200 p-2 rounded-[4px] cursor-pointer text-indigo-600 mr-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExpandOrder(order);
                          }}
                        >
                          {expandedOrderId === order.id ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button

                          aria-label='Stat'
                          onClick={() => handleInitiateDelete(order.id)}
                          disabled={deletingOrderId === order.id}
                          className="p-2 cursor-pointer rounded bg-red-100 hover:bg-red-200 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    required={true}
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
                                    required={true}
                                    type="url"
                                    name="trackingLink"
                                    value={trackingInfo.trackingLink}
                                    onChange={handleTrackingInfoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="https://example.com/tracking/123"
                                  />
                                </div>
                                <button
                                  aria-label='Stat'
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
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          <div className="flex items-center space-x-2">
            <button
              aria-label='Stat'
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
                  aria-label='Stat'
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
      )}
      {isModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this order? This action cannot be undone."
          onConfirm={handleDeleteOrder}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

function getContrastColor(hexColor) {
  if (!hexColor || hexColor.startsWith('#')) return '#fff';
  const darkColors = ['black', 'navy', 'blue', 'darkgreen', 'maroon'];
  return darkColors.includes(hexColor.toLowerCase()) ? '#fff' : '#000';
}