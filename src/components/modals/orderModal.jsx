'use client';

import { useState } from 'react';
import { useOrder } from '@/hooks/useOrder';
import OrderReceiptModal from './orderReciept';

export default function OrderModal({
  product,
  onClose,
  onOrderSubmit
}) {
  const [step, setStep] = useState(1); // 1: Product details, 2: Delivery details
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingLink, setTrackingLink] = useState('');
  const { createOrder, loading, order } = useOrder();
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleNextStep = () => {
    // Only require size/color selection if product has variants
    if (product.hasVariants) {
      if ((product.sizes?.length > 0 && !selectedSize) ||
        (product.colors?.length > 0 && !selectedColor)) {
        return;
      }
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    try {
      const userId = 'current-user-id'; // Replace with actual user ID
      const orderData = {
        productId: product.id,
        userId,
        quantity,
        totalPrice: (product.discounted_price || product.orignal_price) * quantity,
        username,
        email,
        phone,
        address,
        city,
        role: 'admin',
        paymentStatus,
        country: 'Pakistan',
        // Only include size/color if product has variants and they're selected
        ...(product.hasVariants && {
          ...(product.sizes?.length > 0 && { size: selectedSize }),
          ...(product.colors?.length > 0 && { color: selectedColor })
        })
      };

      await createOrder(orderData);

      setOrderDetails({
        ...order,
        product // Include the full product details
      });
      console.log(product)
      setShowReceipt(true);
      onOrderSubmit();
    } catch (error) {
      alert(error.message || 'Failed to place order');
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {step === 1 ? `Order ${product.title}` : 'Customer & Delivery Details'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {step === 1 ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={product.images?.[0] || '/no-image.png'}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-gray-600">
                        ${product.discounted_price || product.orignal_price}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <div className="flex items-center border rounded-md w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 text-lg border-r"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 text-lg border-l"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Size Selector - only show if product has sizes */}
                  {product.hasVariants && product.sizes?.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map(size => (
                          <button
                            key={size.name}
                            onClick={() => setSelectedSize(size.name)}
                            className={`px-4 py-2 rounded-md border ${selectedSize === size.name
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            disabled={size.stock <= 0}
                          >
                            {size.name} {size.stock <= 0 ? '(Out of stock)' : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selector - only show if product has colors */}
                  {product.hasVariants && product.colors?.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <div className="flex flex-wrap gap-3">
                        {product.colors.map(color => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedColor === color.name
                              ? 'ring-2 ring-offset-2 ring-indigo-500'
                              : ''
                              }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          >
                            {selectedColor === color.name && (
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total Price */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="text-lg font-bold">
                        ${((product.discounted_price || product.orignal_price) * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextStep}
                    disabled={
                      (product.hasVariants &&
                        ((product.sizes?.length > 0 && !selectedSize) ||
                          (product.colors?.length > 0 && !selectedColor)))
                    }
                    className={`w-full py-3 px-4 rounded-md text-white font-medium ${(product.hasVariants &&
                      ((product.sizes?.length > 0 && !selectedSize) ||
                        (product.colors?.length > 0 && !selectedColor)))
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="number"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 11) {
                        setPhone(value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value="Pakistan"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Payment Methods */}
                <div className="space-y-2">
                  <div className="border rounded-md overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center p-3 cursor-pointer bg-gray-50">
                        <span className="font-medium">JazzCash</span>
                        <svg className="w-5 h-5 text-gray-500 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="p-3 bg-white">
                        <p className="text-gray-700">Please send payment to: <span className="font-mono">031234567</span></p>
                      </div>
                    </details>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center p-3 cursor-pointer bg-gray-50">
                        <span className="font-medium">EasyPaisa</span>
                        <svg className="w-5 h-5 text-gray-500 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="p-3 bg-white">
                        <p className="text-gray-700">Please send payment to: <span className="font-mono">031234567</span></p>
                      </div>
                    </details>
                  </div>
                </div>

                {/* Complete Order Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading || !username || !email || !phone || !address || !city}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium mt-4 ${loading || !username || !email || !phone || !address || !city
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Complete Order'
                  )}
                </button>

                {/* Back Button */}
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-2 px-4 rounded-md text-indigo-600 font-medium mt-2 border border-indigo-600 hover:bg-indigo-50"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
      {showReceipt && (
        <OrderReceiptModal
          orderDetails={orderDetails.product}
          onClose={() => setShowReceipt(false)}
          onModalClose={() => {
            setShowReceipt(false)
          }}
        />
      )}
    </div>
  );
}