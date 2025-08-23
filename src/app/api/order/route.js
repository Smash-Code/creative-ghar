

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


// export async function POST(req) {
//   try {
//     const body = await req.json();
//     console.log('Received request body:', body);

//     // Get the next count_id
//     const count_id = await getNextCountId();

//     // Current timestamp
//     const now = new Date();

//     // Prepare the data object with all fields
//     const orderData = {
//       ...body,
//       totalPrice: Number(body.totalPrice),
//       status: 'pending',
//       country: body.country || 'Pakistan',
//       createdAt: now,
//       updatedAt: now,
//     };

//     // Validate the input
//     const validatedData = orderSchema.parse(orderData);

//     // Prepare Firestore document with all fields
//     const firestoreDoc = {
//       count_id, // Add the sequential count_id
//       userId: validatedData.userId,
//       products: validatedData.products,
//       totalPrice: validatedData.totalPrice,
//       // Include customer information
//       ...(validatedData.username && { username: validatedData.username }),
//       ...(validatedData.email && { email: validatedData.email }),
//       ...(validatedData.phone && { phone: validatedData.phone }),
//       ...(validatedData.address && { address: validatedData.address }),
//       ...(validatedData.city && { city: validatedData.city }),
//       country: validatedData.country,
//       paymentStatus: "pending",
//       ...(validatedData.paymentOption && { paymentOption: validatedData.paymentOption }),
//       status: validatedData.status,
//       createdAt: Timestamp.fromDate(validatedData.createdAt),
//       updatedAt: Timestamp.fromDate(validatedData.updatedAt),
//     };

//     // Save to Firestore
//     const docRef = await addDoc(collection(db, 'orders'), firestoreDoc);

//     // Update the email template to show all products
//     if (validatedData.email) {
//       const resend = new Resend(process.env.RESEND_API_KEY);

//       const productsHtml = validatedData.products.map(product => `
//   <tr>
//     <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${product.title || `Product ID: ${product.productId}`}</td>
//     <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${product.quantity}</td>
//     <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; text-align: right; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">RS${(product.price).toFixed(2)}</td>
//     <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; text-align: right; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">RS${(product.price * product.quantity).toFixed(2)}</td>
//   </tr>
// `).join('');

//       await resend.emails.send({
//         from: 'Creative Ghar <noreply@creativeghar.com>',
//         to: validatedData.email,
//         subject: `Your Order #${count_id} is Confirmed!`,
//         html: `
//     <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
//       <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

//         <!-- Header with brand name -->
//         <div style="background-color: #C62828; color: #ffffff; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h1 style="font-size: 28px; margin: 0; padding: 0;">Creative Ghar</h1>
//           <p style="font-size: 16px; margin: 5px 0 0;">Order Confirmation</p>
//         </div>

//         <!-- Main Content Section -->
//         <div style="padding: 40px 20px;">
//           <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;">Thank you for your order, ${orderData.username}!</h2>
//           <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
//             We've received your order and are excited to get it to you.
//           </p>

//           <!-- Order Details Section -->
//           <div style="text-align: left; margin-bottom: 30px;">
//             <h3 style="font-size: 20px; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;">Order Summary</h3>
//             <p style="color: #555; font-size: 14px; margin-bottom: 10px;">
//               <strong>Order #:</strong> ${count_id}
//             </p>

//             <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//               <thead>
//                 <tr style="background-color: #f8f8f8;">
//                   <th style="padding: 12px; text-align: left; font-size: 14px; color: #555; border-bottom: 1px solid #ddd;">Item</th>
//                   <th style="padding: 12px; text-align: left; font-size: 14px; color: #555; border-bottom: 1px solid #ddd;">Qty</th>
//                   <th style="padding: 12px; text-align: right; font-size: 14px; color: #555; border-bottom: 1px solid #ddd;">Unit Price</th>
//                   <th style="padding: 12px; text-align: right; font-size: 14px; color: #555; border-bottom: 1px solid #ddd;">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${productsHtml}
//               </tbody>
//               <tfoot>
//                 <tr>
//                   <td colspan="3" style="padding: 20px 0 10px; text-align: right; font-weight: bold; font-size: 16px; color: #333; border-top: 2px solid #ddd;">Total:</td>
//                   <td style="padding: 20px 0 10px; text-align: right; font-weight: bold; font-size: 16px; color: #333; border-top: 2px solid #ddd;">RS${orderData.totalPrice.toFixed(2)}</td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>

//           <p style="color: #666; font-size: 14px; margin-top: 40px;">
//             You will receive a shipping confirmation with tracking information soon.
//           </p>
//           <p style="color: #666; font-size: 14px; margin-top: 20px;">
//             For any query contact us at 
//           </p>
//         </div>

//         <!-- Footer -->
//         <div style="background-color: #f8f8f8; padding: 20px; border-radius: 0 0 10px 10px;">
//           <div style="margin-bottom: 15px;">
//             <a href="https://www.instagram.com/creativeghar7/" target="_blank" style="margin: 0 10px; display: inline-block; vertical-align: middle;">
//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line></svg>
//             </a>
//             <a href="https://www.facebook.com/profile.php?id=61576762615794" target="_blank" style="margin: 0 10px; display: inline-block; vertical-align: middle;">
//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
//             </a>
//           </div>
//           <p style="color: #999; font-size: 12px; margin-top: 15px; margin-bottom: 0;">
//             &copy; ${new Date().getFullYear()} Creative Ghar. All rights reserved.
//           </p>
//         </div>

//       </div>
//     </div>
//   `,
//         text: `
//     Thank you for your order, ${orderData.username}!

//     We've received your order #${count_id} and are getting it ready for shipment.

//     Order Summary:
//     ${validatedData.products.map(product => `
//       ${product.title || `Product ID: ${product.productId}`} - Quantity: ${product.quantity} - Price: RS${(product.price * product.quantity).toFixed(2)}
//     `).join('')}

//     Total: RS${orderData.totalPrice.toFixed(2)}

//     We'll send you a shipping confirmation email with a tracking number as soon as your order is on its way.

//     Thank you for shopping with us! 
//   `,
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       id: docRef.id,
//       count_id,
//       message: 'Order created successfully',
//       data: {
//         ...firestoreDoc,
//         id: docRef.id,
//         count_id,
//         // Convert Timestamps to ISO strings for response
//         createdAt: firestoreDoc.createdAt.toDate().toISOString(),
//         updatedAt: firestoreDoc.updatedAt.toDate().toISOString()
//       }
//     });

//   } catch (error) {
//     console.error('Full error details:', error);

//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Validation error',
//           details: error.errors.map(e => ({
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

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Update the email template to show all products
    if (validatedData.email) {
      const productsHtml = validatedData.products.map(product => `
  <tr>
    <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${product.title || `Product ID: ${product.productId}`}</td>
    <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${product.quantity}</td>
    <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; text-align: right; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">RS ${(product.price).toFixed(2)}</td>
    <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; text-align: right; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">RS  ${(product.price * product.quantity).toFixed(2)}</td>
  </tr>
`).join('');

      // Send email to customer
      await resend.emails.send({
        // for development
        from: 'Creative Ghar <onboarding@resend.dev>',
        // from: 'Creative Ghar <noreply@creativeghar.com>',
        to: validatedData.email,
        subject: `Your Order #${count_id} is Confirmed!`,
        html: `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        
        <!-- Header with brand name -->
        <div style="background-color: #306eff; color: #ffffff; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
            <tr>
              <td style="padding-right: 10px; vertical-align: middle;">
                <img 
                  src="https://www.creativeghar.com/_next/image?url=%2Fcreative-logo.png&w=256&q=75" 
                  alt="Creative Ghar" 
                  style="width: 50px; height: auto; display: block;"
                >
              </td>
              <td style="vertical-align: middle;">
                <h1 style="font-size: 24px; margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
                  Order Confirmation
                </h1>
              </td>
            </tr>
          </table>
        </div>



        <!-- Main Content Section -->
        <div style="padding: 40px 20px;">
          <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;">Thank you for your order, ${orderData.username}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            We've received your order and are excited to get it to you.
          </p>

          <!-- Order Details Section -->
          <div style="text-align: left; margin-bottom: 30px;">
            <h3 style="font-size: 20px; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;">Order Summary</h3>
            <p style="color: #555; font-size: 14px; margin-bottom: 10px;">
              <strong>Order #:</strong> ${count_id}
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f8f8f8;">
                  <th style="padding: 12px; text-align: left; font-size: 14px; color: #555; border-bottom: 1px solid #ddd;">Item</th>
                  <th style="padding: 12px; text-align: left; font-size: 14px; color: #555; border-bottom: 1px solid #ddd;">Qty</th>
                  <th style="padding: 12px; text-align: right; font-size: 14px; color: #555; border-bottom: 1px solid #ddd;">Unit Price</th>
                  <th style="padding: 12px; text-align: right; font-size: 14px; color: #555; border-bottom: 1px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${productsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 20px 0 10px; text-align: right; font-weight: bold; font-size: 16px; color: #333; border-top: 2px solid #ddd;">Total:</td>
                  <td style="padding: 20px 0 10px; text-align: right; font-weight: bold; font-size: 16px; color: #333; border-top: 2px solid #ddd;">RS${orderData.totalPrice.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 40px;">
            You will receive a shipping confirmation with tracking information soon.
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            For any query contact us at +92 345 7036429
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 0 0 10px 10px;">
          <div style="margin-bottom: 15px;">
            <a href="https://www.instagram.com/creativeghar7/" target="_blank" style="margin: 0 10px; display: inline-block; vertical-align: middle;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61576762615794" target="_blank" style="margin: 0 10px; display: inline-block; vertical-align: middle;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 15px; margin-bottom: 0;">
            &copy; ${new Date().getFullYear()} Creative Ghar. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  `,
        text: `
    Thank you for your order, ${orderData.username}!

    We've received your order #${count_id} and are getting it ready for shipment.

    Order Summary:
    ${validatedData.products.map(product => `
      ${product.title || `Product ID: ${product.productId}`} - Quantity: ${product.quantity} - Price: RS ${(product.price * product.quantity).toFixed(2)}
    `).join('')}

    Total: RS${orderData.totalPrice.toFixed(2)}

    We'll send you a shipping confirmation email with a tracking number as soon as your order is on its way.

    Thank you for shopping with us! 
  `,
      });
    }

    // Send email to admin
    const customerName = validatedData.username || `${validatedData.firstName || ''} ${validatedData.lastName || ''}`.trim() || 'Customer';

    const adminProductsHtml = validatedData.products.map(product => `
  <tr>
    <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${product.title || `Product ID: ${product.productId}`}</td>
    <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${product.quantity}</td>
    <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; text-align: right; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">RS${(product.price).toFixed(2)}</td>
    <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; color: #333; text-align: right; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">RS${(product.price * product.quantity).toFixed(2)}</td>
  </tr>
`).join('');

    await resend.emails.send({
      // from: 'Creative Ghar <noreply@creativeghar.com>',
      // to: "creativeghar7@gmail.com",
      // for development
      from: 'Creative Ghar <onboarding@resend.dev>',
      to: "ashfaqahmadfullstack@gmail.com",
      subject: `New Order Received - #${count_id}`,
      html: `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        
        <!-- Header with brand name -->
        <div style="background-color: #2E7D32; color: #ffffff; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="font-size: 28px; margin: 0; padding: 0;">Creative Ghar</h1>
          <p style="font-size: 16px; margin: 5px 0 0;">New Order Notification</p>
        </div>

        <!-- Main Content Section -->
        <div style="padding: 40px 20px;">
          <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;">You have received a new order!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            Customer: <strong>${customerName}</strong><br>
            Order #: <strong>${count_id}</strong><br>
            Date: <strong>${new Date().toLocaleString()}</strong>
          </p>

          <!-- Order Details Section -->
          <div style="text-align: left; margin-bottom: 30px;">
            <h3 style="font-size: 20px; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;">Order Details</h3>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f8f8f8;">
                  <th style="padding: 12px; text-align: left; font-size: 14px; color: #555; border-bottom: 1px solid #ddd;">Item</th>
                  <th style="padding: 12px; text-align: left; font-size: 14px; color: #555; border-bottom: 1px solid #ddd;">Qty</th>
                  <th style="padding: 12px; text-align: right; font-size: 14px; color: #555; border-bottom: 1px solid #ddd;">Unit Price</th>
                  <th style="padding: 12px; text-align: right; font-size: 14px; color: #555; border-bottom: 1px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${adminProductsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 20px 0 10px; text-align: right; font-weight: bold; font-size: 16px; color: #333; border-top: 2px solid #ddd;">Total:</td>
                  <td style="padding: 20px 0 10px; text-align: right; font-weight: bold; font-size: 16px; color: #333; border-top: 2px solid #ddd;">RS${orderData.totalPrice.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 40px;">
            Please process this order as soon as possible.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 0 0 10px 10px;">
          <p style="color: #999; font-size: 12px; margin-top: 15px; margin-bottom: 0;">
            &copy; ${new Date().getFullYear()} Creative Ghar. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  `,
      text: `
    NEW ORDER RECEIVED
    
    Order #: ${count_id}
    Customer: ${customerName}
    ${validatedData.email ? `Email: ${validatedData.email}` : ''}
    ${validatedData.phone ? `Phone: ${validatedData.phone}` : ''}
    Date: ${new Date().toLocaleString()}
    
    Order Details:
    ${validatedData.products.map(product => `
      ${product.title || `Product ID: ${product.productId}`} - Quantity: ${product.quantity} - Price: RS${(product.price * product.quantity).toFixed(2)}
    `).join('')}
    
    Total: RS${orderData.totalPrice.toFixed(2)}
    
    Customer Information:
    Name: ${customerName}
    ${validatedData.email ? `Email: ${validatedData.email}` : ''}
    ${validatedData.phone ? `Phone: ${validatedData.phone}` : ''}
    ${validatedData.address ? `Address: ${validatedData.address}` : ''}
    ${validatedData.city ? `City: ${validatedData.city}` : ''}
    Country: ${validatedData.country}
    
    Please process this order as soon as possible.
  `,
    });

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