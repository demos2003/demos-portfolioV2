// Best-effort, in-memory sliding-window limiter. It lives in the server
// process, so on serverless hosting each instance keeps its own counts: it
// slows down casual abuse but is not a hard guarantee. Swap for a shared store
// (e.g. a Supabase table or Upstash) if Demi starts getting real traffic.
const buckets = new Map<string, number[]>()

export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)

  if (recent.length >= limit) {
    buckets.set(key, recent)
    return false
  }

  recent.push(now)
  buckets.set(key, recent)

  // Keep the map from growing without bound.
  if (buckets.size > 5000) {
    for (const [k, times] of buckets) {
      if (times.every((t) => now - t >= windowMs)) buckets.delete(k)
    }
  }
  return true
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return (
    request.headers.get("x-nf-client-connection-ip") ||
    forwarded ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
}
