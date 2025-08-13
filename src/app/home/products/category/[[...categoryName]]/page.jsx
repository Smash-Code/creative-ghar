'use client'
import { useParams } from 'next/navigation'
import { useProductApi } from '@/hooks/useProduct'
import { useEffect, useState } from 'react'
import Product from "@/components/product/product"
import Navbar from "@/components/Header"
import Footer from "@/components/Footer"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow container mt-[5%] mx-auto px-4 py-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center border-1 border-gray-500 hover:border-indigo-400 hover:scale-105 transition-all duration-300 rounded-[8px] px-2 py-1 cursor-pointer text-black-600 hover:text-indigo-800"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Go Back
                </button>

                <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>

                {loading && products.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <h3 className="mt-2 text-lg font-medium text-gray-900">
                            No products found in {categoryName}
                        </h3>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <Product key={product.id} product={product} />
                            ))}
                        </div>

                        {hasMore && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={() => setPage(prev => prev + 1)}
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300"
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    )
}