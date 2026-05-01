import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Create the Supabase client with safe cookie handling (standard SSR pattern)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 2. Refresh session if expired - this is critical for Next.js 13+ Stability
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  
  // 3. Handle double-slash issues (some social trackers cause this)
  if (url.pathname.includes('//')) {
    url.pathname = url.pathname.replace(/\/+/g, '/')
    return NextResponse.redirect(url)
  }

  // 4. Protect Admin Routes
  if (url.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Fetch profile role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
