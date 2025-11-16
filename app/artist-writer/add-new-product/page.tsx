"use client";

import { useState } from "react";
import { FaUpload } from "react-icons/fa";

export default function AddNewProduct() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ productName, category, price, stock, description, image });
    alert("Product created!");
  };

  const handleCancel = () => {
    setProductName("");
    setCategory("");
    setPrice("");
    setStock(0);
    setDescription("");
    setImage(null);
  };

  return (
    <div className="flex min-h-screen bg-[#f4eafa]">
      <main className="flex flex-1 items-center">
        <div className="bg-white rounded-2xl shadow p-9 w-full max-w-4xl ml-0">

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
              <input
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-600"
                required
              />
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
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-600"
                required
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
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
            </div>

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
                className="w-1/2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
