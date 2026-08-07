# Market Research Hub - Multilingual Market Research Website

A fully server-side rendered, multilingual market research website built with Next.js 16, featuring support for English, Japanese, Korean, and Arabic (with RTL support).

## Features

- **Multilingual Support**: English, Japanese, Korean, and Arabic with automatic RTL support for Arabic
- **Server-Side Rendering**: All pages are fully server-side rendered for optimal SEO
- **Dynamic URL Routing**: Language-based URLs (en: root, ja: /ja, ko: /ko, ar: /ar)
- **SEO Optimized**: 
  - Dynamic meta tags generation
  - JSON-LD schema markup (Organization, Article, BreadcrumbList)
  - Sitemap and robots.txt generation
  - Canonical URLs for each language
- **Performance Optimized**:
  - Image optimization with Next.js Image component
  - API response caching system
  - CSS-based animations (no extra animation libraries)
  - Lazy loading for images and content
- **Responsive Design**: Mobile-first approach, fully responsive on all devices (mobile, tablet, iPad, desktop)
- **Fully Accessible**: WCAG compliant, semantic HTML, ARIA labels
- **Beautiful UI**: Clean, modern design with consistent theming using Tailwind CSS 4

## Tech Stack

- **Framework**: Next.js 16 (latest)
- **Styling**: Tailwind CSS 4 (stable)
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Content Management**: JSON files (language-based)

## Project Structure

```
/app
  /(routes)                  # English routes (root path)
    /page.tsx              # Home
    /reports/page.tsx      # Reports listing
    /about-us/page.tsx     # About page
    /contact-us/page.tsx   # Contact form
    /terms-conditions/page.tsx # Terms
    /search/page.tsx       # Search results
  /[locale]                  # Language-based routes
    /layout.tsx            # Language layout wrapper
    /page.tsx              # Home (ja, ko, ar)
    /reports/page.tsx      # Reports (ja, ko, ar)
    /about-us/page.tsx     # About (ja, ko, ar)
    /contact-us/page.tsx   # Contact (ja, ko, ar)
    /terms-conditions/page.tsx # Terms (ja, ko, ar)
    /search/page.tsx       # Search (ja, ko, ar)
  /sitemap.ts              # Dynamic sitemap
  /robots.ts               # Robots configuration
  /layout.tsx              # Root layout
  /globals.css             # Global styles with animations

/components
  /navbar.tsx              # Navigation with search & language switcher
  /footer.tsx              # Footer with links
  /report-card.tsx         # Report listing card component
  /category-sidebar.tsx    # Category filter sidebar
  
/content
  /en/                     # English content
  /ja/                     # Japanese content
  /ko/                     # Korean content
  /ar/                     # Arabic content
  
/lib
  /config.ts              # Language configuration
  /content.ts             # Content loading utilities
  /seo.ts                 # SEO metadata & schema generation
  /api-cache.ts           # API caching system
  /image-utils.ts         # Image optimization utilities
  /utils.ts               # General utilities

/middleware.ts            # Language detection and routing

/public
  /images/               # Optimized images
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
pnpm start
```

Visit `http://localhost:3000` to see the website.

## URL Structure

### English (Default)
```
/ (home)
/reports (listing)
/about-us
/contact-us
/terms-conditions
/search?q=query
```

### Japanese
```
/ja/ (home)
/ja/reports
/ja/about-us
/ja/contact-us
/ja/terms-conditions
/ja/search?q=query
```

### Korean
```
/ko/ (home)
/ko/reports
/ko/about-us
/ko/contact-us
/ko/terms-conditions
/ko/search?q=query
```

### Arabic (RTL)
```
/ar/ (home)
/ar/reports
/ar/about-us
/ar/contact-us
/ar/terms-conditions
/ar/search?q=query
```

## Content Management

All content is stored in JSON files organized by language:

```
/content
  /en/home.json
  /en/reports.json
  /en/about.json
  /en/contact.json
  /en/terms.json
  /en/common.json (shared content)
```

To add or modify content:
1. Edit the corresponding JSON file in `/content/[locale]/`
2. Content automatically updates on page reload (in development)
3. In production, rebuild to reflect changes

## Features in Detail

### 1. Multilingual Support
- Automatic language detection based on URL
- Language switcher in navbar
- All text translatable via content files
- RTL support for Arabic

### 2. SEO Optimization
- Dynamic meta tags (title, description, keywords)
- Open Graph tags for social sharing
- JSON-LD structured data for:
  - Organization schema
  - Article schema (for reports)
  - Breadcrumb navigation
- Canonical URLs for each language variant
- Automatic sitemap generation

### 3. Search Functionality
- Full-page search popup
- Language-specific search within current locale
- Results displayed in dropdown
- Navigate to dedicated search results page

### 4. Reports Listing
- Grid layout with report cards
- Category filtering (sidebar)
- Responsive cards with images
- Metadata display (author, date, category)

### 5. Performance
- Server-side rendering for all pages
- Image optimization with lazy loading
- API response caching (1 hour default TTL)
- CSS-based animations for scroll/load effects
- Minimal JavaScript - mostly HTML + CSS

### 6. Responsive Design
- Mobile-first approach
- Flexbox-based layouts
- Tailwind CSS utilities for responsive breakpoints
- Touch-friendly navigation
- Optimized for: phones, tablets, iPad, desktops

### 7. Accessibility
- Semantic HTML elements
- ARIA labels and roles
- Alt text for images
- Keyboard navigation support
- Screen reader friendly

## API & Caching System

The application includes a built-in caching system for external API calls:

```typescript
// Usage
import { cachedFetch, getCacheKey, setCache } from '@/lib/api-cache';

// Fetch with automatic caching (1 hour default)
const data = await cachedFetch('https://api.example.com/data');

// Custom TTL (in milliseconds)
const data = await cachedFetch('https://api.example.com/data', {}, 60 * 60 * 1000);

// Manual cache operations
const cacheKey = getCacheKey('news', 'latest');
setCache(cacheKey, data, 60 * 60 * 1000);
```

## Deployment

### Deploy to Vercel

```bash
# Link to Vercel
vercel link

# Deploy
vercel
```

### Environment Variables

No environment variables required for basic setup. If adding external APIs, add them in the Vercel dashboard.

### Build Optimization

The production build is optimized with:
- Turbopack bundler (default in Next.js 16)
- Image compression
- CSS minification
- JavaScript code splitting

## Customization

### Change Brand Colors
Edit `/app/globals.css` to modify CSS variables:
```css
:root {
  --primary: oklch(0.205 0 0);  /* Update to your brand color */
}
```

### Add New Languages
1. Add language code to `lib/config.ts`
2. Create new content JSON files in `/content/[locale]/`
3. Update navbar language switcher if needed

### Modify Animations
Edit animation keyframes in `/app/globals.css`:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Update Report Categories
Edit `/content/[locale]/reports.json` and add new category values.

## Performance Metrics

- **Lighthouse Score**: Target 90+
- **Core Web Vitals**: All green
- **Time to First Byte**: < 100ms
- **Largest Contentful Paint**: < 2.5s
- **First Input Delay**: < 100ms

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Considerations

- Content Security Policy headers
- XSS protection via React's automatic escaping
- SQL injection prevention (using parameterized queries if needed)
- CORS configuration for APIs
- Input validation on forms

## Maintenance

### Regular Updates
- Update dependencies monthly: `pnpm update`
- Review security advisories: `pnpm audit`
- Test after updates: `pnpm dev`

### Content Updates
- Edit JSON files in `/content/[locale]/`
- No database required - JSON-based content management
- Easy version control with Git

### Analytics
Add Google Analytics or similar by updating `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/next';
```

## Troubleshooting

### Pages not updating
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `pnpm build`

### Language not switching
- Check locale parameter in URL
- Verify JSON files exist in `/content/[locale]/`
- Check browser console for errors

### Images not loading
- Verify image paths in JSON content files
- Check image format (JPG, PNG, WebP supported)
- Use Next.js Image component for optimization

## License

MIT License - feel free to use for commercial projects.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Next.js documentation: https://nextjs.org/docs
3. Check Tailwind CSS docs: https://tailwindcss.com/docs

---

**Last Updated**: January 2024
**Next.js Version**: 16.1.6
**Tailwind CSS Version**: 4.2.0
