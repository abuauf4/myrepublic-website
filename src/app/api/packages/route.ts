import { NextRequest, NextResponse } from 'next/server'
import { FALLBACK_PACKAGES } from '@/lib/fallback-data'

async function getDb() {
  try {
    const { db } = await import('@/lib/db')
    // Test connection
    await db.package.findFirst()
    return db
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const db = await getDb()
    if (!db) {
      return NextResponse.json(FALLBACK_PACKAGES)
    }

    const packages = await db.package.findMany({
      orderBy: { order: 'asc' },
    })

    if (packages.length === 0) {
      return NextResponse.json(FALLBACK_PACKAGES)
    }

    return NextResponse.json(packages)
  } catch (error) {
    console.error('GET packages error:', error)
    return NextResponse.json(FALLBACK_PACKAGES)
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    if (!db) {
      return NextResponse.json({ error: 'Database tidak tersedia di environment ini' }, { status: 503 })
    }

    const body = await request.json()
    const { name, badge, speed, description, price, order } = body

    if (!name || !badge || !speed || !description || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const pkg = await db.package.create({
      data: { name, badge, speed, description, price, order: order ?? 0 },
    })

    return NextResponse.json(pkg, { status: 201 })
  } catch (error) {
    console.error('POST package error:', error)
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
  }
}
