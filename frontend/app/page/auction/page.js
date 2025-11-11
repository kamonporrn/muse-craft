"use client"; 
import { useEffect, useState } from "react";
import "./page.css"; // ✅ ไม่มี styles
import { User } from "lucide-react"; // ✅ เพิ่มบรรทัดนี้
export default function AuctionPage() {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const bids = [
    { bidder: "Liam Carter", amount: "$12,000", time: "2 hours ago" },
    { bidder: "Sophia Bennett", amount: "$11,600", time: "2 hours ago" },
    { bidder: "Ethan Walker", amount: "$11,200", time: "4 hours ago" },
    { bidder: "Olivia Hayes", amount: "$10,500", time: "5 hours ago" },
    { bidder: "Noah Foster", amount: "$10,000", time: "6 hours ago" },
  ];

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

      <h1 className="title">Ocean's Whisper</h1>

      <div className="timer">{timeLeft} : {timeLeft} : {timeLeft} s</div>

      <div className="image-container">
        <img src="/1adf5023-13ab-42f8-9ce5-7ca4efa35521.png" alt="Ocean's Whisper" />
      </div>

      <div className="description">
        <p>
          "Ocean’s Whisper" is a digital artwork that captures the quiet yet
          powerful dialogue between the sea and the human soul. Gentle shades of
          blue and turquoise flow seamlessly across the canvas, evoking the
          endless horizon where water meets sky. The composition embodies both
          serenity and mystery—the calm surface concealing untold depths beneath.
          Every detail reflects the rhythm of the tides, reminding viewers that
          the ocean does not shout; it whispers its secrets to those who are
          willing to listen.
        </p>
      </div>

      <div className="info">
  <div>
    <span className="label">Type:</span>{" "}
    <span className="value">PNG</span>
  </div>
  <div>
    <span className="label">On Sale:</span>{" "}
    <span className="value">3/8/2024</span>
  </div>
</div>

      <div className="bit-donet">
        <div>Current Bit: </div>
        <div>Current Donet: </div>
      </div>

      <div className="bitNum">
        <div>1,000.00 ฿</div>
        <div className="Donet"> 10,250</div>
      </div>

      <div className="recent-bids">
        <h3>Recent Bids</h3>
        <table>
          <thead>
            <tr>
              <th>Bidder</th>
              <th>Amount</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, index) => (
              <tr key={index}>
                <td>{bid.bidder}</td>
                <td className="amo-time">{bid.amount}</td>
                <td className="amo-time">{bid.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <a href="#" className="back-button">Back</a>
    </div>
  );
}
