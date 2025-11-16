// app/artist-writer/auction-event/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Search, Upload, ArrowRightCircle, CheckCircle2, Box, Clock, Check } from "lucide-react";

// --- Mock Data ---
const mockAuctions = [
  { id: 1, title: "Arts in Thailand", description: "A selection of curated arts from various regions of Thailand available for bidding.", imagePlaceholder: "/images/thai-art-placeholder.jpg" },
  { id: 2, title: "Vintage Jewelry Collection", description: "Rare finds and high-end collectible pieces from the 19th and 20th centuries.", imagePlaceholder: "/images/jewelry-placeholder.jpg" },
];

// --- Interfaces and Types ---
interface RegistrationData {
  productName: string;
  category: string;
  condition: string;
  description: string;
  startingPrice: number;
  auctionDuration: string;
  imageFile: File | null;
}
type ViewType = 'list' | 'register' | 'status';

const initialSubmittedData: RegistrationData = {
    productName: "N/A", category: "N/A", condition: "N/A", description: "Waiting for submission details.", startingPrice: 0, auctionDuration: "", imageFile: null
};

const emptyFormData: RegistrationData = {
    productName: "", category: "", condition: "", description: "", startingPrice: 0, auctionDuration: "", imageFile: null
};

// =========================================================================
//                             1. AUCTION LIST VIEW 
// =========================================================================

const AuctionListView = ({ onRegisterClick }: { onRegisterClick: () => void }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAuctions = mockAuctions.filter(auction =>
    auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const AuctionCard = ({ title, description }: typeof mockAuctions[0]) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
      <div className="md:grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-gray-100 rounded-lg h-36 flex items-center justify-center mb-4 md:mb-0">
          <span className="text-gray-400 text-sm">Image Preview</span>
        </div>
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          <div className="pt-2 flex items-center space-x-4">
            <button className="text-purple-600 hover:text-purple-800 text-sm font-medium transition">
              View Information
            </button>
            <button 
              onClick={onRegisterClick}
              className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-purple-700 transition shadow-md text-sm"
            >
              Register Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Auction Events</h1>
      <div className="bg-white p-3 rounded-xl shadow-md mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for events or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-md border-none focus:outline-none focus:ring-0"
          />
        </div>
      </div>
      <div className="space-y-4">
        {filteredAuctions.map(auction => <AuctionCard key={auction.id} {...auction} />)}
      </div>
    </>
  );
};

// =========================================================================
//                             2. REGISTRATION FORM VIEW
// =========================================================================

const RegistrationFormView = ({ onSubmissionSuccess }: { onSubmissionSuccess: (data: RegistrationData) => void }) => {
  const [formData, setFormData] = useState<RegistrationData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<null | string>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imageFile: e.target.files![0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast(null);

    setTimeout(() => {
      setIsSubmitting(false);

      if (formData.productName.length < 3) {
        setToast("Product name is too short.");
        setTimeout(() => setToast(null), 3000);
        return;
      }

      setToast("Product submitted! Switching to status page...");
      
      // PASS DATA AND SWITCH VIEW
      setTimeout(() => {
        setToast(null);
        onSubmissionSuccess(formData); 
      }, 1500);

    }, 1500);
  };
  

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Register New Product</h1>
      <p className="text-md text-gray-600 mb-8">Fill in your product details to list it for the auction.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* === Product Image === */}
        <section className="p-6 bg-purple-50 rounded-lg border border-purple-200">
          <h2 className="text-lg font-semibold text-purple-700 mb-4">Product Image</h2>
          <div className="flex justify-center items-center h-56 border-2 border-dashed border-purple-300 rounded-lg p-4 cursor-pointer hover:border-purple-500 transition-colors bg-white">
            <label htmlFor="image-upload" className="flex flex-col items-center text-gray-500 hover:text-purple-600">
              <Upload className="w-8 h-8 mb-2" />
              <span>{formData.imageFile ? formData.imageFile.name : "Click to upload image"}</span>
              <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
            </label>
          </div>
        </section>

        {/* === Product Information === */}
        <section className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">Product Information</h2>
          
          <input name="productName" value={formData.productName} onChange={handleChange} placeholder="Enter product name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-purple-500 focus:ring-purple-500" required />
          
          <div className="grid grid-cols-2 gap-4">
            
            <select name="category" value={formData.category} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm p-3 border bg-white focus:border-purple-500 focus:ring-purple-500" required>
              <option value="">-- Select Category * --</option>
              <option value="painting">Painting</option>
              <option value="sculpture">Sculpture</option>
              <option value="photography">Photography</option>
              <option value="jewelry">Novel</option>
              <option value="design">Design / Furniture</option>
              <option value="nft">Digital Art (NFTs)</option>
              <option value="other">Other Collectibles</option>
            </select>

            <select name="condition" value={formData.condition} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm p-3 border bg-white focus:border-purple-500 focus:ring-purple-500" required>
              <option value="">-- Select Condition * --</option>
              <option value="new">New (Mint Condition)</option>
              <option value="excellent">Excellent (Minor wear)</option>
              <option value="good">Good (Some visible wear)</option>
              <option value="fair">Fair (Needs restoration)</option>
              <option value="antique">Antique (Aged, expected wear)</option>
            </select>
          </div>

          <textarea name="description" rows={4} value={formData.description} onChange={handleChange} placeholder="Describe your product details, condition, provenance (history), and any notable flaws." className="block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-purple-500 focus:ring-purple-500" required />
        </section>

        {/* === Auction Settings === */}
        <section className="p-4 bg-gray-50 rounded-lg space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Auction Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            
            <input name="startingPrice" type="number" min="0.01" step="0.01" value={formData.startingPrice || ''} onChange={handleChange} placeholder="Starting Price (THB)" className="block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-purple-500 focus:ring-purple-500" required />

            <select name="auctionDuration" value={formData.auctionDuration} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm p-3 border bg-white focus:border-purple-500 focus:ring-purple-500" required>
              <option value="">-- Select Duration * --</option>
              <option value="24_hours">24 Hours</option>
              <option value="3_days">3 Days</option>
              <option value="5_days">5 Days</option>
              <option value="7_days">7 Days (1 Week)</option>
              <option value="14_days">14 Days (2 Weeks)</option>
            </select>
          </div>
        </section>
        
        {/* === Action Buttons === */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" className="rounded-md px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 transition">Cancel</button>
          <button type="submit" disabled={isSubmitting} className={`rounded-md px-6 py-3 font-bold text-white shadow-lg flex items-center gap-2 transition duration-200 ${isSubmitting ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 active:translate-y-[1px]"}`}>
            {isSubmitting ? "Submitting..." : "Register Product"}
            <ArrowRightCircle className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Toast */}
      <div aria-live="polite" className="fixed inset-0 z-50 pointer-events-none">
        {toast && (
          <div className="flex h-full w-full items-center justify-center">
            <div
              className={`
                pointer-events-auto
                flex items-center justify-center
                gap-3
                rounded-2xl
                ${toast.includes("success") || toast.includes("submitted") ? 'bg-green-100 text-green-500 ring-4 ring-green-500/50' : 'bg-red-100 text-red-500 ring-4 ring-red-500/50'}
                px-10 py-8
                shadow-2xl
                text-xl font-bold
                tracking-wide
                animate-[fadeIn_.2s_ease-out]
              `}
            >
              <CheckCircle2 className="w-10 h-10 mb-1" />
              <p>{toast}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// =========================================================================
//                             3. APPROVAL STATUS VIEW
// =========================================================================

const StepIcon = ({ icon: Icon, label, status }: { icon: React.ElementType, label: string, status: 'current' | 'completed' | 'pending' }) => {
  let bgColor = "bg-gray-300";
  let textColor = "text-gray-500";
  
  if (status === 'completed') {
    bgColor = "bg-green-500";
    textColor = "text-green-600";
  } else if (status === 'current') {
    bgColor = "bg-yellow-500";
    textColor = "text-yellow-600";
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

// --- Status View Component (Uses submitted product data) ---
const StatusView = ({ product, approvalStep }: { product: RegistrationData, approvalStep: number }) => {

  const getStatus = (stepIndex: number) => {
    if (stepIndex < approvalStep) return 'completed';
    if (stepIndex === approvalStep) return 'current';
    return 'pending';
  };

  const steps = [
    { label: "Confirm", icon: Box },
    { label: "Verification", icon: Clock },
    { label: "Complete", icon: Check },
  ];

  return (
    <>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Waiting Auction for approval
        </h1>
        <p className="text-md text-gray-600 mb-8 text-center">
            Your product is currently under review by our administration team.
        </p>

        {/* Progress Timeline */}
        <section className="flex justify-center items-center my-10 relative">
          
          <div className="absolute w-2/3 h-1 bg-gray-300 top-1/2 transform -translate-y-1/2 z-0">
            <div className={`h-full bg-green-500 transition-all duration-500`} style={{ width: `${(approvalStep - 1) * 50}%` }}/>
          </div>

          {/* Steps */}
          {steps.map((step, index) => (
            <div key={index} className="flex-1 flex justify-center z-10">
              <StepIcon icon={step.icon} label={step.label} status={getStatus(index + 1) as 'current' | 'completed' | 'pending'} />
            </div>
          ))}
        </section>

        {/* Product Details Card - FIX: Structured Details for better readability */}
        <section className="p-6 bg-[#f6e9ff] rounded-lg border border-purple-200 mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Product Details</h2>
          <div className="flex gap-6">
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                <span className="text-xs text-gray-500 break-words text-center px-2">
                    {product.imageFile ? product.imageFile.name : "No Image Uploaded"}
                </span>
            </div>
            
            {/* FIX: Using DL structure for clean text layout */}
            <div className="text-gray-800 space-y-3">
                <dl className="space-y-2">
                    
                    {/* Product Name (Primary Info) */}
                    <div className="text-xl font-bold text-purple-700">
                        {product.productName}
                    </div>
                    
                    {/* Starting Price (Highlight) */}
                    <div className="font-semibold text-gray-600 inline">
                        {product.startingPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} THB
                    </div>
                    
                    {/* Category */}
                    <div className="text-sm">
                        <dt className="font-semibold text-gray-600 inline">Category: </dt>
                        <dd className="text-gray-800 inline">{product.category}</dd>
                    </div>

                    {/* Condition */}
                    <div className="text-sm">
                        <dt className="font-semibold text-gray-600 inline">Condition: </dt>
                        <dd className="text-gray-800 inline">{product.condition}</dd>
                    </div>

                    {/* Description (Separated block) */}
                    <div className="text-sm">
                        <dt className="font-semibold text-gray-600 inline">
                            Description:</dt>
                        <dd className="text-gray-800 inline">
                            {product.description}
                        </dd>
                    </div>
                </dl>
            </div>
          </div>
        </section>
    </>
  );
};

// =========================================================================
//                             4. MAIN EXPORT COMPONENT
// =========================================================================

export default function CombinedAuctionPage() {
  const [view, setView] = useState<ViewType>('list'); 
  const [submittedProduct, setSubmittedProduct] = useState<RegistrationData>(initialSubmittedData);
  const [approvalStep, setApprovalStep] = useState(1); 

  const handleSubmissionSuccess = (data: RegistrationData) => {
    setSubmittedProduct(data);
    setApprovalStep(1); // Reset to "Confirm" when a new product is submitted
    setView('status');
  };

  const renderContent = () => {
    switch (view) {
      case 'list':
        return <AuctionListView onRegisterClick={() => setView('register')} />;
      case 'register':
        return <RegistrationFormView onSubmissionSuccess={handleSubmissionSuccess} />;
      case 'status':
        return <StatusView product={submittedProduct} approvalStep={approvalStep} />;
      default:
        return <div>Error: Invalid View</div>;
    }
  };

  return (
    <main className="min-h-screen bg-[#f6e9ff] text-gray-900">
      <div className="flex justify-center py-10 px-4">
        <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-2xl">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
