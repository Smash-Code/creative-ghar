import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const formData = await request.formData();
        const category = formData.get('category');
        const images = formData.getAll('images');

        if (!category) {
            return NextResponse.json(
                { error: 'Category is required' },
                { status: 400 }
            );
        }

        if (!images || images.length === 0) {
            return NextResponse.json(
                { error: 'At least one image is required' },
                { status: 400 }
            );
        }

        // Upload images to Cloudinary
        const uploadPromises = images.map((image, index) => {
            return new Promise((resolve, reject) => {
                if (!image || typeof image === 'string') {
                    resolve(null);
                    return;
                }

                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'category-banners',
                        public_id: `banner-${index + 1}-${Date.now()}`,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                // Convert the image to buffer for upload
                image.arrayBuffer().then(buffer => {
                    uploadStream.end(Buffer.from(buffer));
                });
            });
        });

        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.filter(result => result !== null).map(result => result.secure_url);

        // Check if category already exists in the new collection
        const categoryImagesRef = collection(db, 'category-images');
        const q = query(categoryImagesRef, where('category', '==', category));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Update existing document
            const docId = querySnapshot.docs[0].id;
            const docRef = doc(db, 'category-images', docId);

            await updateDoc(docRef, {
                imageUrls,
                updatedAt: new Date()
            });
        } else {
            // Create new document
            await addDoc(categoryImagesRef, {
                category,
                imageUrls,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Images uploaded successfully',
            imageUrls,
            category
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload images: ' + error.message },
            { status: 500 }
        );
    }
}