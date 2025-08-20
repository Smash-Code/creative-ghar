import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { productSchema } from "@/firebase/schemas/productSchema";
// import { productSchema } from "@/schemas/productSchema";




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
  const { id } = data;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    delete body.createdAt;

    // First parse the basic data without category resolution
    const parsedData = productSchema.partial().parse({
      ...body,
      sizes: body.sizes?.map((size) => ({
        name: size.name,
        stock: Number(size.stock) || 0,
      })) || [],
      colors: body.colors?.map((color) => ({
        name: color.name,
        hex: color.hex,
      })) || [],
      updatedAt: new Date(),
    });

    // Handle category resolution
    let categoryToUpdate = parsedData.category;

    if (categoryToUpdate && typeof categoryToUpdate === 'string') {
      // Check if it's a valid ID format (optional)
      const isPotentialId = /^[a-zA-Z0-9]{20}$/.test(categoryToUpdate);

      if (!isPotentialId) {
        // It's likely a category name, so look up the ID
        const categoriesRef = collection(db, "categories");
        const q = query(categoriesRef, where("name", "==", categoryToUpdate));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Get the first matching category's ID
          categoryToUpdate = querySnapshot.docs[0].id;
        } else {
          // No matching category found - you could throw an error here if you want
          console.warn(`No category found with name: ${categoryToUpdate}`);
          categoryToUpdate = null;
        }
      }
    }

    // Prepare the final update data
    const updatedData = {
      ...parsedData,
      ...(categoryToUpdate ? { category: categoryToUpdate } : {}),
    };

    const docRef = doc(db, "products", id);
    await updateDoc(docRef, updatedData);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, error: error.errors || error.message },
      { status: 400 }
    );
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
