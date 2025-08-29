import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { productSchema } from "@/firebase/schemas/productSchema";
import { generateSlug, generateUniqueSlug } from "@/utils/slug";



export async function GET(_req, { params }) {
  const data = await params;
  const { id } = data;

  console.log(params)

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Product identifier is required" },
      { status: 400 }
    );
  }

  try {
    let productData = null;
    let categoryName = null;

    // 1. First try to find by slug
    try {
      const productsRef = collection(db, "products");
      const slugQuery = query(productsRef, where("slug", "==", id));
      const querySnapshot = await getDocs(slugQuery);

      if (!querySnapshot.empty) {
        const productDoc = querySnapshot.docs[0];
        productData = { id: productDoc.id, ...productDoc.data() };
      }
    } catch (slugError) {
      console.log('Slug lookup failed, trying ID lookup');
    }

    // 2. If not found by slug, try ID lookup (for backward compatibility)
    if (!productData) {
      const productRef = doc(db, "products", id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        productData = { id: productSnap.id, ...productSnap.data() };
      }
    }

    if (!productData) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // 3. If product has a categoryId, fetch the category
    if (productData.category) {
      const categoryRef = doc(db, "categories", productData.category);
      const categorySnap = await getDoc(categoryRef);

      if (categorySnap.exists()) {
        categoryName = categorySnap.data().name;
      }
    }

    // 4. Return combined data
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

    // Handle slug generation if title is being updated and no slug is provided
    let slugToUpdate = body.slug;
    if (!slugToUpdate && body.title) {
      const baseSlug = generateSlug(body.title);

      // Check if slug already exists (excluding current product)
      const productsRef = collection(db, 'products');
      const slugQuery = query(productsRef, where('slug', '==', baseSlug));
      const slugSnapshot = await getDocs(slugQuery);

      // Filter out the current product
      const existingSlugs = slugSnapshot.docs
        .filter(doc => doc.id !== id)
        .map(doc => doc.data().slug);

      if (existingSlugs.includes(baseSlug)) {
        slugToUpdate = generateUniqueSlug(baseSlug, existingSlugs);
      } else {
        slugToUpdate = baseSlug;
      }
    }

    // First parse the basic data without category resolution
    const parsedData = productSchema.partial().parse({
      ...body,
      ...(slugToUpdate ? { slug: slugToUpdate } : {}),
      priority: Number(body.priority) || 0,
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

    return NextResponse.json({
      success: true,
      id,
      ...(slugToUpdate ? { slug: slugToUpdate } : {})
    });
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
