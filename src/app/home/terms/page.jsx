import Footer from "@/components/Footer";
import Navbar from "@/components/Header";

// app/terms-of-service/page.jsx (Next.js 13+ App Router)
export default function TermsOfService() {
    return (
        // Use a light gray background for a modern, soft feel
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
            <div className="bg-gray-50 min-h-screen flex flex-col">
                <Navbar />

                {/* Main content container with a "card" effect */}
                <div className="flex-grow flex justify-center items-start py-20 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 sm:p-12">
                        {/* Main Title Section */}
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                                Terms of Service
                            </h1>
                            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                                Welcome to Creative Ghar. Please read these terms carefully.
                            </p>
                        </div>

                        <hr className="my-10 border-gray-200" />

                        {/* Prose for a beautifully formatted body content */}
                        {/* Adjusted to prose-xl for larger, more readable text */}
                        {/* Added custom colors and a list style for a polished look */}
                        <div className="prose prose-lg prose-indigo max-w-none text-gray-700">
                            <h2>Overview</h2>
                            <p>
                                This website is operated by <strong>Creative Ghar</strong>. Throughout the site, the terms
                                “we”, “us” and “our” refer to Creative Ghar. Creative Ghar offers this website,
                                including all information, tools and Services available from this site to you,
                                the user, conditioned upon your acceptance of all terms, conditions, policies
                                and notices stated here.
                            </p>
                            <p>
                                By visiting our site and/or purchasing something from us, you engage in our
                                “Service” and agree to be bound by the following terms and conditions (“Terms
                                of Service”, “Terms”), including those additional terms and conditions and
                                policies referenced herein and/or available by hyperlink. These Terms of Service
                                apply to all users of the site.
                            </p>

                            <h2>SECTION 1 - ONLINE STORE TERMS</h2>
                            <p>
                                By agreeing to these Terms of Service, you represent that you are at least the
                                age of majority in your state or province of residence, or that you are the age
                                of majority and have given consent to allow any of your minor dependents to use
                                this site.
                            </p>
                            <p>
                                You may not use our products for any illegal or unauthorized purpose nor may you,
                                in the use of the Service, violate any laws in your jurisdiction (including but
                                not limited to copyright laws). A breach or violation of any of the Terms will
                                result in an immediate termination of your Services.
                            </p>

                            <h2>SECTION 2 - GENERAL CONDITIONS</h2>
                            <p>
                                We reserve the right to refuse Service to anyone for any reason at any time. You
                                agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of
                                the Service without express written permission by us.
                            </p>

                            {/* Repeat the same structure for each section */}
                            <h2>SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</h2>
                            <p>
                                We are not responsible if information made available on this site is not accurate,
                                complete or current...
                            </p>

                            <h2>SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES</h2>
                            <p>
                                Prices for our products are subject to change without notice. We reserve the right
                                to modify or discontinue the Service without notice.
                            </p>

                            <h2>SECTION 5 - PRODUCTS OR SERVICES</h2>
                            <p>
                                Certain products or Services may be available exclusively online through the
                                website...
                            </p>

                            <h2>SECTION 20 - CONTACT INFORMATION</h2>
                            <p>
                                Questions about the Terms of Service should be sent to us at{" "}
                                <a
                                    href="mailto:creativeghar7@gmail.com"
                                    className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                                >
                                    creativeghar7@gmail.com
                                </a>
                                .
                            </p>
                            <address className="not-italic mt-6 text-gray-500 border-l-4 border-indigo-500 pl-4">
                                <strong>Creative Ghar</strong> <br />
                                creativeghar7@gmail.com <br />
                                137d Samosa Chowk D Ground Faisalabad <br />
                                03457036429
                            </address>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>

    );
}