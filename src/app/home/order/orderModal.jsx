// components/OrderModal.js
'use client';

import { useState } from 'react';
import { useOrder } from '@/hooks/useOrder';
import OrderReceiptModal from '@/components/modals/orderReciept';

export default function OrderModal({
  product,
  onClose,
  onOrderSubmit
}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentOption, setPaymentOption] = useState('jazzcash');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { createOrder, loading, order } = useOrder();
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Red', value: 'red', bg: 'bg-red-500' },
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500' },
    { name: 'Green', value: 'green', bg: 'bg-green-500' },
    { name: 'Black', value: 'black', bg: 'bg-black' },
    { name: 'White', value: 'white', bg: 'bg-white border border-gray-300' },
  ];

  const handleSubmit = async () => {
    try {
      const userId = 'current-user-id'; // Replace with actual user ID
      await createOrder({
        productId: product.id,
        userId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        totalPrice: (product.discounted_price || product.orignal_price) * quantity,
        username,
        email,
        phone,
        role: 'user',
        address,
        paymentStatus: 'pending', // Default status
        country: 'Pakistan' // Hardcoded as per your requirement
      });
      onOrderSubmit();
      setOrderDetails({
        ...order,
        product // Include the full product details
      });
      setShowReceipt(true);
      // onClose();
    } catch (error) {
      alert(error.message || 'Failed to place order');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Order {product.title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

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

          <div className="space-y-4">
            {/* Product Selection */}
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

              {/* Size Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-md border ${selectedSize === size
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                        }`}
                      title={color.name}
                    >
                      {selectedColor === color.value && (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="pt-4 border-t space-y-4">
              <h4 className="font-medium text-gray-900">Customer Details</h4>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
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

              {/* Payment Option */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Option</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="jazzcash"
                      name="payment"
                      value="jazzcash"
                      checked={paymentOption === 'jazzcash'}
                      onChange={() => setPaymentOption('jazzcash')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="jazzcash" className="ml-2 block text-sm text-gray-700">
                      JazzCash (031234567)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="easypaisa"
                      name="payment"
                      value="easypaisa"
                      checked={paymentOption === 'easypaisa'}
                      onChange={() => setPaymentOption('easypaisa')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="easypaisa" className="ml-2 block text-sm text-gray-700">
                      EasyPaisa (031234567)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="cod"
                      checked={paymentOption === 'cod'}
                      onChange={() => setPaymentOption('cod')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="cod" className="ml-2 block text-sm text-gray-700">
                      Cash On Delivery
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-lg font-bold">
                  ${((product.discounted_price || product.orignal_price) * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedSize || !selectedColor || !username || !email || !phone || !address}
              className={`w-full py-3 px-4 rounded-md text-white font-medium mt-4 ${loading || !selectedSize || !selectedColor || !username || !email || !phone || !address
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
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </div>
      {showReceipt && (
        <OrderReceiptModal
          orderDetails={orderDetails.product}
          onClose={() => setShowReceipt(false)}
          onModalClose={onClose}
        />
      )}

    </div>
  );
}