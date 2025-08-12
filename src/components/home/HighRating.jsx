import { Star } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const HighRating = () => {
    return (
        <div className=" my-[10%]" >
            <div className="flex items-center flex-col lg:flex-row justify-center gap-4" >
                <div className="overflow-hidden relative" >
                    <Image alt="banner-2" src="/image_1.png" height={450} width={450} className="object-contain hover:scale-105 transition-transform duration-500 ease-in-out" />
                    <div className='absolute top-[16%] left-[5%] max-w-[50%]' >
                        <i className='text-yellow-500 text-xl font-bold' >Top Rated</i>
                        <div className='text-red-400 font-bold text-lg' >
                            Our Top Selling Product
                        </div>
                        <div className='text-yellow-500 text-xl font-bold' >Product Name</div>

                        <button className='bg-yellow-500 cursor-pointer rounded-full px-3 py-1 mt-3' >Order Now</button>

                    </div>
                </div>
                <div className="overflow-hidden relative" >
                    <Image alt="banner-3" src="/image_2.png" height={450} width={450} className="object-contain hover:scale-105 transition-transform duration-500 ease-in-out" />
                    <div className='absolute top-[16%] left-[5%] max-w-[50%]' >
                        <i className='text-yellow-500 text-xl font-bold' >Top Rated</i>
                        <div className='text-red-400 font-bold text-lg' >
                            Our Top Selling Product
                        </div>
                        <div className='text-yellow-500 text-xl font-bold' >Product Name</div>

                        <button className='bg-yellow-500 cursor-pointer rounded-full px-3 py-1 mt-3' >Order Now</button>

                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-[5%]">
                <div className="flex items-center gap-2" >
                    <Star className="text-yellow-500" />
                    <Star className="text-yellow-500" />
                    <Star className="text-yellow-500" />
                    <Star className="text-yellow-500" />
                    <Star className="text-yellow-500" />
                </div>
                <div className="mt-[2%] font-semibold md:font-bold w-[90%] md:w-[55%] lg:w-[35%] text-center" >
                    some mock test comment of a user who bought a product
                </div>
            </div>
        </div>
    )
}

export default HighRating