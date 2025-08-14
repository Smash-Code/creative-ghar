// app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const orderRef = doc(db, 'orders', id);
    await updateDoc(orderRef, {
      ...body,
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update order'
      },
      { status: 500 }
    );
  }
}