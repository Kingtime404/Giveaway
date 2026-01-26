export interface Giveaway {
  id: string;
  title: string;
  description: string;
  prize: string;
  image: string;
  endDate: string;
  participants: number;
  requirements: string[];
  isActive: boolean;
}

export const giveaways: Giveaway[] = [
  {
    id: "1",
    title: "Saldo DANA Rp 500.000 Giveaway",
    description: "Menangkan saldo DANA senilai Rp 500.000! Ikuti langkah-langkah sederhana untuk berpartisipasi dalam giveaway eksklusif ini.",
    prize: "Saldo DANA Rp 500.000",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
    endDate: "2026-02-15",
    participants: 12543,
    requirements: [
      "Follow akun Instagram @giveaway_official",
      "Like postingan ini",
      "Tag 3 teman di kolom komentar",
      "Share ke story dengan mention @giveaway_official"
    ],
    isActive: true,
  },
  {
    id: "2",
    title: "Saldo DANA Rp 1.000.000 Giveaway",
    description: "Dapatkan kesempatan memenangkan saldo DANA senilai Rp 1.000.000! Bisa langsung digunakan untuk belanja atau transfer.",
    prize: "Saldo DANA Rp 1.000.000",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    endDate: "2026-02-28",
    participants: 8721,
    requirements: [
      "Subscribe channel YouTube kami",
      "Follow Instagram @tech_giveaway",
      "Komen alasan kenapa kamu butuh saldo DANA ini"
    ],
    isActive: true,
  },
  {
    id: "3",
    title: "PS5 + Game Bundle",
    description: "PlayStation 5 dengan 5 game terbaik tahun ini! Siap untuk gaming experience yang luar biasa?",
    prize: "PS5 Digital Edition + 5 Games",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800",
    endDate: "2026-03-10",
    participants: 15892,
    requirements: [
      "Follow Instagram @gaming_giveaway",
      "Subscribe YouTube Gaming Channel",
      "Like & share postingan giveaway"
    ],
    isActive: true,
  },
  {
    id: "4",
    title: "Cash Rp 10.000.000",
    description: "Giveaway uang tunai senilai 10 juta rupiah! Bisa digunakan untuk apapun yang kamu mau.",
    prize: "Rp 10.000.000 Cash",
    image: "https://images.unsplash.com/photo-1554672723-d42a16e533db?w=800",
    endDate: "2026-02-20",
    participants: 25431,
    requirements: [
      "Follow semua akun sosial media kami",
      "Repost dengan hashtag #CashGiveaway",
      "Isi form pendaftaran dengan lengkap"
    ],
    isActive: true,
  },
  {
    id: "5",
    title: "AirPods Pro 2 Giveaway",
    description: "Wireless earbuds terbaik dari Apple dengan Active Noise Cancellation. Dengarkan musik favoritmu tanpa gangguan!",
    prize: "AirPods Pro 2nd Gen",
    image: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=800",
    endDate: "2026-02-10",
    participants: 6234,
    requirements: [
      "Follow Instagram @audio_giveaway",
      "Tag 2 teman pecinta musik",
      "Share ke story"
    ],
    isActive: true,
  },
];
