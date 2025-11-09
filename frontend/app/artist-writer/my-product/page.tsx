"use client";

import React, { useState } from "react";

const MyProductPage: React.FC = () => {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); 
  const [stock, setStock] = useState(""); 
  const [image, setImage] = useState<File | null>(null);

  // state สำหรับเก็บ error ของแต่ละ field
  const [errors, setErrors] = useState({
    productName: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setErrors((prev) => ({ ...prev, image: "" })); // ลบ error
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ตรวจสอบแต่ละ field
    const newErrors = {
      productName: productName ? "" : "Please enter product name",
      category: category ? "" : "Please enter category",
      description: description ? "" : "Please enter description",
      price: price ? "" : "Please enter price",
      stock: stock ? "" : "Please enter stock",
      image: image ? "" : "Please upload a product image",
    };
    setErrors(newErrors);

    // ถ้ามี error ใด ๆ ไม่ส่งข้อมูล
    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (hasError) return;

    const productData = { productName, category, description, price, stock, image };
    console.log("Creating product:", productData);

    // Reset form
    setProductName("");
    setCategory("");
    setDescription("");
    setPrice("");
    setStock("");
    setImage(null);
    setErrors({
      productName: "",
      category: "",
      description: "",
      price: "",
      stock: "",
      image: "",
    });
  };

  // helper สำหรับ class border
  const inputClass = (error: string) =>
    `border rounded-lg p-3 text-gray-700 ${error ? "border-red-500" : "border-gray-300"}`;

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl mb-2 flex items-center gap-1">
          <span className="font-bold text-black">My Product</span>
          <span className="text-gray-800">/</span>
          <span className="font-medium text-purple-500">Add New Product</span>
        </h1>
        <p className="text-gray-600 text-lg">Add and manage your products easily</p>
      </div>

      {/* Add Product Form */}
      <div className="bg-white shadow-md rounded-2xl p-6 max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-4">Fill in your product for sale</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Product Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Product Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className={inputClass(errors.productName)}
            />
            {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Category</label>
            <input
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass(errors.category)}
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Description</label>
            <input
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass(errors.description)}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Price & Stock */}
          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <label className="text-gray-700 font-medium mb-1">Price</label>
              <input
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) setPrice(value);
                }}
                className={inputClass(errors.price)}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-gray-700 font-medium mb-1">Stock</label>
              <input
                type="text"
                placeholder="Stock"
                value={stock}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) setStock(value);
                }}
                className={inputClass(errors.stock)}
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Product Image */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Product Image</label>
            <label className={`flex flex-col items-center justify-center border-2 rounded-lg p-6 cursor-pointer text-gray-700 ${errors.image ? "border-red-500" : "border-dashed border-gray-300"}`}>
              {image ? image.name : "Drag & Drop or Choose image to upload"}
              <input type="file" className="hidden" onChange={handleImageChange} />
            </label>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg"
              onClick={() => {
                setProductName("");
                setCategory("");
                setDescription("");
                setPrice("");
                setStock("");
                setImage(null);
                setErrors({
                  productName: "",
                  category: "",
                  description: "",
                  price: "",
                  stock: "",
                  image: "",
                });
              }}
            >
              Cancel
            </button>
            <button type="submit" className="bg-purple-500 text-white px-6 py-2 rounded-lg">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProductPage;
