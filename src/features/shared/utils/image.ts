const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3E Image%3C/text%3E%3C/svg%3E';

export function getImageSrc(src: string): string {
  if (!src || typeof src !== 'string') {
    return PLACEHOLDER_IMAGE;
  }
  return src;
}

export function getImageFallback(): string {
  return PLACEHOLDER_IMAGE;
}
