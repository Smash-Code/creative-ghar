import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { productSchema } from "@/firebase/schemas/productSchema";
// import { productSchema } from "@/schemas/productSchema";

// GET /api/product/[id]
// export async function GET(_req, { params }) {
//     const data = await params;
//   const { id } = data



//   if (!id) {
//     return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
//   }

//   try {
//     const docRef = doc(db, "products", id);
//     const docSnap = await getDoc(docRef);

//     if (!docSnap.exists()) {
//       return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: { id: docSnap.id, ...docSnap.data() } });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }


export async function GET(_req, { params }) {
  const data = await params;
  const { id } = data;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch the product
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const productData = { id: productSnap.id, ...productSnap.data() };

    // 2. If product has a categoryId, fetch the category
    let categoryName = null;
    if (productData.category) {
      const categoryRef = doc(db, "categories", productData.category);
      const categorySnap = await getDoc(categoryRef);
      
      if (categorySnap.exists()) {
        categoryName = categorySnap.data().name; // Make sure this matches your field name
      }
    }

    // 3. Return combined data
    return NextResponse.json({
      success: true,
      data: {
        ...productData,
        category: categoryName || ' ' // Add category name to response
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/product/[id]
export async function PUT(req, { params }) {
    const data = await params;
  const { id } = data

  if (!id) {
    return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    delete body.createdAt;


    const updatedData = productSchema.partial().parse({
      ...body,
      updatedAt: new Date(),
    });

    const docRef = doc(db, "products", id);
    await updateDoc(docRef, updatedData);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.errors || error.message }, { status: 400 });
  }
}

// DELETE /api/product/[id]
export async function DELETE(_req, { params }) {
  const data = await params;
  const { id } = data

  if (!id) {
    return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
  }

  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
