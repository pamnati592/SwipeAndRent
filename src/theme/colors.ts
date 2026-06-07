// Semantic color tokens for the whole app.
// Every screen consumes these via useTheme() — never hardcode hex values.
// light + dark MUST expose the exact same keys so screens can switch freely.

export type ThemeColors = {
  // --- surfaces (back-to-front elevation) ---
  bg: string;          // screen background            (dark #1a1a1a)
  surface: string;     // headers, tab bar, top bars   (dark #242424 / #1f1f1f / #1e1e1e)
  card: string;        // cards, inputs, chips, modals (dark #2a2a2a)
  cardAlt: string;     // nested / slightly raised card (dark #2e2e2e / #2f2f2f)
  chip: string;        // small pills / icon buttons    (dark #333)

  // --- borders / dividers ---
  border: string;      // default divider               (dark #3a3a3a / #333)
  borderStrong: string;// emphasized border             (dark #444 / #4a4a4a)

  // --- text ---
  text: string;          // primary text                (dark #fff)
  textSecondary: string; // secondary text              (dark #aaa)
  textMuted: string;     // muted / captions            (dark #888)
  textFaint: string;     // disabled / placeholders     (dark #666 / #555)

  // --- primary action button (high-contrast pill) ---
  btn: string;        // button background  (dark #fff -> light dark pill)
  btnText: string;    // text/icon on btn   (dark #000 -> light #fff)

  // --- brand / accents ---
  primary: string;       // links / blue accent         (dark #4da6ff)
  primarySoft: string;   // tint of primary             (dark #cce0ff)
  accent: string;        // AI / purple                 (dark #8b5cf6)
  accentSoft: string;    // lighter purple              (dark #a78bfa)
  warning: string;       // amber / stars               (dark #f0a500 / #f59e0b)
  danger: string;        // destructive / errors        (dark #f44336)
  dangerSoft: string;    // softer red                  (dark #e57373)
  success: string;       // confirmations               (dark #4cd964 / #4caf50)

  // --- subtle status backgrounds (badges / banners) ---
  successBg: string;   // (dark #1a3a1a / #1a2a1a / #0a2a1a)
  warningBg: string;   // (dark #3a2a00)
  dangerBg: string;    // (dark #3a0a0a / #2a1a1a / #3a1a2a)
  infoBg: string;      // (dark #0a1a4a / #0a1a2a / #1e2a3a / #2a4a6a)

  // --- misc ---
  overlay: string;     // modal scrim                   (rgba(0,0,0,0.6))
  overlayStrong: string;
  scrimText: string;   // text over photos / dark scrim (always light)
  white: string;       // literal white (e.g. white badge text)
  black: string;       // literal black
  star: string;        // rating star (== warning)
};

export const darkColors: ThemeColors = {
  bg: '#1a1a1a',
  surface: '#242424',
  card: '#2a2a2a',
  cardAlt: '#2e2e2e',
  chip: '#333',

  border: '#3a3a3a',
  borderStrong: '#4a4a4a',

  text: '#fff',
  textSecondary: '#aaa',
  textMuted: '#888',
  textFaint: '#666',

  btn: '#fff',
  btnText: '#000',

  primary: '#4da6ff',
  primarySoft: '#cce0ff',
  accent: '#8b5cf6',
  accentSoft: '#a78bfa',
  warning: '#f0a500',
  danger: '#f44336',
  dangerSoft: '#e57373',
  success: '#4cd964',

  successBg: '#1a3a1a',
  warningBg: '#3a2a00',
  dangerBg: '#3a0a0a',
  infoBg: '#0a1a4a',

  overlay: 'rgba(0,0,0,0.6)',
  overlayStrong: 'rgba(0,0,0,0.7)',
  scrimText: '#fff',
  white: '#fff',
  black: '#000',
  star: '#f0a500',
};

export const lightColors: ThemeColors = {
  bg: '#f2f2f7',
  surface: '#ffffff',
  card: '#ffffff',
  cardAlt: '#f7f7fa',
  chip: '#ececf1',

  border: '#e2e2e8',
  borderStrong: '#cfcfd6',

  text: '#16181d',
  textSecondary: '#5b5e66',
  textMuted: '#82858d',
  textFaint: '#a6a9b0',

  btn: '#16181d',
  btnText: '#ffffff',

  primary: '#0a84ff',
  primarySoft: '#dbeafe',
  accent: '#7c3aed',
  accentSoft: '#a78bfa',
  warning: '#c77700',
  danger: '#dc2626',
  dangerSoft: '#ef5350',
  success: '#1f9d4d',

  successBg: '#e6f6ec',
  warningBg: '#fdf2dd',
  dangerBg: '#fdecea',
  infoBg: '#e7f0ff',

  overlay: 'rgba(0,0,0,0.4)',
  overlayStrong: 'rgba(0,0,0,0.55)',
  scrimText: '#fff',
  white: '#fff',
  black: '#000',
  star: '#f5a623',
};

export type ThemeMode = 'light' | 'dark';

export const palettes: Record<ThemeMode, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};
