// app/api/banners/route.js
import { NextResponse } from 'next/server';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/firebase/config'; // Make sure this is your Firebase v9 initialized db

export async function GET() {
  try {
    const bannersRef = collection(db, 'banners');
    const q = query(bannersRef, orderBy('order'));
    const snapshot = await getDocs(q);
    
    const banners = [];
    snapshot.forEach(doc => {
      banners.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { updates } = await request.json();
    
    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const batch = writeBatch(db);

    updates.forEach(update => {
      const docRef = doc(db, 'banners', update.id);
      batch.update(docRef, { order: update.order });
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id, public_id } = await request.json();
    
    if (!id || !public_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary (you'll need to implement this)
    await deleteFromCloudinary(public_id);
    
    // Delete from Firestore
    await deleteDoc(doc(db, 'banners', id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function deleteFromCloudinary(public_id) {
  // Implement Cloudinary deletion if needed
  // Example:
  // await cloudinary.uploader.destroy(public_id);
}