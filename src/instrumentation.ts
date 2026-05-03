export async function register() {
  // Auto-seed database on app startup
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { autoSeed } = await import('@/app/api/seed/route')
      await autoSeed()
      console.log('[instrumentation] Auto-seed completed')
    } catch (error) {
      console.error('[instrumentation] Auto-seed failed:', error)
    }
  }
}
