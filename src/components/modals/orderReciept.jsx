'use client';

import { useRef, useState } from 'react';
import * as domtoimage from 'dom-to-image';


export default function OrderReceiptModal({ orderDetails, onClose, onModalClose }) {
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!receiptRef.current) return;

    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const dataUrl = await domtoimage.toPng(receiptRef.current);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `receipt-${orderDetails.id?.slice(0, 8) || 'order'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
    setIsDownloading(false);
  };

  const handleClose = () => {
    onClose();
    onModalClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Order Confirmation</h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Receipt Content */}
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
                <span className="font-semibold">#{orderDetails.id?.slice(0, 8).toUpperCase() || 'N/A'}</span>
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

              {orderDetails.products?.map((product, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image || '/no-image.png'}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/no-image.png';
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                    </div>
                    <p className="font-medium">
                      RS {(product.discounted_price || product.orignal_price).toFixed(2)}
                    </p>
                  </div>
                  {product.size && (
                    <p className="text-sm text-gray-600 ml-20">Size: {product.size}</p>
                  )}
                  {product.color && (
                    <p className="text-sm text-gray-600 ml-20">Color: {product.color}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>RS {orderDetails.total}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 font-bold text-lg">
                <span>Total:</span>
                <span>RS {orderDetails.total}</span>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              <p>Thank you for shopping with us!</p>
              <p>For any questions, contact support@example.com</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex items-center justify-center mx-auto">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 disabled:bg-gray-400"
            >
              {isDownloading ? 'Downloading...' : 'Download Receipt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}