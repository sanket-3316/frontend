/**
 * Image optimization utilities for fast loading and responsive images
 */

export interface ImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

export function getImageProps(config: ImageConfig) {
  return {
    src: config.src,
    alt: config.alt,
    width: config.width || 1200,
    height: config.height || 600,
    priority: config.priority || false,
    fill: config.fill || false,
    sizes: config.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  };
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(basePath: string, widths: number[] = [320, 640, 1024, 1280, 1920]) {
  return widths.map((width) => {
    const ext = basePath.split('.').pop();
    const baseName = basePath.substring(0, basePath.lastIndexOf('.'));
    return `${baseName}_${width}w.${ext} ${width}w`;
  }).join(', ');
}

/**
 * Optimize image loading with placeholder
 */
export function getImagePlaceholder(src: string): string {
  // Return a low-quality placeholder image (LQIP)
  // In a real implementation, this would generate a blurred version
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3C/svg%3E`;
}

/**
 * Lazy load images on intersection
 */
export function observeImageLoading() {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}
