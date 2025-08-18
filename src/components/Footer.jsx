import { Facebook, Instagram } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Footer = () => {
    return (
        <div className='max-w-[1320px] mx-auto '>
            <div className=' border-t-1 border-gray-100 flex justify-around flex-col md:flex-row py-8 gap-10 px-4'>
                {/* Logo column - centered on small screens, normal on larger */}
                <div className=' flex items-center justify-center'>
                    <Image
                        alt='logo'
                        src='/creative-logo.png'
                        height={100}
                        width={100}
                        className='object-contain'
                    />
                </div>

                <div className=' flex flex-col gap-1'>
                    <div className='font-bold'>Customer Care</div>
                    <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>Privacy Policy</div>
                    <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>Refund Policy</div>
                    <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>Shipping Policy</div>
                    <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>Terms of Service</div>
                </div>

                <div className=' flex flex-col gap-1'>
                    <div className='font-bold'>Collections</div>
                    <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>Home</div>
                    <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>Fashion & Beauty</div>
                    <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>Customize Products</div>
                </div>

                <div className=' flex flex-col gap-1'>
                    <div className='font-bold'>Social Links</div>
                    <div className='flex items-center mt-4 gap-4 justify-start'>
                        <Facebook className='text-[9px] cursor-pointer' />
                        <Instagram className='text-[8px] cursor-pointer' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer