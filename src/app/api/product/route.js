import { NextResponse } from "next/server";
import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { productSchema } from "@/firebase/schemas/productSchema";
// import { getPaginatedQuery } from "@/lib/getPaginatedQuery";

// POST: Add a new product

export async function POST(req) {
  try {
    const body = await req.json();

    // Convert numeric fields from string to number
    const parsedBody = {
      ...body,
      orignal_price: Number(body.orignal_price),
      discounted_price: Number(body.discounted_price),
      stock: Number(body.stock),
      return_or_exchange_time: Number(body.return_or_exchange_time),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate the parsed input
    const validatedData = productSchema.parse(parsedBody);

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'products'), {
      ...validatedData,
      createdAt: Timestamp.fromDate(validatedData.createdAt),
      updatedAt: Timestamp.fromDate(validatedData.updatedAt),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.errors || error.message },
      { status: 400 }
    );
  }
}

// GET : All products



// export async function GET() {
//   try {
//     const productsRef = collection(db, "products");

//     // Get all documents directly without any query
//     const snapshot = await getDocs(productsRef);

//     const products = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return NextResponse.json({ success: true, data: products });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    // Get all products first
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch category names for all products
    const productsWithCategories = await Promise.all(
      products.map(async (product) => {
        if (product.category) {
          const categoryRef = doc(db, "categories", product.category);
          const categorySnap = await getDoc(categoryRef);
          
          return {
            ...product,
            category: categorySnap.exists() ? categorySnap.data().name : ' '
          };
        }
        return product;
      })
    );


    return NextResponse.json({ success: true, data: productsWithCategories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   try {
//     const productsRef = collection(db, "products");
    
//     // Optional: Order by createdAt (newest first)
//     const q = query(productsRef, orderBy("createdAt", "desc"));

//     const snapshot = await getDocs(q);
//     const products = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return NextResponse.json({ success: true, data: products });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

//GET : get product by category
// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const category = searchParams.get("category");
//     const page = parseInt(searchParams.get("page") || "1");
//     const pageSize = parseInt(searchParams.get("limit") || "10");

//     const q = await getPaginatedQuery(category, page, pageSize);
//     const snapshot = await getDocs(q);

//     const products = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return NextResponse.json({
//       success: true,
//       data: products,
//       pagination: {
//         page,
//         limit: pageSize,
//         count: products.length,
//         hasMore: products.length === pageSize,
//       },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }
