import { NextRequest, NextResponse } from 'next/server'

// Sales config stored in memory (persisted via database when available)
// Falls back to default values
let salesConfig = {
  name: 'Sales MyRepublic',
  whatsapp: '6281234567890',
  greeting: 'Halo, saya tertarik dengan paket internet MyRepublic',
}

async function getDb() {
  try {
    const { db } = await import('@/lib/db')
    // Check if SalesConfig model exists by trying to query it
    await db.$queryRaw`SELECT 1`
    return db
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const db = await getDb()
    if (db) {
      try {
        // Try to read from DB if SalesConfig table exists
        const result = await db.$queryRaw`SELECT * FROM SalesConfig LIMIT 1` as any[]
        if (result && result.length > 0) {
          salesConfig = {
            name: result[0].name || salesConfig.name,
            whatsapp: result[0].whatsapp || salesConfig.whatsapp,
            greeting: result[0].greeting || salesConfig.greeting,
          }
        }
      } catch {
        // Table doesn't exist yet, use memory/defaults
      }
    }
    return NextResponse.json(salesConfig)
  } catch {
    return NextResponse.json(salesConfig)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, whatsapp, greeting } = body

    if (name) salesConfig.name = name
    if (whatsapp) salesConfig.whatsapp = whatsapp
    if (greeting) salesConfig.greeting = greeting

    // Try to persist to database
    const db = await getDb()
    if (db) {
      try {
        await db.$executeRaw`DELETE FROM SalesConfig`
        await db.$executeRaw`INSERT INTO SalesConfig (id, name, whatsapp, greeting) VALUES ('default', ${salesConfig.name}, ${salesConfig.whatsapp}, ${salesConfig.greeting})`
      } catch {
        // Table doesn't exist, keep in memory only
      }
    }

    return NextResponse.json(salesConfig)
  } catch (error) {
    console.error('POST sales config error:', error)
    return NextResponse.json({ error: 'Failed to update sales config' }, { status: 500 })
  }
}
