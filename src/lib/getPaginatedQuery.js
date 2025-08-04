// app/api/product/route.js
import { NextResponse } from 'next/server';
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
  orderBy
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const lastVisible = searchParams.get('lastVisible');

    const productsRef = collection(db, 'products');
    let q;

    if (category) {
      q = query(
        productsRef,
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
    } else {
      q = query(
        productsRef,
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
    }

    const snapshot = await getDocs(q);

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
