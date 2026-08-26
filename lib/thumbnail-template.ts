// Business-card style report thumbnail template. The [[title_block]] token
// is replaced at request time in app/report/thumbnail/[file]/route.ts.
export const BUSINESS_CARD_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 561 321" width="1122" height="642">

  <style>
    text {
      font-family: 'Open Sans', 'Noto Sans', 'Segoe UI', Roboto, Arial, Helvetica, sans-serif;
      white-space: pre;
    }
    .c-name  { fill: #333B47; }
    .c-info  { fill: #454F5B; }
    .info    { font-size: 14.2px; font-weight: 400; }
  </style>

  <defs>
    <linearGradient id="g-bg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="561" y2="321">
      <stop offset="0" stop-color="#EEF2F8"/><stop offset="1" stop-color="#E9EEF5"/>
    </linearGradient>
    <linearGradient id="g-badge" gradientUnits="userSpaceOnUse" x1="49" y1="0" x2="49" y2="321">
      <stop offset="0" stop-color="#3D9AEE"/><stop offset="1" stop-color="#2A80DC"/>
    </linearGradient>
    <pattern id="hatch" width="1.35" height="1.35" patternUnits="userSpaceOnUse"
             patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="1.35" stroke="#AEB7C2" stroke-width="0.55"/>
    </pattern>
    <linearGradient id="g-navy_tr" gradientUnits="userSpaceOnUse" x1="531.1" y1="77.4" x2="560.6" y2="67.8">
      <stop offset="0" stop-color="#3F4B60"/><stop offset="1" stop-color="#424D5F"/>
    </linearGradient>
    <linearGradient id="g-gray_mid" gradientUnits="userSpaceOnUse" x1="458.8" y1="235.4" x2="436.9" y2="227.4">
      <stop offset="0" stop-color="#CACACF"/><stop offset="1" stop-color="#C3D7E6"/>
    </linearGradient>
    <linearGradient id="g-navy_mid" gradientUnits="userSpaceOnUse" x1="399.8" y1="231.5" x2="436.2" y2="230.5">
      <stop offset="0" stop-color="#3E4756"/><stop offset="1" stop-color="#3C5373"/>
    </linearGradient>
    <linearGradient id="g-blue_up" gradientUnits="userSpaceOnUse" x1="518.1" y1="200.8" x2="488.9" y2="150.2">
      <stop offset="0" stop-color="#404859"/><stop offset="1" stop-color="#2991F7"/>
    </linearGradient>
    <linearGradient id="g-blue_right" gradientUnits="userSpaceOnUse" x1="571.4" y1="179.2" x2="560.3" y2="172.0">
      <stop offset="0" stop-color="#4290D5"/><stop offset="1" stop-color="#3792EB"/>
    </linearGradient>
    <linearGradient id="g-blue_big" gradientUnits="userSpaceOnUse" x1="528.4" y1="311.4" x2="497.6" y2="238.6">
      <stop offset="0" stop-color="#424958"/><stop offset="1" stop-color="#2899FF"/>
    </linearGradient>
    <linearGradient id="g-blue_bot" gradientUnits="userSpaceOnUse" x1="399.6" y1="332.9" x2="386.0" y2="302.2">
      <stop offset="0" stop-color="#405D7C"/><stop offset="1" stop-color="#2A92F9"/>
    </linearGradient>
    <linearGradient id="g-navy_bl" gradientUnits="userSpaceOnUse" x1="310.1" y1="324.3" x2="348.9" y2="313.2">
      <stop offset="0" stop-color="#415673"/><stop offset="1" stop-color="#3C5B80"/>
    </linearGradient>
    <clipPath id="card"><rect x="0" y="0" width="561" height="321"/></clipPath>
  </defs>

  <g clip-path="url(#card)">
    <rect x="0" y="0" width="561" height="321" fill="url(#g-bg)"/>
    <polygon points="150,0 235,0 105,321 20,321" fill="#FFFFFF" opacity=".38"/>
    <polygon points="300,0 355,0 225,321 170,321" fill="#FFFFFF" opacity=".30"/>
    <polygon points="559.0,148.0 542.5,176.6 509.5,176.6 493.0,148.0 509.5,119.4 542.5,119.4" fill="#F1F4F8"/>
    <polygon points="559.0,148.0 542.5,176.6 509.5,176.6 493.0,148.0 509.5,119.4 542.5,119.4" fill="url(#hatch)"/>
    <polygon points="574.2,72.0 560.9,95.0 534.3,95.0 521.0,72.0 534.3,49.0 560.9,49.0" fill="url(#g-navy_tr)"/>
    <polygon points="467.0,230.0 455.5,249.9 432.5,249.9 421.0,230.0 432.5,210.1 455.5,210.1" fill="url(#g-gray_mid)"/>
    <polygon points="572.0,240.0 552.0,274.6 512.0,274.6 492.0,240.0 512.0,205.4 552.0,205.4" fill="#F1F4F8"/>
    <polygon points="572.0,240.0 552.0,274.6 512.0,274.6 492.0,240.0 512.0,205.4 552.0,205.4" fill="url(#hatch)"/>
    <polygon points="446.0,231.0 432.0,255.2 404.0,255.2 390.0,231.0 404.0,206.8 432.0,206.8" fill="url(#g-navy_mid)"/>
    <polygon points="548.0,175.5 525.8,214.0 481.2,214.0 459.0,175.5 481.2,137.0 525.8,137.0" fill="url(#g-blue_up)"/>
    <polygon points="619.0,186.0 600.5,218.0 563.5,218.0 545.0,186.0 563.5,154.0 600.5,154.0" fill="url(#g-blue_right)"/>
    <polygon points="573.0,275.0 543.0,327.0 483.0,327.0 453.0,275.0 483.0,223.0 543.0,223.0" fill="url(#g-blue_big)"/>
    <polygon points="465.5,344.0 435.0,396.8 374.0,396.8 343.5,344.0 374.0,291.2 435.0,291.2" fill="url(#g-blue_bot)"/>
    <polygon points="359.5,319.0 344.0,345.8 313.0,345.8 297.5,319.0 313.0,292.2 344.0,292.2" fill="url(#g-navy_bl)"/>
    <circle cx="460" cy="197" r="4.4" fill="#CBD1D8"/>
    <circle cx="386" cy="277" r="4.4" fill="#CBD1D8"/>
  </g>

  <polygon points="66.0,177.0 57.5,191.7 40.5,191.7 32.0,177.0 40.5,162.3 57.5,162.3" fill="url(#g-badge)"/>
  <polygon points="66.0,222.7 57.5,237.4 40.5,237.4 32.0,222.7 40.5,208.0 57.5,208.0" fill="url(#g-badge)"/>
  <polygon points="66.0,268.5 57.5,283.2 40.5,283.2 32.0,268.5 40.5,253.8 57.5,253.8" fill="url(#g-badge)"/>

  <g transform="translate(49,177) scale(0.62) translate(-11,-11)" fill="#FFFFFF">
    <path d="M6.6 2.2c.5-.4 1.2-.3 1.6.2l2 2.6c.3.5.3 1.1-.1 1.5L8.7 7.9c.8 1.8 2.2 3.2 4 4l1.4-1.4c.4-.4 1-.5 1.5-.2l2.6 2c.5.4.6 1.1.2 1.6l-1.3 1.6c-.5.6-1.3.8-2 .6C10.4 16.3 5.7 11.6 4.3 6.1c-.2-.7 0-1.5.6-2l1.7-1.9z"/>
  </g>
  <g transform="translate(49,222.7) scale(0.62) translate(-11,-11)"
     fill="none" stroke="#FFFFFF" stroke-width="1.5">
    <circle cx="11" cy="11" r="9"/>
    <ellipse cx="11" cy="11" rx="4" ry="9"/>
    <line x1="2" y1="11" x2="20" y2="11"/>
    <line x1="4" y1="5.6" x2="18" y2="5.6"/>
    <line x1="4" y1="16.4" x2="18" y2="16.4"/>
  </g>
  <g transform="translate(49,268.5) scale(0.62) translate(-11,-11)" fill="#FFFFFF">
    <path d="M11 1.2c-3.9 0-7 3.1-7 7 0 5.2 7 12.6 7 12.6s7-7.4 7-12.6c0-3.9-3.1-7-7-7zm0 9.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2z"/>
  </g>

  <rect x="31.5" y="119.5" width="52.5" height="4.6" fill="#4E88BE"/>

  [[title_block]]

  <text id="phone-1"   x="69.5" y="172.5" class="info c-info">+1-302-846-2799</text>
  <text id="phone-2"   x="69.5" y="188.5" class="info c-info">+49-176-7450-2496</text>
  <text id="website"   x="69.5" y="217.5" class="info c-info">www.bremontstrategy.com</text>
  <text id="email"     x="69.5" y="234.5" class="info c-info">sales@bremontstrategy.com</text>
  <text id="address-1" x="69.5" y="264"   class="info c-info"> 24a Trolley Square, Wilmington,</text>
  <text id="address-2" x="69.5" y="280"   class="info c-info">Delaware, 19801, USA</text>

</svg>`;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Mirrors the backend's build_wrapped_left_text() helper: greedy word-wrap
// using an average-character-width heuristic, left-anchored, capped at
// maxLines (with an ellipsis on the last line if it still overflows).
export function buildWrappedLeftText(
  text: string,
  x: number,
  anchorY: number,
  fontFamily: string,
  fontWeight: number,
  fontSize: number,
  maxWidth: number,
  maxLines = 2
): string {
  const avgCharWidth = fontSize * 0.6;
  const maxChars = Math.max(6, Math.floor(maxWidth / avgCharWidth));

  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    } else {
      current = candidate;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }
  const last = lines[lines.length - 1] || '';
  if (last.length > maxChars) {
    lines[lines.length - 1] = `${last.slice(0, Math.max(0, maxChars - 1))}…`;
  }

  const lineHeight = fontSize * 1.3;
  const tspans = lines
    .map((line, i) => {
      const y = Math.round((anchorY + i * lineHeight) * 100) / 100;
      return `<tspan x="${x}" y="${y}">${escapeXml(line)}</tspan>`;
    })
    .join('');

  return `<text text-anchor="start" font-family="${fontFamily}" font-weight="${fontWeight}" font-size="${fontSize}">${tspans}</text>`;
}
