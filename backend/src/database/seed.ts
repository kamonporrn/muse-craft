import { DatabaseService } from "./database.service";
import { User, Credential } from "./entities/user.entity";
import { Product } from "./entities/product.entity";
import { Order } from "./entities/order.entity";
import { AdminLog } from "./entities/admin-log.entity";

const db = new DatabaseService();

// Seed Users
const seedUsers: User[] = [
  {
    id: "u1",
    accountId: "#CRE-001",
    name: "Sophia Mitchell",
    email: "creator@email.com",
    role: "Creator",
    status: "Normal",
    avatar: "/img/avatars/a1.jpg",
    storeName: "Happy Story",
    phone: "0987654321",
    address: "123 Chiang Rai, Thailand, 71000",
  },
  {
    id: "u2",
    accountId: "#CRE-002",
    name: "Mason Park",
    email: "creator2@email.com",
    role: "Creator",
    status: "Suspended",
    avatar: "/img/avatars/a2.jpg",
  },
  {
    id: "u3",
    accountId: "#COL-001",
    name: "Noah Brown",
    email: "collector@email.com",
    role: "Collector",
    status: "Normal",
    avatar: "/img/avatars/a3.jpg",
  },
  {
    id: "u4",
    accountId: "#AD-001",
    name: "Admin01",
    email: "admin01@email.com",
    role: "Admin",
    status: "Normal",
    avatar: "/img/avatars/a4.jpg",
  },
];

const seedCredentials: Credential[] = [
  { email: "Admin01@test.com", password: "Admin01", userId: "u4" },
  { email: "creator@email.com", password: "creator123", userId: "u1" },
  { email: "creator2@email.com", password: "creator123", userId: "u2" },
  { email: "collector@email.com", password: "collector123", userId: "u3" },
];

// Seed Products - REMOVED: No mock data, only use real data from database
const seedProducts: Product[] = [
  // Painting (ภาพวาด)
  {
    id: "p1",
    name: "Ocean Whisper",
    author: "Clara Everwood",
    price: 1499,
    rating: 5,
    img: "/img/Painting1.jpg",
    category: "Painting",
    stock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Twilight Fields",
    author: "Adrian Blake",
    price: 1799,
    rating: 4,
    img: "/img/Painting2.jpg",
    category: "Painting",
    stock: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p3",
    name: "Golden Horizon",
    author: "Maya Thorne",
    price: 1599,
    rating: 5,
    img: "/img/Painting3.jpg",
    category: "Painting",
    stock: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p4",
    name: "Silent Harbor",
    author: "Leo Hart",
    price: 1399,
    rating: 4,
    img: "/img/Painting4.jpg",
    category: "Painting",
    stock: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p5",
    name: "Forest Lullaby",
    author: "Nora Vale",
    price: 1699,
    rating: 5,
    img: "/img/Painting5.jpg",
    category: "Painting",
    stock: 9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p6",
    name: "City Nocturne",
    author: "Iris Morrow",
    price: 1899,
    rating: 5,
    img: "/img/Painting6.jpg",
    category: "Painting",
    stock: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Sculpture (งานปั้น/แกะสลัก)
  {
    id: "p7",
    name: "Marble Grace",
    author: "Ari Stone",
    price: 3299,
    rating: 5,
    img: "/img/sculpture1.jpg",
    category: "Sculpture",
    stock: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p8",
    name: "Cedar Spirit",
    author: "Rowan Hale",
    price: 2799,
    rating: 4,
    img: "/img/sculpture2.jpg",
    category: "Sculpture",
    stock: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p9",
    name: "Bronze Echo",
    author: "Kei Aoki",
    price: 2999,
    rating: 5,
    img: "/img/sculpture3.jpg",
    category: "Sculpture",
    stock: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p10",
    name: "Porcelain Bloom",
    author: "Aya Lin",
    price: 2599,
    rating: 4,
    img: "/img/sculpture4.jpg",
    category: "Sculpture",
    stock: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p11",
    name: "Obsidian Wave",
    author: "Dane Rivers",
    price: 3499,
    rating: 5,
    img: "/img/sculpture5.jpg",
    category: "Sculpture",
    stock: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p12",
    name: "Granite Dawn",
    author: "Mila Crest",
    price: 2899,
    rating: 4,
    img: "/img/sculpture6.jpg",
    category: "Sculpture",
    stock: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Literature (E-book) (วรรณกรรม)
  {
    id: "p13",
    name: "Mystery Way",
    author: "Adrian Blake",
    price: 169,
    rating: 4,
    img: "/img/ebook1.jpg",
    category: "Literature (E-book)",
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p14",
    name: "Echoes of Rain",
    author: "Seren Vale",
    price: 149,
    rating: 5,
    img: "/img/ebook2.jpg",
    category: "Literature (E-book)",
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p15",
    name: "Paper Stars",
    author: "Iman Suri",
    price: 129,
    rating: 4,
    img: "/img/ebook3.jpg",
    category: "Literature (E-book)",
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p16",
    name: "Shoreline Letters",
    author: "Liam North",
    price: 159,
    rating: 5,
    img: "/img/ebook4.jpg",
    category: "Literature (E-book)",
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p17",
    name: "Glass Garden",
    author: "Eden Moss",
    price: 139,
    rating: 3,
    img: "/img/ebook5.jpg",
    category: "Literature (E-book)",
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p18",
    name: "Midnight Atlas",
    author: "Kara Finn",
    price: 179,
    rating: 5,
    img: "/img/ebook6.jpg",
    category: "Literature (E-book)",
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Graphic Design (กราฟิกดีไซน์)
  {
    id: "p19",
    name: "Neon Poster Set",
    author: "Karn Visual",
    price: 499,
    rating: 5,
    img: "/img/Graphic1.jpg",
    category: "Graphic Design",
    stock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p20",
    name: "Minimal Brand Kit",
    author: "Luca Reed",
    price: 699,
    rating: 4,
    img: "/img/Graphic2.jpg",
    category: "Graphic Design",
    stock: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p21",
    name: "Retro Cover Pack",
    author: "Juno Ray",
    price: 399,
    rating: 4,
    img: "/img/Graphic3.jpg",
    category: "Graphic Design",
    stock: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p22",
    name: "Monochrome Layouts",
    author: "Eli Park",
    price: 459,
    rating: 5,
    img: "/img/Graphic4.jpg",
    category: "Graphic Design",
    stock: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p23",
    name: "Gradient Toolkit",
    author: "Mia Vale",
    price: 289,
    rating: 4,
    img: "/img/Graphic5.jpg",
    category: "Graphic Design",
    stock: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p24",
    name: "Social Ad Frames",
    author: "Noah Grey",
    price: 349,
    rating: 5,
    img: "/img/Graphic6.jpg",
    category: "Graphic Design",
    stock: 55,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Crafts (หัตถกรรม)
  {
    id: "p25",
    name: "Siam Weave",
    author: "Aria Moonfall",
    price: 1699,
    rating: 5,
    img: "/img/crafts1.jpg",
    category: "Crafts",
    stock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p26",
    name: "Isan Harmony",
    author: "Kenneth Bulmer",
    price: 899,
    rating: 4,
    img: "/img/crafts2.jpg",
    category: "Crafts",
    stock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p27",
    name: "Heritage Weaves",
    author: "Kael Ashborne",
    price: 1899,
    rating: 5,
    img: "/img/crafts3.jpg",
    category: "Crafts",
    stock: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p28",
    name: "Hands of the Loom",
    author: "Nyra Solstice",
    price: 1299,
    rating: 4,
    img: "/img/crafts4.jpg",
    category: "Crafts",
    stock: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p29",
    name: "Bamboo Flow",
    author: "Nara Weave",
    price: 799,
    rating: 4,
    img: "/img/crafts5.jpg",
    category: "Crafts",
    stock: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p30",
    name: "Golden Knot",
    author: "Tida Craft",
    price: 1199,
    rating: 5,
    img: "/img/crafts6.jpg",
    category: "Crafts",
    stock: 16,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Digital Art (ดิจิทัลอาร์ต)
  {
    id: "p31",
    name: "The Changeling Worlds",
    author: "Arwang",
    price: 899,
    rating: 5,
    img: "/img/Digital1.jpg",
    category: "Digital Art",
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p32",
    name: "Pixel Aurora",
    author: "Kai Vector",
    price: 599,
    rating: 4,
    img: "/img/Digital2.jpg",
    category: "Digital Art",
    stock: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p33",
    name: "Cyber Petals",
    author: "Rin Nova",
    price: 649,
    rating: 5,
    img: "/img/Digital3.jpg",
    category: "Digital Art",
    stock: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p34",
    name: "Synth Dunes",
    author: "Dax Orbit",
    price: 549,
    rating: 4,
    img: "/img/Digital4.jpg",
    category: "Digital Art",
    stock: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p35",
    name: "Neon Rivers",
    author: "Vee Prism",
    price: 729,
    rating: 5,
    img: "/img/Digital5.jpg",
    category: "Digital Art",
    stock: 28,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p36",
    name: "Glass City",
    author: "Nova Lumen",
    price: 679,
    rating: 4,
    img: "/img/digital6.jpg",
    category: "Digital Art",
    stock: 32,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // New Product - เพิ่มข้อมูลใหม่ 1 ชุด
  {
    id: "p37",
    name: "Sunset Serenity",
    author: "Luna Moonlight",
    price: 2199,
    rating: 5,
    img: "/img/Painting1.jpg", // ใช้รูปที่มีอยู่
    category: "Painting",
    stock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


// Seed Orders
// Seed Orders - REMOVED: No mock data, only use real data from database
const seedOrders: Order[] = [
  {
    id: "o-10001",
    buyerId: "u3",
    items: [
      { productId: "p1", name: "Ocean Whisper", price: 1499, qty: 1 },
      { productId: "p2", name: "Neon Poster Set", price: 499, qty: 2 },
    ],
    total: 1499 + 499 * 2,
    dateISO: new Date(Date.now() - 5 * 864e5).toISOString(),
    status: "delivered",
    createdAt: new Date(Date.now() - 5 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
];

// Seed Admin Logs
const seedAdminLogs: AdminLog[] = [
  {
    id: "L-1",
    adminId: "u4",
    atISO: new Date(Date.now() - 3600e3).toISOString(),
    action: "Approved artwork",
    target: "Ocean Whisper",
  },
  {
    id: "L-2",
    adminId: "u4",
    atISO: new Date(Date.now() - 2 * 3600e3).toISOString(),
    action: "Suspended user",
    target: "Mason Park",
  },
];

export function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Only seed if files don't exist
    const existingUsers = db.readFile<User>("users");
    if (existingUsers.length === 0) {
      const success = db.writeFile("users", seedUsers);
      if (success) {
        console.log("✅ Seeded users");
      } else {
        console.error("❌ Failed to seed users");
      }
    }

    const existingCreds = db.readFile<Credential>("credentials");
    if (existingCreds.length === 0) {
      const success = db.writeFile("credentials", seedCredentials);
      if (success) {
        console.log("✅ Seeded credentials");
      } else {
        console.error("❌ Failed to seed credentials");
      }
    }

    // Don't seed products - only use real data from database
    // const existingProducts = db.readFile<Product>("products");
    // if (existingProducts.length === 0) {
    //   db.writeFile("products", seedProducts);
    //   console.log("✅ Seeded products");
    // }

    // Don't seed orders - only use real data from database
    // const existingOrders = db.readFile<Order>("orders");
    // if (existingOrders.length === 0) {
    //   db.writeFile("orders", seedOrders);
    //   console.log("✅ Seeded orders");
    // }

    const existingLogs = db.readFile<AdminLog>("admin-logs");
    if (existingLogs.length === 0) {
      const success = db.writeFile("admin-logs", seedAdminLogs);
      if (success) {
        console.log("✅ Seeded admin logs");
      } else {
        console.error("❌ Failed to seed admin logs");
      }
    }

    console.log("✨ Database seeding completed!");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    // Don't throw - allow server to start even if seeding fails
  }
}

// Run if executed directly
if (require.main === module) {
  seedDatabase();
}

