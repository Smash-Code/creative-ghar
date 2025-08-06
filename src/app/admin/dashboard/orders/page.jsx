import Sidebar from '@/components/Sidebar'
import React from 'react'
import OrdersList from './orderList'
import Link from 'next/link'

const page = () => {
  return (
    <div className='flex min-h-screen' >
        {/* <Sidebar/> */}
         <div className="flex-1 overflow-auto">
        <div className="p-6">
              {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
            <div className="flex space-x-4">
              <Link 
                href="/admin/dashboard/products" 
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Show All Products
              </Link>
            </div>
          </div>


           <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">

        <OrdersList/>
            </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default page