import { NextRequest, NextResponse } from 'next/server'
import { FALLBACK_TESTIMONIALS } from '@/lib/fallback-data'

async function getDb() {
  try {
    const { db } = await import('@/lib/db')
    await db.testimonial.findFirst()
    return db
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const db = await getDb()
    if (!db) {
      return NextResponse.json(FALLBACK_TESTIMONIALS)
    }

    const testimonials = await db.testimonial.findMany({
      orderBy: { order: 'asc' },
    })

    if (testimonials.length === 0) {
      return NextResponse.json(FALLBACK_TESTIMONIALS)
    }

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('GET testimonials error:', error)
    return NextResponse.json(FALLBACK_TESTIMONIALS)
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    if (!db) {
      return NextResponse.json({ error: 'Database tidak tersedia di environment ini' }, { status: 503 })
    }

    const body = await request.json()
    const { name, role, content, rating, avatar, order } = body

    if (!name || !role || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const testimonial = await db.testimonial.create({
      data: {
        name,
        role,
        content,
        rating: rating ?? 5,
        avatar: avatar ?? '',
        order: order ?? 0,
      },
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('POST testimonial error:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
