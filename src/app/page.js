

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProductApi } from '@/hooks/useProduct';
// import { useOrder } from '@/hooks/useOrder';
import Link from 'next/link';
import { useOrder } from '@/hooks/useOrder';
import OrderModal from './home/order/orderModal';

export default function ProductListPage() {
  const { getAllProducts, deleteProduct } = useProductApi();
  const { createOrder, loading: orderLoading } = useOrder();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentOrderingProduct, setCurrentOrderingProduct] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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



  // Modify handleOrder to show modal
  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setShowOrderModal(true);
  };

  // Handle successful order submission
  const handleOrderSuccess = () => {
    alert('Order placed successfully!');
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
      
      alert('Order placed successfully!');
    } catch (error) {
      alert(error.message || 'Failed to place order');
    } finally {
      setCurrentOrderingProduct(null);
    }
  };

  const handleDetail = (id) => {
    router.push(`/home/products/${id}`)
  }

  return (
    <div className="flex h-screen bg-gray-50">

      <div className="flex-1 overflow-auto">
      <Link 
        href="/home/order"   
        className="px-4 py-2 w-fit m-4 ml-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center">
          Go To My Orders
      </Link>
        <div className="p-6">

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
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div onClick={()=>handleDetail(product.id)} className="relative h-48 bg-gray-100">
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

                    <div className="mt-4 flex justify-between items-center">
                     
                      
                      <div className="flex space-x-2">
                         <button
                          onClick={() => handleOrderClick(product)}
                          disabled={product.stock <= 0}
                          className={`px-3 py-1 rounded text-sm font-medium flex items-center ${
                            product.stock > 0 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

          <div className="flex h-screen bg-gray-50">
      {/* ... existing JSX ... */}
      
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