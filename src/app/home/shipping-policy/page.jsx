import Head from 'next/head';
import { Truck, Globe, Clock, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import Navbar from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShippingPolicy() {
    return (
        <>
            <h1 className='text-white absolute top-0' >Creative ghar store</h1>

            <Navbar />

            <div className="min-h-screen pt-[10%] bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-indigo-600 px-6 py-8 text-white">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Shipping Policy</h1>
                            <p className="text-indigo-100">
                                Thank you for shopping with Creative Ghar! We're committed to delivering your products quickly, safely, and affordably.
                            </p>
                        </div>

                        <div className="p-6 md:p-8">
                            {/* Domestic Shipping */}
                            <div className="mb-10">
                                <div className="flex items-center mb-4">
                                    <Truck className="h-8 w-8 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-800">Shipping Within Pakistan</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-gray-50 p-5 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                                            <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                                            Delivery Time
                                        </h3>
                                        <p className="text-gray-600">3 to 7 business days (excluding weekends & public holidays)</p>
                                    </div>

                                    <div className="bg-gray-50 p-5 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">Shipping Charges</h3>
                                        <ul className="text-gray-600 space-y-2">
                                            <li className="flex items-start">
                                                <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2"></span>
                                                Standard Shipping: PKR 300 flat rate
                                            </li>
                                            <li className="flex items-start">
                                                <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2"></span>
                                                Free Shipping: On orders over PKR 3,500
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                                    <h3 className="font-semibold text-blue-800 mb-2">Couriers Used</h3>
                                    <p className="text-blue-700">TCS, Leopards Courier, M&P, Call Courier (based on your location)</p>
                                </div>
                            </div>

                            {/* International Shipping */}
                            <div className="mb-10">
                                <div className="flex items-center mb-4">
                                    <Globe className="h-8 w-8 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-800">International Shipping</h2>
                                </div>

                                <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
                                    <p className="text-amber-800 mb-3">
                                        Currently, we do not offer international shipping.
                                    </p>
                                    <p className="text-amber-700">
                                        If you are outside Pakistan and interested in our products, please email us at{' '}
                                        <a href="mailto:creativeghar7@gmail.com" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                            creativeghar7@gmail.com
                                        </a>
                                        , and we'll try to assist you.
                                    </p>
                                </div>
                            </div>

                            {/* Order Processing */}
                            <div className="mb-10">
                                <div className="flex items-center mb-4">
                                    <Clock className="h-8 w-8 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-800">Order Processing Time</h2>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-lg">
                                    <ul className="text-gray-700 space-y-3">
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3"></span>
                                            Orders are processed within 24–48 hours of confirmation.
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3"></span>
                                            You'll receive a confirmation email or SMS with your tracking number once your order has been dispatched.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Delays & Tracking */}
                            <div className="mb-10">
                                <div className="flex items-center mb-4">
                                    <AlertCircle className="h-8 w-8 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-800">Delays & Tracking</h2>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-lg">
                                    <ul className="text-gray-700 space-y-3">
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3"></span>
                                            While we strive for timely delivery, delays may occur due to weather, strikes, or courier issues.
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3"></span>
                                            You can track your order using the tracking number provided.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Incorrect Address */}
                            <div className="mb-10">
                                <div className="flex items-center mb-4">
                                    <MapPin className="h-8 w-8 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-800">Incorrect Address</h2>
                                </div>

                                <div className="bg-red-50 p-5 rounded-lg border border-red-100">
                                    <ul className="text-red-800 space-y-3">
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></span>
                                            Please ensure that your shipping address is accurate.
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></span>
                                            Creative Ghar is not responsible for undelivered packages due to incorrect or incomplete addresses.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <Phone className="h-8 w-8 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-800">Need Help?</h2>
                                </div>

                                <p className="text-gray-600 mb-6">If you have any questions or concerns about shipping, feel free to contact us:</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-indigo-50 p-5 rounded-lg">
                                        <div className="flex items-center mb-3">
                                            <Mail className="h-5 w-5 text-indigo-600 mr-2" />
                                            <h3 className="font-semibold text-indigo-800">Email</h3>
                                        </div>
                                        <a href="mailto:creativeghar7@gmail.com" className="text-indigo-600 hover:text-indigo-800">
                                            creativeghar7@gmail.com
                                        </a>
                                    </div>

                                    <div className="bg-indigo-50 p-5 rounded-lg">
                                        <div className="flex items-center mb-3">
                                            <Phone className="h-5 w-5 text-indigo-600 mr-2" />
                                            <h3 className="font-semibold text-indigo-800">Phone</h3>
                                        </div>
                                        <a href="tel:03457036429" className="text-indigo-600 hover:text-indigo-800">
                                            03457036429
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-lg mt-6">
                                    <div className="flex items-center">
                                        <Clock className="h-5 w-5 text-gray-600 mr-2" />
                                        <h3 className="font-semibold text-gray-700">Business Hours</h3>
                                    </div>
                                    <p className="text-gray-600 mt-2">Mon–Sat, 10 AM to 6 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}