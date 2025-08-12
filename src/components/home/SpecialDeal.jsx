import Image from 'next/image'
import React from 'react'

const SpecialDeal = () => {
    return (
        <div className='grid grid-cols-12' >
            <div className='col-span-12 md:col-span-6 overflow-hidden' >
                <Image alt='Deal Banner' src='/image-1.png' className='object-contain hover:scale-105 transition-transform duration-500 ease-in-out' height={600} width={650} />
            </div>

            <div className='col-span-12 md:col-span-6 bg-red-500 pt-[10%] pb-[10%] pr-[5%] md:pt-[20%] pl-[5%]' >
                <div className='flex flex-col gap-5 md:max-w-[60%]' >
                    <i className='text-yellow-400 text-2xl md:text-3xl font-bold' >Top Rated</i>
                    <div className='text-white font-bold text-xl md:text-2xl' >
                        Our Top Selling Product with the best in our new Deal offer
                    </div>
                    <div className='text-yellow-400 font-bold' >The two items on the best price to save 40%</div>

                    <div className='text-white' >
                        Mock Text for like product description
                        Mock Text for like product description
                    </div>

                    <button className='bg-yellow-500 cursor-pointer w-fit   rounded-full px-3 py-1 mt-3' >Order Now</button>

                </div>
            </div>
        </div>
    )
}

export default SpecialDeal