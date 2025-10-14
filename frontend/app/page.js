"use client";
import "@/app/page.module.css"
import Image from "next/image";
import { useState } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
// import { Card, CardContent } from "../components/ui/card";
// import { Button } from "../components/ui/button.js";


const categories = ["Basketry", "Weaving", "Necklace", "Mobile art"];

const products = [
  {
    name: "Siam Weave",
    author: "Aria Moonfall",
    price: 1069,
    rating: 5,
    img: "/img/siamweave.jpg",
  },
  {
    name: "Isan Harmony",
    author: "Kenneth Bulmer",
    price: 899,
    rating: 5,
    img: "/img/isanharmony.jpg",
  },
  {
    name: "Heritage Weaves",
    author: "Kael Ashborne",
    price: 1899,
    rating: 5,
    img: "/img/heritage.jpg",
  },
  {
    name: "Hands of the Loom",
    author: "Nyra Solstice",
    price: 1299,
    rating: 5,
    img: "/img/handsloom.jpg",
  },
];

export default function WeavingShop() {
  const [activeCategory, setActiveCategory] = useState("Weaving");

  return (
    
<div className="over-view">
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
    <div className="text-1">
        Category
    </div>
    <div className="button-container">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-button ${
            activeCategory === cat ? "active" : ""
          }`}
          onClick={() => setActiveCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>

    <div className="order-1">
      <div className="craft">craft</div>
      <div className="pic1"> </div>
      <p className="Siam">Siam Weave</p>
      <p className="Aria">Aria Moonfall</p>
      <p className="Ranking">Ranking</p>
      <div className="star-pice1">
        <div></div>
        <div className="pice-box1">
        <button className="pice1">1,699.00 ฿</button>
        </div>
        
      </div>
    </div>
</div>
//
  ); 
}
