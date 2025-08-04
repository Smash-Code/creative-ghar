import Link from 'next/link';

export default function DashboardPage() {

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <Link href='/admin/dashboard/product-form' >
      <button
        // onClick={() => router.push('/dashboard/product-form')}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        >
        + Add New Product
      </button>
          </Link>


           <Link
        href="/admin/dashboard/products"
        className="inline-block bg-gray-700 text-white px-4 py-2 rounded"
      >
        📦 View All Products
      </Link>
    </div>
  );
}
