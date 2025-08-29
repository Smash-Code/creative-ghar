import { NextResponse } from "next/server";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { generateSlug, generateUniqueSlug } from "@/utils/slug";

export async function POST(req) {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    const productsToUpdate = [];
    const existingSlugs = [];

    // First pass: collect existing slugs and products without slugs
    snapshot.docs.forEach((doc) => {
      const product = { id: doc.id, ...doc.data() };
      if (product.slug) {
        existingSlugs.push(product.slug);
      } else {
        productsToUpdate.push(product);
      }
    });

    console.log(`Found ${productsToUpdate.length} products without slugs`);

    let updatedCount = 0;
    const errors = [];

    // Update products without slugs
    for (const product of productsToUpdate) {
      try {
        const baseSlug = generateSlug(product.title);

        // Ensure unique slug
        let finalSlug = baseSlug;
        if (existingSlugs.includes(baseSlug)) {
          finalSlug = generateUniqueSlug(baseSlug, existingSlugs);
        }

        // Update the product with the new slug
        const productRef = doc(db, 'products', product.id);
        await updateDoc(productRef, {
          slug: finalSlug,
          updatedAt: new Date()
        });

        existingSlugs.push(finalSlug);
        updatedCount++;

        console.log(`Updated product "${product.title}" with slug "${finalSlug}"`);
      } catch (error) {
        console.error(`Error updating product ${product.id}:`, error);
        errors.push({
          productId: product.id,
          productTitle: product.title,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration completed. Updated ${updatedCount} products.`,
      updatedCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check migration status
export async function GET() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    let totalProducts = 0;
    let productsWithSlugs = 0;
    let productsWithoutSlugs = 0;

    snapshot.docs.forEach((doc) => {
      totalProducts++;
      const product = doc.data();
      if (product.slug) {
        productsWithSlugs++;
      } else {
        productsWithoutSlugs++;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        productsWithSlugs,
        productsWithoutSlugs,
        migrationNeeded: productsWithoutSlugs > 0
      }
    });

  } catch (error) {
    console.error('Error checking migration status:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}