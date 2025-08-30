"use client"
import { useCategory } from '@/hooks/useCategory'
import { Facebook, Instagram } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'

const Footer = () => {
    const { category, getAllCategories } = useCategory()
    useEffect(() => {
        getAllCategories()
    }, [])

    return (
        <div className='max-w-[1320px] mx-auto pl-[2%] pr-[4%] '>
            <div className=' border-t-1 border-gray-100 flex justify-between flex-col md:flex-row py-8 gap-10 px-4'>
                {/* Logo column - centered on small screens, normal on larger */}
                <div className=' flex items-center justify-center'>
                    <Link href="/" >
                        <Image
                            alt='logo'
                            src='/creative-logo.png'
                            height={100}
                            width={100}
                            className='object-contain'
                        />
                    </Link>
                </div>

                <div className=' flex flex-col gap-1'>
                    <div className='font-bold'>Customer Care</div>
                    <Link href="/home/privacy-policy" >
                        <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>Privacy Policy</div>
                    </Link>
                    <Link href="/home/refund-policy" >
                        <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>Refund Policy</div>
                    </Link>
                    <Link href="/home/shipping-policy" >
                        <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>Shipping Policy</div>
                    </Link>
                    <Link href="/home/terms" >
                        <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>Terms of Service</div>
                    </Link>
                </div>

                <div className=' flex flex-col gap-1'>
                    <div className='font-bold'>Collections</div>

                    {
                        category && category.map((item, ind) => {
                            return (
                                <Link key={ind} href={`/home/products/category/${item.name}`} >
                                    <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>{item.name}</div>
                                </Link>
                            )
                        })
                    }
                    {/* <Link href={`/home/products/category/Customize Products`} >
                        <div className='text-sm text-gray-500 cursor-pointer hover:text-black'>Customize Products</div>
                    </Link> */}
                </div>

                <div className=' flex flex-col gap-1'>
                    <div className='font-bold'>Social Links</div>
                    <div className='flex items-center mt-4 gap-4 justify-center md:justify-start'>
                        <Link href="https://www.facebook.com/profile.php?id=61576762615794" target='_blank' aria-label="Visit our Facebook page" >
                            <Facebook className='text-[9px] cursor-pointer' />
                        </Link>
                        <Link href="https://www.instagram.com/creativeghar7/" aria-label="Visit our Instagram page" target='_blank' >
                            <Instagram className='text-[8px] cursor-pointer' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer