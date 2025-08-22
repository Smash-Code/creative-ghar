'use client'
import { useParams } from 'next/navigation'
import { useProductApi } from '@/hooks/useProduct'
import { useEffect, useState } from 'react'
import Product from "@/components/product/product"
import Navbar from "@/components/Header"
import Footer from "@/components/Footer"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2 } from 'lucide-react'
import CartPanel from '@/components/home/CartPanel'
import Loader from '@/components/Loader'

export default function CategoryProductsPage() {
    const params = useParams()
    const router = useRouter()
    const categoryName = decodeURIComponent(params.categoryName)
    const { getProductsByCategory } = useProductApi()
    const [products, setProducts] = useState([])
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)

    // Reset products and page when category changes
    useEffect(() => {
        setProducts([])
        setPage(1)
    }, [categoryName])

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const res = await getProductsByCategory(categoryName, { page })

                // If page is 1, replace products, otherwise append
                setProducts(prev => page === 1 ? res.data : [...prev, ...res.data])
                setHasMore(res.hasMore)
            } catch (error) {
                console.error("Error:", error)
            }
            setLoading(false)
        }

        fetchProducts()
    }, [categoryName, page])
    const initialLoadComplete = !loading && products.length === 0 && page === 1;

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
            <div className="overflow-hidden min-h-screen flex flex-col bg-gray-50 text-gray-800">
                <Navbar setCart={setIsCartOpen} />

                <main className="flex-grow container mt-24 mx-auto px-4 py-8">
                    <div className="flex gap-4 md:items-center flex-col md:flex-row justify-between mb-8">
                        <button
                            onClick={() => router.back()}
                            className="flex cursor-pointer items-center space-x-2 text-red-600 hover:text-red-800 transition-colors duration-300 font-medium group"
                        >
                            <div className="p-2 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                                <ChevronLeft size={20} className="stroke-2" />
                            </div>
                            <span className="text-sm md:text-base">Go Back</span>
                        </button>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-center flex-grow">
                            {categoryName}
                        </h1>
                        <div className="w-24"></div> {/* Spacer to center the title */}
                    </div>

                    {loading && products.length === 0 ? (
                        // <div className="flex justify-center items-center h-64">
                        //     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        // </div>
                        <Loader />
                    ) : initialLoadComplete ? (
                        <div className="flex flex-col justify-center items-center p-12 bg-white rounded-xl shadow-md text-center">
                            <h3 className="text-2xl font-bold text-gray-900">
                                No products found in <span className="text-indigo-600">{categoryName}</span>
                            </h3>
                            <p className="mt-2 text-gray-500">
                                Check back later or browse other categories.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                                {products.map((product) => (
                                    <Product key={product.id} setCart={setIsCartOpen} product={product} />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-12 flex justify-center">
                                    <button
                                        onClick={() => setPage(prev => prev + 1)}
                                        disabled={loading}
                                        className="relative flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:-translate-y-1"
                                    >
                                        {loading ? (
                                            // <div className="flex justify-center items-center h-64">
                                            //     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                            // </div>
                                            <Loader />
                                        ) : (
                                            "Load More Products"
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
                <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                <Footer />
            </div>
        </>
    )
}


