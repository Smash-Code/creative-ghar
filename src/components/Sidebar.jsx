'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  // Helper function to determine if a link is active
  const isActive = (href) => {
    return pathname === href ||
      (href !== '/' && pathname.startsWith(href));
  };

  return (
    <div className="w-44 md:w-64 h-screen  bg-white text-gray-800 shadow-md">
      <div className="p-4 border-b border-gray-300">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {/* <li>
            <Link
              href="/admin/dashboard"
              className={`flex items-center p-2 rounded transition-colors ${isActive('/dashboard'.trim())
                ? 'bg-indigo-100 text-indigo-500'
                : 'hover:bg-indigo-100'
                }`}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 " />
              </svg>
              Dashboard
            </Link>
          </li> */}

          <li>
            <Link
              href="/admin/dashboard/products"
              className={`flex items-center p-2 rounded transition-colors ${isActive('/admin/dashboard/products')
                ? 'bg-indigo-100 text-indigo-500'
                : 'hover:bg-indigo-100'
                }`}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Products
            </Link>
          </li>
          <li>
            <Link
              href="/admin/dashboard/orders"
              className={`flex items-center p-2 rounded transition-colors ${isActive('/admin/dashboard/orders')
                ? 'bg-indigo-100 text-indigo-500'
                : 'hover:bg-indigo-100'
                }`}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
              Orders
            </Link>
          </li>
          <li>
            <Link
              href="/admin/dashboard/category"
              className={`flex items-center p-2 rounded transition-colors ${isActive('/admin/dashboard/category')
                ? 'bg-indigo-100 text-indigo-500'
                : 'hover:bg-indigo-100'
                }`}
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M4 4h5l2 2h9a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
                />
              </svg>
              Categories
            </Link>
          </li>

          {/* <li>
            <Link 
              href="/dashboard/accounts" 
              className={`flex items-center p-2 rounded transition-colors ${
                isActive('/dashboard/accounts') 
                  ? 'bg-indigo-600' 
                  : 'hover:bg-indigo-600'
              }`}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Accounts
            </Link>
          </li> */}

          <li>
            <Link
              href="/admin/dashboard/banner"
              className={`flex items-center p-2 rounded transition-colors ${isActive('/admin/dashboard/banner')
                ? 'bg-indigo-100 text-indigo-500'
                : 'hover:bg-indigo-100'
                }`}
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M4 4h5l2 2h9a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
                />
              </svg>
              Hero Banner
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className={`flex items-center p-2 rounded transition-colors ${isActive('/dashboard')
                ? 'bg-indigo-100 text-indigo-500'
                : 'hover:bg-indigo-100'
                }`}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              View Site
            </Link>
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;