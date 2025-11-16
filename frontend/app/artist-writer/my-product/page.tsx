"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaSearch, FaBox, FaTags, FaImage, FaClock, FaArrowLeft } from "react-icons/fa";
import { FileText, Hourglass, CheckCircle, XCircle, Check } from "lucide-react";

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
const StatusView = ({ product, approvalStep, approvalStatus, onStatusChange }: { 
  product: ProductData, 
  approvalStep: number,
  approvalStatus: ApprovalStatus,
  onStatusChange: (status: ApprovalStatus) => void
}) => {
  const router = useRouter();

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

  // Simulate admin approval/rejection
  useEffect(() => {
    if (approvalStep === 2 && approvalStatus === 'pending') {
      const timer = setTimeout(() => {
        const isApproved = Math.random() > 0.3;
        const newStatus: ApprovalStatus = isApproved ? 'approved' : 'rejected';
        onStatusChange(newStatus);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [approvalStep, approvalStatus, onStatusChange]);

  // Handle redirect after approval decision
  useEffect(() => {
    if (approvalStep === 3) {
      const timer = setTimeout(() => {
        if (approvalStatus === 'approved') {
          router.push('/artist-writer/my-product?status=Live');
        } else if (approvalStatus === 'rejected') {
          router.push('/artist-writer/my-product?status=Violation');
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [approvalStep, approvalStatus, router]);

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
            <div className={`h-full transition-all duration-500 ${
              approvalStatus === 'approved' ? 'bg-green-500' : 
              approvalStatus === 'rejected' ? 'bg-red-500' : 
              'bg-yellow-500'
            }`} style={{ width: `${(approvalStep - 1) * 50}%` }}/>
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
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
              <span className="text-xs text-gray-500 break-words text-center px-2">
                {product.imageName !== "No image" ? product.imageName : "No Image Uploaded"}
              </span>
            </div>
            
            <div className="text-gray-800 space-y-3">
              <div className="text-xl font-bold text-purple-700">
                {product.productName}
              </div>
              
              <div className="font-semibold text-gray-600 inline">
                {parseFloat(product.price?.replace(/[฿,]/g, '') || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })} THB
              </div>
              
              <div className="text-sm">
                <span className="font-semibold text-gray-600 inline">Category: </span>
                <span className="text-gray-800 inline">{product.category}</span>
              </div>

              <div className="text-sm">
                <span className="font-semibold text-gray-600 inline">Description: </span>
                <span className="text-gray-800 inline">{product.description}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <Link href="/artist-writer/my-product">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <FaArrowLeft className="text-sm" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Live");
  const [view, setView] = useState<'list' | 'status'>('list');
  const [submittedProduct, setSubmittedProduct] = useState<ProductData>(initialProductData);
  const [approvalStep, setApprovalStep] = useState(1);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('pending');

  // ตรวจสอบ query parameter เมื่อ component mount
  useEffect(() => {
    const viewParam = searchParams.get('view');
    const statusParam = searchParams.get('status');
    
    if (viewParam === 'status') {
      // ตรวจสอบว่ามีข้อมูลสินค้าใหม่จาก localStorage หรือไม่
      const newProductData = localStorage.getItem('newProductData');
      if (newProductData) {
        try {
          const productData = JSON.parse(newProductData);
          setSubmittedProduct(productData);
          setApprovalStep(1);
          setApprovalStatus('pending');
          setView('status');
          localStorage.removeItem('newProductData');
        } catch (error) {
          console.error('Error parsing product data:', error);
        }
      } else {
        setView('status');
      }
    } else if (statusParam) {
      // ตรวจสอบว่า status อยู่ใน tabs หรือไม่
      const validStatuses = ["Live", "Sold Out", "In Progress", "Violation"];
      if (validStatuses.includes(statusParam)) {
        setActiveTab(statusParam);
        setView('list');
      }
    }
  }, [searchParams]);

  // Auto advance steps
  useEffect(() => {
    if (view === 'status' && approvalStep === 1) {
      const timer = setTimeout(() => {
        setApprovalStep(2);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (view === 'status' && approvalStep === 2 && approvalStatus !== 'pending') {
      const timer = setTimeout(() => {
        setApprovalStep(3);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [view, approvalStep, approvalStatus]);

  const handleStatusChange = (status: ApprovalStatus) => {
    setApprovalStatus(status);
  };

  const tabs = [
    { name: "Live", count: 1 },
    { name: "Sold Out", count: 1 },
    { name: "In Progress", count: 1 },
    { name: "Violation", count: 1 },
  ];

  const products = [
    { id: 1, title: "Mountain", type: "Portrait", price: "฿4,000", stock: 2, sold: 90, status: "Live", image: "/img/mountain1.jpg" },
    { id: 2, title: "Flower Vase", type: "Portrait", price: "฿1,000", stock: 0, sold: 2, status: "Sold Out", image: "/img/soldout1.jpg" },
    { id: 3, title: "Spring Meadow in Van Gogh", type: "Portrait", price: "฿4,000", stock: 2, sold: 0, status: "In Progress", image: "/img/mountain2.jpg" },
    { id: 7, title: "Inlay", type: "Portrait", price: "฿4,000", stock: 2, sold: 90, status: "Violation", image: "/img/violation1.jpg" },
  ];

  const filteredProducts = products.filter((product) => product.status === activeTab);

  // Render status view or product list
  if (view === 'status') {
    return (
      <StatusView 
        product={submittedProduct} 
        approvalStep={approvalStep} 
        approvalStatus={approvalStatus} 
        onStatusChange={handleStatusChange} 
      />
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
          <div className="flex justify-between border-b border-gray-200 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`pb-2 px-2 font-medium cursor-pointer ${
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
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <FaImage size={24} />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">{product.title}</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md inline-flex items-center gap-1">
                    <FaImage className="text-blue-500" /> {product.type}
                  </span>

                  <>
                    <p className="mt-1 font-semibold text-gray-800">{product.price}</p>
                    <div className="flex gap-6 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <FaBox /> Stock {product.stock}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaTags /> Sold {product.sold}
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
                  <Link href="/artist-writer/my-product?view=status">
                    <button className="border border-purple-400 text-purple-600 px-3 py-1 rounded-md text-sm hover:bg-purple-50">
                      View Details
                    </button>
                  </Link>
                </div>
              ) : activeTab === "Violation" ? (
                <div className="flex flex-col items-end gap-2">
                  <button className="border border-red-400 text-red-500 px-3 py-1 rounded-md text-sm hover:bg-red-50">
                    Delete
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-100">
                    Edit
                  </button>
                  <button className="border border-red-400 text-red-500 px-3 py-1 rounded-md text-sm hover:bg-red-50">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
    </div>
  );
}