import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";
import { DEFAULT_SEO } from "@/constants/seo";
import { generateOrganizationStructuredData } from "@/utils/seo";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: DEFAULT_SEO.title,
  description: DEFAULT_SEO.description,
  keywords: DEFAULT_SEO.keywords,
  authors: [{ name: "Creative Ghar" }],
  creator: "Creative Ghar",
  publisher: "Creative Ghar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(DEFAULT_SEO.url),
  alternates: {
    canonical: DEFAULT_SEO.url,
  },
  openGraph: {
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    url: DEFAULT_SEO.url,
    siteName: DEFAULT_SEO.siteName,
    images: [
      {
        url: DEFAULT_SEO.image,
        width: 1200,
        height: 630,
        alt: "Creative Ghar - Unique Products & Creative Shopping",
      },
    ],
    locale: DEFAULT_SEO.locale,
    type: "website",
  },
  twitter: {
    card: DEFAULT_SEO.twitterCard,
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    images: [DEFAULT_SEO.image],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
};

export default function RootLayout({ children }) {
  const organizationData = generateOrganizationStructuredData();

  return (
    <html lang="en">
      <head>
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData)
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        {/* Facebook Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
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
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1694571487917100&ev=PageView&noscript=1"
            alt="Facebook Pixel"
          />
        </noscript>
        <Toaster position="top-right" reverseOrder={false} />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
