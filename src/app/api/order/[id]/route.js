import { NextResponse } from 'next/server';
import { doc, updateDoc, getDoc, getFirestore, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Get the current order data first
    const orderRef = doc(db, 'orders', id);
    const orderSnapshot = await getDoc(orderRef);
    const currentOrder = orderSnapshot.data();

    // Update the order
    await updateDoc(orderRef, {
      ...body,
      updatedAt: new Date()
    });

    // Check if fulfillment info was added/updated and send email
    if (body.orderFulfillment && currentOrder.email) {
      await sendShippingConfirmationEmail(
        currentOrder.email,
        id,
        body.orderFulfillment,
        currentOrder.username || 'Customer'
      );
    }

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

// Email sending function for shipping confirmation using Resend
async function sendShippingConfirmationEmail(toEmail, orderId, fulfillmentInfo, customerName) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Creative Ghar <noreply@creativeghar.com>', // Replace with your verified domain
      to: toEmail,
      subject: `Your Order #${orderId} is on its way!`,
      html: `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 24px; font-weight: 500; margin-bottom: 5px;">Your order is on the way!</h1>
    <p style="font-size: 16px; color: #666;">Order #${orderId}</p>
  </div>

  <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
    <h2 style="font-size: 18px; font-weight: 500; margin-top: 0; margin-bottom: 20px;">Tracking Information</h2>
    
    <div style="margin-bottom: 15px;">
      <div style="font-size: 14px; color: #999; margin-bottom: 5px;">Tracking number</div>
      <div style="font-size: 16px; font-weight: 500;">${fulfillmentInfo.trackingNumber}</div>
    </div>
    
    <a href="${fulfillmentInfo.trackingLink}" 
       style="display: inline-block; background-color: #000; color: #fff; 
              text-decoration: none; padding: 12px 20px; border-radius: 4px; 
              font-size: 14px; font-weight: 500; margin-top: 10px;">
      Track your package
    </a>
  </div>

  <div style="text-align: center; font-size: 14px; color: #999; line-height: 1.5;">
    <p>We've shipped your order. You can track its progress using the link above.</p>
    <p>Thank you for shopping with us!</p>
  </div>
</div>
      `,
      text: `
      Hi ${customerName},

Your order #${orderId} has been shipped!

TRACKING INFORMATION
Tracking Number: ${fulfillmentInfo.trackingNumber}
Track Your Package: ${fulfillmentInfo.trackingLink}

We've shipped your order. You can track its progress using the link above.

Thank you for shopping with us!

Creative Ghar
------------------
If you have any questions, contact us at 03457036429
`
    });

    if (error) {
      console.error('Resend error:', error);
      return;
    }

    console.log('Shipping confirmation email sent:', data);

  } catch (error) {
    console.error('Error sending shipping confirmation email:', error);
    // Don't fail the request if email fails
  }
}







export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const orderRef = doc(db, 'orders', id);

    // Check if order exists
    const orderSnapshot = await getDoc(orderRef);
    if (!orderSnapshot.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found'
        },
        { status: 404 }
      );
    }

    // Delete the order
    await deleteDoc(orderRef);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete order'
      },
      { status: 500 }
    );
  }
}