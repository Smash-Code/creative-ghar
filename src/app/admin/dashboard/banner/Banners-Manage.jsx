'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Loader from '@/components/Loader';

export default function ManageTopCategories({ hitCategory }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [message, setMessage] = useState('');

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/top-category');
            const data = await response.json();

            if (response.ok) {
                setCategories(data.data || []);
            } else {
                setMessage('Failed to fetch categories');
            }
        } catch (error) {
            setMessage('Error fetching categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [hitCategory]);

    const handleDelete = async (id, publicId) => {
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        setDeletingId(id);
        setMessage('');

        try {
            const response = await fetch(`/api/top-category?id=${id}&publicId=${publicId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Category deleted successfully');
                // Refresh the list
                fetchCategories();
            } else {
                setMessage(data.error || 'Failed to delete category');
            }
        } catch (error) {
            setMessage('Error deleting category');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            // <div className="min-h-screen flex items-center justify-center">
            //     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            // </div>
            <Loader />
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Top Categories</h1>
                {/* <a
                    href="/admin/top-categories"
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Add New Category
                </a> */}
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {message}
                </div>
            )}

            {categories.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No top categories found.</p>
                    <a
                        href="/admin/top-categories"
                        className="text-blue-500 hover:text-blue-700 mt-4 inline-block"
                    >
                        Add your first category
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                        >
                            <div className="relative h-48 w-full">
                                <Image
                                    src={category.imgURL}
                                    alt={category.category}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {category.category}
                                </h3>

                                <div className="text-sm text-gray-600 mb-4">
                                    <p>Created: {new Date(category.createdAt).toLocaleDateString()}</p>
                                </div>

                                <button
                                    onClick={() => handleDelete(category.id, category.publicId)}
                                    disabled={deletingId === category.id}
                                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {deletingId === category.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}