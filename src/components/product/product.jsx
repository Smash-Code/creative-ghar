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
    if (product.images?.length > 1) {
      setCurrentImageIndex(1); // Immediately show second image on hover
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCurrentImageIndex(0); // Reset to first image
  };

  return (
    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/home/products/${product.id}`} >
        <div
          onClick={() => handleDetail(product)}
          className="relative h-48 bg-gray-100 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Image */}
          <img
            src={product.images?.[0] || '/no-image.png'}
            alt={product.title}
            className={`w-full h-full object-cover absolute transition-opacity duration-500 ${isHovering && product.images?.length > 1 ? 'opacity-0' : 'opacity-100'
              }`}
          />

          {/* Hover Image (only if multiple images exist) */}
          {product.images?.length > 1 && (
            <img
              src={product.images[1]}
              alt={product.title}
              className={`w-full h-full object-cover absolute transition-opacity duration-500 ${isHovering ? 'opacity-100' : 'opacity-0'
                }`}
            />
          )}

          <div className="absolute w-fit top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-center items-start">
          <div className='text-center' >
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          </div>
        </div>
        <div className="text-center text-[12px]">
          {product.discounted_price && product.discounted_price !== product.orignal_price ? (
            <>
              <span className="text-lg text-[12px] font-bold text-indigo-600">${product.discounted_price}</span>
              <span className="ml-1 text-[12px] text-gray-500 line-through">${product.orignal_price}</span>
            </>
          ) : (
            <span className="text-[12px] font-bold text-gray-900">${product.orignal_price}</span>
          )}
        </div>

        <p className="text-sm text-center text-gray-600 mt-2 line-clamp-2">{product.description}</p>
        <Link href={`/home/products/${product.id}`} >
          <div className='mx-auto text-center cursor-pointer px-4 py-1 rounded-full bg-red-500 text-white mt-1 w-fit' >Order Now</div>
        </Link>
      </div>
    </div>
  )
}

export default Product