import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// NO "default export" here! Only named "GET"
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'
  
  // Reconstruct origin based on headers to support local network IPs (like 172.x.x.x)
  const host = request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') || host?.includes('127.0.0.1') || host?.startsWith('172.') ? 'http' : 'https')
  const origin = `${protocol}://${host}`

  if (code) {
    const cookieStore = await cookies() // Await this for Next.js 15
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to homepage even on error
  return NextResponse.redirect(`${origin}/`)
}
