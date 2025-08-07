// app/api/marquee/[id]/route.js
import { NextResponse } from 'next/server';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const marqueeRef = doc(db, 'marquee', id);
    await updateDoc(marqueeRef, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const marqueeRef = doc(db, 'marquee', id);
    await deleteDoc(marqueeRef);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}