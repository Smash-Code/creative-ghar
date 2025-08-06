'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useProductApi } from '@/hooks/useProduct';
import OrderModal from '../../order/orderModal';
import { useCategory } from '@/hooks/useCategory';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { getProductById } = useProductApi();
  const { getAllCategories , category } = useCategory()
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        await getAllCategories();
        setProduct(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Implement your cart logic here
    alert(`${quantity} ${product.title} added to cart!`);
  };

    const handleOrderNow = (product) => {
        setSelectedProduct(product);
        setShowOrderModal(true);
    };
    const handleOrderSuccess = () => {
        alert(`Ordering ${quantity} ${product.title} now!`);
    }
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p>Error loading product:</p>
          <p>{error}</p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p>Product not found</p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const price = product.discounted_price || product.orignal_price;
  const hasDiscount = product.discounted_price && product.discounted_price < product.orignal_price;

  const category_name = category?.find((item) => {
    if(item.id == product.category){
       return item.name
    }
  })

  

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    width={800}
                    height={800}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images?.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={image}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <p className="text-lg text-gray-500 mt-2">{category_name.name}</p>
              </div>

              <div className="flex items-center">
                {hasDiscount && (
                  <span className="text-2xl text-gray-500 line-through mr-3">
                    ${product.orignal_price.toFixed(2)}
                  </span>
                )}
                <span className="text-3xl font-bold text-gray-900">
                  ${price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="ml-3 bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    Save ${(product.orignal_price - product.discounted_price).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600">(24 reviews)</span>
              </div>

              <p className="text-gray-700">{product.description}</p>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Quantity:</span>
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-lg border-r"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-lg border-l"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-500">
                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleOrderNow(product)}
                  disabled={product.stock <= 0}
                  className={`flex-1 bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                    product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Order Now
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900">Delivery Information</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {product.estimated_delivery_time || '3-5 business days'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Return/Exchange: {product.return_or_exchange_time ? `${product.return_or_exchange_time} days` : '30 days'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
       {showOrderModal && selectedProduct && (
              <OrderModal
                product={selectedProduct}
                onClose={() => setShowOrderModal(false)}
                onOrderSubmit={handleOrderSuccess}
              />
        )}
    </div>
  );
}