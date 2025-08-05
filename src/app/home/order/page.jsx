import React from 'react'
// import OrdersList from './orderList'
import Link from 'next/link'
import OrdersList from './orderList'

const page = () => {
  return (
    <div className='flex min-h-screen' >
         <div className="flex-1 overflow-auto">
        <div className="p-6">
               <Link 
        href="/home"   
        className="px-4 py-2 w-fit m-4 ml-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center">
         
          Go to Home
      </Link>


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