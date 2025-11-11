"use client";
import "./page.css"; // ✅ ไม่มี styles
import { User } from "lucide-react"; // ✅ เพิ่มบรรทัดนี้


export default function Dashboard() {
  return (
    <div className="container"> {/* ✅ ใช้ className ตรง ๆ */}
      <header className="navbar">
        <div className="logo">MuseCraft</div>
        <nav>
          <a href="#">Categories</a>
          <a href="#">Auctions</a>
          <a href="#">My Account</a>
        </nav>
        <div className="search">
          <input type="text" placeholder="Search" />
        </div>
         <div className="user-icon">
     <User size={50} color="#8B0ACB" />
     </div>
      </header>

      <div className="stats">
        <div>
          <h4>Total Bid</h4>
          <p>100,000</p>
        </div>
        <div>
          <h4>Total Donat</h4>
          <p>103,124</p>
        </div>
        <div>
          <h4>Active</h4>
          <p>1</p>
        </div>
      </div>

      <hr className="divider" />

      {/* Auction Section */}
      <section>
    <div className="box">
        <div className="sectionHeader">Product</div>
        <div className="box2">
            <div className="#"> Current Bid</div>
            <div className="#"> Bid</div>
             <div className="#"> Time left</div>
            <div className="#"> Staus</div>
        </div>
        
    </div>
        

        <div className="auctionCard">
          <img
            src="/images/ocean-whisper.jpg"
            alt="Ocean's Whisper"
            className="productImg"
            width={60}
            height={60}
          />
          <div className="productInfo">
            <p>Ocean’s Whisper</p>
          </div>
          <div className="details">
            <p>1,000.00 ฿</p>
            <p>20</p>
            <p>00 : 00 : 59 s</p>
            <span className="active">active</span>
            <button className="viewBtn">view</button>
          </div>
        </div>

        <div className="newAuction">+Create New Auction</div>
      </section>
       <hr className="divider" />

       <div className="text">Request</div>
  

        <div className="box">
        <div className="sectionHeader">Product</div>
        <div className="box2">
            <div className="#"> Current Bid</div>
            <div className="#"> Bid</div>
             <div className="#"> Time left</div>
            <div className="#"> Staus</div>
        </div>
        
    </div>


    <div className="auctionCard">
          <img
            src="/images/ocean-whisper.jpg"
            alt="Ocean's Whisper"
            className="productImg"
            width={60}
            height={60}
          />
          <div className="productInfo">
            <p>Dreamwalker</p>
          </div>
          <div className="details">
            <p>249.00 ฿</p>
            <p>20</p>
            <p>00 : 60 : 00 s</p>
            <span className="waiting">waiting</span>
            <div className="acc-view">
            <button className="acceptBtn">accept</button>
            <button className="deleteBtn">delete</button>
            </div>

          </div>
        </div>
       
    </div>

    
    
  );
}
