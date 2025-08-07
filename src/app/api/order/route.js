
import { NextResponse } from 'next/server';
import { addDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import { z } from 'zod';
import { db } from '@/firebase/config';

// Define order schema validation with optional fields for both modals
const orderSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  userId: z.string().min(1, "User ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  totalPrice: z.number().min(0, "Price cannot be negative"),
  role : z.string().min(1, "Role is required"),
  // Fields from both modals made optional
  username: z.string().min(1, "Username is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(1, "Phone number is required").optional(),
  address: z.string().min(1, "Address is required").optional(),
  // Fields from first modal
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  apartment: z.string().optional(),
  streetAddress: z.string().min(1, "Street address is required").optional(),
  // Common fields
  city: z.string().min(1, "City is required").optional(),
  country: z.string().min(1, "Country is required").default('Pakistan'),
  paymentStatus: z.enum(['pending', 'paid', 'failed']).default('pending'),
  paymentOption: z.string().optional(), // For the new modal
  // Optional fulfillment info
  orderFulfillment: z.object({
    trackingNumber: z.string().optional(),
    trackingLink: z.string().url("Invalid tracking URL").optional(),
  }).optional(),
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
      status: 'pending', // Default status
      country: body.country || 'Pakistan', // Default country
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
      role : validatedData.role,
      color: validatedData.color,
      totalPrice: validatedData.totalPrice,
      // Include all possible fields
      ...(validatedData.username && { username: validatedData.username }),
      ...(validatedData.email && { email: validatedData.email }),
      ...(validatedData.phone && { phone: validatedData.phone }),
      ...(validatedData.address && { address: validatedData.address }),
      ...(validatedData.firstName && { firstName: validatedData.firstName }),
      ...(validatedData.lastName && { lastName: validatedData.lastName }),
      ...(validatedData.apartment && { apartment: validatedData.apartment }),
      ...(validatedData.streetAddress && { streetAddress: validatedData.streetAddress }),
      ...(validatedData.city && { city: validatedData.city }),
      country: validatedData.country,
      paymentStatus: validatedData.paymentStatus,
      ...(validatedData.paymentOption && { paymentOption: validatedData.paymentOption }),
      ...(validatedData.orderFulfillment && { orderFulfillment: validatedData.orderFulfillment }),
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

export async function GET() {
  try {
    // Get all documents from the 'orders' collection
    const querySnapshot = await getDocs(collection(db, 'orders'));
    
    // Convert documents to array of order objects
    const orders = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamps to JavaScript Dates
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || null
      });
    });

    // Sort by createdAt date (newest first) manually
    orders.sort((a, b) => b.createdAt - a.createdAt);


    return NextResponse.json({ 
      success: true, 
      data: orders 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch orders',
        data: [] // Return empty array on error
      },
      { status: 500 }
    );
  }
}