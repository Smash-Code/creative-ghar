import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function GET() {
    try {
        const categoryImagesRef = collection(db, 'category-images');
        const querySnapshot = await getDocs(categoryImagesRef);

        const categoryImages = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            categoryImages[data.category] = data.imageUrls;
        });

        return NextResponse.json({
            success: true,
            images: categoryImages
        });
    } catch (error) {
        console.error('Error fetching category images:', error);
        return NextResponse.json(
            { error: 'Failed to fetch category images' },
            { status: 500 }
        );
    }
}