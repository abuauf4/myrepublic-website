import { NextRequest, NextResponse } from 'next/server'
import { FALLBACK_PACKAGES } from '@/lib/fallback-data'

async function getDb() {
  try {
    const { db } = await import('@/lib/db')
    await db.package.findFirst()
    return db
  } catch {
    return null
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDb()
    if (!db) {
      const pkg = FALLBACK_PACKAGES.find(p => p.id === id)
      if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 })
      return NextResponse.json(pkg)
    }

    const pkg = await db.package.findUnique({ where: { id } })
    if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    return NextResponse.json(pkg)
  } catch (error) {
    console.error('GET package error:', error)
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDb()
    if (!db) {
      return NextResponse.json({ error: 'Database tidak tersedia' }, { status: 503 })
    }

    const body = await request.json()
    const { name, badge, speed, description, price, order } = body

    const pkg = await db.package.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(badge !== undefined && { badge }),
        ...(speed !== undefined && { speed }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json(pkg)
  } catch (error) {
    console.error('PUT package error:', error)
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDb()
    if (!db) {
      return NextResponse.json({ error: 'Database tidak tersedia' }, { status: 503 })
    }

    await db.package.delete({ where: { id } })
    return NextResponse.json({ message: 'Package deleted successfully' })
  } catch (error) {
    console.error('DELETE package error:', error)
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 })
  }
}
