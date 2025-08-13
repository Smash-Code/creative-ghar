// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import Product from './product';

// export default function ProductCarousel({ products }) {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const carouselRef = useRef(null);
//     const intervalRef = useRef(null);

//     // Auto-rotate carousel
//     useEffect(() => {
//         intervalRef.current = setInterval(() => {
//             setCurrentIndex(prev => (prev + 1) % products.length);
//         }, 3000); // Change slide every 3 seconds

//         return () => clearInterval(intervalRef.current);
//     }, [products.length]);

//     const nextSlide = () => {
//         setCurrentIndex(prev => (prev + 1) % products.length);
//         resetInterval();
//     };

//     const prevSlide = () => {
//         setCurrentIndex(prev => (prev - 1 + products.length) % products.length);
//         resetInterval();
//     };

//     const resetInterval = () => {
//         clearInterval(intervalRef.current);
//         intervalRef.current = setInterval(() => {
//             setCurrentIndex(prev => (prev + 1) % products.length);
//         }, 3000);
//     };

//     // Calculate visible products based on currentIndex
//     const getVisibleProducts = () => {
//         const visibleProducts = [];
//         for (let i = 0; i < Math.min(4, products.length); i++) {
//             visibleProducts.push(products[(currentIndex + i) % products.length]);
//         }
//         return visibleProducts;
//     };

//     if (!products || products.length === 0) return null;

//     return (
//         <div className="relative w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//             <h2 className="text-2xl font-bold mb-6">You may also like</h2>

//             <div className="relative overflow-hidden">
//                 <div
//                     ref={carouselRef}
//                     className="flex transition-transform duration-500 ease-in-out"
//                     style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
//                 >
//                     {products.map((product) => (
//                         <div className='flex-shrink-0 w-1/4 px-2' >
//                             <Product product={product} />
//                         </div>
//                     ))}
//                 </div>

//                 {/* Navigation arrows */}
//                 <button
//                     onClick={prevSlide}
//                     className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
//                 >
//                     <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                     </svg>
//                 </button>

//                 <button
//                     onClick={nextSlide}
//                     className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
//                 >
//                     <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                 </button>
//             </div>
//         </div>
//     );
// }



'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Product from './product';

export default function ProductCarousel({ products }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);
    const intervalRef = useRef(null);

    // Number of products to show at once
    const itemsToShow = 4;
    const totalItems = products.length;
    const maxIndex = Math.max(0, totalItems - itemsToShow);

    // Auto-rotate carousel only if we have enough products
    useEffect(() => {
        if (totalItems > itemsToShow) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
            }, 3000);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [totalItems, maxIndex]);

    const nextSlide = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
            resetInterval();
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            resetInterval();
        }
    };

    const resetInterval = () => {
        if (totalItems <= itemsToShow) return;

        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
        }, 3000);
    };

    // Disable arrows when at start/end
    const isPrevDisabled = currentIndex === 0;
    const isNextDisabled = currentIndex >= maxIndex || totalItems <= itemsToShow;

    if (!products || products.length === 0) return null;

    return (
        <div className="relative w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">You may also like</h2>

            <div className="relative overflow-hidden">
                <div
                    ref={carouselRef}
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
                        width: `${(totalItems / itemsToShow) * 100}%`
                    }}
                >
                    {products.map((product, index) => (
                        <div key={product._id || index} className='flex-shrink-0 w-1/5 px-2'>
                            <Product product={product} />
                        </div>
                    ))}
                </div>

                {/* Navigation arrows - only show if we have more products than can be shown */}
                {totalItems > itemsToShow && (
                    <>
                        <button
                            onClick={prevSlide}
                            disabled={isPrevDisabled}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none ${isPrevDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={nextSlide}
                            disabled={isNextDisabled}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}