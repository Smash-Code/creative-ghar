import Footer from '@/components/Footer';
import Navbar from '@/components/Header';
import Head from 'next/head';

export default function RefundPolicy() {
    return (
        <>
            <h1 className='text-white absolute top-0' >Creative ghar store</h1>

            <Navbar />

            <div className="min-h-screen pt-[10%] bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Refund Policy
                        </h2>

                        <div className="prose prose-lg max-w-none text-gray-700">
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Returns</h2>
                                <p className="mb-4">
                                    We have a 14-day return policy, which means you have 14 days after receiving your item to request a return.
                                </p>
                                <p className="mb-4">
                                    To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
                                </p>
                                <p className="mb-4">
                                    To start a return, you can contact us at{' '}
                                    <a href="mailto:creativeghar7@gmail.com" className="text-blue-600 hover:text-blue-800">
                                        creativeghar7@gmail.com
                                    </a>. Please note that returns will need to be sent to the following address: [INSERT RETURN ADDRESS]
                                </p>
                                <p className="mb-4">
                                    If your return is accepted, we'll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
                                </p>
                                <p>
                                    You can always contact us for any return question at{' '}
                                    <a href="mailto:creativeghar7@gmail.com" className="text-blue-600 hover:text-blue-800">
                                        creativeghar7@gmail.com
                                    </a>.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Damages and Issues</h2>
                                <p>
                                    Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Exceptions / Non-returnable Items</h2>
                                <p className="mb-4">
                                    Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.
                                </p>
                                <p>
                                    Unfortunately, we cannot accept returns on sale items or gift cards.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Exchanges</h2>
                                <p>
                                    The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Refunds</h2>
                                <p className="mb-4">
                                    We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within 7 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
                                </p>
                                <p>
                                    If more than 10 business days have passed since we've approved your return, please contact us at{' '}
                                    <a href="mailto:creativeghar7@gmail.com" className="text-blue-600 hover:text-blue-800">
                                        creativeghar7@gmail.com
                                    </a>.
                                </p>
                            </section>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-gray-600 text-sm">
                                Last updated: {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}