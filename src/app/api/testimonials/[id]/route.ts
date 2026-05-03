import { NextRequest, NextResponse } from 'next/server'

async function getDb() {
  try {
    const { db } = await import('@/lib/db')
    await db.testimonial.findFirst()
    return db
  } catch {
    return null
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
    const { name, role, content, rating, avatar, order } = body

    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(content !== undefined && { content }),
        ...(rating !== undefined && { rating }),
        ...(avatar !== undefined && { avatar }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('PUT testimonial error:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
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

    await db.testimonial.delete({ where: { id } })
    return NextResponse.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    console.error('DELETE testimonial error:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
