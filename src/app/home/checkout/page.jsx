'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useOrder } from '@/hooks/useOrder';
import OrderReceiptModal from '@/components/modals/orderReciept';
import Navbar from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import CartPanel from '@/components/home/CartPanel';
import toast from 'react-hot-toast';
import Head from 'next/head';

export default function CheckoutPage() {
    // const router = useRouter();
    // const { createOrder, loading: orderLoading } = useOrder();
    // const [formData, setFormData] = useState({
    //     username: '',
    //     email: '',
    //     phone: '',
    //     city: '',
    //     address: '',
    //     paymentOption: 'jazzcash',
    //     country: 'Pakistan'
    // });
    // const [formErrors, setFormErrors] = useState({
    //     phone: ''
    // });
    // const [showReceipt, setShowReceipt] = useState(false);
    // const [orderDetails, setOrderDetails] = useState(null);
    // const [orderSuccess, setOrderSuccess] = useState(false);
    // const [isCartOpen, setIsCartOpen] = useState(false);


    // // Load cart items from localStorage
    // const [cartItems] = useState(() => {
    //     if (typeof window !== 'undefined') {
    //         const savedCart = localStorage.getItem('cart');
    //         return savedCart ? JSON.parse(savedCart) : [];
    //     }
    //     return [];
    // });

    // // Check if all required fields are filled
    // const isFormValid = () => {
    //     return (
    //         formData.username.trim() !== '' &&
    //         formData.email.trim() !== '' &&
    //         formData.phone.trim() !== '' &&
    //         formData.city.trim() !== '' &&
    //         formData.address.trim() !== '' &&
    //         formData.phone.length === 11
    //     );
    // };

    // const calculateTotal = () => {
    //     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    // };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));

    //     // Validate phone number specifically
    //     if (name === 'phone') {
    //         validatePhone(value);
    //     }
    // };

    // const validatePhone = (phone) => {
    //     if (phone.length > 0 && phone.length < 11) {
    //         setFormErrors(prev => ({
    //             ...prev,
    //             phone: 'Phone number must be 11 digits'
    //         }));
    //     } else if (phone.length === 11 && !phone.startsWith('03')) {
    //         setFormErrors(prev => ({
    //             ...prev,
    //             phone: 'Phone number should start with 03'
    //         }));
    //     } else {
    //         setFormErrors(prev => ({
    //             ...prev,
    //             phone: ''
    //         }));
    //     }
    // };

    // // const handleSubmit = async (e) => {
    // //     e.preventDefault();

    // //     // Final validation before submission
    // //     if (!isFormValid()) {
    // //         toast.error('Please fill all required fields correctly');
    // //         return;
    // //     }

    // //     try {
    // //         // Create an order for each product in the cart
    // //         const orderPromises = cartItems.map(item =>
    // //             createOrder({
    // //                 productId: item.id,
    // //                 userId: 'current-user-id',
    // //                 quantity: item.quantity,
    // //                 size: item.size,
    // //                 color: item.color,
    // //                 totalPrice: item.price * item.quantity,
    // //                 username: formData.username,
    // //                 email: formData.email,
    // //                 phone: formData.phone,
    // //                 role: 'user',
    // //                 city: formData.city,
    // //                 address: formData.address,
    // //                 paymentStatus: 'pending',
    // //                 country: formData.country,
    // //                 paymentMethod: formData.paymentOption
    // //             })
    // //         );

    // //         const createdOrders = await Promise.all(orderPromises);

    // //         // Set order details for the receipt with all products
    // //         setOrderDetails({
    // //             ...createdOrders[0],
    // //             products: cartItems.map((item, index) => ({
    // //                 ...item,
    // //                 orderId: createdOrders[index]?.id || '',
    // //                 orignal_price: item.price,
    // //                 discounted_price: item.price * item.quantity
    // //             })),
    // //             total: calculateTotal(),
    // //             customerInfo: {
    // //                 username: formData.username,
    // //                 email: formData.email,
    // //                 phone: formData.phone,
    // //                 address: formData.address,
    // //                 city: formData.city,
    // //                 country: formData.country
    // //             }
    // //         });

    // //         // Clear cart after successful order
    // //         localStorage.removeItem('cart');

    // //         // Show receipt modal
    // //         setShowReceipt(true);

    // //     } catch (error) {
    // //         toast.error(error.message || 'Failed to place order');
    // //     }
    // // };

    // // In your CheckoutPage component, replace the handleSubmit function:

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Final validation before submission
    //     if (!isFormValid()) {
    //         toast.error('Please fill all required fields correctly');
    //         return;
    //     }

    //     try {
    //         // Create a single order with all products
    //         const orderData = {
    //             userId: 'current-user-id', // You might want to get this from authentication
    //             products: cartItems.map(item => ({
    //                 productId: item.id,
    //                 quantity: item.quantity,
    //                 size: item.size,
    //                 color: item.color,
    //                 price: item.price,
    //                 title: item.title,
    //                 image: item.image
    //             })),
    //             totalPrice: parseFloat(calculateTotal()),
    //             username: formData.username,
    //             email: formData.email,
    //             phone: formData.phone,
    //             role: 'user',
    //             city: formData.city,
    //             address: formData.address,
    //             paymentStatus: 'pending',
    //             country: formData.country,
    //             paymentMethod: formData.paymentOption
    //         };

    //         const createdOrder = await createOrder(orderData);

    //         // Set order details for the receipt with all products
    //         setOrderDetails({
    //             ...createdOrder,
    //             products: cartItems,
    //             total: calculateTotal(),
    //             customerInfo: {
    //                 username: formData.username,
    //                 email: formData.email,
    //                 phone: formData.phone,
    //                 address: formData.address,
    //                 city: formData.city,
    //                 country: formData.country
    //             }
    //         });

    //         // Clear cart after successful order
    //         localStorage.removeItem('cart');

    //         // Show receipt modal
    //         setShowReceipt(true);

    //     } catch (error) {
    //         toast.error(error.message || 'Failed to place order');
    //     }
    // };

    const router = useRouter();
    const { createOrder, loading: orderLoading } = useOrder();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        paymentOption: 'jazzcash',
        country: 'Pakistan'
    });
    const [formErrors, setFormErrors] = useState({
        phone: '',
        email: ''
    });
    const [showReceipt, setShowReceipt] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart items from localStorage
    const [cartItems] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });

    // Check if all required fields are filled
    const isFormValid = () => {
        return (
            formData.username.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.phone.trim() !== '' &&
            formData.city.trim() !== '' &&
            formData.address.trim() !== '' &&
            formData.phone.length === 11 &&
            formErrors.email === '' // Add email validation check
        );
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    // Email validation function
    const validateEmail = (email) => {
        if (!email.includes('@') || !email.endsWith('.com')) {
            setFormErrors(prev => ({
                ...prev,
                email: 'Email must include @ and end with .com'
            }));
        } else {
            setFormErrors(prev => ({
                ...prev,
                email: ''
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate phone number specifically
        if (name === 'phone') {
            validatePhone(value);
        }

        // Validate email on change
        if (name === 'email') {
            validateEmail(value);
        }
    };

    // Handle email blur for additional validation
    const handleEmailBlur = (e) => {
        const { value } = e.target;
        validateEmail(value);
    };

    const validatePhone = (phone) => {
        if (phone.length > 0 && phone.length < 11) {
            setFormErrors(prev => ({
                ...prev,
                phone: 'Phone number must be 11 digits'
            }));
        } else if (phone.length === 11 && !phone.startsWith('03')) {
            setFormErrors(prev => ({
                ...prev,
                phone: 'Phone number should start with 03'
            }));
        } else {
            setFormErrors(prev => ({
                ...prev,
                phone: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation before submission
        if (!isFormValid()) {
            toast.error('Please fill all required fields correctly');
            return;
        }

        try {
            // Create a single order with all products
            const orderData = {
                userId: 'current-user-id', // You might want to get this from authentication
                products: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    price: item.price,
                    title: item.title,
                    image: item.image
                })),
                totalPrice: parseFloat(calculateTotal()),
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                role: 'user',
                city: formData.city,
                address: formData.address,
                paymentStatus: 'pending',
                country: formData.country,
                paymentMethod: formData.paymentOption
            };

            const createdOrder = await createOrder(orderData);

            // Set order details for the receipt with all products
            setOrderDetails({
                ...createdOrder,
                products: cartItems,
                total: calculateTotal(),
                customerInfo: {
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    country: formData.country
                }
            });

            // Clear cart after successful order
            localStorage.removeItem('cart');

            // Show receipt modal
            setShowReceipt(true);

        } catch (error) {
            toast.error(error.message || 'Failed to place order');
        }
    };

    if (orderSuccess) {
        return (
            <div>
                <Navbar setCart={setIsCartOpen} />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                        <p className="text-gray-600 mb-6">Thank you for your purchase. And Hope you saved the reciept.</p>
                        <Link href="/" className="inline-block bg-green-100 hover:bg-green-200 text-green-600 font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
                            Continue Shopping
                        </Link>
                        <div className="animate-pulse text-sm text-gray-500 mt-4">Happy Shopping on Creative Ghar</div>
                    </div>
                </div>
                <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                <Footer />
            </div>
        );
    }

    return (
        <>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1694571487917100');
              fbq('track', 'PageView');
            `,
                    }}
                />
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: 'none' }}
                        src="https://www.facebook.com/tr?id=1694571487917100&ev=PageView&noscript=1"
                        alt="Facebook Pixel"
                    />
                </noscript>
            </head>
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex flex-col gap-4 items-start md:flex-row md:justify-between md:items-center">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center border-1 border-gray-500 hover:border-indigo-400 hover:scale-105 transition-all duration-300 rounded-[8px] px-2 py-1 cursor-pointer text-black-600 hover:text-indigo-800"
                            >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Go Back
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
                            <div className="w-10"></div> {/* Spacer for balance */}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
                            {/* Order Summary */}
                            <div className="md:col-span-1 order-2 md:order-1">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

                                    {/* <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center">
                                            <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-center object-cover"
                                                />
                                            </div>
                                            <div className="ml-4 flex-2">
                                                <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                                                <p className="text-sm text-gray-500">RS {item.price.toFixed(2)} × {item.quantity}</p>
                                            </div>
                                            <div className="ml-4 flex-1">
                                                {item.hasVariants && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {item.size && <p>Size: {item.size}</p>}
                                                        {item.color && <p>Color: {item.color}</p>}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">
                                                RS {(item.price * item.quantity).toFixed(2)} PKR
                                            </p>
                                        </div>
                                    ))}
                                </div> */}
                                    <div className="space-y-6">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50 hover:bg-white transition-colors duration-200">
                                                <div className="flex-shrink-0 w-20 h-20 overflow-hidden border border-gray-200 rounded-md">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        width={80}
                                                        height={80}
                                                        className="w-full h-full object-cover object-center"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1 min-w-0 pr-4">
                                                            <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2">
                                                                {item.title}
                                                            </h3>
                                                            {item.hasVariants && (
                                                                <div className="mt-1 text-xs text-gray-500">
                                                                    {item.size && <p className="mt-0.5">Size: {item.size}</p>}
                                                                    {item.color && <p className="mt-0.5">Color: {item.color}</p>}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-base font-semibold text-gray-900 text-right">
                                                            RS {(item.price * item.quantity)}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            RS {item.price} x {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <p>Subtotal</p>
                                            <p>RS {calculateTotal()} PKR</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-sm text-gray-600">Shipping</p>
                                            <p className="text-sm text-gray-600">Free</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-sm text-gray-600">Taxes</p>
                                            <p className="text-sm text-gray-600">RS 0.00</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between text-lg font-bold text-gray-900">
                                        <p>Total</p>
                                        <p>RS {calculateTotal()} PKR</p>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Form */}
                            <div className="md:col-span-2 order-1 md:order-2">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                {/* Username field - remains the same */}
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                                        Username
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="username"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>

                                                {/* Email field - remains the same */}
                                                {/* <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div> */}

                                                <div className="relative">
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        onBlur={handleEmailBlur}
                                                        required
                                                        className={`mt-1 block w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                                    />
                                                    {formErrors.email && (
                                                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                                    )}
                                                </div>

                                                {/* Phone field with validation */}
                                                <div className='relative' >
                                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                        Mobile Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, '');
                                                            if (
                                                                value === '' ||
                                                                value.length < 2 ||
                                                                (value.startsWith('03') && value.length <= 11)
                                                            ) {
                                                                handleChange({
                                                                    target: {
                                                                        name: 'phone',
                                                                        value: value
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="03XXXXXXXXX"
                                                    />
                                                    {/* {formErrors.phone && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                                                )} */}
                                                    {formData.phone.length > 0 && formData.phone.length < 11 && (
                                                        <div className="border-1 border-green-500 bg-green-400/10 px-2 py-1 rounded-[8px] absolute  mt-1 text-sm text-green-600">Phone starts with 03 and it'll be of 11 digits</div>
                                                    )}
                                                </div>

                                                {/* Address field - remains the same */}
                                                <div className="mt-10 lg:mt-2 sm:col-span-2">
                                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                                        Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>

                                                {/* City field - remains the same */}
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="city"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>

                                                {/* Country field - remains the same */}
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                                        Country
                                                    </label>
                                                    <select
                                                        id="country"
                                                        name="country"
                                                        value={formData.country}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    >
                                                        <option>Pakistan</option>
                                                        <option disabled>Other countries (disabled for demo)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>

                                            <div className="space-y-4">
                                                <div className="flex items-center">
                                                    <input
                                                        id="jazzcash"
                                                        name="paymentOption"
                                                        type="radio"
                                                        value="jazzcash"
                                                        checked={formData.paymentOption === 'jazzcash'}
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <label htmlFor="jazzcash" className="ml-3 block text-sm font-medium text-gray-700">
                                                        JazzCash (03071991737)
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    <input
                                                        id="easypaisa"
                                                        name="paymentOption"
                                                        type="radio"
                                                        value="easypaisa"
                                                        checked={formData.paymentOption === 'easypaisa'}
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <label htmlFor="easypaisa" className="ml-3 block text-sm font-medium text-gray-700">
                                                        EasyPaisa (03478196414)
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    <input
                                                        id="cod"
                                                        name="paymentOption"
                                                        type="radio"
                                                        value="cod"
                                                        checked={formData.paymentOption === 'cod'}
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                                                        Cash On Delivery
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <button
                                                type="submit"
                                                disabled={orderLoading || cartItems.length === 0 || !isFormValid()}
                                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${orderLoading || cartItems.length === 0 || !isFormValid()
                                                    ? 'opacity-75 cursor-not-allowed'
                                                    : ''
                                                    }`}
                                            >
                                                {orderLoading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Place Order'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


                {showReceipt && orderDetails && (
                    <OrderReceiptModal
                        orderDetails={orderDetails}
                        onClose={() => setShowReceipt(false)}
                        onModalClose={() => {
                            setShowReceipt(false);
                            setOrderSuccess(true);
                        }}
                    />
                )}
            </div>
        </>
    );
}