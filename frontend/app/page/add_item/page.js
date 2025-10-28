"use client";
 import "./page.css";
 import { Search, ShoppingCart, User } from "lucide-react";


export default function AddItem() {
  return (

    <div>
      <div className="bar" >
     <input className="search" 
     type="text" 
     placeholder="Search" 
     />
     <div className="shop-icon">
     <ShoppingCart size={55} color="#ffff" />
     </div>

     <div className="user-icon">
     <User size={55} color="#8B0ACB" />
     </div>

    </div>

    <main className="container">
       
      <h2 className="title">Add Sell Item</h2>
      <p className="subtitle">Product Information</p>

      <form className="form-box">
        <div className="form-left">
          <label>Product Name</label>
          <input type="text" placeholder="Enter product name" />

          <label >Category</label>
          <select>
            <option>Select a category</option>
            <option>E-book</option>
            <option>Artwork</option>
            <option>Graphic Design</option>
          </select>
        </div>

        <div className="form-right">
          <label >฿ Price</label>
          <input type="number" step="0.01" placeholder="0.00" />

          <label>Description</label>
          <textarea placeholder="Description of product"></textarea>

          <label>📷 Upload images</label>
          <div className="upload-box">
            <p>Drag & Drop or Choose image to upload</p>
            <span className="upload-icon">⬆️</span>
          </div>
        </div>
      </form>

      <div className="btn-group">
        <button className="cancel-btn">Cancel</button>
        <button className="create-btn">Create</button>
      </div>
    </main>
    </div>
  );
}
