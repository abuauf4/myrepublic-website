// Fallback data & Sales config — works even without database
// When deployed with PostgreSQL (Supabase), data comes from DB
// When no DB available, fallback data is used

export const FALLBACK_PACKAGES = [
  {
    id: 'pkg-1',
    name: 'Value Plan',
    badge: 'VALUE',
    speed: '30 Mbps',
    description: 'Cocok untuk Streaming & kerja ringan',
    price: 'Rp 239.000',
    order: 1,
  },
  {
    id: 'pkg-2',
    name: 'Fast Plan',
    badge: 'FAST',
    speed: '100 Mbps',
    description: 'Cocok untuk Gaming & Keluarga',
    price: 'Rp 349.000',
    order: 2,
  },
  {
    id: 'pkg-3',
    name: 'Pro Plan',
    badge: 'PRO',
    speed: '150 Mbps',
    description: 'Cocok untuk Bisnis & Heavy User',
    price: 'Rp 479.000',
    order: 3,
  },
]

export const FALLBACK_TESTIMONIALS = [
  {
    id: 'testi-1',
    name: 'Budi Santoso',
    role: 'Karyawan Swasta',
    content: 'Internetnya super cepat dan stabil! Sejak pakai MyRepublic, WFH jadi lancar tanpa putus-putus. Sangat recommended!',
    rating: 5,
    avatar: '',
    order: 1,
  },
  {
    id: 'testi-2',
    name: 'Siti Rahayu',
    role: 'Ibu Rumah Tangga',
    content: 'Anak-anak bisa belajar online dan streaming tanpa buffering. Harganya juga terjangkau untuk kualitas sebagus ini.',
    rating: 5,
    avatar: '',
    order: 2,
  },
  {
    id: 'testi-3',
    name: 'Ahmad Fauzi',
    role: 'Gamer & Content Creator',
    content: 'Ping rendah banget buat main game, upload video juga cepat. Tim support-nya responsif kalau ada kendala.',
    rating: 5,
    avatar: '',
    order: 3,
  },
]

// Default sales config — can be overridden via admin panel
export const DEFAULT_SALES_CONFIG = {
  name: 'Sales MyRepublic',
  whatsapp: '6281234567890',
  greeting: 'Halo, saya tertarik dengan paket internet MyRepublic',
}
