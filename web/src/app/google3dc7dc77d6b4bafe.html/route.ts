export const dynamic = 'force-static'

export function GET() {
  const content = 'google-site-verification: google3dc7dc77d6b4bafe.html'
  return new Response(content, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
