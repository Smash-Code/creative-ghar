

import { NextResponse } from 'next/server';
import { addDoc, collection, getDocs, Timestamp, query, orderBy, limit, getCountFromServer } from 'firebase/firestore';
import { z } from 'zod';
import { db } from '@/firebase/config';
import { Resend } from 'resend';

// Define order schema validation with optional fields for both modals
const orderSchema = z.object({
  products: z.array(z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    size: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    price: z.number().min(0, "Price cannot be negative"),
    title: z.string().optional(),
    image: z.string().optional()
  })),
  userId: z.string().min(1, "User ID is required"),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  totalPrice: z.number().min(0, "Price cannot be negative"),
  role: z.string().min(1, "Role is required"),
  username: z.string().min(1, "Username is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(1, "Phone number is required").optional(),
  address: z.string().min(1, "Address is required").optional(),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  apartment: z.string().optional(),
  streetAddress: z.string().min(1, "Street address is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  country: z.string().min(1, "Country is required").default('Pakistan'),
  paymentStatus: z.enum(['pending', 'paid', 'failed']).default('pending'),
  paymentOption: z.string().optional(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

// Helper function to get the next count_id
async function getNextCountId() {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('count_id', 'desc'), limit(1));
    const snapshot = await getDocs(q);

    let nextId;
    if (snapshot.empty) {
      nextId = 1;
    } else {
      const lastOrder = snapshot.docs[0].data();
      nextId = (parseInt(lastOrder.count_id, 10) || 0) + 1;
    }

    // Format with leading zeros (e.g., 001, 002, 010, 100)
    return formatCountId(nextId);
  } catch (error) {
    console.error('Error getting next count_id:', error);

    try {
      const ordersRef = collection(db, 'orders');
      const countSnapshot = await getCountFromServer(ordersRef);
      return formatCountId(countSnapshot.data().count + 1);
    } catch (countError) {
      console.error('Error getting document count:', countError);
      return Date.now().toString(); // fallback as string
    }
  }
}

function formatCountId(num, length = 4) {
  return String(num).padStart(length, '0');
}


export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);

    // Get the next count_id
    const count_id = await getNextCountId();

    // Current timestamp
    const now = new Date();

    // Prepare the data object with all fields
    const orderData = {
      ...body,
      totalPrice: Number(body.totalPrice),
      status: 'pending',
      country: body.country || 'Pakistan',
      createdAt: now,
      updatedAt: now,
    };

    // Validate the input
    const validatedData = orderSchema.parse(orderData);

    // Prepare Firestore document with all fields
    const firestoreDoc = {
      count_id, // Add the sequential count_id
      userId: validatedData.userId,
      products: validatedData.products,
      totalPrice: validatedData.totalPrice,
      // Include customer information
      ...(validatedData.username && { username: validatedData.username }),
      ...(validatedData.email && { email: validatedData.email }),
      ...(validatedData.phone && { phone: validatedData.phone }),
      ...(validatedData.address && { address: validatedData.address }),
      ...(validatedData.city && { city: validatedData.city }),
      country: validatedData.country,
      paymentStatus: "pending",
      ...(validatedData.paymentOption && { paymentOption: validatedData.paymentOption }),
      status: validatedData.status,
      createdAt: Timestamp.fromDate(validatedData.createdAt),
      updatedAt: Timestamp.fromDate(validatedData.updatedAt),
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'orders'), firestoreDoc);

    // Update the email template to show all products
    if (validatedData.email) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Generate products HTML for email
      const productsHtml = validatedData.products.map(product => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #555;">${product.title || `Product ID: ${product.productId}`}</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #555;">${product.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #555; text-align: right;">RS${(product.price).toFixed(2)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #555; text-align: right;">RS${(product.price * product.quantity).toFixed(2)}</td>
        </tr>
      `).join('');

      await resend.emails.send({
        from: 'Creative Ghar <noreply@creativeghar.com>',
        to: validatedData.email,
        subject: `Your Order #${count_id} is Confirmed!`,
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; background-color: #f8f8f8; padding: 30px 20px; border-radius: 8px;">
        <h1 style="color: #333; font-size: 28px; margin-bottom: 10px;">Thank you, ${orderData.username}!</h1>
        <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
          Your order is confirmed, and we're excited to get it to you.
        </p>
      </div>

      <div style="padding: 20px 0;">
        <h2 style="font-size: 22px; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Order Summary</h2>
        <p style="color: #555; font-size: 14px; margin-bottom: 10px;">
          <strong>Order #:</strong> ${count_id}
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 12px; text-align: left; font-size: 14px; color: #333;">Item</th>
              <th style="padding: 12px; text-align: left; font-size: 14px; color: #333;">Qty</th>
              <th style="padding: 12px; text-align: right; font-size: 14px; color: #333;">Unit Price</th>
              <th style="padding: 12px; text-align: right; font-size: 14px; color: #333;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 16px; color: #333;">Total:</td>
              <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 16px; color: #333;">RS${orderData.totalPrice.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="padding: 20px 0; border-top: 1px dashed #ddd;">
        <h3 style="font-size: 18px; color: #333; text-align: center; margin-bottom: 15px;">What happens next?</h3>
        <p style="color: #666; font-size: 14px; text-align: center;">
          We're preparing your order for shipment.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <div style="margin-top: 15px;">
          <a href="https://www.instagram.com/creativeghar7/" target="_blank" style="margin: 0 8px;"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style="width: 24px;"></a>
          <a href="https://www.facebook.com/profile.php?id=61576762615794" target="_blank" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/256/124/124010.png" alt="Facebook" style="width: 24px;"></a>
        </div>
        <p style="color: #aaa; font-size: 10px; margin-top: 15px;">
          &copy; ${new Date().getFullYear()} Creative Ghar. All rights reserved.
        </p>
      </div>
    </div>
  `,
        text: `
    Thank you for your order, ${orderData.username}!

    We've received your order #${count_id} and are getting it ready for shipment.

    Order Summary:
    ${validatedData.products.map(product => `
      ${product.title || `Product ID: ${product.productId}`} - Quantity: ${product.quantity} - Price: RS${(product.price * product.quantity).toFixed(2)}
    `).join('')}

    Total: RS${orderData.totalPrice.toFixed(2)}

    We'll send you a shipping confirmation email with a tracking number as soon as your order is on its way.

    Thank you for shopping with us!
  `,
      });
    }

    return NextResponse.json({
      success: true,
      id: docRef.id,
      count_id,
      message: 'Order created successfully',
      data: {
        ...firestoreDoc,
        id: docRef.id,
        count_id,
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

    // Sort by count_id (newest first)
    orders.sort((a, b) => b.count_id - a.count_id);

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