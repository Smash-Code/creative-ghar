import { Crown } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Sale = () => {
    return (
        <div className='mt-[5%]'>
            <div className='text-center text-[36px] font-semibold' >Top Categories</div>
            <div className="grid grid-cols-12 mx-[10%] mt-[2%] mb-[5%] gap-3" >
                <div className="col-span-12 md:col-span-6 " >
                    <Image src="/image_3.png" height={450} width={600} alt="perfume" />
                </div>
                <div className="col-span-12 md:col-span-6" >
                    <Image src="/image_4.png" height={450} width={600} alt="perfume" />
                    {/* <div className='font-bold text-[20px] md:text-[36px]' >
                    Amazing Deals in the products we offers
                    </div>
                    <div className='text-gray-600 my-4 text-sm' >
                    Welcome too restaurant where culinary excellence meets hospitality in every dish we serve nestled in the heart of City Name our eatery invites you on a journey
                </div>
                <div className='flex flex-col gap-5 md:gap-0 md:flex-row items-center' >
                    <div className='flex gap-4' >
                    <Crown className='text-red-500' size={60} />
                    <div className='font-bold text-[20px]' >
                            Best Quality Product
                            <div className='text-sm text-gray-600 font-light' >
                                Our best providers provide the quality products
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-4' >
                        <Crown className='text-red-500' size={60} />
                        <div className='font-bold text-[20px]' >
                            Best Quality Product
                            <div className='text-sm text-gray-600 font-light' >
                                Our best providers provide the quality products
                            </div>
                        </div>
                    </div>
                </div>

                <div className='my-6 pointer-cursor' >
                    <div className='bg-red-500 font-bold text-white px-4 py-1 rounded-full w-fit' >Order Now</div>
                </div> */}
                </div>
            </div>
        </div>

    )
}

export default Sale