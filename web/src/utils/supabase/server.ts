import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // In Next.js App Router, we should ONLY set cookies in Middleware or Server Actions.
          // In Server Components, we let this fail silently because the Middleware handles the refresh.
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This is expected in Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // This is expected in Server Components
          }
        },
      },
    }
  )
}
