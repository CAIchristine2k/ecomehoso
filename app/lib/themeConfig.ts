// Theme configuration system for Hydrogen - Hoso Matcha themed
import type {LandingPageConfig} from '~/utils/config';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export type BrandStyle =
  | 'luxury'
  | 'sporty'
  | 'casual'
  | 'technical'
  | 'minimalist'
  | 'vibrant'
  | 'custom';

export interface ThemeConfig {
  colors: ThemeColors;
  brandName: string;
  brandStyle: BrandStyle;
  brandLogo: string;
  influencerName: string;
  influencerTitle?: string;
  influencerImage?: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    facebook?: string;
    website?: string;
  };
}

// Predefined color schemes - all updated for Hoso Matcha
export const colorSchemes: Record<
  Exclude<BrandStyle, 'custom'>,
  ThemeColors
> = {
  luxury: {
    primary: '#3d6b4f', // Matcha green
    secondary: '#f5f0e6', // Warm cream
    accent: '#c9a55c', // Gold accent
    background: '#f5f0e6', // Cream background
    text: '#1a1a18', // Charcoal text
  },
  minimalist: {
    primary: '#3d6b4f',
    secondary: '#f5f0e6',
    accent: '#c9a55c',
    background: '#faf8f3',
    text: '#1a1a18',
  },
  sporty: {
    primary: '#3d6b4f',
    secondary: '#f5f0e6',
    accent: '#c9a55c',
    background: '#f5f0e6',
    text: '#1a1a18',
  },
  casual: {
    primary: '#5a8a6a',
    secondary: '#f5f0e6',
    accent: '#d4b87a',
    background: '#faf8f3',
    text: '#2a2a28',
  },
  technical: {
    primary: '#3d6b4f',
    secondary: '#f5f0e6',
    accent: '#c9a55c',
    background: '#f5f0e6',
    text: '#1a1a18',
  },
  vibrant: {
    primary: '#3d6b4f',
    secondary: '#f5f0e6',
    accent: '#c9a55c',
    background: '#f5f0e6',
    text: '#1a1a18',
  },
};

// Default theme configuration - Hoso Matcha
const defaultTheme: ThemeConfig = {
  colors: colorSchemes.luxury,
  brandName: 'HOSO MATCHA',
  brandStyle: 'luxury',
  brandLogo: '/images/logo.png',
  influencerName: 'Hoso Matcha',
  influencerTitle: 'Matcha Premium depuis Uji, Kyoto',
  influencerImage: '/images/hero-background.jpg',
  socialLinks: {
    instagram: 'https://www.instagram.com/hosobasqueparis_/',
  },
};

// Current theme state
let currentTheme: ThemeConfig = {...defaultTheme};

// Helper functions to customize theme
export function setTheme(newTheme: Partial<ThemeConfig>): void {
  currentTheme = {...currentTheme, ...newTheme};

  if (
    newTheme.brandStyle &&
    newTheme.brandStyle !== 'custom' &&
    newTheme.brandStyle in colorSchemes
  ) {
    currentTheme.colors =
      colorSchemes[newTheme.brandStyle as Exclude<BrandStyle, 'custom'>];
  }

  if (typeof document !== 'undefined') {
    updateCssVariables(currentTheme.colors);
  }
}

// Set only the color theme
export function setColorTheme(style: BrandStyle | ThemeColors): void {
  if (typeof style === 'string') {
    if (style !== 'custom' && style in colorSchemes) {
      currentTheme.colors =
        colorSchemes[style as Exclude<BrandStyle, 'custom'>];
      currentTheme.brandStyle = style;
    }
  } else if (typeof style === 'object') {
    currentTheme.colors = {...currentTheme.colors, ...style};
    currentTheme.brandStyle = 'custom';
  }

  if (typeof document !== 'undefined') {
    updateCssVariables(currentTheme.colors);
  }
}

// Update CSS custom properties based on theme colors
function updateCssVariables(colors: ThemeColors): void {
  const root = document.documentElement;

  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-text', colors.text);

  root.style.setProperty(
    '--color-primary-50',
    adjustColorBrightness(colors.primary, 0.85),
  );
  root.style.setProperty(
    '--color-primary-100',
    adjustColorBrightness(colors.primary, 0.7),
  );
  root.style.setProperty(
    '--color-primary-200',
    adjustColorBrightness(colors.primary, 0.55),
  );
  root.style.setProperty(
    '--color-primary-300',
    adjustColorBrightness(colors.primary, 0.4),
  );
  root.style.setProperty(
    '--color-primary-400',
    adjustColorBrightness(colors.primary, 0.2),
  );
  root.style.setProperty('--color-primary-500', colors.primary);
  root.style.setProperty(
    '--color-primary-600',
    adjustColorBrightness(colors.primary, -0.2),
  );
  root.style.setProperty(
    '--color-primary-700',
    adjustColorBrightness(colors.primary, -0.4),
  );
  root.style.setProperty(
    '--color-primary-800',
    adjustColorBrightness(colors.primary, -0.6),
  );
  root.style.setProperty(
    '--color-primary-900',
    adjustColorBrightness(colors.primary, -0.8),
  );

  root.style.setProperty(
    '--color-secondary-50',
    adjustColorBrightness(colors.secondary, 0.85),
  );
  root.style.setProperty(
    '--color-secondary-100',
    adjustColorBrightness(colors.secondary, 0.7),
  );
  root.style.setProperty(
    '--color-secondary-200',
    adjustColorBrightness(colors.secondary, 0.55),
  );
  root.style.setProperty(
    '--color-secondary-300',
    adjustColorBrightness(colors.secondary, 0.4),
  );
  root.style.setProperty(
    '--color-secondary-400',
    adjustColorBrightness(colors.secondary, 0.2),
  );
  root.style.setProperty('--color-secondary-500', colors.secondary);
  root.style.setProperty(
    '--color-secondary-600',
    adjustColorBrightness(colors.secondary, -0.2),
  );
  root.style.setProperty(
    '--color-secondary-700',
    adjustColorBrightness(colors.secondary, -0.4),
  );
  root.style.setProperty(
    '--color-secondary-800',
    adjustColorBrightness(colors.secondary, -0.6),
  );
  root.style.setProperty(
    '--color-secondary-900',
    adjustColorBrightness(colors.secondary, -0.8),
  );
}

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, factor: number): string {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  r = Math.min(255, Math.max(0, Math.round(r + factor * 255)));
  g = Math.min(255, Math.max(0, Math.round(g + factor * 255)));
  b = Math.min(255, Math.max(0, Math.round(b + factor * 255)));

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Helper function to convert hex to RGB
export function hexToRgb(hex: string): string {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

// CSS variables for easy access in components
export const cssVars = {
  get primary() {
    if (typeof document === 'undefined') return currentTheme.colors.primary;
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary')
        .trim() || currentTheme.colors.primary
    );
  },
  get secondary() {
    if (typeof document === 'undefined') return currentTheme.colors.secondary;
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-secondary')
        .trim() || currentTheme.colors.secondary
    );
  },
  get accent() {
    if (typeof document === 'undefined') return currentTheme.colors.accent;
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim() || currentTheme.colors.accent
    );
  },
  get background() {
    if (typeof document === 'undefined') return currentTheme.colors.background;
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-background')
        .trim() || currentTheme.colors.background
    );
  },
  get text() {
    if (typeof document === 'undefined') return currentTheme.colors.text;
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-text')
        .trim() || currentTheme.colors.text
    );
  },
};

// Initialize theme from config
export function initThemeFromConfig(config: LandingPageConfig): void {
  setTheme({
    brandName: config.brandName,
    brandStyle: config.brandStyle,
    brandLogo: config.brandLogo,
    influencerName: config.influencerName,
    influencerTitle: config.influencerTitle,
    influencerImage: config.influencerImage,
    socialLinks: config.socialLinks,
  });

  if (config.layout && typeof document !== 'undefined') {
    updateLayoutVariables(config.layout);
  }
}

// Update layout CSS variables from config
function updateLayoutVariables(layout: LandingPageConfig['layout']): void {
  if (!layout || typeof document === 'undefined') return;

  const root = document.documentElement;
  if (layout.cart) {
    root.style.setProperty('--cart-width-mobile', layout.cart.width.mobile);
    root.style.setProperty('--cart-width-tablet', layout.cart.width.tablet);
    root.style.setProperty('--cart-width-desktop', layout.cart.width.desktop);
    root.style.setProperty(
      '--cart-max-width-mobile',
      layout.cart.maxWidth.mobile,
    );
    root.style.setProperty(
      '--cart-max-width-tablet',
      layout.cart.maxWidth.tablet,
    );
    root.style.setProperty(
      '--cart-max-width-desktop',
      layout.cart.maxWidth.desktop,
    );
    root.style.setProperty('--cart-min-width', layout.cart.minWidth);
    root.style.setProperty(
      '--cart-items-max-height',
      layout.cart.itemsAreaMaxHeight,
    );
    root.style.setProperty(
      '--cart-items-min-height',
      layout.cart.itemsAreaMinHeight,
    );
    root.style.setProperty(
      '--cart-summary-min-height',
      layout.cart.summaryMinHeight,
    );
  }

  if (layout.header) {
    root.style.setProperty(
      '--header-height-mobile',
      layout.header.height.mobile,
    );
    root.style.setProperty(
      '--header-height-desktop',
      layout.header.height.desktop,
    );
  }

  if (layout.spacing) {
    root.style.setProperty(
      '--container-padding',
      layout.spacing.containerPadding,
    );
    root.style.setProperty('--section-spacing', layout.spacing.sectionSpacing);
    root.style.setProperty('--card-spacing', layout.spacing.cardSpacing);
  }
}

// Initialize theme on app startup
export function initializeTheme(): void {
  if (typeof document !== 'undefined') {
    updateCssVariables(currentTheme.colors);

    const root = document.documentElement;
    root.style.setProperty(
      '--color-primary-rgb',
      hexToRgb(currentTheme.colors.primary),
    );
    root.style.setProperty(
      '--color-secondary-rgb',
      hexToRgb(currentTheme.colors.secondary),
    );
  }
}

// Get current theme
export function getTheme(): ThemeConfig {
  return currentTheme;
}

// Get theme colors for CSS
export function getThemeColors(): ThemeColors {
  return currentTheme.colors;
}

export default currentTheme;
