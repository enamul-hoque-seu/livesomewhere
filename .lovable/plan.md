# Certificate Redesign Plan

## Assessment of current design (`src/lib/certificate.ts`)

Today's cert is a classic "diploma" layout — A3 landscape, gold + green ornaments, italic serif "Certificate of Completion", center seal, two underlined signature slots labeled "Instructor" and "Date". It's elegant but generic and doesn't match the bold, gamified, cyber aesthetic of the reference (Hack The Box: Breakpoint Pro Labs).

Gaps vs. the reference:
- No bold diagonal/horizontal **neon banner** carrying the course title as the hero element.
- No **hero artwork / mascot image** zone (top-left).
- Only one signature line; reference shows **two signatures with names + roles** stacked bottom-left.
- No structured **metadata grid** (Date / CPE credits / Length / Location / Subject areas).
- Uses gold + italic serif — feels academic, not "tech / hacker".
- Seal is decorative only; reference has a strong **holographic-style circular Seal of Approval** bottom-right.
- "Recipient" sentence is centered and large; reference uses a quieter monospaced sentence ("Is hereby granted this certificate on completion of…").

## Target design (matches the reference vibe, branded for Noob to Root)

Landscape A4 (or A3), single page.

```text
┌─────────────────────────────────────────────────────────────────┐
│ [LOGO Noob to Root]                                             │
│                                                                 │
│   ╱╱╱╱╱╱╱╱╱╱  NEON BANNER (cyan→magenta gradient) ╱╱╱╱╱╱╱╱╱╱   │
│   [HERO ART]              CATEGORY (e.g. PRO COURSE)            │
│                          ░░ COURSE TITLE ░░                     │
│                          CERTIFICATE OF COMPLETION              │
│   ╲╲╲╲╲╲╲╲╲╲                                       ╲╲╲╲╲╲╲╲╲╲ │
│                                                                 │
│   Is hereby granted to                                          │
│   ── RECIPIENT NAME ──                                          │
│   on completion of the Noob to Root course "<course>".          │
│                                                                 │
│   [sig1.png]      [sig2.png]                       ╭─────────╮  │
│   Mir, Founder    Instructor, Lead Mentor          │  SEAL   │  │
│                                                    ╰─────────╯  │
│                                                                 │
│   Date            CPE Credits        Length          Location   │
│   12 May 2026     20                 12 hours        Online     │
│                                                                 │
│   Subject areas covered                                         │
│   <comma list of module titles>                                 │
│                                                                 │
│   CERTIFICATE ID: NTR-XXXX-XXXX        Verify at noobtoroot.com │
└─────────────────────────────────────────────────────────────────┘
```

Visual language:
- Background: deep navy `#0A0E18` with very subtle grid + faint scanline texture.
- Accent: **neon cyan `#22D3EE`** primary, **electric green `#2DDC82`** secondary (matches site palette / "from zero to root"), magenta `#E879F9` only on seal hologram.
- Banner: full-width horizontal band with jagged/wavy top + bottom edges, gradient fill, course title in heavy condensed sans (Space Grotesk Bold or built-in `helvetica bold` fallback).
- Body text: monospace (`courier`) for the granting sentence — gives "terminal" feel like the reference's typewriter caption.
- Recipient name: large serif/script accent in cyan with underline flourish.
- Seal: layered concentric rings + tick marks + holographic gradient + "NOOB TO ROOT • CERTIFIED • SINCE 2026".

## Data model changes

Extend `CertData` (in `src/lib/certificate.ts`):
```ts
type CertData = {
  recipient: string;
  course: string;
  category?: string;        // e.g. "PRO COURSE", "FOUNDATIONS"
  date: string;
  number: string;           // certificate ID
  lengthHours?: number;     // for "Length"
  cpeCredits?: number;      // optional
  location?: string;        // default "Online"
  subjects?: string[];      // module titles
  heroImage?: string;       // dataURL/base64 of course thumbnail/mascot
  signatures?: Array<{ image?: string; name: string; role: string }>;
};
```

Callers (`CourseLearn.tsx`, `Profile.tsx`, `AdminEnrollments.tsx`) pass course duration, modules list, and signatures.

## Signatures (user will upload PNGs later)

- Add a folder `src/assets/cert-signatures/` for the PNG files.
- Add a `SIGNATURES` constant (configurable later via Admin Settings) defaulting to two slots: Founder + Lead Mentor.
- Each signature is drawn via `doc.addImage(pngDataUrl, 'PNG', x, y, w, h)` with the printed name + role beneath a thin cyan rule.
- Until PNGs are provided, fall back to an italic typeset name so the cert still renders.

## Hero artwork

- Use the course's existing `cover_image` (already stored on `courses` table) as the left-side hero panel inside the banner. Loaded as base64 before generating the PDF.
- Fallback: a vector-drawn "NTR" hex mascot (already partially present in current `drawLogo`).

## Implementation steps

1. **Refactor `src/lib/certificate.ts`**
   - Replace gold/serif theme with the navy + neon palette and helpers.
   - New draw functions: `drawBanner`, `drawHeroPanel`, `drawSignatureBlock`, `drawHologramSeal`, `drawMetaGrid`.
   - Keep `generateCertificatePdf(data)` as the single entry point (backward compatible — old fields still work; new fields optional).
2. **Wire data from courses**
   - In `CourseLearn.tsx` (cert issue path): pass `course.duration_hours`, `course.cover_image`, module titles → `subjects`, and `category` from `course.level` or `course.category`.
   - In `Profile.tsx` & `AdminEnrollments.tsx`: same, fetched from the existing course row.
3. **Signature configuration**
   - Add `src/lib/certSignatures.ts` exporting the default signature array (name + role + import of PNG).
   - PNGs imported as `?url` and converted to base64 once at module load.
   - Leave clearly marked TODO slots for the two PNGs the user will upload.
4. **Recipient name source**
   - Replace the `"Student"` placeholder in `AdminEnrollments.tsx` with the user's `display_name` / `first_name + last_name` from `profiles` (joined when loading enrollments).
5. **Visual QA**
   - Render a sample PDF for one course locally, eyeball banner edges, seal, signature alignment, no overlaps, ID/footer position.

## Out of scope (can follow up)

- Storing a per-course custom hero image specifically for the certificate.
- Admin UI to manage signature list (name/role/PNG) instead of editing code.
- Public verification page at `/verify/:certId`.

## Next action from you

Upload the two signature PNGs (transparent background preferred). I'll drop them into `src/assets/cert-signatures/` and wire them into the new cert renderer.
