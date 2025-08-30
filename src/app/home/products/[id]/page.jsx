'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useProductApi } from '@/hooks/useProduct';
import { useCategory } from '@/hooks/useCategory';
import Navbar from '@/components/Header';
import Footer from '@/components/Footer';
import { deliveryDate } from '@/utils/deliveryDates';
import ProductCarousel from '@/components/product/ProductCarousel';
import CartPanel from '@/components/home/CartPanel';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import SEO from '@/components/seo/Head';
import { generateProductSEO, generateProductStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart()
  const { getProductById, getAllProducts, getProductsByCategory } = useProductApi();
  const { getAllCategories, category } = useCategory();

  // Extract identifier from params (could be ID or slug)
  const identifier = params.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');



  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.category) return;

      try {
        const res = await getProductsByCategory(product.category, { limit: 10 });
        if (res.data) {
          // Filter out the current product
          const filtered = res.data.filter(p => p.id !== product.id || p.slug !== product.slug);

          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    if (product?.category) {
      fetchRelatedProducts();
    }
  }, [product?.category]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // First try to fetch by slug
        let productData = null;
        try {
          const response = await fetch(`/api/product/slug/${identifier}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              productData = result.data;
            }
          }
        } catch (slugError) {
          console.log('Product not found by slug, trying ID fallback');
        }

        // If not found by slug, try ID fallback (for backward compatibility)
        if (!productData) {
          try {
            const response = await fetch(`/api/product/${identifier}`);
            if (response.ok) {
              const result = await response.json();
              if (result.success) {
                productData = result.data;
                // Redirect to slug URL if accessed by ID and slug exists
                if (productData.slug && productData.slug !== identifier) {
                  router.replace(`/home/products/${productData.slug}`, { scroll: false });
                  return;
                }
              }
            }
          } catch (idError) {
            console.log('Product not found by ID either');
          }
        }

        if (!productData) {
          setError('Product not found');
          return;
        }

        await getAllCategories();
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
      fetchProduct();
    }
  }, [identifier]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.hasVariants) {
      if (product.sizes?.length > 0 && !selectedSize) {
        toast.error('Please select a size');
        return;
      }
      if (product.colors?.length > 0 && !selectedColor) {
        toast.error('Please select a color');
        return;
      }
    }
    addToCart(product, quantity, selectedSize, selectedColor);
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      // <div className="flex justify-center items-center min-h-screen">
      //   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      // </div>
      <Loader />
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

  // Generate SEO data for the product
  const productSEO = generateProductSEO(product);
  const productStructuredData = generateProductStructuredData(product);
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: product?.category || 'Products', url: `/home/products/category/${product?.category}` },
    { name: product?.title || 'Product', url: `/home/products/${product?.slug || product?._id || product?.id}` }
  ]);

  return (
    <>
      <SEO
        title={productSEO.title}
        description={productSEO.description}
        keywords={productSEO.keywords}
        image={productSEO.image}
        url={productSEO.url}
        type="product"
        price={productSEO.price}
        currency={productSEO.currency}
        availability={productSEO.availability}
        structuredData={productStructuredData}
      />
      {/* Additional structured data for breadcrumbs */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      <h1 className="text-white absolute top-0" >Creative ghar store</h1>

      <div className="overflow-hidden min-h-screen flex flex-col">
        <Navbar setCart={setIsCartOpen} />
        <div className="flex-grow bg-gray-50 mt-[5%] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto ">
            <div className="bg-white border-b border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                {/* Product Images */}
                <div className="space-y-4">
                  {/* Main Image Container with Arrows */}
                  <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-100">
                    {product.images?.[0] ? (
                      <>
                        <Image
                          src={product.images[selectedImage]}
                          alt={product.title}
                          width={800}
                          height={800}
                          className="h-full w-full object-contain"
                        />

                        {/* Navigation Arrows */}
                        {product.images.length > 1 && (
                          <>
                            <button
                              aria-label='Stat'
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(prev =>
                                  (prev - 1 + product.images.length) % product.images.length
                                );
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                              </svg>
                            </button>
                            <button
                              aria-label='Stat'
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(prev =>
                                  (prev + 1) % product.images.length
                                );
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                              </svg>
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        No Image Available
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-4 gap-2">
                    {product.images?.slice(0, 4).map((image, index) => (
                      <div
                        key={index}
                        className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
                        onClick={() => setSelectedImage(index)}
                      >
                        <Image
                          src={image}
                          alt={`${product.title} thumbnail ${index + 1}`}
                          width={200}
                          height={200}
                          className={`h-full w-full object-contain ${selectedImage === index ? 'ring-2 ring-indigo-500' : ''}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>


                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl hover:underline cursor-pointer font-semibold text-gray-900">{product.title}</h2>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>

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
                            aria-label='Stat'
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
                            aria-label='Stat'
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

                  <div className="border-t border-gray-200 py-4">
                    <div className="border-l-2 border-green-500 text-xl font-bold bg-green-100 text-green-900 py-4 pl-3 mt-2">
                      Estimated Delivery : {deliveryDate(product.estimated_delivery_time)}
                    </div>
                    <div className="border-l-2 border-purple-500 text-xl font-bold bg-purple-100 text-purple-900 py-4 pl-3 mt-2">
                      Easy Returns and exchange within {product.return_or_exchange_time ? `${product.return_or_exchange_time} days` : '30 days'}
                    </div>
                    <div className="border-l-2 border-amber-500 text-xl font-bold bg-amber-100 text-amber-900 py-4 pl-3 mt-2">
                      Cash On Delivery Available
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-sm mb-2 text-gray-700">Quantity :</div>
                    <div className="flex text-sm text-gray-500 items-center space-x-4">
                      <div className="flex items-center border border-gray-500 rounded-full">
                        <button
                          aria-label='Stat'
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-2 text-lg border-r border-gray-500"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3">{quantity}</span>
                        <button
                          aria-label='Stat'
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
                      aria-label='Stat'
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                      className={`flex-1 text-lg cursor-pointer bg-red-400 text-white py-3 md:py-2 px-6 rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      Add to Cart
                    </button>
                  </div>

                  <p className="text-gray-700">{product.description}</p>



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
    </>
  );
}