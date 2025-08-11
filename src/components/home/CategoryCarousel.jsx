"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Carousel() {
  const items = Array.from({ length: 15 }, (_, i) => i + 1); // Example data
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handleNext = () => {
    if (startIndex < items.length - 5) setStartIndex(startIndex + 1);
  };

  return (
    <div className="relative w-full mx-auto">
      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full disabled:opacity-40"
      >
        <ChevronLeftIcon />
      </button>

      {/* Carousel Items */}
      <div className="overflow-hidden ml-9">
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${startIndex * (100 / 5)}%)`,
            width: `${(items.length / 5) * 100}%`,
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="w-1/14 flex-shrink-0 p-2"
            >
              <div className=" text-center py-10 rounded-lg">
                <Image alt="category" width={240} height={100} src="/item-2.png" />
                <div className="font-bold">Category Name</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        disabled={startIndex >= items.length - 5}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full disabled:opacity-40"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}
