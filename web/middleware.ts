import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // 1. Handle double-slash issues (some social trackers cause this)
  if (url.pathname.includes('//')) {
    url.pathname = url.pathname.replace(/\/+/g, '/')
    return NextResponse.redirect(url)
  }

  // 2. Protect Admin Routes
  if (url.pathname.startsWith('/admin')) {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log('Middleware: No user found or error:', userError)
      return NextResponse.redirect(new URL('/', request.url))
    }

    console.log('Middleware: User found:', user.email, user.id)

    // Fetch profile role from public.profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Middleware: Profile fetch error:', profileError)
    }

    console.log('Middleware: Profile data:', profile)

    if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    console.log('Middleware: Authorized access to:', url.pathname)
  }

  return NextResponse.next()
}

// Ensure it runs on all routes except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
