import { Shirt, ShoppingBag, ShoppingBasketIcon, Truck } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Services = () => {
    return (
        <div>
            <div className="relative " >
                <div className='min-h-[300px]' >
                    <Image alt="Banner" height={300} width={1320} src='/banner_img.jpg' className="min-h-[300px] min-w-[600px] object-contain" />
                </div>
                <div className="absolute max-w-[100%] md:max-w-[60%] lg:max-w-[40%] left-[5%] top-[15%] md:top-[35%]" >
                    <div className="text-red-500 text-xl lg:text-3xl font-bold  " >
                        Top Trending Product
                    </div>
                    <div className="text-black text-lg lg:text-3xl font-semibold my-1 md:my-4" >
                        The best product of the store to buy in this sale
                    </div>
                    <div className="text-yellow-800 text-md lg:text-xl my-1 md:my-4" >
                        With 40% off , and a free shipping offer.
                    </div>
                    <div className="font-semibold text-black" >
                        Enjoy double portions of delicious mozzarella cheese Crispy paneer,onion,green capsicum.
                    </div>

                    <div className="bg-yellow-500 px-3 py-1 rounded-full w-fit my-2 md:my-5 cursor-pointer" > Order Now </div>
                </div>
            </div>

            <div className="grid grid-cols-12" >
                <div className="flex flex-col items-center col-span-12 md:col-span-6 lg:col-span-3 py-10 border-1 border-gray-200" >
                    <div className="mb-2" >
                        <Truck className="text-red-500" size={40} />
                    </div>
                    <div className="font-bold" >Fast & Free shipping</div>
                    <div className="text-gray-400 text-sm font-light" >We Provide free shipping here</div>
                </div>
                <div className="flex flex-col items-center col-span-12 md:col-span-6 lg:col-span-3 py-10 border-1 border-gray-200" >
                    <div className="mb-2" >
                        <Shirt className="text-red-500" size={40} />
                    </div>
                    <div className="font-bold" >Fast & Free shipping</div>
                    <div className="text-gray-400 text-sm font-light" >We Provide free shipping here</div>
                </div>
                <div className="flex flex-col items-center col-span-12 md:col-span-6 lg:col-span-3 py-10 border-1 border-gray-200" >
                    <div className="mb-2" >
                        <ShoppingBag className="text-red-500" size={40} />
                    </div>
                    <div className="font-bold" >Fast & Free shipping</div>
                    <div className="text-gray-400 text-sm font-light" >We Provide free shipping here</div>
                </div>
                <div className="flex flex-col items-center col-span-12 md:col-span-6 lg:col-span-3 py-10 border-1 border-gray-200" >
                    <div className="mb-2" >
                        <ShoppingBasketIcon className="text-red-500" size={40} />
                    </div>
                    <div className="font-bold" >Fast & Free shipping</div>
                    <div className="text-gray-400 text-sm font-light" >We Provide free shipping here</div>
                </div>
            </div>
        </div>
    )
}

export default Services