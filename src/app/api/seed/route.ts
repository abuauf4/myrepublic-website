import { NextResponse } from 'next/server'
import { FALLBACK_PACKAGES, FALLBACK_TESTIMONIALS } from '@/lib/fallback-data'

async function getDb() {
  try {
    const { db } = await import('@/lib/db')
    await db.package.findFirst()
    return db
  } catch {
    return null
  }
}

export async function autoSeed() {
  try {
    const db = await getDb()
    if (!db) return

    const existingPackages = await db.package.findMany()
    if (existingPackages.length === 0) {
      await db.package.createMany({
        data: FALLBACK_PACKAGES.map(({ id, ...rest }) => rest),
      })
    }

    const existingTestimonials = await db.testimonial.findMany()
    if (existingTestimonials.length === 0) {
      await db.testimonial.createMany({
        data: FALLBACK_TESTIMONIALS.map(({ id, ...rest }) => rest),
      })
    }
  } catch (error) {
    console.error('Auto-seed error:', error)
  }
}

export async function GET() {
  try {
    const db = await getDb()
    if (!db) {
      return NextResponse.json({
        message: 'Using fallback data (database unavailable)',
        packages: 'fallback',
        testimonials: 'fallback',
      })
    }

    const existingPackages = await db.package.findMany()
    if (existingPackages.length === 0) {
      await db.package.createMany({
        data: FALLBACK_PACKAGES.map(({ id, ...rest }) => rest),
      })
    }

    const existingTestimonials = await db.testimonial.findMany()
    if (existingTestimonials.length === 0) {
      await db.testimonial.createMany({
        data: FALLBACK_TESTIMONIALS.map(({ id, ...rest }) => rest),
      })
    }

    return NextResponse.json({
      message: 'Seed completed',
      packages: existingPackages.length > 0 ? 'already exist' : 'created',
      testimonials: existingTestimonials.length > 0 ? 'already exist' : 'created',
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({
      message: 'Using fallback data',
      packages: 'fallback',
      testimonials: 'fallback',
    })
  }
}
