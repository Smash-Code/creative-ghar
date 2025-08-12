import { Facebook, Instagram } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Footer = () => {
    return (
        <div className='bg-[#faf5f0] grid grid-cols-12 py-8 gap-10 px-4' >
            <div className='col-span-12 md:col-span-6 lg:col-span-3' >
                <Image alt='logo' src='/creative-logo.png' height={100} width={100} className='object-contain' />
            </div>
            <div className='col-span-12 md:col-span-6 lg:col-span-3 flex flex-col gap-1' >
                <div className='font-bold' >Customer Care</div>
                <div className='text-sm text-gray-500 cursor-pointer hover:text-black' >Privacy Policy</div>
                <div className='text-sm text-gray-500 cursor-pointer hover:text-black' >Refund Policy</div>
                <div className='text-sm text-gray-500 cursor-pointer hover:text-black' >Shipping Policy</div>
                <div className='text-sm text-gray-500 cursor-pointer hover:text-black' >Terms of Serivce</div>
            </div>
            <div className='col-span-12 md:col-span-6 lg:col-span-3 flex flex-col gap-1' >
                <div className='font-bold' >Collections</div>
                <div className='text-sm text-gray-500 cursor-pointer hover:text-black' >Home</div>
                <div className='text-sm text-gray-500 cursor-pointer hover:text-black' >Fashion & Beauty</div>
                <div className='text-sm text-gray-500 cursor-pointer hover:text-black' >Customize Products</div>
            </div>
            <div className='col-span-12 md:col-span-6 lg:col-span-3 flex flex-col gap-1' >
                <div className='font-bold' >Social Links</div>
                <div className='flex items-center mt-4 gap-4' >
                    <Facebook className='text-[9px] cursor-pointer' />
                    <Instagram className='text-[8px] cursor-pointer' />
                </div>
            </div>
        </div>
    )
}

export default Footer