import { NextResponse } from "next/server";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryName = searchParams.get('category');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        // First find the category ID from the name
        let categoryId = null;
        if (categoryName) {
            const categoriesSnapshot = await getDocs(collection(db, "categories"));
            const categoryDoc = categoriesSnapshot.docs.find(
                doc => doc.data().name === categoryName
            );
            if (!categoryDoc) {
                return NextResponse.json({ success: true, data: [] });
            }
            categoryId = categoryDoc.id;
        }

        // Query products with this category ID
        const productsQuery = query(
            collection(db, "products"),
            where("category", "==", categoryId)
        );

        const productsSnapshot = await getDocs(productsQuery);
        const products = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Implement simple pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = products.slice(startIndex, endIndex);

        // Get category names for each product
        const productsWithCategories = await Promise.all(
            paginatedProducts.map(async (product) => {
                let categoryName = 'Uncategorized';
                if (product.category) {
                    const categoryRef = doc(db, "categories", product.category);
                    const categorySnap = await getDoc(categoryRef);
                    categoryName = categorySnap.exists() ? categorySnap.data().name : 'Uncategorized';
                }
                return {
                    ...product,
                    category: categoryName
                };
            })
        );

        return NextResponse.json({
            success: true,
            data: productsWithCategories,
            hasMore: products.length > endIndex
        });
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}