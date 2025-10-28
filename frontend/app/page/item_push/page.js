// app/item-published/page.js (Next.js 13+ App Router)
import './page.css';
import { Search, ShoppingCart, User } from "lucide-react";

export default function ItemPublished() {
  return (
    <main className="container">
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

      <section className="success-section">
        <div className="checkmark">✔️</div>
        <h1>Item Published Successfully!</h1>
        <p>Your item is now live on the marketplace and available for customers to purchase.</p>
      </section>

      <section className="details-section">
        <div className="review-box">
          <h2>Review your submitted item details</h2>
          <div className="item-info">
            <img src="/ocean-whisper.png" alt="Ocean's Whisper" />
            <div className="item-text">
              <h3>Ocean's Whisper</h3>
              <p className="author">Kenneth Bulmer</p>
              <span className="category">Digital Art</span>
              <p className="description">
                “Ocean’s Whisper” is a digital artwork that captures the quiet yet powerful dialogue between the sea and the human soul. Gentle shades of blue and turquoise flow seamlessly across the canvas, evoking the endless horizon where water meets sky. The composition embodies both serenity and mystery—the calm surface concealing untold depths beneath. Every detail reflects the rhythm of the tides, reminding viewers that the ocean does not shout; it whispers its secrets to those who are willing to listen.
              </p>
              <span className="status">Published</span>
            </div>
          </div>
        </div>

        <div className="actions-box">
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <button className="add-item">Add another item</button>
            <button className="back-market">Back to Marketplace</button>
          </div>

          <div className="submission-details">
            <h2>Submission Details</h2>
            <p><strong>Submitted:</strong> 9/19/2025</p>
            <p><strong>Category:</strong> Digital Art</p>
          </div>
        </div>
      </section>
    </main>
  );
}
