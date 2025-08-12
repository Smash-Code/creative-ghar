import Image from 'next/image'
import React from 'react'

const Newsletter = () => {
    return (
        <div className='relative' >
            <div className='min-h-[300px]' >
                <Image src='/Newsletter-img.jpg' alt='Newsletter' height={300} width={1320} className='min-h-[300px] min-w-[1200px] object-center' />
            </div>
            <div className='absolute top-[15%] md:top-[25%] left-0 right-0 mx-auto flex flex-col items-center justify-center ' >
                <div className='text-2xl md:text-3xl font-bold text-white text-center ' >Subscribe To Our Newsletter</div>
                <div className='text-white text-[12px] my-3 max-w-[95%] md:max-w-[45%] text-center' >Everyone loves a good deal so your subscribers are sure to enjoy getting emails from you that contain awesome coupons and promotions.</div>
                <div className='flex flex-col md:flex-row items-center gap-4' >
                    <input type='text' placeholder='Email' className='outline-0 focus:outline-0 px-3 text-[10px] py-2 min-w-[100%] md:min-w-[500px] rounded-full bg-white' />
                    <button className='px-3 py-1 cursor-pointer text-white text-sm bg-red-500 rounded-full' >Subscribe</button>
                </div>
            </div>
        </div>
    )
}

export default Newsletter