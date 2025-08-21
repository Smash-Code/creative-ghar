"use client"
import React, { useState, useEffect } from 'react';

// Main component that will be exported.
export default function Loader() {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <ThreeDotLoader />
        </div>
    );
}

/**
 * A beautiful, animated loader with three dots.
 * The dots move up and down in a wave and cycle colors between gray and red.
 */
function ThreeDotLoader() {
    // State to manage the index of the dot that is currently red.
    const [currentIndex, setCurrentIndex] = useState(0);

    // useEffect to handle the animation loop using setInterval.
    useEffect(() => {
        // Set up a timer to change the active dot every 500ms.
        const intervalId = setInterval(() => {
            // Update the state to cycle through the dots (0 -> 1 -> 2 -> 0).
            setCurrentIndex(prevIndex => (prevIndex + 1) % 3);
        }, 500);

        // Clean up the interval when the component unmounts to prevent memory leaks.
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this effect runs only once on mount.

    // Array of dot components, using map to render each one.
    const dots = [0, 1, 2].map((index) => {
        // Check if the current dot's index matches the state's current index.
        const isRed = index === currentIndex;

        // Tailwind classes for the dot's appearance and animation.
        const dotClasses = `
      h-4 w-4 rounded-full
      animate-bounce
      transition-colors duration-500 ease-in-out
      ${isRed ? 'bg-red-500' : 'bg-gray-400'}
    `;

        // Inline style to apply the animation delay, creating the wave effect.
        // The delay for the first dot is 0, second is 200ms, third is 400ms.
        const dotStyle = {
            animationDelay: `${index * 200}ms`
        };

        return (
            <div
                key={index}
                className={dotClasses}
                style={dotStyle}
            ></div>
        );
    });

    return (
        <div className="flex items-center space-x-2">
            {dots}
        </div>
    );
}
