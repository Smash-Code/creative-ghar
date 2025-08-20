import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { collection, addDoc } from 'firebase/firestore';
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
        const file = formData.get('image');
        const category = formData.get('category');

        if (!file || !category) {
            return NextResponse.json(
                { error: 'Image and category are required' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: 'top-categories',
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                .end(buffer);
        });

        // Save to Firebase
        const docRef = await addDoc(collection(db, 'top-categories'), {
            category: category,
            imgURL: uploadResult.secure_url,
            createdAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            data: {
                id: docRef.id,
                category: category,
                imgURL: uploadResult.secure_url,
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}