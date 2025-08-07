// app/api/banner/upload/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
// import { db } from '@/lib/firebase'; // Make sure this exports the initialized Firestore instance

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files uploaded' },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    const uploadPromises = files.map(file => {
      return new Promise(async (resolve, reject) => {
        if (!file.type.startsWith('image/')) {
          reject(new Error('Only image files are allowed'));
          return;
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        cloudinary.uploader.upload_stream(
          { folder: 'banners' },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve({
              url: result.secure_url,
              public_id: result.public_id
            });
          }
        ).end(buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    
    // Get current banners to determine the next order position
    const bannersRef = collection(db, 'banners');
    const q = query(bannersRef, orderBy('order', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    let nextOrder = 1;
    
    if (!snapshot.empty) {
      nextOrder = snapshot.docs[0].data().order + 1;
    }

    // Add each banner individually
    const addedBanners = [];
    for (const image of results) {
      const bannerData = {
        url: image.url,
        public_id: image.public_id,
        order: nextOrder++,
        createdAt: Timestamp.fromDate(new Date())
      };
      
      const docRef = await addDoc(bannersRef, bannerData);
      addedBanners.push({ id: docRef.id, ...bannerData });
    }

    return NextResponse.json({ 
      success: true, 
      banners: addedBanners
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}