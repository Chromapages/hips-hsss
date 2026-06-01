# H.I.P.S. Foundation DESIGN.md

[image:16]

This document defines a full DESIGN.md-style brand and interface system for H.I.P.S. Foundation, derived from the attached logo and its visual language.[file:16] The goal is to give human designers and AI coding agents a consistent system for building pages, components, campaigns, and digital products that feel trustworthy, compassionate, and institutionally credible.[file:16]

## Brand Reading

The logo combines a deep navy wordmark, a warm gold human silhouette, and a house outline, creating a strong visual metaphor of protection, vulnerability, shelter, and dignity.[file:16] The serif typography gives the organization gravity and seriousness, while the gold figure softens the identity with warmth and humanity.[file:16] Together, these cues suggest a nonprofit or advocacy brand that should feel safe, calm, legible, and emotionally aware rather than trendy or overstylized.[file:16]

## Core Concepts

- Safe shelter, not surveillance.[file:16]
- Human dignity before institutional language.[file:16]
- Calm authority rather than urgent visual noise.[file:16]
- Spacious, respectful layouts with room to breathe.[file:16]
- Hope communicated through restraint, warmth, and clarity.[file:16]

## Design Principles

1. Lead with trust. The visual system should make visitors feel that the organization is stable, discreet, and capable.[file:16]
2. Preserve emotional dignity. Messaging and visuals should acknowledge pain without making suffering visually sensational.[file:16]
3. Use warmth selectively. Gold should act as a sign of hope and emphasis, not as a dominant background color.[file:16]
4. Keep interactions calm. Motion, hover states, and transitions should be subtle and reassuring.[file:16]
5. Favor timeless design choices. The identity works best with classic typography, restrained spacing systems, and simple interface patterns.[file:16]

## YAML Tokens

```yaml
---
meta:
  brand: "H.I.P.S. Foundation"
  full_name: "Hiding in Plain Sight Foundation"
  personality:
    - trustworthy
    - compassionate
    - discreet
    - dignified
    - supportive
  design_intent: "Create a calm, credible nonprofit interface system grounded in protection, hope, and human dignity."

colors:
  primary: "#173B57"
  primary-dark: "#102A3D"
  primary-soft: "#2A5576"
  accent: "#C59A35"
  accent-dark: "#A67F28"
  accent-soft: "#DFC06A"
  background: "#FFFFFF"
  surface: "#F6F8FA"
  surface-alt: "#EEF3F6"
  border: "#D6E0E8"
  text-primary: "#173B57"
  text-secondary: "#445A6C"
  text-muted: "#6F8291"
  success: "#2F7A5F"
  warning: "#A06A18"
  danger: "#9C3E3E"

semantic_color_usage:
  primary_cta_bg: "#173B57"
  primary_cta_text: "#FFFFFF"
  secondary_cta_border: "#C59A35"
  secondary_cta_text: "#C59A35"
  link: "#173B57"
  link_hover: "#102A3D"
  highlight: "#C59A35"

fonts:
  heading: "Cormorant Garamond, Georgia, serif"
  display: "Cormorant Garamond, Georgia, serif"
  body: "Source Sans 3, Arial, sans-serif"
  ui: "Montserrat, Arial, sans-serif"

font_sizes:
  xs: "0.75rem"
  sm: "0.875rem"
  base: "1rem"
  md: "1.125rem"
  lg: "1.25rem"
  xl: "1.5rem"
  2xl: "2rem"
  3xl: "2.75rem"
  4xl: "3.5rem"
  5xl: "4.5rem"

font_weights:
  regular: 400
  medium: 500
  semibold: 600
  bold: 700

letter_spacing:
  tight: "-0.02em"
  normal: "0"
  wide: "0.12em"
  brand_caps: "0.22em"

line_heights:
  tight: 1.1
  heading: 1.15
  body: 1.65
  relaxed: 1.8

spacing:
  0: "0"
  1: "0.25rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.25rem"
  6: "1.5rem"
  8: "2rem"
  10: "2.5rem"
  12: "3rem"
  16: "4rem"
  20: "5rem"
  24: "6rem"
  32: "8rem"

radius:
  sm: "4px"
  md: "8px"
  lg: "16px"
  xl: "24px"
  pill: "9999px"

shadows:
  soft: "0 4px 18px rgba(23, 59, 87, 0.08)"
  card: "0 10px 30px rgba(23, 59, 87, 0.10)"
  elevated: "0 18px 50px rgba(23, 59, 87, 0.16)"

borders:
  subtle: "1px solid #D6E0E8"
  emphasis: "2px solid #173B57"
  accent: "2px solid #C59A35"

motion:
  fast: "150ms ease-out"
  normal: "220ms ease-out"
  slow: "320ms ease-out"

layout:
  content_max: "1200px"
  text_measure: "68ch"
  section_padding_desktop: "6rem"
  section_padding_mobile: "4rem"
  grid_gap: "2rem"
---
```

## Color System

The most important color relationship is navy plus gold on white.[file:16] Navy should carry trust, structure, body hierarchy, navigation, and most headings, while gold should be used as an intentional signal for hope, emphasis, and calls to action.[file:16]

| Token | Hex | Use |
|---|---|---|
| Primary Navy | `#173B57` | Headers, navigation, footer, primary buttons, links [file:16] |
| Deep Navy | `#102A3D` | Hover states, footer depth, dark hero overlays [file:16] |
| Accent Gold | `#C59A35` | Key labels, highlights, stat numbers, dividers, selected actions [file:16] |
| Soft Gold | `#DFC06A` | Light accents, subtle fills, badge backgrounds [file:16] |
| White | `#FFFFFF` | Main page background, forms, high-clarity surfaces [file:16] |
| Surface | `#F6F8FA` | Cards, secondary sections, quote panels [file:16] |

### Color Usage Rules

- Use navy for 70 to 80 percent of branded UI expression.[file:16]
- Use gold for 10 to 15 percent of the interface, mainly to direct focus.[file:16]
- Keep backgrounds mostly white or very light neutral surfaces to preserve calm and readability.[file:16]
- Avoid large gold backgrounds behind long text blocks because they reduce the brand’s seriousness and can weaken readability.[file:16]
- Avoid bright reds or neon accent palettes unless they serve a true emergency alert pattern.[file:16]

## Typography

The logo suggests a refined serif wordmark paired with a cleaner supporting treatment, so the digital system should mirror that relationship.[file:16] Headings should feel editorial and trustworthy, while body text should feel modern, readable, and emotionally neutral.[file:16]

### Recommended Pairing

- Display and headings: `Cormorant Garamond` or `Lora`.[file:16]
- Body text: `Source Sans 3`, `Inter`, or `Open Sans`.[file:16]
- Small UI labels and button text: `Montserrat` in uppercase with generous tracking, inspired by the FOUNDATION line in the logo.[file:16]

### Typographic Rules

- H1 should feel ceremonial and stable, with large serif letterforms and restrained line breaks.[file:16]
- H2 and H3 should remain serif, but tighter and more practical than the hero treatment.[file:16]
- Body copy should stay between 16px and 18px for accessibility and emotional readability.[file:16]
- Section labels such as `MISSION`, `PROGRAMS`, and `GET HELP` should use uppercase sans-serif with wide tracking in gold.[file:16]
- Avoid playful scripts, compressed display fonts, or aggressive geometric type that would conflict with the logo’s dignity.[file:16]

## Tone and Messaging

The identity implies language that is gentle, direct, and protective.[file:16] Headlines should acknowledge reality without sounding alarmist, and calls to action should feel supportive rather than transactional.[file:16]

### Voice Attributes

- Calm
- Respectful
- Reassuring
- Clear
- Human
- Discreet

### Example Headline Directions

- You are not alone.[file:16]
- Support can begin quietly.[file:16]
- Safety, advocacy, and dignity in one place.[file:16]
- Help that sees what others miss.[file:16]
- Protection starts with being believed.[file:16]

### CTA Language

- Get Help
- Find Support
- Learn the Signs
- Support the Mission
- Donate Today
- Partner With Us

## Layout Concepts

The logo’s composition supports a spacious, left-to-right storytelling structure with a strong symbol and a formal wordmark.[file:16] The website should echo that balance through generous whitespace, strong left alignment, and sections that alternate between narrative content and structured support information.[file:16]

### Homepage Structure

1. Hero with quiet confidence: logo presence, short serif headline, short support statement, one primary CTA, one secondary CTA.[file:16]
2. Mission block: a concise statement with a gold section label and a calm supporting paragraph.[file:16]
3. Program cards: advocacy, housing support, awareness, education, donation pathways, or survivor resources.[file:16]
4. Impact section: stat-led storytelling using gold numerals and navy labels.[file:16]
5. Stories or testimonials: carefully framed, optional anonymization, high readability.[file:16]
6. Resource strip: crisis links, hotline information, local referrals, legal or shelter resources.[file:16]
7. Footer: dark navy, concise, trustworthy, easy to scan.[file:16]

### Grid Guidance

- Use a 12-column desktop grid with generous gutters.[file:16]
- Keep primary text measure under 68 characters for long reading sections.[file:16]
- Use stacked cards and large tap targets on mobile.[file:16]
- Prefer asymmetry with strong alignment over decorative collage layouts.[file:16]

## Components

### Buttons

Primary buttons should use navy backgrounds with white text, creating the most trustworthy action pattern in the system.[file:16] Secondary buttons should use gold outlines or gold text on white for less urgent actions.[file:16]

```md
Primary Button
- Background: primary navy
- Text: white
- Font: uppercase Montserrat
- Radius: pill
- Hover: dark navy with slight lift

Secondary Button
- Background: white
- Border: 2px accent gold
- Text: accent gold
- Hover: soft gold tint background
```

### Cards

Cards should feel soft, elevated, and editorial rather than product-dashboard heavy.[file:16] Use white or surface backgrounds, large internal padding, soft shadow, and optional gold top borders for featured content.[file:16]

### Navigation

Navigation should be simple, high-trust, and uncluttered.[file:16] A white navbar with navy text, a restrained gold hover underline, and one visible support-oriented CTA is the best fit for the brand.[file:16]

### Forms

Forms should feel safe and non-intimidating.[file:16] Use clear labels above fields, modest borders, optional helper text, and supportive microcopy such as “Only share what feels comfortable.”[file:16]

### Alerts and Support Boxes

Not every alert should look urgent.[file:16] Distinguish informational guidance, confidential support notes, and emergency action boxes with separate visual treatments.[file:16]

| Pattern | Style |
|---|---|
| Informational note | Light navy-tinted surface with navy icon [file:16] |
| Confidentiality note | White card with gold border and short reassuring copy [file:16] |
| Emergency action | Reserved danger palette with high contrast and plain language [file:16] |

## Imagery Direction

The logo centers human vulnerability and safe shelter, so photography should remain human-first and emotionally careful.[file:16] Images should suggest support, presence, recovery, privacy, and community rather than dramatized distress.[file:16]

### Preferred Imagery

- Hands, safe spaces, support conversations, quiet interiors, doorways, community programs.[file:16]
- Diverse people shown with dignity, agency, and realism.[file:16]
- Textures such as natural light, paper, wood, soft shadows, and architectural shelter references.[file:16]

### Avoid

- Graphic injury imagery.[file:16]
- Overly staged crying portraits.[file:16]
- Smiling corporate stock imagery that feels disconnected from the mission.[file:16]
- Loud saturated color grades or trendy filters.[file:16]

## Iconography and Illustration

The house outline and seated human figure provide the brand’s symbolic DNA.[file:16] Supporting icons should use simple outline styles with slightly softened corners so they feel consistent with protection and care.[file:16]

### Icon Rules

- Stroke icons are preferred over filled icon sets.[file:16]
- Use navy by default and gold for emphasis only.[file:16]
- Keep icons simple and symbolic: shelter, advocacy, guidance, phone, heart, shield, home, community.[file:16]
- Do not introduce cartoon illustration styles that undermine seriousness.[file:16]

## Motion

This brand should move quietly.[file:16] Animations should help orientation and clarity, not excitement.[file:16]

- Fade and rise transitions under 24px.[file:16]
- Hover lifts should be subtle and slow.[file:16]
- Avoid bouncing counters, energetic parallax, or distracting looped motion.[file:16]
- Respect reduced motion settings in all interfaces.[file:16]

## Accessibility

Because the likely audience may include people in crisis, accessibility is part of the mission, not just compliance.[file:16] Content should be legible, predictable, keyboard accessible, and easy to navigate on mobile devices.[file:16]

### Accessibility Rules

- Default body text should remain dark navy or deep neutral on white or very light surfaces.[file:16]
- Gold should not carry long passages of small text on white backgrounds unless contrast has been tested.[file:16]
- Buttons must be large enough for mobile tapping and clearly labeled by purpose.[file:16]
- Forms should use explicit labels, visible focus states, and supportive error language.[file:16]
- Sensitive sections should avoid autoplay media and unexpected audio.[file:16]
- Emergency and confidential actions should always be easy to find.[file:16]

## Page Concepts

### Concept 1: Quiet Shelter

A minimal editorial nonprofit site with white space, large serif headings, and a navy-led interface accented by gold.[file:16] This direction works best for a foundation, advocacy site, annual report, or donation experience.[file:16]

### Concept 2: Trusted Resource Hub

A more utility-forward design that still uses the same visual language, but places greater emphasis on guides, contact pathways, and resources.[file:16] This direction is ideal for service pages, help directories, and survivor support entry points.[file:16]

### Concept 3: Awareness and Education

A campaign-friendly version of the system with modular story blocks, statistics, event pages, and shareable educational content.[file:16] This direction works well for outreach campaigns, public education, and fundraising microsites.[file:16]

## Tailwind Translation

```ts
export const hipsTheme = {
  colors: {
    primary: '#173B57',
    primaryDark: '#102A3D',
    accent: '#C59A35',
    accentSoft: '#DFC06A',
    surface: '#F6F8FA',
    border: '#D6E0E8',
  },
  fontFamily: {
    display: ['Cormorant Garamond', 'serif'],
    body: ['Source Sans 3', 'sans-serif'],
    ui: ['Montserrat', 'sans-serif'],
  },
  borderRadius: {
    md: '8px',
    lg: '16px',
    pill: '9999px',
  },
  boxShadow: {
    soft: '0 4px 18px rgba(23,59,87,.08)',
    card: '0 10px 30px rgba(23,59,87,.10)',
  },
}
```

## Prompting Guidance for AI Builders

Use this file as the visual source of truth when generating pages, sections, and components for H.I.P.S. Foundation.[file:16] When prompting an AI coding tool, explicitly request the navy-and-gold palette, serif-led hierarchy, spacious nonprofit layout, and calm emotional tone described here.[file:16]

### Example Prompt

```md
Use the H.I.P.S. Foundation DESIGN.md file as the source of truth.
Build a homepage with a calm nonprofit aesthetic, navy-led hierarchy,
gold accent labels, serif hero typography, accessible forms, and a
mobile-first resource section for people seeking support.
```

## Implementation Notes

This system should remain consistent across the website, donation funnels, printed collateral, social graphics, pitch decks, and community outreach materials.[file:16] Any future expansion of the brand should preserve the shelter metaphor, the navy-and-gold trust palette, and the overall feeling of dignified protection.[file:16]
