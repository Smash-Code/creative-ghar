// import { NextResponse } from 'next/server';
// import { addDoc, collection, Timestamp } from 'firebase/firestore';
// import { z } from 'zod';
// import { db } from '@/firebase/config';

// // Define order schema validation
// const orderSchema = z.object({
//   productId: z.string().min(1, "Product ID is required"),
//   userId: z.string().min(1, "User ID is required"),
//   quantity: z.number().min(1, "Quantity must be at least 1"),
//   totalPrice: z.number().min(0, "Price cannot be negative"),
//   status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
//   // Explicitly include createdAt and updatedAt in schema
//   createdAt: z.date().default(new Date()),
//   updatedAt: z.date().default(new Date()),
// });

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     console.log('Received request body:', body);

//     // Current timestamp
//     const now = new Date();

//     // Prepare the data object
//     const orderData = {
//       ...body,
//       quantity: Number(body.quantity),
//       totalPrice: Number(body.totalPrice),
//       status: 'pending', // Default status
//       createdAt: now,
//       updatedAt: now,
//     };

//     console.log('Data before validation:', orderData);

//     // Validate the input
//     const validatedData = orderSchema.parse(orderData);
//     console.log('Validated data:', validatedData);

//     // Prepare Firestore document
//     const firestoreDoc = {
//       ...validatedData,
//       createdAt: Timestamp.fromDate(validatedData.createdAt),
//       updatedAt: Timestamp.fromDate(validatedData.updatedAt),
//     };

//     console.log('Firestore document:', firestoreDoc);

//     // Save to Firestore
//     const docRef = await addDoc(collection(db, 'orders'), firestoreDoc);

//     return NextResponse.json({ 
//       success: true, 
//       id: docRef.id,
//       message: 'Order created successfully'
//     });

//   } catch (error) {
//     console.error('Full error details:', error);
    
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           error: error.errors.map(e => ({
//             path: e.path.join('.'),
//             message: e.message
//           }))
//         },
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: error.message || 'Failed to create order'
//       },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from 'next/server';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { z } from 'zod';
import { db } from '@/firebase/config';

// Define order schema validation
const orderSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  userId: z.string().min(1, "User ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  totalPrice: z.number().min(0, "Price cannot be negative"),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);

    // Current timestamp
    const now = new Date();

    // Prepare the data object with all fields
    const orderData = {
      ...body,
      quantity: Number(body.quantity),
      totalPrice: Number(body.totalPrice),
      size: body.size, // Add size from request
      color: body.color, // Add color from request
      status: 'pending', // Default status
      createdAt: now,
      updatedAt: now,
    };

    console.log('Data before validation:', orderData);

    // Validate the input
    const validatedData = orderSchema.parse(orderData);
    console.log('Validated data:', validatedData);

    // Prepare Firestore document with all fields
    const firestoreDoc = {
      productId: validatedData.productId,
      userId: validatedData.userId,
      quantity: validatedData.quantity,
      size: validatedData.size,
      color: validatedData.color,
      totalPrice: validatedData.totalPrice,
      status: validatedData.status,
      createdAt: Timestamp.fromDate(validatedData.createdAt),
      updatedAt: Timestamp.fromDate(validatedData.updatedAt),
    };

    console.log('Firestore document:', firestoreDoc);

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'orders'), firestoreDoc);

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      message: 'Order created successfully',
      data: {
        ...firestoreDoc,
        id: docRef.id,
        // Convert Timestamps to ISO strings for response
        createdAt: firestoreDoc.createdAt.toDate().toISOString(),
        updatedAt: firestoreDoc.updatedAt.toDate().toISOString()
      }
    });

  } catch (error) {
    console.error('Full error details:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error',
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create order'
      },
      { status: 500 }
    );
  }
}