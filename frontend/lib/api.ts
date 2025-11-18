// lib/api.ts - API service for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to safely parse JSON responses
async function safeJsonParse<T>(response: Response): Promise<T | null> {
  try {
    const text = await response.text();
    if (!text || text.trim() === '') {
      console.warn('Empty response from API');
      return null;
    }
    try {
      return JSON.parse(text) as T;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Response text:', text);
      return null;
    }
  } catch (error) {
    console.error('Error reading response:', error);
    return null;
  }
}

export interface ApiProduct {
  id: string;
  name: string;
  author: string;
  price: number;
  rating?: number; // Optional, removed from collector
  img: string;
  category: "Painting" | "Sculpture" | "Literature (E-book)" | "Graphic Design" | "Crafts" | "Digital Art";
  description?: string;
  stock?: number;
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

// Convert backend product to frontend product format
export function toFrontendProduct(apiProduct: ApiProduct) {
  return {
    id: apiProduct.id, // Include ID for unique keys
    name: apiProduct.name,
    author: apiProduct.author,
    price: apiProduct.price,
    // rating removed from collector view
    img: apiProduct.img,
    category: apiProduct.category,
    status: apiProduct.status, // Include status for filtering
  };
}

// Fetch all products
export async function fetchProducts(status?: "pending" | "approved" | "rejected"): Promise<ApiProduct[]> {
  try {
    const url = status 
      ? `${API_BASE_URL}/products?status=${encodeURIComponent(status)}`
      : `${API_BASE_URL}/products`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const result = await safeJsonParse<ApiProduct[]>(response);
    return result || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch product by ID
export async function fetchProductById(id: string): Promise<ApiProduct | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Product ${id} not found (404)`);
        return null;
      }
      const errorText = await response.text();
      throw new Error(`Failed to fetch product: ${response.statusText} - ${errorText}`);
    }
    const result = await safeJsonParse<ApiProduct>(response);
    return result;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Search products
export async function searchProducts(query: string): Promise<ApiProduct[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

// Fetch products by category
export async function fetchProductsByCategory(category: string): Promise<ApiProduct[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products?category=${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products by category: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Fetch products by author
export async function fetchProductsByAuthor(author: string, status?: "pending" | "approved" | "rejected"): Promise<ApiProduct[]> {
  try {
    let url = `${API_BASE_URL}/products?author=${encodeURIComponent(author)}`;
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch products by author: ${response.statusText}`);
    }
    const result = await safeJsonParse<ApiProduct[]>(response);
    return result || [];
  } catch (error) {
    console.error('Error fetching products by author:', error);
    return [];
  }
}

// Create product
export async function createProduct(product: Omit<ApiProduct, "id" | "createdAt" | "updatedAt">): Promise<ApiProduct | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...product,
        status: 'pending', // New products always start as pending
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`Failed to create product: ${response.statusText} - ${errorText}`);
    }
    const result = await safeJsonParse<ApiProduct>(response);
    if (!result) {
      throw new Error('Invalid response from server');
    }
    return result;
  } catch (error) {
    console.error('Error creating product:', error);
    // Re-throw to let caller handle the error message
    throw error;
  }
}

// Update product (for artist-writer)
export async function updateProduct(productId: string, updates: Partial<ApiProduct>): Promise<ApiProduct | null> {
  try {
    console.log(`Updating product ${productId}`);
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update product: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Failed to update product: ${response.statusText} - ${errorText}`);
    }
    
    const result = await safeJsonParse<ApiProduct>(response);
    if (!result) {
      console.error('Invalid response from server when updating product');
      throw new Error('Invalid response from server');
    }
    
    console.log(`Successfully updated product ${productId}`);
    return result;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// Delete product
export async function deleteProduct(productId: string): Promise<boolean> {
  try {
    console.log(`Deleting product ${productId}`);
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to delete product: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Failed to delete product: ${response.statusText} - ${errorText}`);
    }
    
    console.log(`Successfully deleted product ${productId}`);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Update product status (for admin)
export async function updateProductStatus(productId: string, status: "pending" | "approved" | "rejected"): Promise<ApiProduct | null> {
  try {
    console.log(`Updating product ${productId} status to ${status}`);
    const response = await fetch(`${API_BASE_URL}/products/${productId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update product status: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Failed to update product status: ${response.statusText} - ${errorText}`);
    }
    
    const result = await safeJsonParse<ApiProduct>(response);
    if (!result) {
      console.error('Invalid response from server when updating product status');
      throw new Error('Invalid response from server');
    }
    
    console.log(`Successfully updated product ${productId} status to ${status}`);
    return result;
  } catch (error) {
    console.error('Error updating product status:', error);
    // Re-throw to let caller handle the error
    throw error;
  }
}

// User/Store Information API
export interface ApiUser {
  id: string;
  accountId: string;
  name: string;
  email: string;
  role: "Creator" | "Collector" | "Admin";
  status: "Normal" | "Suspended" | "Deleted";
  avatar?: string;
  storeName?: string;
  phone?: string;
  address?: string;
}

// Fetch user by ID
export async function fetchUserById(id: string): Promise<ApiUser | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Fetch current user (by email from localStorage or session)
export async function fetchCurrentUser(): Promise<ApiUser | null> {
  try {
    if (typeof window === 'undefined') return null;
    
    // Try to get user ID first
    const userId = localStorage.getItem('musecraft.userId');
    if (userId) {
      const user = await fetchUserById(userId);
      if (user) return user;
    }
    
    // Fallback to email
    const userEmail = localStorage.getItem('musecraft.userEmail') || 'creator@email.com';
    const response = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(userEmail)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch current user: ${response.statusText}`);
    }
    const result = await response.json();
    // findByEmail returns User | null, not array
    return result || null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

// Create user (for sign up)
export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role?: "Creator" | "Collector" | "Admin";
}): Promise<ApiUser | null> {
  try {
    // Prevent creating Admin role through sign up - only Collector or Creator allowed
    const role = (userData.role === "Admin" ? "Collector" : (userData.role || "Collector")) as "Creator" | "Collector";
    const rolePrefix = role === "Creator" ? "CRE" : "COL";
    const users = await fetch(`${API_BASE_URL}/users`).then(r => r.json()).catch(() => []);
    const count = Array.isArray(users) ? users.filter((u: ApiUser) => u.role === role).length + 1 : 1;
    const accountId = `#${rolePrefix}-${String(count).padStart(3, '0')}`;

    // Create user
    const newUser: Omit<ApiUser, "id"> = {
      accountId,
      name: userData.name,
      email: userData.email,
      role: role,
      status: "Normal",
    };

    const userResponse = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to create user: ${userResponse.statusText}`);
    }

    const createdUser = await userResponse.json();

    // Create credential
    const credentialResponse = await fetch(`${API_BASE_URL}/users/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        userId: createdUser.id,
      }),
    });

    if (!credentialResponse.ok) {
      // If credential creation fails, we should ideally rollback user creation
      // For now, just log the error
      console.error('Failed to create credential, but user was created');
    }

    return createdUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Update user
export async function updateUser(id: string, updates: Partial<ApiUser>): Promise<ApiUser | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Order API
export interface ApiOrder {
  id: string;
  buyerId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    qty: number;
  }>;
  total: number;
  dateISO: string;
  status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}

// Fetch orders by creator (products created by this creator)
export async function fetchOrdersByCreator(creatorName: string): Promise<ApiOrder[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders?creatorName=${encodeURIComponent(creatorName)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders by creator: ${response.statusText}`);
    }
    const result = await safeJsonParse<ApiOrder[]>(response);
    return result || [];
  } catch (error) {
    console.error('Error fetching orders by creator:', error);
    return [];
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: ApiOrder["status"]): Promise<ApiOrder | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.statusText}`);
    }
    return await safeJsonParse<ApiOrder>(response);
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
}

