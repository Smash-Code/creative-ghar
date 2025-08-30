

"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCategory } from "@/hooks/useCategory";
import { useRouter } from "next/navigation";
import Loader from "../Loader";

export default function Carousel({ selectedCategory, setSelectedCategory }) {
  const { category, getAllCategories, loading, error } = useCategory();
  const [startIndex, setStartIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    getAllCategories();
  }, []);

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handleNext = () => {
    if (category && startIndex < category.length - 5) {
      setStartIndex(startIndex + 1);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    // Optional: Scroll to products section
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      // <div className="flex justify-center items-center h-40">
      //   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      // </div>
      <Loader />
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Error loading categories: {error}
      </div>
    );
  }

  if (!category || category.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No categories available
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto">
      {/* Left Arrow */}
      <button
        aria-label='Stat'
        onClick={handlePrev}
        disabled={startIndex === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full disabled:opacity-40 z-10"
      >
        <ChevronLeftIcon />
      </button>

      {/* Carousel Items */}
      <div className="overflow-hidden ml-9 mr-9">
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${startIndex * (100 / 5)}%)`,
            width: `${(category.length / 5) * 100}%`,
          }}
        >
          {category.map((cat) => (
            <div
              key={cat.id}
              className="w-1/4 flex-shrink-0 p-2"
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className={`text-center py-10 rounded-lg cursor-pointer transition-all ${selectedCategory === cat.name ? 'bg-indigo-50 border-2 border-indigo-500' : 'hover:bg-gray-50'}`}>
                <div className="relative w-24 h-24 mx-auto">
                  <Image
                    alt={cat.name}
                    src={cat.image || "/item-2.png"}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div className={`font-bold mt-2 ${selectedCategory === cat.id ? 'text-indigo-600' : 'text-gray-800'}`}>
                  {cat.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        aria-label='Stat'
        onClick={handleNext}
        disabled={!category || startIndex >= category.length - 5}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full disabled:opacity-40 z-10"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}