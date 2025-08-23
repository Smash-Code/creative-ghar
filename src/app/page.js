'use client'
import Navbar from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import Sale from "@/components/home/Sale"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProductApi } from '@/hooks/useProduct';
import MarqueeDisplay from '@/components/heading/Heading';
import Product from "@/components/product/product"
import Footer from "@/components/Footer"
import HighRating from "@/components/home/HighRating"
import SpecialDeal from "@/components/home/SpecialDeal"
import Services from "@/components/home/Services"
import Newsletter from "@/components/home/Newsletter"
import Link from 'next/link';
import CartPanel from "@/components/home/CartPanel";
import Loader from "@/components/Loader";

export default function HomePage() {
  const { getAllProducts } = useProductApi();
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const router = useRouter();

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await getAllProducts({ page: 1, limit: 20 });

  //       // Group products by category
  //       const grouped = res.data.reduce((acc, product) => {
  //         const category = product.category || 'Uncategorized';
  //         if (!acc[category]) {
  //           acc[category] = [];
  //         }
  //         acc[category].push(product);
  //         return acc;
  //       }, {});

  //       setProductsByCategory(grouped);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }
  //     setLoading(false);
  //   };

  //   fetchProducts();
  // }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts({ page: 1, limit: 20 });

        // Group products by category and sort by priority
        const grouped = res.data.reduce((acc, product) => {
          const category = product.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});

        // Sort products within each category by priority (highest first), then by other criteria
        Object.keys(grouped).forEach(category => {
          grouped[category].sort((a, b) => {
            // Sort by priority (higher numbers first)
            if (b.priority !== a.priority) {
              return (b.priority || 0) - (a.priority || 0);
            }
            // If same priority, you can add additional sorting criteria
            return a.title.localeCompare(b.title);
          });
        });

        setProductsByCategory(grouped);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1694571487917100');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1694571487917100&ev=PageView&noscript=1"
            alt="Facebook Pixel"
          />
        </noscript>
      </head>
      <div className="overflow-hidden">

        <MarqueeDisplay />
        <div className='relative'>
          <Navbar setCart={setIsCartOpen} />
        </div>
        <div className=" mt-5 md:mt-22" >
          <HeroSection />
        </div>
        <div className="mx-auto " >
          <Sale />
        </div>

        {/* Products Section */}
        <div id="products-section" className="flex mt-10 p-4 md:p-6">
          <div className="flex-1 overflow-auto">
            {loading ? (
              <Loader />
              // <div className="flex justify-center items-center h-64">
              //   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              // </div>
            ) : Object.keys(productsByCategory).length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No products found
                </h3>
              </div>
            ) : (
              <div className="space-y-12 mx-auto ">
                {Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
                  <div key={categoryName} className="mb-3 md:p-6 bg-white">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl mt-5 md:mt-0 text-center mx-auto font-bold text-gray-800 tracking-wide">
                        {categoryName}
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
                      {categoryProducts.slice(0, 4).map((product) => (
                        <Product key={product.id} setCart={setIsCartOpen} product={product} />
                      ))}
                    </div>
                    <Link
                      href={`/home/products/category/${categoryName}`}
                      className="bg-red-400 hover:bg-red-500 transition-colors duration-300 rounded-xl mx-auto text-center flex items-center justify-center w-fit text-white px-6 py-3 font-medium shadow-md"
                    >
                      View All →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <Footer />
      </div>
    </>
  );
}