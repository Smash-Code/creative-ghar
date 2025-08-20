import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { collection, addDoc, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
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
            publicId: uploadResult.public_id, // Store Cloudinary public_id for deletion
        });

        return NextResponse.json({
            success: true,
            data: {
                id: docRef.id,
                category: category,
                imgURL: uploadResult.secure_url,
                publicId: uploadResult.public_id,
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

export async function GET() {
    try {
        const q = query(collection(db, 'top-categories'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const categories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamp to ISO string if needed
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        }));

        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const publicId = searchParams.get('publicId');

        if (!id) {
            return NextResponse.json(
                { error: 'Category ID is required' },
                { status: 400 }
            );
        }

        // Delete from Cloudinary if publicId exists
        if (publicId) {
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryError) {
                console.warn('Cloudinary deletion failed:', cloudinaryError);
                // Continue with Firestore deletion even if Cloudinary fails
            }
        }

        // Delete from Firestore
        await deleteDoc(doc(db, 'top-categories', id));

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}