import { useState, useEffect } from 'react';

export function useCategoryImages() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categoryImages, setCategoryImages] = useState({});

    const getCategoryImages = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/top-category');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch category images');
            }

            setCategoryImages(data.images || {});
            return data.images;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategoryImages();
    }, []);

    return {
        loading,
        error,
        categoryImages,
        getCategoryImages,
        refetch: getCategoryImages
    };
}