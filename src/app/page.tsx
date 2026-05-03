'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Menu,
  X,
  Wifi,
  Zap,
  Shield,
  Headphones,
  Rocket,
  Pencil,
  Trash2,
  Plus,
  Check,
  Loader2,
  Monitor,
  Gamepad2,
  Building2,
  ArrowRight,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Star,
  Quote,
  MapPin,
  Clock,
  Gift,
  Phone,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

// ─── Types ───────────────────────────────────────────────────────────────────
interface PackageItem {
  id: string
  name: string
  badge: string
  speed: string
  description: string
  price: string
  order: number
}

interface TestimonialItem {
  id: string
  name: string
  role: string
  content: string
  rating: number
  avatar: string
  order: number
}

// ─── Sales Config ───────────────────────────────────────────────────────────
interface SalesConfig {
  name: string
  whatsapp: string
  greeting: string
}

// ─── Constants ───────────────────────────────────────────────────────────────
const NAV_ITEMS = ['Beranda', 'Paket', 'Testimoni', 'Promo', 'Kontak']

const DEFAULT_SALES: SalesConfig = {
  name: 'Sales MyRepublic',
  whatsapp: '6281234567890',
  greeting: 'Halo, saya tertarik dengan paket internet MyRepublic',
}

const PAIN_POINTS = [
  { emoji: '📶', title: 'Internet lemot saat meeting penting', desc: 'Saat presentasi online, koneksi tiba-tiba putus atau lag. Malu banget kan?' },
  { emoji: '🎬', title: 'Buffering terus saat nonton film', desc: 'Film seru malah kepotong-putus karena loading. Kesel banget!' },
  { emoji: '🎮', title: 'Ping tinggi, lag saat main game', desc: 'Rank match tapi lag! Musuh udahbunuh, lo masih loading.' },
]

const SOLUTION_FEATURES = [
  { icon: Zap, title: 'Fiber Optic Tercepat', desc: 'Jaringan fiber optic langsung ke rumah, kecepatan tanpa kompromi.' },
  { icon: Shield, title: 'Stabil & Low Latency', desc: 'Tanpa putus, ping rendah. Stabil 24/7 untuk segala kebutuhan.' },
  { icon: Headphones, title: 'Support Cepat 24/7', desc: 'Tim siap bantu kapan saja. Respon cepat, masalah langsung selesai.' },
  { icon: Rocket, title: 'Instalasi Cepat', desc: 'Aktif dalam 24 jam! Pesan hari ini, besok sudah bisa internetan.' },
]

const PACKAGE_ICONS: Record<string, React.ElementType> = {
  VALUE: Monitor,
  FAST: Gamepad2,
  PRO: Building2,
}

const ADMIN_PASSWORD = 'admin123'

const AVATAR_COLORS = [
  'from-[#6A0DAD] to-[#9333EA]',
  'from-[#2563EB] to-[#3B82F6]',
  'from-[#DC2626] to-[#EF4444]',
  'from-[#059669] to-[#10B981]',
  'from-[#D97706] to-[#F59E0B]',
  'from-[#7C3AED] to-[#A78BFA]',
]

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6 },
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Home() {
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Sales config
  const [salesConfig, setSalesConfig] = useState<SalesConfig>(DEFAULT_SALES)
  const [salesDialogOpen, setSalesDialogOpen] = useState(false)
  const [salesFormName, setSalesFormName] = useState('')
  const [salesFormWhatsapp, setSalesFormWhatsapp] = useState('')
  const [salesFormGreeting, setSalesFormGreeting] = useState('')

  // WhatsApp helpers (dynamic based on sales config)
  const waLink = `https://wa.me/${salesConfig.whatsapp}`
  const waText = (text: string) => `${waLink}?text=${encodeURIComponent(text)}`

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null)
  const [saving, setSaving] = useState(false)

  // Testimonial edit state
  const [editTestiDialogOpen, setEditTestiDialogOpen] = useState(false)
  const [deleteTestiDialogOpen, setDeleteTestiDialogOpen] = useState(false)
  const [addTestiDialogOpen, setAddTestiDialogOpen] = useState(false)
  const [selectedTesti, setSelectedTesti] = useState<TestimonialItem | null>(null)
  const [savingTesti, setSavingTesti] = useState(false)

  // Form state (packages)
  const [formName, setFormName] = useState('')
  const [formBadge, setFormBadge] = useState('')
  const [formSpeed, setFormSpeed] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPrice, setFormPrice] = useState('')

  // Form state (testimonials)
  const [formTestiName, setFormTestiName] = useState('')
  const [formTestiRole, setFormTestiRole] = useState('')
  const [formTestiContent, setFormTestiContent] = useState('')
  const [formTestiRating, setFormTestiRating] = useState(5)

  // Coverage checker
  const [coverageArea, setCoverageArea] = useState('')
  const [coverageResult, setCoverageResult] = useState<null | 'available' | 'checking'>(null)

  // Countdown
  const [countdown, setCountdown] = useState({ days: 7, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date()
    target.setDate(target.getDate() + 7)
    const targetTime = target.getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = targetTime - now
      if (diff <= 0) { clearInterval(interval); return }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [pkgRes, testiRes, salesRes] = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/testimonials'),
        fetch('/api/sales'),
      ])

      const pkgData = await pkgRes.json()
      const testiData = await testiRes.json()
      const salesData = await salesRes.json()

      setPackages(pkgData)
      setTestimonials(testiData)
      if (salesData && salesData.whatsapp) {
        setSalesConfig(salesData)
      }

      if (pkgData.length === 0 || testiData.length === 0) {
        await fetch('/api/seed')
        const [rePkgRes, reTestiRes] = await Promise.all([
          fetch('/api/packages'),
          fetch('/api/testimonials'),
        ])
        setPackages(await rePkgRes.json())
        setTestimonials(await reTestiRes.json())
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ─── Admin ─────────────────────────────────────────────────────────────
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setAdminDialogOpen(false)
      setAdminPassword('')
      toast.success('Mode admin aktif!')
    } else {
      toast.error('Password salah!')
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    toast.success('Mode admin dinonaktifkan')
  }

  // ─── Sales Config ──────────────────────────────────────────────────────
  const openSalesDialog = () => {
    setSalesFormName(salesConfig.name)
    setSalesFormWhatsapp(salesConfig.whatsapp)
    setSalesFormGreeting(salesConfig.greeting)
    setSalesDialogOpen(true)
  }

  const saveSalesConfig = async () => {
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: salesFormName,
          whatsapp: salesFormWhatsapp,
          greeting: salesFormGreeting,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSalesConfig(data)
        setSalesDialogOpen(false)
        toast.success('Data sales berhasil disimpan!')
      }
    } catch {
      toast.error('Gagal menyimpan data sales')
    }
  }

  // ─── Package CRUD ──────────────────────────────────────────────────────
  const openEditDialog = (pkg: PackageItem) => {
    if (!isAdmin) return
    setSelectedPackage(pkg)
    setFormName(pkg.name)
    setFormBadge(pkg.badge)
    setFormSpeed(pkg.speed)
    setFormDescription(pkg.description)
    setFormPrice(pkg.price)
    setEditDialogOpen(true)
  }

  const openAddDialog = () => {
    if (!isAdmin) { setAdminDialogOpen(true); return }
    setSelectedPackage(null)
    setFormName(''); setFormBadge(''); setFormSpeed(''); setFormDescription(''); setFormPrice('')
    setAddDialogOpen(true)
  }

  const openDeleteDialog = (pkg: PackageItem) => {
    if (!isAdmin) return
    setSelectedPackage(pkg)
    setDeleteDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedPackage) return
    if (!formName || !formBadge || !formSpeed || !formDescription || !formPrice) {
      toast.error('Semua field harus diisi'); return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/packages/${selectedPackage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, badge: formBadge, speed: formSpeed, description: formDescription, price: formPrice }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Paket berhasil diperbarui!')
      setEditDialogOpen(false); fetchData()
    } catch { toast.error('Gagal memperbarui paket') }
    finally { setSaving(false) }
  }

  const handleAddPackage = async () => {
    if (!formName || !formBadge || !formSpeed || !formDescription || !formPrice) {
      toast.error('Semua field harus diisi'); return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, badge: formBadge, speed: formSpeed, description: formDescription, price: formPrice, order: packages.length + 1 }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Paket berhasil ditambahkan!')
      setAddDialogOpen(false); fetchData()
    } catch { toast.error('Gagal menambahkan paket') }
    finally { setSaving(false) }
  }

  const handleDeletePackage = async () => {
    if (!selectedPackage) return
    setSaving(true)
    try {
      const res = await fetch(`/api/packages/${selectedPackage.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      toast.success('Paket berhasil dihapus!')
      setDeleteDialogOpen(false); fetchData()
    } catch { toast.error('Gagal menghapus paket') }
    finally { setSaving(false) }
  }

  // ─── Testimonial CRUD ──────────────────────────────────────────────────
  const openEditTestiDialog = (t: TestimonialItem) => {
    if (!isAdmin) return
    setSelectedTesti(t)
    setFormTestiName(t.name); setFormTestiRole(t.role); setFormTestiContent(t.content); setFormTestiRating(t.rating)
    setEditTestiDialogOpen(true)
  }

  const openAddTestiDialog = () => {
    if (!isAdmin) { setAdminDialogOpen(true); return }
    setSelectedTesti(null)
    setFormTestiName(''); setFormTestiRole(''); setFormTestiContent(''); setFormTestiRating(5)
    setAddTestiDialogOpen(true)
  }

  const openDeleteTestiDialog = (t: TestimonialItem) => {
    if (!isAdmin) return
    setSelectedTesti(t)
    setDeleteTestiDialogOpen(true)
  }

  const handleSaveTesti = async () => {
    if (!selectedTesti) return
    if (!formTestiName || !formTestiRole || !formTestiContent) {
      toast.error('Semua field harus diisi'); return
    }
    setSavingTesti(true)
    try {
      const res = await fetch(`/api/testimonials/${selectedTesti.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formTestiName, role: formTestiRole, content: formTestiContent, rating: formTestiRating }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Testimoni berhasil diperbarui!')
      setEditTestiDialogOpen(false); fetchData()
    } catch { toast.error('Gagal memperbarui testimoni') }
    finally { setSavingTesti(false) }
  }

  const handleAddTesti = async () => {
    if (!formTestiName || !formTestiRole || !formTestiContent) {
      toast.error('Semua field harus diisi'); return
    }
    setSavingTesti(true)
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formTestiName, role: formTestiRole, content: formTestiContent, rating: formTestiRating, order: testimonials.length + 1 }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Testimoni berhasil ditambahkan!')
      setAddTestiDialogOpen(false); fetchData()
    } catch { toast.error('Gagal menambahkan testimoni') }
    finally { setSavingTesti(false) }
  }

  const handleDeleteTesti = async () => {
    if (!selectedTesti) return
    setSavingTesti(true)
    try {
      const res = await fetch(`/api/testimonials/${selectedTesti.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      toast.success('Testimoni berhasil dihapus!')
      setDeleteTestiDialogOpen(false); fetchData()
    } catch { toast.error('Gagal menghapus testimoni') }
    finally { setSavingTesti(false) }
  }

  // ─── Coverage Checker ─────────────────────────────────────────────────
  const checkCoverage = () => {
    if (!coverageArea.trim()) return
    setCoverageResult('checking')
    setTimeout(() => setCoverageResult('available'), 1500)
  }

  // ─── Navigation ────────────────────────────────────────────────────────
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        const headerOffset = 72
        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' })
      }
    }, 50)
  }

  const getNavTarget = (item: string): string => {
    const map: Record<string, string> = {
      Beranda: 'hero',
      Paket: 'packages',
      Testimoni: 'testimonials',
      Promo: 'promo',
      Kontak: 'contact',
    }
    return map[item] || 'hero'
  }

  const isPopularPkg = (pkg: PackageItem) => {
    return pkg.badge?.toUpperCase() === 'FAST' || pkg.order === 2
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ═══════════════════════════════════════════════════════════════════
          1. NAVBAR (sticky, simple)
      ═══════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" onClick={() => scrollToSection('hero')}>
              <Image src="/myrepublic-logo.png" alt="MyRepublic Logo" width={36} height={36} className="rounded-xl" />
              <span className="text-lg font-extrabold text-[#6A0DAD] leading-tight tracking-tight">MyRepublic</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(getNavTarget(item))}
                  className="px-3 lg:px-4 py-2 text-sm font-semibold text-gray-600 hover:text-[#6A0DAD] hover:bg-[#F3EAFA] rounded-xl transition-all duration-200 whitespace-nowrap"
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* Desktop WhatsApp Button */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <Button
                className="bg-[#25D366] hover:bg-[#1EB954] text-white rounded-xl px-5 h-10 gap-2 shadow-md shadow-[#25D366]/20 font-semibold transition-all duration-200 text-sm"
                onClick={() => window.open(waLink, '_blank')}
              >
                <WhatsAppIcon className="w-4 h-4" />
                Chat WhatsApp
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 bg-[#6A0DAD] rounded-xl flex items-center justify-center shadow-md shadow-[#6A0DAD]/20"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(getNavTarget(item))}
                    className="block w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:text-[#6A0DAD] hover:bg-[#F3EAFA] rounded-lg transition-all"
                  >
                    {item}
                  </button>
                ))}
                <Button
                  className="w-full mt-3 bg-[#25D366] hover:bg-[#1EB954] text-white rounded-xl h-11 gap-2 font-semibold"
                  onClick={() => window.open(waLink, '_blank')}
                >
                  <WhatsAppIcon />
                  Chat WhatsApp
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════════════
            2. HERO SECTION (conversion focused)
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          id="hero"
          className="relative overflow-hidden bg-gradient-to-br from-[#0A0A1A] via-[#1A0A2E] to-[#0A0A1A]"
        >
          {/* Glow effects */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6A0DAD]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9333EA]/15 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-[#6A0DAD]/8 rounded-full blur-[150px]" />

          {/* Animated floating orbs */}
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-[#6A0DAD]/40 to-[#9333EA]/30 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-32 left-10 w-24 h-24 bg-gradient-to-br from-[#9333EA]/30 to-[#6A0DAD]/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-1/2 right-1/3 w-20 h-20 bg-[#C084FC]/20 rounded-full blur-lg"
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left — Text */}
              <div className="flex-1 text-center lg:text-left max-w-2xl">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-[#6A0DAD]/20 border border-[#6A0DAD]/30 rounded-full px-4 py-1.5 mb-6"
                >
                  <span className="animate-pulse">🔥</span>
                  <span className="text-sm font-semibold text-[#C084FC]">Promo Terbatas</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-3xl md:text-[2.75rem] lg:text-[3.25rem] xl:text-5xl font-extrabold text-white leading-tight tracking-tight"
                >
                  Internet{' '}
                  <span className="bg-gradient-to-r from-[#C084FC] to-[#A855F7] bg-clip-text text-transparent">Ngebut</span>{' '}
                  Tanpa Lemot{' '}
                  <br className="hidden md:block" />
                  Buat{' '}
                  <span className="bg-gradient-to-r from-[#C084FC] to-[#A855F7] bg-clip-text text-transparent">Kerja</span> &{' '}
                  <span className="bg-gradient-to-r from-[#C084FC] to-[#A855F7] bg-clip-text text-transparent">Gaming</span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="mt-5 text-base md:text-lg text-gray-400 leading-relaxed"
                >
                  Fiber stabil, tanpa buffering, langsung aktif cepat
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-4"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#6A0DAD] to-[#9333EA] hover:from-[#5A0B9A] hover:to-[#8325D4] text-white rounded-2xl px-8 h-14 text-base gap-2.5 w-full sm:w-auto shadow-lg shadow-[#6A0DAD]/30 font-bold transition-all duration-200"
                    onClick={() => window.open(waText('Halo, saya mau cek area & pasang internet MyRepublic'), '_blank')}
                  >
                    Cek Area & Pasang Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    className="bg-[#25D366] hover:bg-[#1EB954] text-white rounded-2xl px-8 h-14 text-base gap-2.5 w-full sm:w-auto shadow-lg shadow-[#25D366]/20 font-bold transition-all duration-200"
                    onClick={() => window.open(waLink, '_blank')}
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    Chat WhatsApp
                  </Button>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.55 }}
                  className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-400"
                >
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-green-400" /> Gratis Instalasi
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-green-400" /> Aktif 24 Jam
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-green-400" /> Tanpa FUP
                  </span>
                </motion.div>
              </div>

              {/* Right — Abstract Fiber Optic Visual */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex-1 relative max-w-md lg:max-w-lg w-full aspect-square"
              >
                {/* Outer glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6A0DAD]/30 to-[#9333EA]/20 rounded-full blur-3xl" />

                {/* Central orb */}
                <div className="absolute inset-8 bg-gradient-to-br from-[#6A0DAD] to-[#9333EA] rounded-full opacity-20 blur-2xl" />
                <div className="absolute inset-16 bg-gradient-to-br from-[#6A0DAD] to-[#9333EA] rounded-full opacity-30 blur-xl" />

                {/* Animated rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border border-[#6A0DAD]/20"
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#C084FC] rounded-full shadow-lg shadow-[#6A0DAD]/50" />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-12 rounded-full border border-[#9333EA]/20"
                >
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#A855F7] rounded-full shadow-lg shadow-[#9333EA]/50" />
                  <div className="absolute top-1/4 -right-1.5 w-2.5 h-2.5 bg-[#C084FC] rounded-full" />
                </motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-20 rounded-full border border-purple-400/15"
                >
                  <div className="absolute top-1/3 -left-1 w-2 h-2 bg-[#C084FC]/80 rounded-full" />
                </motion.div>

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-20 h-20 bg-gradient-to-br from-[#6A0DAD] to-[#9333EA] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#6A0DAD]/40"
                  >
                    <Wifi className="w-10 h-10 text-white" />
                  </motion.div>
                </div>

                {/* Floating speed badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium">Speed Test</p>
                      <p className="text-sm text-white font-bold">150+ Mbps</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating latency badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#6A0DAD] rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium">Latency</p>
                      <p className="text-sm text-white font-bold">5ms Ping</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            3. PROBLEM SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="problem" className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Lagi Kesel Sama Internet{' '}
                <span className="text-red-500">Ginian</span>?
              </h2>
              <p className="mt-4 text-gray-500 text-base md:text-lg max-w-2xl mx-auto">Masalah yang bikin kamu kesel setiap hari</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {PAIN_POINTS.map((point, idx) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="group relative bg-gradient-to-br from-red-50/80 to-orange-50/50 border border-red-100/80 rounded-3xl p-6 md:p-8 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mb-5 text-3xl">
                    {point.emoji}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{point.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{point.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            4. SOLUTION SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="solution" className="relative py-20 md:py-32 bg-gradient-to-br from-[#0A0A1A] via-[#1A0A2E] to-[#0A0A1A] overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#6A0DAD]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#9333EA]/10 rounded-full blur-[100px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                Solusi Internet Yang{' '}
                <span className="bg-gradient-to-r from-[#C084FC] to-[#A855F7] bg-clip-text text-transparent">Beneran Ngebut</span>
              </h2>
              <p className="mt-4 text-gray-400 text-base md:text-lg max-w-2xl mx-auto">Kenapa harus pilih kami? Ini alasannya</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SOLUTION_FEATURES.map((feat, idx) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/10 hover:border-[#6A0DAD]/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#6A0DAD] to-[#9333EA] rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-[#6A0DAD]/30 group-hover:scale-110 transition-transform duration-300">
                    <feat.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            5. PACKAGE SECTION (Pricing)
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="packages" className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Pilih Paket Internet{' '}
                <span className="text-[#6A0DAD]">Terbaik</span>
              </h2>
              <p className="mt-4 text-gray-500 text-base md:text-lg">Semua paket fiber optic tanpa FUP, gratis instalasi</p>

              {isAdmin && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex justify-center">
                  <Button onClick={openAddDialog} className="bg-[#6A0DAD] hover:bg-[#5A0B9A] text-white rounded-xl gap-2 shadow-md shadow-[#6A0DAD]/20 font-semibold">
                    <Plus className="w-4 h-4" /> Tambah Paket Baru
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#6A0DAD] animate-spin" /></div>
            ) : packages.length === 0 ? (
              <div className="text-center py-20 text-gray-400"><p>Belum ada paket.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                {packages.map((pkg, idx) => {
                  const IconComponent = PACKAGE_ICONS[pkg.badge?.toUpperCase()] || Wifi
                  const popular = isPopularPkg(pkg)
                  return (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className={`group relative bg-white rounded-3xl p-6 md:p-8 transition-all duration-300 ${
                        popular
                          ? 'border-2 border-[#6A0DAD] shadow-xl shadow-[#6A0DAD]/10 md:scale-105'
                          : 'border border-gray-200 hover:border-[#6A0DAD]/30 hover:shadow-lg hover:shadow-[#6A0DAD]/5'
                      }`}
                    >
                      {popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <span className="bg-gradient-to-r from-[#6A0DAD] to-[#9333EA] text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg shadow-[#6A0DAD]/30 uppercase tracking-wider">Terlaris</span>
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <Badge className="bg-[#6A0DAD]/10 hover:bg-[#6A0DAD]/10 text-[#6A0DAD] font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider border-0">{pkg.badge}</Badge>
                        {isAdmin && (
                          <div className="flex gap-1.5">
                            <button onClick={() => openEditDialog(pkg)} className="w-8 h-8 bg-gray-100 hover:bg-[#6A0DAD]/10 rounded-lg flex items-center justify-center transition-colors group/edit" title="Edit">
                              <Pencil className="w-3.5 h-3.5 text-gray-400 group-hover/edit:text-[#6A0DAD]" />
                            </button>
                            <button onClick={() => openDeleteDialog(pkg)} className="w-8 h-8 bg-gray-100 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors group/del" title="Hapus">
                              <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover/del:text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="mt-5 w-14 h-14 rounded-2xl bg-[#F3EAFA] flex items-center justify-center">
                        <IconComponent className="w-7 h-7 text-[#6A0DAD]" />
                      </div>
                      <div className="mt-4"><span className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{pkg.speed}</span></div>
                      <p className="mt-3 text-gray-500 text-sm md:text-base leading-relaxed">{pkg.description}</p>
                      <div className="mt-5 flex items-baseline gap-1">
                        <span className="text-2xl md:text-3xl font-extrabold text-gray-900">{pkg.price}</span>
                        <span className="text-sm text-gray-400 font-medium">/bulan</span>
                      </div>

                      {/* Benefits */}
                      <div className="mt-5 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> Tanpa FUP
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> Gratis Instalasi
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> Gratis Router WiFi
                        </div>
                      </div>

                      <Button
                        className={`w-full mt-6 rounded-2xl h-12 text-base gap-2 font-bold transition-all duration-200 ${
                          popular
                            ? 'bg-gradient-to-r from-[#6A0DAD] to-[#9333EA] hover:from-[#5A0B9A] hover:to-[#8325D4] text-white shadow-lg shadow-[#6A0DAD]/30'
                            : 'bg-[#6A0DAD] hover:bg-[#5A0B9A] text-white'
                        }`}
                        onClick={() => window.open(waText(`Halo, saya tertarik dengan paket ${pkg.name} (${pkg.speed})`), '_blank')}
                      >
                        Pilih Paket <ChevronRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )
                })}
              </div>
            )}

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 flex items-center justify-center gap-2.5 text-sm text-gray-500">
              <Shield className="w-4 h-4 text-[#6A0DAD] flex-shrink-0" />
              <span>Semua paket menggunakan jaringan <strong className="text-gray-700">Fiber Optic</strong> tanpa FUP</span>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            6. TESTIMONIALS SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="testimonials" className="py-20 md:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Dipercaya{' '}
                <span className="text-[#6A0DAD]">Ratusan Pelanggan</span>
              </h2>
              <p className="mt-4 text-gray-500 text-base md:text-lg">Dengarkan cerita mereka yang sudah beralih</p>
              {isAdmin && (
                <Button onClick={openAddTestiDialog} className="mt-4 bg-[#6A0DAD] hover:bg-[#5A0B9A] text-white rounded-xl gap-2 shadow-md shadow-[#6A0DAD]/20 font-semibold">
                  <Plus className="w-4 h-4" /> Tambah Testimoni
                </Button>
              )}
            </motion.div>

            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-[#6A0DAD] animate-spin" /></div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-16 text-gray-400"><p>Belum ada testimoni.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t, idx) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group relative bg-white rounded-3xl p-6 md:p-8 border border-gray-100 hover:shadow-xl hover:shadow-[#6A0DAD]/5 transition-all duration-300"
                  >
                    {isAdmin && (
                      <div className="absolute top-4 right-4 flex gap-1.5">
                        <button onClick={() => openEditTestiDialog(t)} className="w-7 h-7 bg-gray-100 hover:bg-[#6A0DAD]/10 rounded-lg flex items-center justify-center transition-colors" title="Edit">
                          <Pencil className="w-3 h-3 text-gray-400 hover:text-[#6A0DAD]" />
                        </button>
                        <button onClick={() => openDeleteTestiDialog(t)} className="w-7 h-7 bg-gray-100 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors" title="Hapus">
                          <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    )}

                    <Quote className="w-8 h-8 text-[#6A0DAD]/15 mb-3" />

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{t.content}&rdquo;</p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-xs font-bold">{getInitials(t.name)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            7. COVERAGE CHECKER
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="coverage" className="py-20 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Cek Ketersediaan di{' '}
                <span className="text-[#6A0DAD]">Area Anda</span>
              </h2>
              <p className="mt-4 text-gray-500 text-base md:text-lg max-w-2xl mx-auto">Masukkan lokasi Anda, kami cek apakah area Anda sudah tercover</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-purple-500/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6A0DAD] to-[#9333EA] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Cek Area Coverage</p>
                    <p className="text-sm text-gray-500">Cek apakah lokasimu sudah tercover</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Input
                    value={coverageArea}
                    onChange={(e) => setCoverageArea(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && checkCoverage()}
                    placeholder="Masukkan nama daerah/area Anda..."
                    className="border-gray-200 focus:border-[#6A0DAD] focus:ring-[#6A0DAD]/20 h-12 rounded-xl text-base"
                  />
                  <Button
                    onClick={checkCoverage}
                    disabled={coverageResult === 'checking' || !coverageArea.trim()}
                    className="bg-gradient-to-r from-[#6A0DAD] to-[#9333EA] hover:from-[#5A0B9A] hover:to-[#8325D4] text-white rounded-xl h-12 px-6 font-bold gap-2 shadow-lg shadow-[#6A0DAD]/20 flex-shrink-0"
                  >
                    {coverageResult === 'checking' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    Cek
                  </Button>
                </div>

                <AnimatePresence>
                  {coverageResult === 'checking' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 text-center text-sm text-gray-500"
                    >
                      <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                      Memeriksa area...
                    </motion.div>
                  )}
                  {coverageResult === 'available' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4 text-center"
                    >
                      <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <p className="font-bold text-green-700">Area Anda tercover!</p>
                      <p className="text-sm text-green-600 mt-1">Hubungi kami untuk pemasangan.</p>
                      <Button
                        onClick={() => window.open(waText('Halo, saya mau pasang internet di area yang sudah tercover'), '_blank')}
                        className="mt-3 bg-[#25D366] hover:bg-[#1EB954] text-white rounded-xl h-10 px-6 text-sm font-bold gap-2"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                        Hubungi Kami
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            8. PROMO SECTION (Urgency)
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="promo" className="relative py-20 md:py-32 bg-gradient-to-br from-[#6A0DAD] via-[#5A0B9A] to-[#2D0649] overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-[80px]" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#9333EA]/20 rounded-full blur-[60px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <Gift className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-semibold text-yellow-200">Promo Terbatas!</span>
              </div>

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                🎁 Promo Terbatas!
              </h2>
              <p className="mt-4 text-white/70 text-base md:text-lg max-w-2xl mx-auto">Jangan sampai kehabisan! Promo berakhir dalam:</p>

              {/* Countdown */}
              <div className="mt-8 flex items-center justify-center gap-3 md:gap-5">
                {[
                  { value: countdown.days, label: 'Hari' },
                  { value: countdown.hours, label: 'Jam' },
                  { value: countdown.minutes, label: 'Menit' },
                  { value: countdown.seconds, label: 'Detik' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl md:text-3xl font-extrabold text-white">{String(item.value).padStart(2, '0')}</span>
                    </div>
                    <span className="mt-2 text-xs text-white/60 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="mt-10 max-w-md mx-auto space-y-3">
                <div className="flex items-center gap-3 text-white/90 text-sm md:text-base">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Gratis Instalasi <span className="text-white/60">(hemat Rp 500.000)</span></span>
                </div>
                <div className="flex items-center gap-3 text-white/90 text-sm md:text-base">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Diskon 50% bulan pertama</span>
                </div>
                <div className="flex items-center gap-3 text-white/90 text-sm md:text-base">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Gratis router WiFi</span>
                </div>
              </div>

              <Button
                size="lg"
                className="mt-10 bg-white hover:bg-gray-50 text-[#6A0DAD] rounded-2xl px-10 h-14 text-base font-bold gap-2.5 shadow-xl shadow-black/20 transition-all duration-200"
                onClick={() => window.open(waText('Halo, saya mau ambil promo MyRepublic!'), '_blank')}
              >
                <Gift className="w-5 h-5" />
                Ambil Promo Sekarang
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            9. FINAL CTA SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="contact" className="relative py-20 md:py-32 bg-gradient-to-br from-gray-900 via-[#0A0A1A] to-gray-900 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#6A0DAD]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#9333EA]/10 rounded-full blur-[100px]" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Pasang Sekarang,{' '}
                <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-[#C084FC] to-[#A855F7] bg-clip-text text-transparent">Internet Aktif Besok</span>
              </h2>
              <p className="mt-5 text-gray-400 text-base md:text-lg max-w-2xl mx-auto">Jangan tunda lagi, nikmati internet super cepat hari ini</p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#6A0DAD] to-[#9333EA] hover:from-[#5A0B9A] hover:to-[#8325D4] text-white rounded-2xl px-10 h-14 text-base gap-2.5 shadow-lg shadow-[#6A0DAD]/30 font-bold transition-all duration-200 w-full sm:w-auto"
                  onClick={() => window.open(waText('Halo, saya mau pasang internet MyRepublic sekarang!'), '_blank')}
                >
                  Pasang Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  className="bg-[#25D366] hover:bg-[#1EB954] text-white rounded-2xl px-10 h-14 text-base gap-2.5 shadow-lg shadow-[#25D366]/20 font-bold transition-all duration-200 w-full sm:w-auto"
                  onClick={() => window.open(waLink, '_blank')}
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  Chat WhatsApp
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          10. FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0A0A1A] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/myrepublic-logo.png" alt="MyRepublic Logo" width={32} height={32} className="rounded-lg" />
                <span className="text-lg font-extrabold">MyRepublic</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">Internet fiber optic terbaik untuk rumah dan bisnis Anda. Cepat, stabil, dan tanpa FUP.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm mb-4">Quick Links</h4>
              <div className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(getNavTarget(item))}
                    className="block text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm mb-4">Kontak</h4>
              <div className="space-y-3">
                <a href={waLink} target="_blank" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <WhatsAppIcon className="w-4 h-4" /> WhatsApp
                </a>
                <a href="tel:+6281234567890" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" /> +62 812-3456-7890
                </a>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" /> Support 24/7
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} MyRepublic Authorized Partner. All rights reserved.</p>
            <p className="text-xs text-gray-600">Powered by Fiber Optic Technology</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════
          11. FLOATING WHATSAPP BUTTON
      ═══════════════════════════════════════════════════════════════════ */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8 w-14 h-14 bg-[#25D366] hover:bg-[#1EB954] rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/30 transition-all duration-200 hover:scale-110 group"
        aria-label="Chat WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7 text-white" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      </a>

      {/* ═══════════════════════════════════════════════════════════════════
          12. STICKY BOTTOM CTA (mobile only)
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-gradient-to-r from-[#6A0DAD] to-[#9333EA] p-3 shadow-[0_-4px_20px_rgba(106,13,173,0.3)]">
        <Button
          className="w-full bg-white hover:bg-gray-50 text-[#6A0DAD] rounded-2xl h-12 text-base font-bold gap-2 shadow-lg transition-all duration-200"
          onClick={() => window.open(waText('Halo, saya mau pasang internet MyRepublic!'), '_blank')}
        >
          Pasang Sekarang
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          FLOATING ADMIN BUTTON
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-20 right-6 z-40 md:bottom-8 md:right-24">
        {isAdmin ? (
          <div className="flex flex-col gap-2 items-end">
            <Button onClick={openSalesDialog} className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1EB954] text-white shadow-xl shadow-[#25D366]/30 p-0 transition-all duration-200 hover:scale-110" title="Setting Sales">
              <WhatsAppIcon className="w-5 h-5" />
            </Button>
            <Button onClick={openAddDialog} className="w-12 h-12 rounded-full bg-[#6A0DAD] hover:bg-[#5A0B9A] text-white shadow-xl shadow-[#6A0DAD]/30 p-0 transition-all duration-200 hover:scale-110" title="Tambah Paket">
              <Plus className="w-5 h-5" />
            </Button>
            <Button onClick={openAddTestiDialog} className="w-12 h-12 rounded-full bg-[#9333EA] hover:bg-[#7C3AED] text-white shadow-xl shadow-[#9333EA]/30 p-0 transition-all duration-200 hover:scale-110" title="Tambah Testimoni">
              <Quote className="w-5 h-5" />
            </Button>
            <Button onClick={handleAdminLogout} className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/30 p-0 transition-all duration-200 hover:scale-110" title="Logout Admin">
              <Unlock className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <Button onClick={() => setAdminDialogOpen(true)} className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-xl shadow-gray-800/30 p-0 transition-all duration-200 hover:scale-110" title="Login Admin">
            <Lock className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ADMIN LOGIN DIALOG
      ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#6A0DAD] flex items-center gap-2"><Lock className="w-5 h-5" /> Login Admin</DialogTitle>
            <DialogDescription>Masukkan password admin untuk mengakses fitur edit.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="admin-pass" className="font-semibold text-gray-700">Password Admin</Label>
              <div className="relative">
                <Input id="admin-pass" type={showPassword ? 'text' : 'password'} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()} placeholder="Masukkan password" className="border-gray-200 focus:border-[#6A0DAD] focus:ring-[#6A0DAD]/20 pr-10" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setAdminDialogOpen(false); setAdminPassword('') }} className="font-semibold">Batal</Button>
            <Button className="bg-[#6A0DAD] hover:bg-[#5A0B9A] text-white font-semibold gap-1.5" onClick={handleAdminLogin}><Lock className="w-4 h-4" /> Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════
          PACKAGE EDIT DIALOG
      ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#6A0DAD] flex items-center gap-2"><Pencil className="w-5 h-5" /> Edit Paket</DialogTitle>
            <DialogDescription>Perbarui informasi paket internet.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="font-semibold text-gray-700">Nama Paket</Label><Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Fast Plan" className="border-gray-200 focus:border-[#6A0DAD]" /></div>
              <div className="space-y-2"><Label className="font-semibold text-gray-700">Badge</Label><Input value={formBadge} onChange={(e) => setFormBadge(e.target.value)} placeholder="e.g. FAST" className="border-gray-200 focus:border-[#6A0DAD]" /></div>
            </div>
            <div className="space-y-2"><Label className="font-semibold text-gray-700">Kecepatan</Label><Input value={formSpeed} onChange={(e) => setFormSpeed(e.target.value)} placeholder="e.g. 100 Mbps" className="border-gray-200 focus:border-[#6A0DAD]" /></div>
            <div className="space-y-2"><Label className="font-semibold text-gray-700">Deskripsi</Label><Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="e.g. Cocok untuk Gaming & Keluarga" rows={2} className="border-gray-200 focus:border-[#6A0DAD]" /></div>
            <div className="space-y-2"><Label className="font-semibold text-gray-700">Harga</Label><Input value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="e.g. Rp 349.000" className="border-gray-200 focus:border-[#6A0DAD]" /></div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={saving} className="font-semibold">Batal</Button>
            <Button className="bg-[#6A0DAD] hover:bg-[#5A0B9A] text-white font-semibold gap-1.5" onClick={handleSaveEdit} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════
          PACKAGE ADD DIALOG
      ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#6A0DAD] flex items-center gap-2"><Plus className="w-5 h-5" /> Tambah Paket Baru</DialogTitle>
            <DialogDescription>Isi informasi paket internet baru.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="font-semibold text-gray-700">Nama Paket</Label><Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Fast Plan" className="border-gray-200 focus:border-[#6A0DAD]" /></div>
              <div className="space-y-2"><Label className="font-semibold text-gray-700">Badge</Label><Input value={formBadge} onChange={(e) => setFormBadge(e.target.value)} placeholder="e.g. FAST" className="border-gray-200 focus:border-[#6A0DAD]" /></div>
            </div>
            <div className="space-y-2"><Label className="font-semibold text-gray-700">Kecepatan</Label><Input value={formSpeed} onChange={(e) => setFormSpeed(e.target.value)} placeholder="e.g. 100 Mbps" className="border-gray-200 focus:border-[#6A0DAD]" /></div>
            <div className="space-y-2"><Label className="font-semibold text-gray-700">Deskripsi</Label><Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="e.g. Cocok untuk Gaming & Keluarga" rows={2} className="border-gray-200 focus:border-[#6A0DAD]" /></div>
            <div className="space-y-2"><Label className="font-semibold text-gray-700">Harga</Label><Input value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="e.g. Rp 349.000" className="border-gray-200 focus:border-[#6A0DAD]" /></div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} disabled={saving} className="font-semibold">Batal</Button>
            <Button className="bg-[#6A0DAD] hover:bg-[#5A0B9A] text-white font-semibold gap-1.5" onClick={handleAddPackage} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Tambah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════
          PACKAGE DELETE DIALOG
      ═══════════════════════════════════════════════════════════════════ */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><Trash2 className="w-5 h-5 text-red-500" /> Hapus Paket?</AlertDialogTitle>
            <AlertDialogDescription>Yakin ingin menghapus paket <strong>{selectedPackage?.name}</strong>? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePackage} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white gap-1.5">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIAL EDIT DIALOG
      ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={editTestiDialogOpen} onOpenChange={setEditTestiDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#6A0DAD] flex items-center gap-2"><Pencil className="w-5 h-5" /> Edit Testimoni</DialogTitle>
            <DialogDescription>Perbarui informasi testimoni.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="font-semibold text-gray-700">Nama</Label><Input value={formTestiName} onChange={(e) => setFormTestiName(e.target.value)} placeholder="Nama pelanggan" className="border-gray-200 focus:border-[#6A0DAD]" /></div>
              <div className="space-y-2"><Label className="font-semibold text-gray-700">Role</Label><Input value={formTestiRole} onChange={(e) => setFormTestiRole(e.target.value)} placeholder="e.g. Karyawan Swasta" className="border-gray-200 focus:border-[#6A0DAD]" /></div>
            </div>
            <div className="space-y-2"><Label className="font-semibold text-gray-700">Testimoni</Label><Textarea value={formTestiContent} onChange={(e) => setFormTestiContent(e.target.value)} placeholder="Tulis testimoni..." rows={3} className="border-gray-200 focus:border-[#6A0DAD]" /></div>
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Rating (1-5)</Label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} type="button" onClick={() => setFormTestiRating(i + 1)}>
                    <Star className={`w-7 h-7 transition-colors ${i < formTestiRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditTestiDialogOpen(false)} disabled={savingTesti} className="font-semibold">Batal</Button>
            <Button className="bg-[#6A0DAD] hover:bg-[#5A0B9A] text-white font-semibold gap-1.5" onClick={handleSaveTesti} disabled={savingTesti}>{savingTesti ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIAL ADD DIALOG
      ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={addTestiDialogOpen} onOpenChange={setAddTestiDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#6A0DAD] flex items-center gap-2"><Plus className="w-5 h-5" /> Tambah Testimoni</DialogTitle>
            <DialogDescription>Tambah testimoni pelanggan baru.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="font-semibold text-gray-700">Nama</Label><Input value={formTestiName} onChange={(e) => setFormTestiName(e.target.value)} placeholder="Nama pelanggan" className="border-gray-200 focus:border-[#6A0DAD]" /></div>
              <div className="space-y-2"><Label className="font-semibold text-gray-700">Role</Label><Input value={formTestiRole} onChange={(e) => setFormTestiRole(e.target.value)} placeholder="e.g. Karyawan Swasta" className="border-gray-200 focus:border-[#6A0DAD]" /></div>
            </div>
            <div className="space-y-2"><Label className="font-semibold text-gray-700">Testimoni</Label><Textarea value={formTestiContent} onChange={(e) => setFormTestiContent(e.target.value)} placeholder="Tulis testimoni..." rows={3} className="border-gray-200 focus:border-[#6A0DAD]" /></div>
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Rating (1-5)</Label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} type="button" onClick={() => setFormTestiRating(i + 1)}>
                    <Star className={`w-7 h-7 transition-colors ${i < formTestiRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddTestiDialogOpen(false)} disabled={savingTesti} className="font-semibold">Batal</Button>
            <Button className="bg-[#6A0DAD] hover:bg-[#5A0B9A] text-white font-semibold gap-1.5" onClick={handleAddTesti} disabled={savingTesti}>{savingTesti ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Tambah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIAL DELETE DIALOG
      ═══════════════════════════════════════════════════════════════════ */}
      <AlertDialog open={deleteTestiDialogOpen} onOpenChange={setDeleteTestiDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><Trash2 className="w-5 h-5 text-red-500" /> Hapus Testimoni?</AlertDialogTitle>
            <AlertDialogDescription>Yakin ingin menghapus testimoni dari <strong>{selectedTesti?.name}</strong>?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={savingTesti}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTesti} disabled={savingTesti} className="bg-red-600 hover:bg-red-700 text-white gap-1.5">{savingTesti ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ═══════════════════════════════════════════════════════════════════
          SALES CONFIG DIALOG
      ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={salesDialogOpen} onOpenChange={setSalesDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#25D366] flex items-center gap-2">
              <WhatsAppIcon className="w-5 h-5" /> Setting Data Sales
            </DialogTitle>
            <DialogDescription>Atur nama & nomor WhatsApp sales. Semua tombol WhatsApp di website akan otomatis mengarah ke nomor ini.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="sales-name" className="font-semibold text-sm">Nama Sales</Label>
              <Input id="sales-name" value={salesFormName} onChange={(e) => setSalesFormName(e.target.value)} placeholder="Contoh: Ahmad - Sales MyRepublic" className="border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sales-wa" className="font-semibold text-sm">Nomor WhatsApp (tanpa +)</Label>
              <Input id="sales-wa" value={salesFormWhatsapp} onChange={(e) => setSalesFormWhatsapp(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Contoh: 6281234567890" className="border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]/20" />
              <p className="text-xs text-gray-400">Format: kode negara + nomor. Contoh: 6281234567890</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sales-greeting" className="font-semibold text-sm">Pesan Pembuka WhatsApp</Label>
              <Textarea id="sales-greeting" value={salesFormGreeting} onChange={(e) => setSalesFormGreeting(e.target.value)} placeholder="Halo, saya tertarik dengan paket internet MyRepublic" rows={3} className="border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]/20" />
            </div>
            <div className="bg-[#25D366]/5 border border-[#25D366]/20 rounded-xl p-3">
              <p className="text-xs text-[#25D366] font-semibold mb-1">Preview link WhatsApp:</p>
              <p className="text-xs text-gray-500 break-all">wa.me/{salesFormWhatsapp || '628xxx'}?text={encodeURIComponent(salesFormGreeting || 'Halo...')}</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSalesDialogOpen(false)} className="rounded-xl">Batal</Button>
            <Button className="bg-[#25D366] hover:bg-[#1EB954] text-white rounded-xl gap-2 font-semibold" onClick={saveSalesConfig}>
              <WhatsAppIcon className="w-4 h-4" /> Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
