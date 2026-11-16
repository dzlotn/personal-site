// Returns 410 Gone for removed URLs (see rewrites in vercel.json) so search
// engines drop them instead of receiving the SPA's index.html with a 200.
// eslint-disable-next-line import/prefer-default-export
export function GET() {
  return new Response('Gone', {
    status: 410,
    headers: { 'Content-Type': 'text/plain', 'X-Robots-Tag': 'noindex' },
  });
}
