import { NextResponse } from "next/server";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function GET(_req, { params }) {
    const data = await params;
    const { slug } = data;

    if (!slug) {
        return NextResponse.json(
            { success: false, error: "Product slug is required" },
            { status: 400 }
        );
    }

    try {
        // Query products by slug
        const productsRef = collection(db, "products");
        const slugQuery = query(productsRef, where("slug", "==", slug));
        const querySnapshot = await getDocs(slugQuery);

        if (querySnapshot.empty) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 }
            );
        }

        // Get the first matching product
        const productDoc = querySnapshot.docs[0];
        const productData = { id: productDoc.id, ...productDoc.data() };

        // If product has a categoryId, fetch the category
        let categoryName = null;
        if (productData.category) {
            const categoryRef = doc(db, "categories", productData.category);
            const categorySnap = await getDoc(categoryRef);

            if (categorySnap.exists()) {
                categoryName = categorySnap.data().name;
            }
        }

        // Return combined data
        return NextResponse.json({
            success: true,
            data: {
                ...productData,
                category: categoryName || ' '
            }
        });

    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}