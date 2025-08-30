

import { useCart } from '@/hooks/useCart';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const Product = ({ product, setCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { addToCart } = useCart();

  const handleDetail = (product) => {
    // Your existing detail handling logic
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1); // Default quantity of 1
    setCart(true)
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % product.images?.length
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + product.images?.length) % product.images?.length
    );
  };

  return (
    <div key={product.id} className="bg-white transition-shadow duration-300 group overflow-hidden h-full">
      <Link href={`/home/products/${product.slug || product.id}`} className='h-full flex flex-col'>
        <div
          onClick={() => handleDetail(product)}
          className="relative hover:scale-105 transition-all duration-300 w-full aspect-square bg-gray-100 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Image */}
          {product.images?.length > 0 ? (
            <img
              src={product.images[currentImageIndex] || '/no-image.png'}
              alt={product.title}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <div className='absolute text-white bottom-4 left-4 bg-red-400 px-4 pt-[2px] rounded-full' >Sale</div>

          {/* Navigation Arrows */}
          {product.images?.length > 1 && isHovering && (
            <>
              <button
                aria-label='Stat'
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                aria-label='Stat'
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image Indicator Dots */}
          {product.images?.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-1 pt-4 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="font-semibold text-sm md:text-xl lg:text-[23px] hover:underline text-gray-900 mb-1 line-clamp-2">{product.title}</h3>
          </div>
          <div className="flex flex-col justify-between md:flex-row  text-start text-sm md:text-lg lg:text-[20px] mt-4 lg:mt-6">
            {product.discounted_price && product.discounted_price !== product.orignal_price ? (
              <>
                <div className="text-gray-500 line-through">RS {product.orignal_price}.00 PKR </div>
                <div>RS {product.discounted_price}.00 PKR</div>
              </>
            ) : (
              <span className="text-gray-900">RS {product.orignal_price}.00 PKR</span>
            )}
          </div>

          <button
            aria-label='Stat'
            onClick={handleAddToCart}
            className='border-1 md:border-2 mt-4 text-center text-red-400 cursor-pointer border-red-400 w-full rounded-[8px] py-2 md:py-3 md:font-semibold text-sm md:text-lg hover:bg-red-400 hover:text-white transition-colors mb-2'
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  )
}

export default Product;