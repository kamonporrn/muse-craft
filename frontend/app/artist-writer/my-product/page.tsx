"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaSearch, FaBox, FaTags, FaImage, FaClock, FaArrowLeft } from "react-icons/fa";
import { FileText, Hourglass, CheckCircle, XCircle, Check } from "lucide-react";
import { fetchProductsByAuthor, fetchCurrentUser, fetchProductById, deleteProduct, type ApiProduct } from "@/lib/api";
import { FaUpload } from "react-icons/fa";

// Types
type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface ProductData {
  productName: string;
  category: string;
  price: string;
  stock: number;
  description: string;
  imageName: string;
}

const initialProductData: ProductData = {
  productName: "N/A",
  category: "N/A",
  price: "0",
  stock: 0,
  description: "Waiting for submission details.",
  imageName: "No image"
};

// StepIcon Component
const StepIcon = ({ icon: Icon, label, status, stepIndex, approvalStatus }: { 
  icon: React.ElementType, 
  label: string, 
  status: 'current' | 'completed' | 'pending',
  stepIndex: number,
  approvalStatus: ApprovalStatus
}) => {
  let bgColor = "bg-gray-300";
  let textColor = "text-gray-500";
  
  if (status === 'completed') {
    bgColor = "bg-green-500";
    textColor = "text-green-600";
  } else if (status === 'current') {
    // Step 3 (Approved/Rejected) - ใช้สีตาม approvalStatus
    if (stepIndex === 3) {
      if (approvalStatus === 'approved') {
        bgColor = "bg-green-500";
        textColor = "text-green-600";
      } else if (approvalStatus === 'rejected') {
        bgColor = "bg-red-500";
        textColor = "text-red-600";
      } else {
        bgColor = "bg-yellow-500";
        textColor = "text-yellow-600";
      }
    } else {
      bgColor = "bg-yellow-500";
      textColor = "text-yellow-600";
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center p-3 transition-colors duration-500 ${bgColor} shadow-lg`}>
        <div className={`w-8 h-8 text-white`}>
          {status === 'completed' ? <Check className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
        </div>
      </div>
      <span className={`mt-2 text-sm font-medium ${textColor}`}>{label}</span>
    </div>
  );
};

// StatusView Component
const StatusView = ({ productId }: { productId?: string }) => {
  const router = useRouter();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);

  // Load product data from API
  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        console.log('Loading product with ID:', productId);
        const productData = await fetchProductById(productId);
        console.log('Product data received:', productData);
        if (productData) {
          setProduct(productData);
        } else {
          console.warn('Product not found (404):', productId);
          console.warn('API URL:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/products/${productId}`);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    loadProduct();

    // Poll for status updates every 5 seconds if still pending
    let pollInterval: NodeJS.Timeout | null = null;
    
    const startPolling = () => {
      pollInterval = setInterval(async () => {
        try {
          const productData = await fetchProductById(productId);
          if (productData) {
            setProduct(productData);
            // If status changed from pending, stop polling
            if (productData.status !== 'pending') {
              if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
              }
            }
          }
        } catch (error) {
          console.error('Failed to poll product status:', error);
          // Stop polling on error
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }
      }, 5000);
    };

    // Only start polling if product exists and is pending
    const checkAndStartPolling = async () => {
      try {
        const productData = await fetchProductById(productId);
        if (productData && productData.status === 'pending') {
          startPolling();
        }
      } catch (error) {
        console.error('Failed to check product for polling:', error);
      }
    };

    // Start polling after initial load
    setTimeout(checkAndStartPolling, 1000);

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [productId]);

  // Handle redirect after approval decision (only once) - must be before conditional returns
  useEffect(() => {
    if (!product) return;
    
    // Only redirect if status changed to approved or rejected
    if (product.status === 'approved') {
      const timer = setTimeout(() => {
        console.log('Product approved, redirecting to Live tab');
        router.push('/artist-writer/my-product?status=Live');
      }, 3000);
      return () => clearTimeout(timer);
    } else if (product.status === 'rejected') {
      const timer = setTimeout(() => {
        console.log('Product rejected, redirecting to Violation tab');
        router.push('/artist-writer/my-product?status=Violation');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [product?.status, router]);

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="text-center text-gray-500">Loading product status...</div>
          {productId && (
            <div className="text-center text-xs text-gray-400 mt-2">Product ID: {productId}</div>
          )}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="text-center text-red-500 mb-2">Product not found</div>
          {productId && (
            <div className="text-center text-xs text-gray-400 mb-4">Product ID: {productId}</div>
          )}
          <div className="text-center text-sm text-gray-600 mb-4">
            The product may not exist or has been deleted.
          </div>
          <div className="flex justify-center mt-4">
            <Link href="/artist-writer/my-product">
              <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                Back to My Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Determine approval status from product status
  const approvalStatus: ApprovalStatus = product.status === 'approved' ? 'approved' : 
                                         product.status === 'rejected' ? 'rejected' : 
                                         'pending';

  // Determine current step
  let approvalStep = 1;
  if (product.status === 'pending') {
    approvalStep = 2; // Waiting for approval
  } else if (product.status === 'approved' || product.status === 'rejected') {
    approvalStep = 3; // Decision made
  }

  const getStatus = (stepIndex: number) => {
    if (stepIndex < approvalStep) return 'completed';
    if (stepIndex === approvalStep) return 'current';
    return 'pending';
  };

  const steps = [
    { label: "Submit", icon: FileText },
    { label: "Waiting for Approval", icon: Hourglass },
    { label: approvalStatus === 'approved' ? "Approved" : approvalStatus === 'rejected' ? "Rejected" : "Approved/Rejected", icon: approvalStatus === 'approved' ? CheckCircle : approvalStatus === 'rejected' ? XCircle : Check },
  ];

  return (
    <div className="flex flex-col">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Waiting for approval
        </h1>
        <p className="text-md text-gray-600 mb-8 text-center">
          {approvalStep === 1 && "Submitting your product"}
          {approvalStep === 2 && approvalStatus === 'pending' && "Your product is currently under review by our administration team"}
          {approvalStep === 3 && approvalStatus === 'approved' && "Your product has been approved"}
          {approvalStep === 3 && approvalStatus === 'rejected' && "Your product has been rejected"}
        </p>

        {/* Progress Timeline */}
        <section className="flex justify-center items-center my-10 relative">
          <div className="absolute w-2/3 h-1 bg-gray-300 top-1/2 transform -translate-y-1/2 z-0">
            <div 
              className={`h-full transition-all duration-500 progress-bar-width ${
                approvalStatus === 'approved' ? 'bg-green-500' : 
                approvalStatus === 'rejected' ? 'bg-red-500' : 
                'bg-yellow-500'
              }`}
              // eslint-disable-next-line react/forbid-dom-props
              style={{ '--progress-width': `${(approvalStep - 1) * 50}%` } as React.CSSProperties}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => (
            <div key={index} className="flex-1 flex justify-center z-10">
              <StepIcon 
                icon={step.icon} 
                label={step.label} 
                status={getStatus(index + 1) as 'current' | 'completed' | 'pending'} 
                stepIndex={index + 1}
                approvalStatus={approvalStatus}
              />
            </div>
          ))}
        </section>

        {/* Product Details */}
        <section className="p-6 bg-[#f6e9ff] rounded-lg border border-purple-200 mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Product Details</h2>
          <div className="flex gap-6">
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
              {product.img ? (
                <img 
                  src={product.img.startsWith('data:') ? product.img : product.img}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-gray-500 break-words text-center px-2">No Image</span>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-gray-500 break-words text-center px-2">No Image Uploaded</span>
                </div>
              )}
            </div>
            
            <div className="text-gray-800 space-y-3">
              <div className="text-xl font-bold text-purple-700">
                {product.name}
              </div>
              
              <div className="font-semibold text-gray-600 inline">
                ฿{product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              
              <div className="text-sm">
                <span className="font-semibold text-gray-600 inline">Category: </span>
                <span className="text-gray-800 inline">{product.category}</span>
              </div>

              {product.description && (
                <div className="text-sm">
                  <span className="font-semibold text-gray-600 inline">Description: </span>
                  <span className="text-gray-800 inline">{product.description}</span>
                </div>
              )}

              {product.stock !== undefined && (
                <div className="text-sm">
                  <span className="font-semibold text-gray-600 inline">Stock: </span>
                  <span className="text-gray-800 inline">{product.stock}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => {
              // Clear all query parameters and go to my-product page
              router.replace('/artist-writer/my-product');
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function PageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Live");
  const [view, setView] = useState<'list' | 'status' | 'add'>('list');
  
  // Add New Product form states
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string>("");

  // ตรวจสอบ query parameter เมื่อ component mount
  useEffect(() => {
    const viewParam = searchParams.get('view');
    const statusParam = searchParams.get('status');
    const productIdParam = searchParams.get('productId');
    
    if (viewParam === 'add') {
      setView('add');
    } else if (viewParam === 'status' || productIdParam) {
      setView('status');
    } else if (statusParam) {
      // ตรวจสอบว่า status อยู่ใน tabs หรือไม่
      const validStatuses = ["Live", "Sold Out", "In Progress", "Violation"];
      if (validStatuses.includes(statusParam)) {
        setActiveTab(statusParam);
        setView('list');
      } else {
        setView('list');
      }
    } else {
      // No query parameters - show list view
      setView('list');
    }
  }, [searchParams]);

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());

  // Load products from API
  const loadProducts = async () => {
    try {
      const user = await fetchCurrentUser();
      if (user) {
        const allProducts = await fetchProductsByAuthor(user.name);
        setProducts(allProducts);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Reload products when page becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Poll for product updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadProducts();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Map status to tabs
  const getProductStatus = (product: ApiProduct): string => {
    // Check status first
    if (product.status === "rejected") return "Violation";
    if (product.status === "pending") return "In Progress";
    if (product.status === "approved") {
      // Only check stock if status is approved
      if (product.stock !== undefined && product.stock === 0) return "Sold Out";
      return "Live";
    }
    // Default: if no status or unknown status, treat as Live (for backward compatibility)
    return "Live";
  };

  const tabs = [
    { name: "Live", count: products.filter(p => getProductStatus(p) === "Live").length },
    { name: "Sold Out", count: products.filter(p => getProductStatus(p) === "Sold Out").length },
    { name: "In Progress", count: products.filter(p => getProductStatus(p) === "In Progress").length },
    { name: "Violation", count: products.filter(p => getProductStatus(p) === "Violation").length },
  ];

  const filteredProducts = products.filter((product) => {
    // Hide products that are being deleted
    if (deleting.has(product.id)) return false;
    return getProductStatus(product) === activeTab;
  });

  // Delete product with fade animation
  const handleDelete = async (productId: string) => {
    try {
      // Start fade out animation immediately
      setDeleting(prev => new Set(prev).add(productId));
      
      // Wait for fade animation (300ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const success = await deleteProduct(productId);
      if (success) {
        // Remove product from state immediately after fade out
        setProducts(prev => prev.filter(p => p.id !== productId));
        // Remove from deleting set
        setDeleting(prev => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        console.log(`Product ${productId} deleted successfully`);
      } else {
        // Cancel fade out on error
        setDeleting(prev => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        alert("Failed to delete product. Please try again.");
      }
    } catch (error) {
      // Cancel fade out on error
      setDeleting(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      console.error('Error deleting product:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to delete product: ${errorMessage}`);
    }
  };

  // Render status view or product list
  if (view === 'status') {
    const productId = searchParams.get('productId');
    return (
      <StatusView productId={productId || undefined} />
    );
  }

  return (
    <div className="flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">My Product</h1>
           <Link href="/artist-writer/add-new-product">
            <button className="bg-purple-500 hover:bg-purple-600 text-white text-sm px-4 py-2 rounded-lg font-medium">
              Add New Product
            </button>
          </Link>
        </div>

        {/* Search + Tabs */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          <div className="bg-purple-50 border border-purple-200 rounded-xl shadow-sm p-3 mb-4 flex items-center gap-2">
            <FaSearch className="text-purple-500" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
          {/* Tabs - แสดงเสมอ */}
          <div className="flex border-b border-gray-200 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  router.push(`/artist-writer/my-product?status=${tab.name}`);
                }}
                className={`flex-1 pb-3 px-4 font-medium cursor-pointer transition-colors text-center ${
                  activeTab === tab.name
                    ? "text-purple-600 border-b-2 border-purple-500"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No products found in this category.</div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-xl shadow p-4 flex justify-between items-center transition-opacity duration-300 ${
                  deleting.has(product.id) ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {/* LEFT SIDE */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                    {product.img ? (
                      <img
                        src={product.img.startsWith('data:') ? product.img : product.img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.src = '/img/products/placeholder.jpg';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <FaImage size={24} />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md inline-flex items-center gap-1">
                      <FaTags className="text-blue-500" /> {product.category}
                    </span>

                    <>
                      <p className="mt-1 font-semibold text-gray-800">฿{product.price.toLocaleString()}</p>
                      <div className="flex gap-6 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <FaBox /> Stock {product.stock || 0}
                        </span>
                      </div>
                    </>
                  </div>
                </div>

                {/* RIGHT SIDE BUTTONS */}
                {activeTab === "In Progress" ? (
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-sm text-yellow-500 font-medium flex items-center gap-1">
                      <FaClock className="text-yellow-400" /> Waiting for Confirmation
                    </p>
                    <Link href={`/artist-writer/my-product?view=status&productId=${product.id}`}>
                      <button className="border border-purple-400 text-purple-600 px-3 py-1 rounded-md text-sm hover:bg-purple-50">
                        View Details
                      </button>
                    </Link>
                  </div>
              ) : activeTab === "Violation" ? (
                <div className="flex flex-col items-end gap-2">
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="border border-red-400 text-red-500 px-3 py-1 rounded-md text-sm hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  <Link href={`/artist-writer/my-product/edit/${product.id}`}>
                    <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-100">
                      Edit
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="border border-red-400 text-red-500 px-3 py-1 rounded-md text-sm hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
              </div>
            ))
          )}
        </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-purple-50 flex items-center justify-center">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}