// 'use client'
// import Image from 'next/image'
// import Link from 'next/link'
// import React, { useEffect } from 'react'
// import { useCategory } from '@/hooks/useCategory' // adjust path if needed

// const Sale = () => {
//     const { category, getAllCategories, loading, error } = useCategory()

//     useEffect(() => {
//         getAllCategories()
//     }, [])

//     if (loading) return <p className="text-center mt-5"></p>
//     if (error) return <p className="text-center mt-5 text-red-500">{error}</p>

//     return (
//         <div className="mt-[5%]">
//             <div className="text-center text-[6vw] md:text-[36px] font-semibold">
//                 Top Categories
//             </div>

//             <div className="flex flex-col md:flex-row mx-[5%] md:mx-[10%] mt-[2%] mb-[5%] gap-3">
//                 {category?.slice(0, 2).map((cat, index) => (
//                     <div key={cat._id || index} className="flex-1">
//                         {/* Clickable Image */}
//                         <Link href={`/home/products/category/${cat.name}`}>
//                             <div className="relative w-full aspect-[10/10] cursor-pointer group">
//                                 <Image
//                                     src={cat.image || (index === 0 ? '/image_4.png' : '/image_3.png')}
//                                     alt={cat.name}
//                                     fill
//                                     className="object-cover group-hover:opacity-90 transition"
//                                     priority
//                                 />
//                             </div>

//                             {/* Category Name */}
//                             <p className="text-center cursor-pointer hover:underline mt-3 text-lg font-medium capitalize">
//                                 {cat.name}
//                             </p>
//                         </Link>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default Sale

'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Sale = () => {
    const [topCategories, setTopCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTopCategories = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/top-category')
                const data = await response.json()

                if (response.ok) {
                    setTopCategories(data.data || [])
                } else {
                    setError(data.error || 'Failed to fetch top categories')
                }
            } catch (err) {
                setError('Error fetching top categories')
            } finally {
                setLoading(false)
            }
        }

        fetchTopCategories()
    }, [])

    if (loading) return <p className="text-center mt-5"></p>
    if (error) return <p className="text-center mt-5 text-red-500">{error}</p>
    if (topCategories.length === 0) return null // Don't show section if no top categories

    return (
        <div className="mt-[5%]">
            <h1 className="text-center text-[6vw] md:text-[36px] font-semibold">
                Top Categories
            </h1>

            <div className="flex flex-col md:flex-row mx-[5%] md:mx-[10%] mt-[2%] mb-[5%] gap-3">
                {topCategories.slice(0, 2).map((cat, index) => (
                    <div key={cat.id || index} className="flex-1">
                        {/* Clickable Image */}
                        <Link href={`/home/products/category/${cat.category}`}>
                            <div className="relative w-full aspect-[10/10] cursor-pointer group">
                                <Image
                                    src={cat.imgURL || (index === 0 ? '/image_4.png' : '/image_3.png')}
                                    alt={cat.category}
                                    fill
                                    className="object-cover group-hover:opacity-90 transition"
                                    priority
                                />
                            </div>

                            {/* Category Name */}
                            <p className="text-center cursor-pointer hover:underline mt-3 text-lg font-medium capitalize">
                                {cat.category}
                            </p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Sale