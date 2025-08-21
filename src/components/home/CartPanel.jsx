'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';

export default function CartPanel({ isOpen, onClose }) {
    const router = useRouter();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        calculateTotal
    } = useCart();

    const handleCheckout = () => {
        router.push('/home/checkout');
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 overflow-hidden">
                {/* Background overlay */}
                <div
                    className="absolute inset-0 bg-gray-500/40 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Sidebar panel */}
                <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                    <div className="w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                                    <button
                                        type="button"
                                        className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close panel</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-8">
                                    <div className="flow-root">
                                        {cartItems.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-gray-500">Your cart is empty</p>
                                                <button
                                                    onClick={onClose}
                                                    className="mt-4 px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500"
                                                >
                                                    Continue Shopping
                                                </button>
                                            </div>
                                        ) : (
                                            <ul className="-my-6 divide-y divide-gray-200">
                                                {cartItems.map((item) => (
                                                    <li key={`${item.id}-${item.size}-${item.color}`} className="py-6 flex">
                                                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.title}
                                                                width={96}
                                                                height={96}
                                                                className="w-full h-full object-center object-cover"
                                                            />
                                                        </div>

                                                        <div className="ml-4 flex-1 flex flex-col">
                                                            <div>
                                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                                    <h3>{item.title}</h3>
                                                                    <p className="ml-4">RS {(item.price * item.quantity).toFixed(2)} PKR</p>
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-500">RS {item.price.toFixed(2)} each</p>
                                                            </div>
                                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                                {/* <div className="flex items-center border border-gray-300 rounded-md">
                                                                    <button
                                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                        className="px-2 py-1 text-gray-600"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="px-2">{item.quantity}</span>
                                                                    <button
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                        className="px-2 py-1 text-gray-600"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div> */}

                                                                <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                                                                    <button
                                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                        className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-200 disabled:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        disabled={item.quantity <= 1}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                            <path fillRule="evenodd" d="M3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                    <span className="w-10 text-center text-sm font-medium text-gray-700 select-none">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                        className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-200"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v7.5h7.5a.75.75 0 0 1 0 1.5h-7.5v7.5a.75.75 0 0 1-1.5 0v-7.5h-7.5a.75.75 0 0 1 0-1.5h7.5v-7.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                                <div className="ml-4 flex-1">
                                                                    {item.hasVariants && (
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            {item.size && <p>Size: {item.size}</p>}
                                                                            {item.color && <p>Color: {item.color}</p>}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    className="font-medium text-red-400 hover:text-red-500"
                                                                    onClick={() => removeFromCart(item.id)}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {cartItems.length > 0 && (
                                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <p>Subtotal</p>
                                        <p>RS {calculateTotal()} PKR</p>
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                    <div className="mt-6">
                                        <button
                                            onClick={handleCheckout}
                                            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-500 hover:bg-red-600"
                                        >
                                            Checkout
                                        </button>
                                    </div>
                                    <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                        <p>
                                            or{' '}
                                            <button
                                                type="button"
                                                className="text-red-500 font-medium hover:text-red-600"
                                                onClick={onClose}
                                            >
                                                Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}