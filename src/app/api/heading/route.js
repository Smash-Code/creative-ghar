// app/api/marquee/route.js
import { NextResponse } from 'next/server';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'marquee'));
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const docRef = await addDoc(collection(db, 'marquee'), {
      text: body.text,
      isActive: body.isActive || true,
      createdAt: new Date()
    });
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}