
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const Product = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleDetail = (product) => {
    // Your existing detail handling logic
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % product.images?.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + product.images?.length) % product.images?.length
    );
  };

  return (
    <div key={product.id} className="bg-white  w-fit transition-shadow duration-300 group overflow-hidden">
      <Link href={`/home/products/${product.id}`} className=''>
        <div
          onClick={() => handleDetail(product)}
          className="relative hover:scale-105 transition-all duration-300 h-70 min-w-full md:min-w-66 bg-gray-100 overflow-hidden"
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

          {/* Navigation Arrows */}
          {product.images?.length > 1 && isHovering && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  nextImage();
                }}
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

        <div className="px-4 pt-1 flex flex-col justify-between min-h-[250px]">
          <div className=''>
            <h3 className="font-semibold text-[23px] hover:underline text-gray-900 mb-1">{product.title}</h3>
          </div>
          <div className="text-start text-[20px] mt-6">
            {product.discounted_price && product.discounted_price !== product.orignal_price ? (
              <>
                <div className="text-[20px] text-gray-500 line-through">${product.orignal_price}</div>
                <div className="text-lg text-[20px] ">${product.discounted_price}</div>
              </>
            ) : (
              <span className="text-[12px] text-gray-900">${product.orignal_price}</span>
            )}
          </div>

          <div className='border-2 mt-4 text-center text-red-400 cursor-pointer border-red-400 w-full rounded-full py-2 text-xl hover:bg-red-400 hover:text-white transition-colors'>
            Add to Cart
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Product;