import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

const horizontalShimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

// Vertical shimmer
const verticalShimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="vg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="vr" width="${w}" height="${h}" fill="url(#vg)" />
  <animateTransform xlink:href="#vr" attributeName="transform" type="translate" 
    values="0,-${h};0,0;0,${h}" dur="1.5s" repeatCount="indefinite" />
</svg>`;

// Pulse effect
const pulseShimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="rg">
      <stop stop-color="#444" offset="0%" />
      <stop stop-color="#222" offset="100%" />
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#rg)">
    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
  </rect>
</svg>`;

// Wave shimmer
const waveShimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wg" gradientUnits="userSpaceOnUse">
      <stop stop-color="#333" offset="0%" />
      <stop stop-color="#555" offset="50%" />
      <stop stop-color="#333" offset="100%" />
      <animateTransform attributeName="gradientTransform" type="translate" 
        values="-${w * 2} 0;${w * 2} 0;-${
    w * 2
} 0" dur="3s" repeatCount="indefinite" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#wg)" />
</svg>`;

// Diagonal shimmer
const diagonalShimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dg" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop stop-color="#333" offset="0%" />
      <stop stop-color="#666" offset="50%" />
      <stop stop-color="#333" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect width="${w}" height="${h}" fill="url(#dg)">
    <animateTransform attributeName="transform" type="translate" 
      values="-${w} -${h};${w} ${h}" dur="1.5s" repeatCount="indefinite" />
  </rect>
</svg>`;

const shimmers = {
    horizontal: horizontalShimmer,
    vertical: verticalShimmer,
    pulse: pulseShimmer,
    wave: waveShimmer,
    diagonal: diagonalShimmer,
};

const toBase64 = (str: string) =>
    typeof window === "undefined"
        ? Buffer.from(str).toString("base64")
        : window.btoa(str);

export const shimmerBase64 = (w: number, h: number) =>
    toBase64(shimmers.wave(w, h));

export const shimmerDataUrl = (w: number, h: number) =>
    `data:image/svg+xml;base64,${shimmerBase64(w, h)}` as PlaceholderValue;
