// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import Product from './product';

// export default function ProductCarousel({ products }) {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const carouselRef = useRef(null);
//     const intervalRef = useRef(null);

//     // Number of products to show at once
//     const itemsToShow = 4;
//     const totalItems = products.length;
//     const maxIndex = Math.max(0, totalItems - itemsToShow);

//     // Auto-rotate carousel only if we have enough products
//     useEffect(() => {
//         if (totalItems > itemsToShow) {
//             intervalRef.current = setInterval(() => {
//                 setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
//             }, 3000);
//         }

//         return () => {
//             if (intervalRef.current) clearInterval(intervalRef.current);
//         };
//     }, [totalItems, maxIndex]);

//     const nextSlide = () => {
//         if (currentIndex < maxIndex) {
//             setCurrentIndex(prev => prev + 1);
//             resetInterval();
//         }
//     };

//     const prevSlide = () => {
//         if (currentIndex > 0) {
//             setCurrentIndex(prev => prev - 1);
//             resetInterval();
//         }
//     };

//     const resetInterval = () => {
//         if (totalItems <= itemsToShow) return;

//         clearInterval(intervalRef.current);
//         intervalRef.current = setInterval(() => {
//             setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
//         }, 3000);
//     };

//     // Disable arrows when at start/end
//     const isPrevDisabled = currentIndex === 0;
//     const isNextDisabled = currentIndex >= maxIndex || totalItems <= itemsToShow;

//     if (!products || products.length === 0) return null;

//     return (
//         <div className="relative w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//             <h2 className="text-2xl font-bold mb-6">You may also like</h2>

//             <div className="relative overflow-hidden">
//                 <div
//                     ref={carouselRef}
//                     className="flex transition-transform duration-500 ease-in-out"
//                     style={{
//                         transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
//                         width: `${(totalItems / itemsToShow) * 100}%`
//                     }}
//                 >
//                     {products.map((product, index) => (
//                         <div key={product._id || index} className={`flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/${products.length > 4 ? 5 : 4} px-2`}>
//                             <Product product={product} />
//                         </div>
//                     ))}
//                 </div>

//                 {/* Navigation arrows - only show if we have more products than can be shown */}
//                 {totalItems > itemsToShow && (
//                     <>
//                         <button
//                             onClick={prevSlide}
//                             disabled={isPrevDisabled}
//                             className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none ${isPrevDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                         >
//                             <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                             </svg>
//                         </button>

//                         <button
//                             onClick={nextSlide}
//                             disabled={isNextDisabled}
//                             className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                         >
//                             <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                             </svg>
//                         </button>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }



'use client';
import { useEffect, useRef, useState } from 'react';
import Product from './product';

export default function ProductCarousel({ products }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(4);
    const carouselRef = useRef(null);
    const intervalRef = useRef(null);

    const totalItems = products.length;

    // Update itemsToShow based on screen size
    useEffect(() => {
        const updateItemsToShow = () => {
            if (window.innerWidth < 640) setItemsToShow(1); // Mobile
            else if (window.innerWidth < 1024) setItemsToShow(2); // Tablet
            else if (window.innerWidth < 1280) setItemsToShow(3); // Small Desktop
            else setItemsToShow(4); // Large Desktop
        };

        updateItemsToShow();
        window.addEventListener('resize', updateItemsToShow);
        return () => window.removeEventListener('resize', updateItemsToShow);
    }, []);

    const maxIndex = Math.max(0, totalItems - itemsToShow);

    // Auto-slide
    useEffect(() => {
        if (totalItems > itemsToShow) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
            }, 3000);
        }
        return () => clearInterval(intervalRef.current);
    }, [totalItems, maxIndex, itemsToShow]);

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
        clearInterval(intervalRef.current);
        if (totalItems > itemsToShow) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
            }, 3000);
        }
    };

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
                        transform: `translateX(-${currentIndex * (160 / itemsToShow)}%)`,
                        width: `${(totalItems / itemsToShow) * 100}%`
                    }}
                >
                    {products.map((product, index) => (
                        <div
                            key={product._id || index}
                            className="flex-shrink-0 px-2"
                            style={{ maxWidth: `${100 / itemsToShow}%` }}
                        >
                            <Product product={product} />
                        </div>
                    ))}
                </div>

                {totalItems > itemsToShow && (
                    <>
                        <button
                            onClick={prevSlide}
                            disabled={isPrevDisabled}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition 
                                ${isPrevDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={nextSlide}
                            disabled={isNextDisabled}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition 
                                ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
