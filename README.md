# MyRepublic - Internet Provider Landing Page

Landing page website untuk MyRepublic, penyedia layanan internet fiber optic. Dibangun dengan Next.js, TypeScript, Tailwind CSS, dan Prisma ORM + PostgreSQL.

## Fitur

- Landing page responsif dengan desain dark theme dan aksen ungu
- Daftar paket internet (Value, Fast, Pro) dengan fitur CRUD
- Bagian testimoni yang bisa diedit oleh admin
- Proteksi admin dengan password (klik ikon gembok di pojok kanan bawah)
- Smooth scroll navigation
- Responsif untuk desktop dan mobile
- **Full CRUD berfungsi di Vercel** (menggunakan PostgreSQL)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: PostgreSQL via Prisma ORM
- **Hosting**: Vercel + Supabase (free tier)
- **Icons**: Lucide React

## Cara Deploy ke Vercel (Production)

### Step 1: Buat Database di Supabase (Free)

1. Buka [supabase.com](https://supabase.com) → Sign up / Login
2. Klik **"New Project"** → isi nama & password → **Create new project**
3. Tunggu sampai project selesai dibuat
4. Pergi ke **Settings** → **Database** → scroll ke bawah
5. Copy **Connection string** (URI format), contoh:
   ```
   postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

### Step 2: Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → Login pakai GitHub
2. Klik **"Add New Project"** → Import repo `myrepublic-website`
3. Di bagian **Environment Variables**, tambahkan:
   - **Key**: `DATABASE_URL`
   - **Value**: paste connection string Supabase tadi
4. Klik **Deploy** → tunggu sampai selesai
5. Done! Website live 🎉

### Step 3: Seed Data

Setelah deploy, buka browser dan akses:
```
https://nama-project-lu.vercel.app/api/seed
```
Data paket & testimoni otomatis masuk ke database.

## Cara Menjalankan Lokal (Development)

1. Install dependencies:
```bash
npm install
```

2. Setup `.env` file:
```bash
cp .env.example .env
# Edit DATABASE_URL dengan PostgreSQL connection string lu
```

3. Setup database:
```bash
npx prisma db push
```

4. Jalankan development server:
```bash
npm run dev
```

5. Buka [http://localhost:3000](http://localhost:3000)

> Data otomatis ter-seed saat pertama kali halaman dibuka!

## Admin Access

- Klik ikon gembok di pojok kanan bawah
- Password: `admin123`
- Setelah login, tombol edit/delete/add akan muncul di section Paket dan Testimoni

## Struktur Project

```
├── prisma/
│   └── schema.prisma          # Database schema (Package & Testimonial models)
├── public/
│   ├── favicon-icon.png       # Favicon
│   ├── hero-family.png        # Hero section image
│   ├── myrepublic-logo.png    # Logo MyRepublic
│   └── logo.svg               # Logo SVG
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── packages/      # CRUD API untuk paket internet
│   │   │   ├── testimonials/  # CRUD API untuk testimoni
│   │   │   └── seed/          # Seed endpoint untuk data awal
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main landing page
│   ├── components/ui/         # shadcn/ui components
│   ├── hooks/                 # Custom hooks
│   ├── instrumentation.ts     # Auto-seed on startup
│   └── lib/                   # Utilities (db, utils)
├── .env.example               # Environment variables template
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## License

MIT
