'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useProductApi } from '@/hooks/useProduct';
import { useCategory } from '@/hooks/useCategory';
import Navbar from '@/components/Header';
import Newsletter from '@/components/home/Newsletter';
import Footer from '@/components/Footer';
import { deliveryDate } from '@/utils/deliveryDates';
import ProductCarousel from '@/components/product/ProductCarousel';
import CartPanel from '@/components/home/CartPanel';
import { useCart } from '@/hooks/useCart';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart()
  const { getProductById, getAllProducts } = useProductApi();
  const { getAllCategories, category } = useCategory();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');



  const [relatedProducts, setRelatedProducts] = useState([]);

  // Add this useEffect to fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await getAllProducts();
        if (res.data) {
          // Filter out the current product and get 10 random products
          const filtered = res.data.filter(p => p._id !== id).slice(0, 10);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        await getAllCategories();
        const res = await getProductById(id);
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
    if (!product) return;

    if (product.hasVariants) {
      if (product.sizes?.length > 0 && !selectedSize) {
        alert('Please select a size');
        return;
      }
      if (product.colors?.length > 0 && !selectedColor) {
        alert('Please select a color');
        return;
      }
    }
    addToCart(product, quantity, selectedSize, selectedColor);
    setIsCartOpen(true);
  };
  // const removeFromCart = (productId) => {
  //   setCartItems(cartItems.filter(item => item.id !== productId));
  // };

  // const updateQuantity = (productId, newQuantity) => {
  //   if (newQuantity < 1) return;

  //   setCartItems(cartItems.map(item =>
  //     item.id === productId ? { ...item, quantity: newQuantity } : item
  //   ));
  // };

  // const calculateTotal = () => {
  //   return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  // };

  // const handleCheckout = () => {
  //   router.push('/home/checkout');
  //   setIsCartOpen(false);
  // };

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

  return (

    <div className="overflow-hidden min-h-screen flex flex-col">
      <Navbar setCart={setIsCartOpen} />
      <div className="flex-grow bg-gray-50 mt-[5%] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Images */}

              <div className="space-y-4">
                {/* Main Image - Fixed height container */}
                <div className="h-96 w-full overflow-hidden rounded-lg bg-gray-100"> {/* Fixed height */}
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.title}
                      width={800}
                      height={800}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Thumbnails - unchanged */}
                <div className="grid grid-cols-4 gap-2">
                  {product.images?.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        onClick={() => setSelectedImage(index)}
                        src={image}
                        alt={`${product.title} thumbnail ${index + 1}`}
                        width={200}
                        height={200}
                        className="h-full w-full object-contain cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>


              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <div className="text-2xl hover:underline cursor-pointer font-semibold text-gray-900">{product.title}</div>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <p className="text-gray-700">{product.description}</p>

                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
                  {hasDiscount && (
                    <span className="text-xl text-gray-500 line-through mr-3">
                      RS {product.orignal_price.toFixed(2)} PKR
                    </span>
                  )}
                  <span className="text-xl font-bold text-gray-900">
                    RS {price.toFixed(2)} PKR
                  </span>
                  {hasDiscount && (
                    <span className="md:ml-3 w-fit bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      Save RS {(product.orignal_price - product.discounted_price).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className={`px-3 py-1 rounded-lg w-fit text-white ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} >{product.stock} {product.stock > 0 ? 'in stock' : 'out of stock'}</div>

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
                  <span className="text-sm text-gray-600">(24 reviews)</span>
                </div>
                {product.hasVariants && product.sizes?.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-sm mb-2 text-gray-700">Size:</div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedSize(size.name)}
                          className={`px-3 py-1 border rounded-full text-sm ${selectedSize === size.name
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {size.name} {size.stock > 0 ? '' : '(Out of stock)'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.hasVariants && product.colors?.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-sm mb-2 text-gray-700">Color:</div>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          className={`px-3 py-1 border rounded-full text-sm flex items-center gap-1 ${selectedColor === color.name
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full inline-block"
                            style={{ backgroundColor: color.hex }}
                          ></span>
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm mb-2 text-gray-700">Quantity :</div>
                  <div className="flex text-sm text-gray-500 items-center space-x-4">
                    <div className="flex items-center border border-gray-500 rounded-full">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 text-lg border-r border-gray-500"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 text-lg border-l border-gray-500"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 bg-red-300 text-white py-[6px] px-6 rounded-full hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    Add to Cart
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-900">Delivery Information</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Delivered on : {deliveryDate(product.estimated_delivery_time)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Return/Exchange: {product.return_or_exchange_time ? `${product.return_or_exchange_time} days` : '30 days'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ProductCarousel products={relatedProducts} />
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}