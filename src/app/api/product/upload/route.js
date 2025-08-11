import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dvouucusn',
  api_key: '386218388118338',
  api_secret: 'j4x5c0VqlHTbouTe5g58YsPt7J8'
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

    // Limit to 5 images
    if (files.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum 5 images allowed' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(file => {
      return new Promise(async (resolve, reject) => {
        if (!file.type.startsWith('image/')) {
          reject(new Error('Only image files are allowed'));
          return;
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        cloudinary.uploader.upload_stream(
          { folder: 'products' },
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

    return NextResponse.json({
      success: true,
      images: results
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}