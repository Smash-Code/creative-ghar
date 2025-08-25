import { NextResponse } from 'next/server';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { z } from 'zod';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // If ID parameter exists, return single category
  if (id) {
    try {
      const docRef = doc(db, 'categories', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }

      const category = {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || null,
        updatedAt: docSnap.data().updatedAt?.toDate() || null,
      };

      return NextResponse.json({ success: true, data: category });
    } catch (error) {
      console.error('Error fetching category:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }

  // Otherwise return all categories (existing GET implementation)
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = [];

    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || null,
        updatedAt: doc.data().updatedAt?.toDate() || null,
      });
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}