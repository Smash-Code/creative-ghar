// components/MarqueeDisplay.js
'use client';

import { useState, useEffect } from 'react';

export default function MarqueeDisplay() {
  const [activeMessages, setActiveMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveMessages = async () => {
      try {
        const response = await fetch('/api/heading');
        const data = await response.json();
        if (data.success) {
          setActiveMessages(data.data.filter(msg => msg.isActive));
        }
      } catch (error) {
        console.error('Error fetching marquee messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveMessages();
    // const interval = setInterval(fetchActiveMessages, 60000); // Refresh every minute

    // return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  if (activeMessages.length === 0) return null;

  return (
    <div className="bg-indigo-600 text-white py-2">
      <marquee behavior="scroll" direction="left" scrollamount="5">
        {activeMessages.map((message, index) => (
          <span key={message.id} className="mx-4">
            {message.text}
            {index < activeMessages.length - 1 && ' • '}
          </span>
        ))}
      </marquee>
    </div>
  );
}