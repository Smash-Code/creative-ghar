// hooks/useProductApi.js
export function useProductApi() {
  const BASE_URL = "/api/product";

  // Create a new product
  const createProduct = async (productData) => {
    const payload = {
      ...productData,
      orignal_price: Number(productData.orignal_price),
      discounted_price: Number(productData.discounted_price),
      stock: Number(productData.stock),
      // return_or_exchange_time: Number(productData.return_or_exchange_time),
    };

    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Get a single product by ID
  const getProductById = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch product");
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Update a product by ID
  const updateProduct = async (id, updatedData) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Delete a product by ID
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product");
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Get all products (with optional pagination)
  const getAllProducts = async ({ page = 1, limit = 10 } = {}) => {
    try {
      const res = await fetch(`${BASE_URL}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch products");
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Get products by category (with pagination)
  const getProductsByCategory = async (category, { page = 1, limit = 10 } = {}) => {
    try {
      const res = await fetch(
        `/api/product/category?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  };

  return {
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductsByCategory,
  };
}
