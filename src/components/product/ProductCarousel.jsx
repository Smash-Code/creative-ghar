'use client';
import { useEffect, useRef, useState } from 'react';
import Product from './product';

export default function ProductCarousel({ products }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(4);
    const intervalRef = useRef(null);

    const totalItems = products.length;

    // Responsive items count
    useEffect(() => {
        const updateItemsToShow = () => {
            if (window.innerWidth < 640) setItemsToShow(1);
            else if (window.innerWidth < 1024) setItemsToShow(2);
            else if (window.innerWidth < 1280) setItemsToShow(3);
            else setItemsToShow(4);
        };
        updateItemsToShow();
        window.addEventListener('resize', updateItemsToShow);
        return () => window.removeEventListener('resize', updateItemsToShow);
    }, []);

    const maxIndex = Math.max(0, totalItems - itemsToShow);

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
    };

    const isPrevDisabled = currentIndex === 0;
    const isNextDisabled = currentIndex >= maxIndex || totalItems <= itemsToShow;

    if (!products || products.length === 0) return null;

    return (
        <div className="relative w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">You may also like</h2>

            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`
                    }}
                >
                    {products.map((product, index) => (
                        <div
                            key={product.id || index}
                            className="flex-shrink-0 px-2"
                            style={{ flexBasis: `${100 / itemsToShow}%` }}
                        >
                            <Product product={product} />
                        </div>
                    ))}
                </div>

                {totalItems > itemsToShow && (
                    <>
                        <button
                            aria-label='Stat'
                            onClick={prevSlide}
                            disabled={isPrevDisabled}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 
                                bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition 
                                ${isPrevDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            aria-label='Stat'
                            onClick={nextSlide}
                            disabled={isNextDisabled}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 
                                bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition 
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
