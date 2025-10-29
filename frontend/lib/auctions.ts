// /lib/auctions.ts
export type AuctionStatus = "live" | "upcoming" | "closed";

export type Auction = {
  slug: string;
  titleEN: string;
  titleTH?: string;
  artist: string;
  category: "Painting" | "Sculpture" | "Literature (E-book)" | "Graphic Design" | "Crafts" | "Digital Art";
  medium?: string;
  size?: string;
  img: string;          // public path under /public
  startingBid: number;
  currentBid: number;
  endsAt: string;       // ISO string
};

export const auctions: Auction[] = [
  {
    slug: "whispers-of-the-forest-falls",
    titleEN: "Whispers of the Forest Falls",
    titleTH: "เสียงกระซิบน้ำตกในป่า",
    artist: "Humphries",
    category: "Painting",
    medium: "Oil on canvas",
    size: "24 × 36 inches",
    img: "/5th.jpg",
    startingBid: 9800,
    currentBid: 12500,
    endsAt: new Date(Date.now() + 36 * 3600 * 1000).toISOString(), // +36 ชม.
  },
  {
    slug: "signed-baseball-rare",
    titleEN: "Signed Baseball (Rare)",
    artist: "Unknown",
    category: "Crafts",
    img: "/5th2.jpg",
    startingBid: 120,
    currentBid: 180,
    endsAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // ปิดแล้ว
  },
  {
    slug: "antique-clock-victorian",
    titleEN: "Antique Victorian Clock",
    artist: "Vintage Atelier",
    category: "Crafts",
    img: "/clock.jpg",
    startingBid: 250,
    currentBid: 420,
    endsAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), // +6 ชม.
  },
  {
    slug: "moonlight-garden",
    titleEN: "Moonlight Garden",
    artist: "Clara Everwood",
    category: "Digital Art",
    img: "/7th.jpg",
    startingBid: 800,
    currentBid: 800,
    endsAt: new Date(Date.now() + 3 * 86400 * 1000).toISOString(), // +3 วัน
  },
];

export function getStatus(a: Auction, now = Date.now()): AuctionStatus {
  const end = new Date(a.endsAt).getTime();
  if (end <= now) return "closed";
  // ถ้าอยากรองรับ "upcoming" ให้เติม field startsAt แล้วเช็คที่นี่
  return "live";
}

export function getAuctionBySlug(slug: string): Auction | undefined {
  return auctions.find(a => a.slug === slug);
}

export function listAuctions(opts?: {
  q?: string;
  category?: Auction["category"] | "all";
  status?: AuctionStatus | "all";
}) {
  const now = Date.now();
  let list = [...auctions];

  if (opts?.q) {
    const qq = opts.q.toLowerCase();
    list = list.filter(a =>
      a.titleEN.toLowerCase().includes(qq) ||
      (a.titleTH?.toLowerCase().includes(qq) ?? false) ||
      a.artist.toLowerCase().includes(qq) ||
      a.category.toLowerCase().includes(qq)
    );
  }
  if (opts?.category && opts.category !== "all") {
    list = list.filter(a => a.category === opts.category);
  }
  if (opts?.status && opts.status !== "all") {
    list = list.filter(a => getStatus(a, now) === opts.status);
  }

  // เรียง live ก่อน, ตามด้วย close, แล้วค่อยตามเวลาใกล้หมดก่อน
  return list.sort((a, b) => {
    const sa = getStatus(a, now), sb = getStatus(b, now);
    if (sa === "live" && sb !== "live") return -1;
    if (sb === "live" && sa !== "live") return 1;
    return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
  });
}
