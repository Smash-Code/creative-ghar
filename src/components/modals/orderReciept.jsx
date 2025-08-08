// components/OrderReceiptModal.js
'use client';

import { useRef, useState, useEffect } from 'react';
// import html2pdf from 'html2pdf.js';
// import html2canvas from 'html2canvas';
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';

export default function OrderReceiptModal({ 
  orderDetails, 
  onClose 
}) {
    console.log(orderDetails , "details")
    const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

//   const downloadReceipt = async () => {
//        if (!receiptRef.current || !orderDetails) return;
    
//     setIsDownloading(true);
//     try {
//       // First, create a clone of the receipt element
//       const receiptElement = receiptRef.current;
//       const clone = receiptElement.cloneNode(true);
      
//       // Remove any problematic styles or elements
//       clone.querySelectorAll('*').forEach(el => {
//         // Remove background gradients or complex colors
//         if (window.getComputedStyle(el).backgroundImage.includes('gradient')) {
//           el.style.backgroundImage = 'none';
//           el.style.backgroundColor = '#ffffff';
//         }
//       });

//       // Temporarily append the clone to body
//       clone.style.position = 'absolute';
//       clone.style.left = '-9999px';
//       document.body.appendChild(clone);

//       // Capture the clone instead of the original
//       const canvas = await html2canvas(clone, {
//         scale: 2,
//         logging: true,
//         useCORS: true,
//         backgroundColor: '#ffffff',
//         removeContainer: true,
//         ignoreElements: (element) => {
//           // Ignore any elements that might cause color parsing issues
//           return false;
//         }
//       });

//       // Remove the clone
//       document.body.removeChild(clone);

//       // Create PDF with simple color space
//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         compress: true
//       });

//       // Convert canvas to image data
//       const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
//       // Calculate dimensions to fit A4
//       const imgWidth = 190; // Slightly smaller than A4 width (210mm)
//       const pageHeight = 277; // A4 height in mm (297mm - 10mm margins)
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
//       // Add image to PDF
//       pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
      
//       // Add footer
//       pdf.setFontSize(10);
//       pdf.setTextColor(100);
//       pdf.text('Thank you for your purchase!', 105, 280, { align: 'center' });
      
//       // Download the PDF
//       pdf.save(`receipt_${orderDetails.id.slice(0, 8)}.pdf`);
      
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       alert('Failed to generate PDF. Please try again or contact support.');
//     } finally {
//       setIsDownloading(false);
//     }
//   };


//   const downloadReceipt = async () => {
//     if (!receiptRef.current) return;
    
//     setIsDownloading(true);
//     try {
//       const canvas = await html2canvas(receiptRef.current, {
//         scale: 2, // Higher quality
//         logging: false,
//         useCORS: true,
//       });
      
//       const link = document.createElement('a');
//       link.download = `order-${orderDetails.id}.jpg`;
//       link.href = canvas.toDataURL('image/jpeg', 0.9);
//       link.click();
//     } catch (error) {
//       console.error('Error generating receipt:', error);
//     } finally {
//       setIsDownloading(false);
//     }
//   };

  return (
    <div   className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Order Confirmation</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Receipt Content - This will be converted to image */}
          <div 
            ref={receiptRef} 
            className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Order Receipt</h2>
              <p className="text-gray-600">Thank you for your purchase!</p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Order ID:</span>
                <span className="font-semibold">#{orderDetails.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Date:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Status:</span>
                <span className="px-2 py-1 text-xs bg-green-100 font-medium rounded">
                  {orderDetails.status || 'Processing'}
                </span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <h3 className="font-medium text-lg mb-2">Order Summary</h3>
              <div className="flex items-center space-x-4 mb-3">
                <img 
                  src={orderDetails.images?.[0] || '/no-image.png'} 
                  alt={orderDetails.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{orderDetails.title}</p>
                  <p className="text-sm text-gray-600">
                    Size: {orderDetails.size} | Color: {orderDetails.color}
                  </p>
                  <p className="text-sm text-gray-600">Qty: {orderDetails.quantity}</p>
                </div>
                <p className="font-medium">
                  ${(orderDetails.discounted_price || orderDetails.orignal_price)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              {/* <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>${((orderDetails.discounted_price || orderDetails.orignal_price) * orderDetails.quantity)}</span>
              </div> */}
              <div className="flex justify-between py-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 font-bold text-lg">
                <span>Total:</span>
                <span>${orderDetails.discounted_price}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-2">Customer Information</h3>
              <p className="text-sm">{orderDetails.username}</p>
              <p className="text-sm">{orderDetails.email}</p>
              <p className="text-sm">{orderDetails.phone}</p>
              <p className="text-sm">{orderDetails.address}</p>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              <p>Thank you for shopping with us!</p>
              <p>For any questions, contact support@example.com</p>
            </div>
          </div>

          {/* <div className="mt-6 flex justify-center">
            <button
              onClick={downloadReceipt}
              disabled={isDownloading}
              className={`px-6 py-2 rounded-md text-white font-medium ${
                isDownloading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isDownloading ? 'Downloading...' : 'Download Receipt'}
            </button>
          </div> */}

          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}