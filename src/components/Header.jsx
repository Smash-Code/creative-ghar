// components/Navbar.jsx
'use client';

import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCategory } from '@/hooks/useCategory'; // Adjust the import path as needed

export default function Navbar({ setCart }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { category: categories, getAllCategories } = useCategory();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        await getAllCategories();
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full mx-auto z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md top-0' : 'bg-white '}`}>
      <div className="mx-auto px-3 md:px-10 py-2 flex justify-between items-center">
        {/* Logo - Creative Ghar */}
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
          <Image src="/creative-logo.png" height={80} width={80} className='object-contain hidden md:block' alt='Creative Ghar' />
          <Image src="/creative-logo.png" height={55} width={55} className='object-contain md:hidden' alt='Creative Ghar' />
        </Link>

        {/* Categories in center - Desktop */}
        <div className="hidden md:flex items-center space-x-6 mx-6 flex-1 justify-center">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/home/products/category/${category.name}`}
              className="text-gray-700 text-xl hover:text-indigo-600 transition-colors whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Desktop Navigation - Right side */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => setCart(true)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ShoppingCart className="h-7 w-7 text-gray-700" />
            </button>

            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User className="h-7 w-7 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg pb-4 px-4">
          {/* Mobile Categories */}
          <div className="flex flex-col space-y-3 pt-2">
            {categories?.map((category) => (
              <Link
                key={category._id}
                href={`/home/products/category/${category.name}`}
                className="text-gray-700 hover:text-indigo-600 transition-colors py-2 px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4 pt-2 border-t border-gray-100">
            <button onClick={() => setCart(true)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
            </button>

            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}