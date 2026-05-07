const trackers = new Map<string, { count: number; lastReset: number }>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const tracker = trackers.get(key);

  if (!tracker || now - tracker.lastReset > windowMs) {
    trackers.set(key, { count: 1, lastReset: now });
    return false;
  }

  if (tracker.count >= limit) {
    return true;
  }

  tracker.count++;
  return false;
}
