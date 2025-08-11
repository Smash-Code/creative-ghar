

'use client'

import Navbar from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import Carousel from "@/components/home/CategoryCarousel"
import Sale from "@/components/home/Sale"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProductApi } from '@/hooks/useProduct';
// import { useOrder } from '@/hooks/useOrder';
import Link from 'next/link';
import { useOrder } from '@/hooks/useOrder';
import OrderModal from './home/order/orderModal';
// import HeroSection from '@/components/HeroSection';
// import Navbar from '@/components/Header';
import MarqueeDisplay from '@/components/heading/Heading';
import Product from "@/components/product/product"
import Image from "next/image"
import { Shirt, ShoppingBag, ShoppingBasketIcon, Star, Truck } from "lucide-react"
import Footer from "@/components/Footer"

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
  // const handleOrderClick = (product) => {
  //   setSelectedProduct(product);
  //   // setShowOrderModal(true);
  // };

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

  const handleDetail = (product) => {
    setSelectedProduct(product)
    router.push(`/home/products/${product.id}`)
  }

  return (
    <div>
      <MarqueeDisplay />
      <div className='relative'>
        <Navbar />
      </div>
      <HeroSection />
      <div>
        <Carousel />
      </div>
      <Sale />
      <div className="flex bg-gray-50 mt-10">

        <div className="flex-1 overflow-auto">

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
                  <Product product={product} />
                ))}
              </div>
            )}
          </div>
        </div>


        <div className="flex h-screen bg-gray-50">

          {showOrderModal && selectedProduct && (
            <OrderModal
              product={selectedProduct}
              onClose={() => setShowOrderModal(false)}
              onOrderSubmit={handleOrderSuccess}
            />
          )}
        </div>

      </div>
      <div className="relative " >
        <div>
          <Image alt="Banner" height={300} width={1320} src='/banner-1.png' className="object-contain" />
        </div>
        <div className="absolute max-w-[100%] md:max-w-[60%] lg:max-w-[40%] left-[5%] top-[35%]" >
          <div className="text-red-500 text-xl lg:text-3xl font-bold  " >
            Top Trending Product
          </div>
          <div className="text-white text-lg lg:text-3xl font-semibold my-1 md:my-4" >
            The best product of the store to buy in this sale
          </div>
          <div className="text-yellow-400 text-md lg:text-xl my-1 md:my-4" >
            With 40% off , and a free shipping offer.
          </div>
          <div className="font-semibold text-white" >
            Enjoy double portions of delicious mozzarella cheese Crispy paneer,onion,green capsicum.
          </div>

          <div className="bg-yellow-500 px-3 py-1 rounded-full w-fit my-2 md:my-5 cursor-pointer" > Order Now </div>
        </div>
      </div>

      <div className="grid grid-cols-12" >
        <div className="flex flex-col items-center col-span-12 md:col-span-6 lg:col-span-3 py-10 border-1 border-gray-200" >
          <div className="mb-2" >
            <Truck className="text-red-500" size={40} />
          </div>
          <div className="font-bold" >Fast & Free shipping</div>
          <div className="text-gray-400 text-sm font-light" >We Provide free shipping here</div>
        </div>
        <div className="flex flex-col items-center col-span-12 md:col-span-6 lg:col-span-3 py-10 border-1 border-gray-200" >
          <div className="mb-2" >
            <Shirt className="text-red-500" size={40} />
          </div>
          <div className="font-bold" >Fast & Free shipping</div>
          <div className="text-gray-400 text-sm font-light" >We Provide free shipping here</div>
        </div>
        <div className="flex flex-col items-center col-span-12 md:col-span-6 lg:col-span-3 py-10 border-1 border-gray-200" >
          <div className="mb-2" >
            <ShoppingBag className="text-red-500" size={40} />
          </div>
          <div className="font-bold" >Fast & Free shipping</div>
          <div className="text-gray-400 text-sm font-light" >We Provide free shipping here</div>
        </div>
        <div className="flex flex-col items-center col-span-12 md:col-span-6 lg:col-span-3 py-10 border-1 border-gray-200" >
          <div className="mb-2" >
            <ShoppingBasketIcon className="text-red-500" size={40} />
          </div>
          <div className="font-bold" >Fast & Free shipping</div>
          <div className="text-gray-400 text-sm font-light" >We Provide free shipping here</div>
        </div>
      </div>

      <div className=" my-[10%]" >
        <div className="flex items-center flex-col lg:flex-row justify-center gap-4" >
          <Image alt="banner-2" src="/banner-2.png" height={450} width={450} className="object-contain" />
          <Image alt="banner-3" src="/banner-3.jpg" height={450} width={450} className="object-contain" />
        </div>
        <div className="flex flex-col items-center justify-center mt-[5%]">
          <div className="flex items-center gap-2" >
            <Star className="text-yellow-500" />
            <Star className="text-yellow-500" />
            <Star className="text-yellow-500" />
            <Star className="text-yellow-500" />
            <Star className="text-yellow-500" />
          </div>
          <div className="mt-[2%] font-semibold md:font-bold w-[90%] md:w-[55%] lg:w-[35%] text-center" >
            some mock test comment of a user who bought a product
          </div>
        </div>
      </div>

      <div className="my-[10%]" >

        <MarqueeDisplay />
      </div>

      <Footer />

    </div>
  );
}






// const page = () => {
//   const { getAllProducts, deleteProduct } = useProductApi();
//   const [products, setProducts] = useState([])
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


//   return (
//     <div>
//       <Navbar />
//       <HeroSection />
// <div>
//   <Carousel />
// </div>
// <Sale />

//       <div>
//         {
//           products.length <= 0 ? <>loading..</> :
//             products.map((product) => <Product product={product} />)
//         }
//       </div>

//     </div>
//   )
// }

// export default page