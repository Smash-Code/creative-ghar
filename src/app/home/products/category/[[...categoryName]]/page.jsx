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

export default function CategoryProductsPage() {
    const params = useParams()
    const router = useRouter()
    const categoryName = decodeURIComponent(params.categoryName)
    const { getProductsByCategory } = useProductApi()
    const [products, setProducts] = useState([])
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
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            <Navbar />

            <main className="flex-grow container mt-24 mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-300 font-medium group"
                    >
                        <div className="p-2 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
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
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <Product key={product.id} product={product} />
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
                                        <div className="flex justify-center items-center h-64">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                        </div>
                                    ) : (
                                        "Load More Products"
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    )
}
// <div className="min-h-screen flex flex-col">
//     <Navbar />

//     <div className="flex-grow container mt-[60px] mx-auto px-4 py-8">
//         <button
//             onClick={() => router.back()}
//             className="flex items-center border-1 border-gray-500 hover:border-indigo-400 hover:scale-105 transition-all duration-300 rounded-[8px] px-2 py-1 cursor-pointer text-black-600 hover:text-indigo-800"
//         >
//             <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Go Back
//         </button>

//         <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>

//         {loading && products.length === 0 ? (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//             </div>
//         ) : products.length === 0 ? (
//             <div className="bg-white rounded-lg shadow p-8 text-center">
//                 <h3 className="mt-2 text-lg font-medium text-gray-900">
//                     No products found in {categoryName}
//                 </h3>
//             </div>
//         ) : (
//             <>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {products.map((product) => (
//                         <Product key={product.id} product={product} />
//                     ))}
//                 </div>

//                 {hasMore && (
//                     <div className="mt-8 flex justify-center">
//                         <button
//                             onClick={() => setPage(prev => prev + 1)}
//                             disabled={loading}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300"
//                         >
//                             {loading ? 'Loading...' : 'Load More'}
//                         </button>
//                     </div>
//                 )}
//             </>
//         )}
//     </div>
//     <div className="mt-auto">
//         <Footer />
//     </div>
// </div>