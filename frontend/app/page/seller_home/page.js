"use client";
import "./page.css";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const slides = [
    { img: "/mystery.jpg", title: "Mystery Way", author: "Writer: Adrian Blake" },
    { img: "/changeworld.jpg", title: "The Changing Worlds", author: "Artist: Aranang" },
    { img: "/ocean.jpg", title: "Ocean's Whisper", author: "Artist: Clara Everwood" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <main>
      {/* ---------- Navbar ---------- */}
      <nav className="navbar">
        <div className="logo">MuseShop</div>
        <input type="text" className="search" placeholder="Search" />
        <div className="nav-right">
          <ShoppingCart size={30} className="cart" />
          <button className="signin">Sign in</button>
          <button className="signup">Sign up</button>
        </div>
      </nav>

      <button className="add-btn">+ Add Sell Item</button>

      {/* ---------- Slider ---------- */}
      <section className="slider">
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${current * 340}px)`,
          }}
        >
          {slides.map((s, i) => (
            <div key={i} className="slide">
              <img src={s.img} alt={s.title} />
              <div className="slide-text">
                <h3>{s.title}</h3>
                <p>{s.author}</p>
                <button>More Detail</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Category ---------- */}
      <section className="category-section">
        <h2>Shop by Category</h2>
        <div className="category-box">
          <div className="cat-item">
            <i>📖</i>
            <h4>Writing</h4>
            <p>E-book & Digital Literature</p>
          </div>
          <div className="cat-item">
            <i>🎨</i>
            <h4>Artwork</h4>
            <p>Painting</p>
          </div>
          <div className="cat-item">
            <i>🖌️</i>
            <h4>Graphic design</h4>
            <p>Visual Art</p>
          </div>
        </div>
      </section>

      {/* ---------- Best Seller ---------- */}
      <section className="bestseller-section">
        <h2>Best seller</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src="/mystery.jpg" alt="Mystery way" />
            <span className="tag">E-book</span>
            <h4>Mystery way</h4>
            <p>Adrian Blake</p>
            <p className="price">149.00 B</p>
          </div>
          <div className="product-card">
            <img src="/demon.jpg" alt="Demon" />
            <span className="tag">Graphic design</span>
            <h4>Demon</h4>
            <p>Adrian Blake</p>
            <p className="price">149.00 B</p>
          </div>
          <div className="product-card">
            <img src="/after.jpg" alt="After Sunset" />
            <span className="tag">Art</span>
            <h4>After Sunset</h4>
            <p>Kenneth Bulmer</p>
            <p className="price">249.00 B</p>
          </div>
        </div>
      </section>
    </main>
  );
}
