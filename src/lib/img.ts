/**
 * Optimize Unsplash image URLs (and pass through others unchanged).
 * Returns a single src + a srcSet for responsive loading.
 */
export function unsplashSrc(url: string | null | undefined, width = 720, quality = 70): string {
  if (!url) return "/placeholder.svg";
  if (!url.includes("images.unsplash.com")) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("w", String(width));
    u.searchParams.set("q", String(quality));
    u.searchParams.set("auto", "format");
    u.searchParams.set("fit", "crop");
    return u.toString();
  } catch {
    return url;
  }
}

export function unsplashSrcSet(url: string | null | undefined, widths = [400, 720, 1080]): string | undefined {
  if (!url || !url.includes("images.unsplash.com")) return undefined;
  return widths.map((w) => `${unsplashSrc(url, w)} ${w}w`).join(", ");
}
