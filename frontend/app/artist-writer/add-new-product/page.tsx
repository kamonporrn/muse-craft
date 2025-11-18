"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUpload } from "react-icons/fa";
import { createProduct, fetchCurrentUser } from "@/lib/api";

export default function AddNewProduct() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [priceError, setPriceError] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Validate file size (max 2MB - will be compressed before upload)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB. Please compress your image first.');
      return;
    }
    
    setImage(file);
    setError("");
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get current user to get author name
      const user = await fetchCurrentUser();
      if (!user) {
        setError("Failed to get user information");
        setLoading(false);
        return;
      }

      // Map category value to API format
      const categoryMap: Record<string, "Painting" | "Sculpture" | "Literature (E-book)" | "Graphic Design" | "Crafts" | "Digital Art"> = {
        "painting": "Painting",
        "sculpture": "Sculpture",
        "literature": "Literature (E-book)",
        "graphic-design": "Graphic Design",
        "crafts": "Crafts",
        "digital-art": "Digital Art",
      };

      const apiCategory = categoryMap[category];
      if (!apiCategory) {
        setError("Invalid category selected");
        setLoading(false);
        return;
      }

      // Parse price (remove commas and convert to number)
      const priceNum = parseFloat(price.replace(/,/g, '').trim());
      if (isNaN(priceNum) || priceNum <= 0) {
        setError("Please enter a valid price");
        setLoading(false);
        return;
      }

      // Convert image to base64 with compression if provided
      let imagePath = "/img/products/placeholder.jpg";
      if (image) {
        try {
          // Compress image before converting to base64
          const compressedImage = await compressImage(image);
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
              const base64 = reader.result as string;
              // Check if base64 size is too large (max ~8MB for base64)
              if (base64.length > 8 * 1024 * 1024) {
                reject(new Error('Image is too large after compression. Please use a smaller image.'));
                return;
              }
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(compressedImage);
          });
          imagePath = await base64Promise;
        } catch (imgError) {
          console.error('Error converting image to base64:', imgError);
          setError(imgError instanceof Error ? imgError.message : "Failed to process image. Please try again.");
          setLoading(false);
          return;
        }
      }

      // Create product via API
      const newProduct = await createProduct({
        name: productName,
        author: user.name,
        price: priceNum,
        category: apiCategory,
        description: description || undefined,
        stock: stock || undefined,
        img: imagePath,
      });

      if (!newProduct) {
        setError("Failed to create product. Please check your connection and try again.");
        setLoading(false);
        return;
      }

      // Redirect to my-product page showing the new product status
      router.push(`/artist-writer/my-product?view=status&productId=${newProduct.id}`);
    } catch (err) {
      console.error('Error creating product:', err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred while creating the product";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Compress image function
  const compressImage = (file: File, maxWidth: number = 1920, maxHeight: number = 1920, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            file.type,
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCancel = () => {
    setProductName("");
    setCategory("");
    setPrice("");
    setStock(0);
    setDescription("");
    setImage(null);
    setImagePreview("");
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-9 w-full max-w-4xl">

          <h1 className="text-2xl font-semibold mb-6 text-gray-800">Add New Product</h1>

          <form onSubmit={handleCreate} className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-600"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                aria-label="Product category"
                required
              >
                <option value="">-- Select Category * --</option>
                <option value="painting">Painting</option>
                <option value="sculpture">Sculpture</option>
                <option value="literature">Literature (E-book)</option>
                <option value="graphic-design">Graphic Design</option>
                <option value="crafts">Crafts</option>
                <option value="digital-art">Digital Art</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-600 resize-none"
                rows={4}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="text"
                placeholder="Enter price"
                value={price}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Check if user is trying to type non-numeric characters
                  const hasNonNumeric = /[^0-9,]/g.test(inputValue);
                  if (hasNonNumeric) {
                    setPriceError("Please enter numbers only");
                  } else {
                    setPriceError("");
                  }
                  // Only allow numbers
                  const value = inputValue.replace(/[^0-9]/g, '');
                  setPrice(value);
                }}
                onBlur={(e) => {
                  // Format with commas when user finishes typing
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value) {
                    const formatted = parseInt(value, 10).toLocaleString('en-US');
                    setPrice(formatted);
                  }
                  setPriceError("");
                }}
                onFocus={(e) => {
                  // Remove commas when user starts editing
                  const value = e.target.value.replace(/,/g, '');
                  setPrice(value);
                  setPriceError("");
                }}
                className={`w-full border rounded-md px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 placeholder:text-gray-600 ${
                  priceError 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-purple-400'
                }`}
                required
              />
              {priceError && (
                <p className="mt-1 text-sm text-red-500">{priceError}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                placeholder="Enter stock quantity"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-600"
                required
              />
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              {imagePreview ? (
                <div className="mb-2">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
                </div>
              ) : null}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-purple-500">
                <FaUpload className="text-gray-400 mb-2" size={24} />
                <span className="text-sm text-gray-500">
                  {image ? image.name : "Click to upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Supports image files up to 2MB (system will compress automatically)
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}