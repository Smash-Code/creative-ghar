import { NextResponse } from 'next/server';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = [];
    
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamps to JavaScript Dates
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

export async function POST(req) {
  try {
    const body = await req.json();
    const validatedData = categorySchema.parse(body);

    const docRef = await addDoc(collection(db, 'categories'), {
      ...validatedData,
      createdAt: Timestamp.fromDate(validatedData.createdAt),
      updatedAt: Timestamp.fromDate(validatedData.updatedAt),
    });

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(req) {
  try {
    const { id, ...body } = await req.json();
    const validatedData = categorySchema.parse(body);

    await updateDoc(doc(db, 'categories', id), {
      ...validatedData,
      updatedAt: Timestamp.fromDate(new Date()),
    });

    return NextResponse.json({ 
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await deleteDoc(doc(db, 'categories', id));

    return NextResponse.json({ 
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}