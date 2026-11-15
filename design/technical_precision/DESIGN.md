---
name: Technical Precision
colors:
  surface: '#fbf8ff'
  surface-dim: '#d8d8eb'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2ff'
  surface-container: '#edecff'
  surface-container-high: '#e7e7fa'
  surface-container-highest: '#e1e1f4'
  on-surface: '#191b28'
  on-surface-variant: '#474555'
  inverse-surface: '#2e2f3e'
  inverse-on-surface: '#f0efff'
  outline: '#777587'
  outline-variant: '#c8c4d8'
  surface-tint: '#5141e6'
  primary: '#422cd8'
  on-primary: '#ffffff'
  primary-container: '#5b4cf0'
  on-primary-container: '#e8e4ff'
  inverse-primary: '#c4c0ff'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#7ff3e1'
  on-secondary-container: '#006f64'
  tertiary: '#714600'
  on-tertiary: '#ffffff'
  tertiary-container: '#925c00'
  on-tertiary-container: '#ffe3c6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c0ff'
  on-primary-fixed: '#130068'
  on-primary-fixed-variant: '#381dcf'
  secondary-fixed: '#82f6e4'
  secondary-fixed-dim: '#63d9c8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#fbf8ff'
  on-background: '#191b28'
  surface-variant: '#e1e1f4'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system targets developers, engineering leads, and technical professionals who value clarity, density, and intellectual rigor. The aesthetic blends the crisp utility of developer platforms like Linear and Vercel with the didactic elegance of Stripe Documentation and Brilliant.

The visual style is **Contemporary Technical Precision**:
- High micro-contrast paired with restrained macroscopic compositions.
- Sub-pixel borders, structured grids, and strict typography rules that minimize cognitive friction.
- Tactile feedback through crisp borders and micro-interactions rather than heavy dimensionality.
- An environment that feels authoritative, focused, and distraction-free.

## Colors
The color palette anchors technical learning through chromatic clarity and functional semiotics.

### Light Mode (Default)
- **Primary Canvas**: `#F7F7FB` (cool, faintly tinted technical slate).
- **Surface Elevation 1 (Cards, Code containers)**: `#FFFFFF`.
- **Primary Brand**: `#5B4CF0` (vibrant indigo, signaling focus and forward movement).
- **Secondary / Success**: `#0F9F8F` (deep teal, signaling validated logic and code passing).
- **Tertiary / Warning**: `#F59E0B` (amber, signaling operational cautions and hints).
- **Error / Destructive**: `#EF4444` (soft red, signaling failing syntax or failed tests).
- **Border Subtle**: `#E2E4ED`.
- **Text Primary**: `#121421`.
- **Text Muted**: `#646982`.

### Dark Mode
- **Primary Canvas**: `#0D0F1A`.
- **Surface Elevation 1**: `#151827`.
- **Primary Brand (Lightened for WCAG AA)**: `#8B7FFB`.
- **Secondary / Success**: `#14B8A6`.
- **Tertiary / Warning**: `#FBBF24`.
- **Error / Destructive**: `#F87171`.
- **Border Subtle**: `#22273D`.
- **Text Primary**: `#F1F3F9`.
- **Text Muted**: `#9096B2`.

## Typography
Typography reflects high-density developer interfaces. 

- **Headlines & Body**: Set in `Inter`. Headings feature negative letter-spacing (`-0.015em` to `-0.03em`) and heavy weights (`600`, `700`) to evoke technical authority and intentional structure.
- **Code & Metadata**: Set in `JetBrains Mono`. Monospace scales preserve visual alignment across parameters, keyboard shortcuts, status metrics, and syntax blocks.
- **Hierarchy Rules**: Long-form instructional passages use `body-lg` at 26px line height for optimal readability. Dense parameter tables, sidebars, and course directory trees step down to `body-md` and `body-sm`.

## Layout & Spacing
The layout follows an asymmetric 3-column architecture designed for technical deep-dives and modular documentation:

- **Left Rail (Index / Hierarchy)**: Fixed width (260px–300px), collapsible, hosts module navigation and lesson state.
- **Center Canvas (Reading / Execution)**: Dynamic fluid column with a strict max-width of 768px for continuous reading comfort.
- **Right Rail (Progress / Meta / Sandboxes)**: Fixed width (280px–320px), displays chapter completion metrics, outline anchors, and live sandbox triggers.

### Responsiveness
- **Desktop (>= 1280px)**: Full 3-column view with independent vertical scrolling for navigation rails.
- **Tablet (768px – 1279px)**: Right rail collapses into top meta pills; left rail becomes an off-canvas drawer.
- **Mobile (< 768px)**: Single-column stack. Content occupies full width with `margin-mobile` (1rem). Navigation moves to a sticky bottom action bar and header menu.

## Elevation & Depth
Depth relies on crisp borders and ambient light drops:

- **Surface Treatment**: Never float elements in total void. Every card, menu, or sandbox block features a 1px solid border (`#E2E4ED` in light mode, `#22273D` in dark mode).
- **Ambient Shadows**:
  - `elevation-card`: `0 1px 3px 0 rgba(18, 20, 33, 0.04), 0 1px 2px -1px rgba(18, 20, 33, 0.04)`
  - `elevation-hover`: `0 8px 16px -4px rgba(91, 76, 240, 0.06), 0 2px 4px -2px rgba(18, 20, 33, 0.04)`
  - `elevation-dropdown`: `0 12px 24px -6px rgba(18, 20, 33, 0.08), 0 4px 6px -2px rgba(18, 20, 33, 0.03)`
- **Glassmorphism Usage**: Reserved strictly for sticky navigation headers and floating contextual banners (`backdrop-filter: blur(12px)` over 80% opaque surface tokens).

## Shapes
Primary cards use an explicit `1rem` (16px) corner radius to soften dense technical interfaces without appearing toy-like:
- **Cards, Code Panels, Callout Banners**: `rounded-lg` (16px).
- **Buttons, Form Inputs, Chapter Badges**: `rounded` (8px).
- **Progress Trackers & Floating Badges**: Full pills (`rounded-full` / 9999px).

## Components

### 1. Buttons
- **Primary**: Background `#5B4CF0`, text `#FFFFFF`, border none, 8px radius. Hover: `#4A3CCF`. Active: micro-scale to `0.99`.
- **Secondary**: Surface transparent, border 1px solid `#E2E4ED`, text `#121421`. Hover: background `#F1F2F8`.
- **Ghost / Icon**: Pure icon with 8px padding, text `#646982`, hover text `#121421`.

### 2. Status Badges (Chapter States)
Monospace text (`label-sm`), 6px vertical padding, 10px horizontal padding, 6px radius:
- **Completed**: `#E6F7F5` background, `#0F9F8F` text, border 1px solid `#A4E7DF`. Format: `[✓ Validé • 98%]`.
- **In Progress**: `#EEECFD` background, `#5B4CF0` text, border 1px solid `#C7C1FA`. Format: `[● En cours]`.
- **Not Started**: `#F1F2F8` background, `#646982` text, border 1px solid `#E2E4ED`. Format: `[○ À commencer]`.
- **Locked**: `#F7F7FB` background, `#9096B2` text, border 1px dashed `#D0D3E2`. Format: `[🔒 Verrouillé]`.

### 3. Didactic Callouts (Encadrés Pédagogiques)
Full-width containers with a 16px radius, 16px padding, and a 4px solid left border accent:
- **Tip (Conseil)**: Border left `#5B4CF0`, background `rgba(91, 76, 240, 0.04)`. Icon: Lightbulb.
- **Note (À noter)**: Border left `#0F9F8F`, background `rgba(15, 159, 143, 0.04)`. Icon: Info.
- **Important**: Border left `#F59E0B`, background `rgba(245, 158, 11, 0.05)`. Icon: Alert Triangle.
- **Warning (Attention)**: Border left `#EF4444`, background `rgba(239, 68, 68, 0.05)`. Icon: Shield Alert.

### 4. Code Blocks & Playgrounds
- Header bar: 40px height, background `#0F111E`, top 16px radius, displaying file type in `code-sm` and a "Copier" button that flips to "Copié !" with feedback.
- Body: Monospace syntax highlighting (dark theme default), line numbers in `#4E5572`, 16px horizontal and vertical padding.
- Bottom corner actions: Optional "Run code" or "Replier" anchors.

### 5. Expandable Solution Panels
- Container: Border 1px solid `#E2E4ED`, background `#FFFFFF`, 16px radius.
- Header: Clickable button spanning 100% width with a chevron indicator (`Transform: rotate(180deg)` on open) and title "Voir la solution".
- Reveal: Smooth vertical accordion transition exposing annotated answer code and explanation.

### 6. Progress Bars
- Track: Height 6px, background `#E2E4ED`, radius 9999px.
- Fill: Linear gradient from `#5B4CF0` to `#0F9F8F`, smoothly animated on chapter validation.