// import Link from 'next/link';

// export default function DashboardPage() {

//   return (
//     <div className="">
//       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//       <Link href='/admin/dashboard/product-form' >
//       <button
//         // onClick={() => router.push('/dashboard/product-form')}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//         + Add New Product
//       </button>
//           </Link>


//            <Link
//         href="/admin/dashboard/products"
//         className="inline-block bg-gray-700 text-white px-4 py-2 rounded"
//       >
//         📦 View All Products
//       </Link>


//       <div className='flex' >
//         <div className='max-w-[20%]' >
          
//         </div>
//       </div>


//     </div>
//   );
// }

"use client"

import Sidebar from '@/components/Sidebar';
import { useProductApi } from '@/hooks/useProduct';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { getAllProducts, deleteProduct } = useProductApi();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);


    const router = useRouter();
  
    useEffect(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const res = await getAllProducts({ page: 1, limit: 20 });

          console.log(res)
          setProducts(res.data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
        setLoading(false);
      };
  
      fetchProducts();
    }, []);
  
    const handleDelete = async (id) => {
      const confirm = window.confirm('Are you sure you want to delete this product?');
      if (!confirm) return;
  
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete');
      }
    };
  
    const handleEdit = (id) => {
      router.push(`/dashboard/product-form?id=${id}`);
    };


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
            <div className="flex space-x-4">
              <Link 
                href="/admin/dashboard/product-form" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </Link>
              <Link 
                href="/admin/dashboard/products" 
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Show All Products
              </Link>
            </div>
          </div>

          {/* Products Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) :
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discounted Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Products will be mapped here using your hook */}
                  {/* Example row - replace with your data mapping */}

                  {products.map((item)=>{
                    return(
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex-shrink-0 h-5 w-5">
                            {/* Image will be rendered here */}
                            <img className="h-5 w-5 rounded-full" src={item.images[0]} alt="" />
                          </div>
                        </td>
                        <td className="px-6 cursor-pointer transition-all duration-200 hover:text-blue-500 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.orignal_price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.discounted_price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.stock}
                        </td>
                        <td className="flex items-center px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/admin/dashboard/product-form?id=${item.id}`}>
                            <div className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</div>
                          </Link>
                          <div onClick={() => handleDelete(item.id)} className="text-red-600 cursor-pointer hover:text-red-900">Delete</div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  );
}