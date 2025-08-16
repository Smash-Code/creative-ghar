'use client';

import { useState, useEffect } from 'react';

export function useCart() {
    const [cartItems, setCartItems] = useState([]);

    // Load cart from localStorage on component mount
    useEffect(() => {
        const loadCart = () => {
            if (typeof window !== 'undefined') {
                const savedCart = localStorage.getItem('cart');
                setCartItems(savedCart ? JSON.parse(savedCart) : []);
            }
        };
        loadCart();

        // Listen for custom cart update events
        const handleCartUpdate = () => loadCart();
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    // Save to localStorage and trigger update event
    const updateCart = (newCart) => {
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const addToCart = (product, quantity = 1, size = '', color = '') => {
        const existingIndex = cartItems.findIndex(
            item => item.id === product.id && item.size === size && item.color === color
        );

        const newCart = [...cartItems];
        if (existingIndex >= 0) {
            newCart[existingIndex].quantity += quantity;
        } else {
            newCart.push({
                id: product.id,
                title: product.title,
                price: product.discounted_price || product.orignal_price,
                image: product.images?.[0] || '/no-image.png',
                quantity,
                size,
                color,
                hasVariants: product.hasVariants
            });
        }
        updateCart(newCart);
    };

    const removeFromCart = (productId) => {
        updateCart(cartItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        updateCart(
            cartItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        calculateTotal,
        cartCount
    };
}