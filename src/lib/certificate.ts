import jsPDF from "jspdf";
import { DEFAULT_SIGNATURES, type CertSignature } from "./certSignatures";

export type CertData = {
  recipient: string;
  course: string;
  date: string;
  number: string;
  /** Optional course meta */
  category?: string;          // e.g. "PRO COURSE", "FOUNDATIONS"
  lengthHours?: number;       // hours of content
  cpeCredits?: number;
  location?: string;          // default "Online"
  subjects?: string[];        // module / topic list
  heroImage?: string;         // dataURL or remote URL of course cover
  signatures?: CertSignature[];
  /** @deprecated kept for backward compat — maps to first signature name */
  instructor?: string;
};

/* ----- palette (RGB) ----- */
const BG       = [10, 14, 24]    as const; // deep navy
const BG_SOFT  = [16, 22, 34]    as const;
const NEON     = [45, 220, 130]  as const; // electric green
const NEON_DK  = [22, 140, 82]   as const;
const CYAN     = [34, 211, 238]  as const;
const MAGENTA  = [232, 121, 249] as const;
const WHITE    = [240, 246, 252] as const;
const MUTED    = [150, 168, 190] as const;
const FAINT    = [60, 76, 96]    as const;
const INK      = [12, 16, 22]    as const; // dark text on neon banner

const setFill = (d: jsPDF, c: readonly [number, number, number]) => d.setFillColor(c[0], c[1], c[2]);
const setDraw = (d: jsPDF, c: readonly [number, number, number]) => d.setDrawColor(c[0], c[1], c[2]);
const setText = (d: jsPDF, c: readonly [number, number, number]) => d.setTextColor(c[0], c[1], c[2]);

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */
async function urlToDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => resolve(typeof r.result === "string" ? r.result : null);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function detectImgFmt(dataUrl: string): "PNG" | "JPEG" {
  return /^data:image\/jpe?g/i.test(dataUrl) ? "JPEG" : "PNG";
}

/* ------------------------------------------------------------------ */
/* Brand mark — NTR hex tile + wordmark                                */
/* ------------------------------------------------------------------ */
function drawBrand(doc: jsPDF, x: number, y: number) {
  const r = 14;
  const cx = x + r;
  const cy = y + r;
  const pts: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  setFill(doc, BG_SOFT);
  setDraw(doc, NEON);
  doc.setLineWidth(1.1);
  doc.lines(
    pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]])
       .concat([[pts[0][0] - pts[5][0], pts[0][1] - pts[5][1]]]),
    pts[0][0], pts[0][1], [1, 1], "FD"
  );
  setText(doc, NEON);
  doc.setFont("courier", "bold");
  doc.setFontSize(13);
  doc.text(">_", cx, cy + 4, { align: "center" });

  setText(doc, WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("NOOB", cx + r + 8, cy - 1);
  const w1 = doc.getTextWidth("NOOB ");
  setText(doc, NEON);
  doc.text("TO", cx + r + 8 + w1, cy - 1);
  const w2 = doc.getTextWidth("NOOB TO ");
  setText(doc, WHITE);
  doc.text("ROOT", cx + r + 8 + w2, cy - 1);

  setText(doc, MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.text("FROM ZERO TO ROOT", cx + r + 8, cy + 7, { charSpace: 1.1 });
}

/* ------------------------------------------------------------------ */
/* Neon banner — wavy edges, course title hero                         */
/* ------------------------------------------------------------------ */
function drawBanner(
  doc: jsPDF,
  W: number,
  yTop: number,
  height: number,
  title: string,
  category?: string
) {
  // Outer glow (faint)
  setFill(doc, NEON_DK);
  doc.rect(0, yTop - 2, W, height + 4, "F");

  // Main band
  setFill(doc, NEON);
  doc.rect(0, yTop, W, height, "F");

  // Subtle gradient illusion via two overlapping translucent stripes
  setFill(doc, [60, 230, 150]);
  doc.rect(0, yTop, W * 0.55, height, "F");

  // Wavy ink edges (top + bottom) — small triangles for jagged feel
  setFill(doc, BG);
  const seg = 14;
  for (let x = 0; x < W; x += seg) {
    // top zig
    doc.triangle(x, yTop, x + seg / 2, yTop + 4, x + seg, yTop, "F");
    // bottom zig
    doc.triangle(x, yTop + height, x + seg / 2, yTop + height - 4, x + seg, yTop + height, "F");
  }

  // Faint scanlines on banner
  setDraw(doc, NEON_DK);
  doc.setLineWidth(0.2);
  for (let y = yTop + 6; y < yTop + height - 6; y += 4) {
    doc.line(20, y, W - 20, y);
  }

  // Category eyebrow
  if (category) {
    setText(doc, INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(category.toUpperCase(), W - 40, yTop + 22, { align: "right", charSpace: 3 });
  }

  // Course title — heavy condensed
  setText(doc, INK);
  doc.setFont("helvetica", "bold");
  // shrink to fit
  let size = 56;
  doc.setFontSize(size);
  while (doc.getTextWidth(title.toUpperCase()) > W - 80 && size > 22) {
    size -= 2;
    doc.setFontSize(size);
  }
  doc.text(title.toUpperCase(), W - 40, yTop + height / 2 + size * 0.32, { align: "right" });

  // Sub label
  setText(doc, INK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("CERTIFICATE OF COMPLETION", W - 40, yTop + height - 14, { align: "right", charSpace: 3 });
}

/* ------------------------------------------------------------------ */
/* Hero panel (left side, on top of banner)                            */
/* ------------------------------------------------------------------ */
function drawHeroPanel(doc: jsPDF, x: number, y: number, w: number, h: number, img?: string) {
  if (img) {
    try {
      doc.addImage(img, detectImgFmt(img), x, y, w, h, undefined, "FAST");
      // dark overlay tint for legibility
      doc.setGState(new (doc as unknown as { GState: new (o: object) => unknown }).GState({ opacity: 0.35 }));
      setFill(doc, BG);
      doc.rect(x, y, w, h, "F");
      doc.setGState(new (doc as unknown as { GState: new (o: object) => unknown }).GState({ opacity: 1 }));
      return;
    } catch {
      /* fallthrough to vector */
    }
  }
  // Vector fallback — large hex mascot
  setFill(doc, BG);
  doc.rect(x, y, w, h, "F");
  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.min(w, h) / 2 - 12;
  const pts: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  setDraw(doc, NEON);
  doc.setLineWidth(2);
  setFill(doc, BG_SOFT);
  doc.lines(
    pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]])
       .concat([[pts[0][0] - pts[5][0], pts[0][1] - pts[5][1]]]),
    pts[0][0], pts[0][1], [1, 1], "FD"
  );
  setText(doc, NEON);
  doc.setFont("courier", "bold");
  doc.setFontSize(r * 0.9);
  doc.text(">_", cx, cy + r * 0.32, { align: "center" });
}

/* ------------------------------------------------------------------ */
/* Holographic seal                                                    */
/* ------------------------------------------------------------------ */
function drawHologramSeal(doc: jsPDF, cx: number, cy: number, radius = 58) {
  // Scalloped outer ring (24 bumps)
  const bumps = 24;
  setFill(doc, MAGENTA);
  for (let i = 0; i < bumps; i++) {
    const a = (Math.PI * 2 * i) / bumps;
    const px = cx + radius * Math.cos(a);
    const py = cy + radius * Math.sin(a);
    doc.circle(px, py, 4, "F");
  }
  // Holographic disk — layered translucent
  const layers: Array<readonly [number, number, number]> = [CYAN, MAGENTA, NEON];
  layers.forEach((c, i) => {
    doc.setGState(new (doc as unknown as { GState: new (o: object) => unknown }).GState({ opacity: 0.45 - i * 0.1 }));
    setFill(doc, c);
    doc.circle(cx + (i - 1) * 4, cy + (i - 1) * 4, radius - 2, "F");
  });
  doc.setGState(new (doc as unknown as { GState: new (o: object) => unknown }).GState({ opacity: 1 }));

  // Inner disk
  setFill(doc, BG_SOFT);
  doc.circle(cx, cy, radius - 14, "F");
  setDraw(doc, NEON);
  doc.setLineWidth(0.8);
  doc.circle(cx, cy, radius - 14, "S");
  setDraw(doc, CYAN);
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, radius - 20, "S");

  // Center hex glyph
  const r = (radius - 28);
  const pts: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  setFill(doc, NEON);
  doc.lines(
    pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]])
       .concat([[pts[0][0] - pts[5][0], pts[0][1] - pts[5][1]]]),
    pts[0][0], pts[0][1], [1, 1], "F"
  );
  setText(doc, INK);
  doc.setFont("courier", "bold");
  doc.setFontSize(r * 0.8);
  doc.text(">_", cx, cy + r * 0.28, { align: "center" });

  // Ring text
  setText(doc, WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("NOOB TO ROOT  •  CERTIFIED", cx, cy + radius - 7, { align: "center", charSpace: 1.4 });
  doc.text("SEAL OF APPROVAL  •  SINCE 2026", cx, cy - radius + 11, { align: "center", charSpace: 1.4 });
}

/* ------------------------------------------------------------------ */
/* Signature block                                                     */
/* ------------------------------------------------------------------ */
function drawSignature(doc: jsPDF, x: number, y: number, sig: CertSignature) {
  const w = 150;
  if (sig.image) {
    try {
      doc.addImage(sig.image, detectImgFmt(sig.image), x, y - 28, w, 30, undefined, "FAST");
    } catch {
      setText(doc, WHITE);
      doc.setFont("times", "italic");
      doc.setFontSize(20);
      doc.text(sig.name, x, y - 6);
    }
  } else {
    setText(doc, WHITE);
    doc.setFont("times", "italic");
    doc.setFontSize(20);
    doc.text(sig.name, x, y - 6);
  }
  setDraw(doc, CYAN);
  doc.setLineWidth(0.4);
  doc.line(x, y, x + w, y);
  setText(doc, MUTED);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(sig.name.toUpperCase(), x, y + 11, { charSpace: 1.2 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(sig.role.toUpperCase(), x, y + 21, { charSpace: 1.2 });
}

/* ------------------------------------------------------------------ */
/* Metadata field                                                      */
/* ------------------------------------------------------------------ */
function drawMetaField(doc: jsPDF, x: number, y: number, label: string, value: string) {
  setText(doc, MUTED);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(label.toUpperCase(), x, y, { charSpace: 1.4 });
  setText(doc, WHITE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(value, x, y + 14);
}

/* ------------------------------------------------------------------ */
export async function generateCertificatePdf(data: CertData) {
  // Resolve hero image (course cover) into a data URL if a remote URL was passed
  let hero = data.heroImage;
  if (hero && /^https?:/i.test(hero)) {
    hero = (await urlToDataUrl(hero)) ?? undefined;
  }

  // Resolve signature images if any are remote
  const signaturesRaw = data.signatures ??
    (data.instructor
      ? [{ name: data.instructor, role: "Course Instructor" }, DEFAULT_SIGNATURES[0]]
      : DEFAULT_SIGNATURES);
  const signatures: CertSignature[] = await Promise.all(
    signaturesRaw.slice(0, 2).map(async (s) => {
      if (s.image && /^https?:/i.test(s.image)) {
        const d = await urlToDataUrl(s.image);
        return { ...s, image: d ?? undefined };
      }
      return s;
    })
  );

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  /* Background */
  setFill(doc, BG);
  doc.rect(0, 0, W, H, "F");

  // Subtle grid texture
  setDraw(doc, FAINT);
  doc.setLineWidth(0.12);
  for (let x = 0; x < W; x += 22) doc.line(x, 0, x, H);
  for (let y = 0; y < H; y += 22) doc.line(0, y, W, y);

  // Inner cyan hairline frame
  setDraw(doc, CYAN);
  doc.setLineWidth(0.5);
  doc.rect(18, 18, W - 36, H - 36);
  setDraw(doc, NEON_DK);
  doc.setLineWidth(0.3);
  doc.rect(24, 24, W - 48, H - 48);

  /* Brand */
  drawBrand(doc, 40, 40);

  /* Hero artwork — left column, vertically centered around banner */
  const heroX = 40;
  const heroY = 100;
  const heroW = 230;
  const heroH = 170;
  drawHeroPanel(doc, heroX, heroY, heroW, heroH, hero);

  /* Banner — overlaps hero on the left, dominates right side */
  const bannerY = 130;
  const bannerH = 110;
  drawBanner(doc, W, bannerY, bannerH, data.course, data.category);

  // Re-draw hero on top so banner doesn't cover it
  drawHeroPanel(doc, heroX, heroY, heroW, heroH, hero);
  // thin neon outline on hero
  setDraw(doc, NEON);
  doc.setLineWidth(1.2);
  doc.rect(heroX, heroY, heroW, heroH, "S");

  /* Granting sentence — terminal/mono */
  const bodyY = heroY + heroH + 40;
  setText(doc, MUTED);
  doc.setFont("courier", "normal");
  doc.setFontSize(11);
  doc.text("Is hereby granted to", 40, bodyY);

  /* Recipient name */
  setText(doc, CYAN);
  doc.setFont("times", "bolditalic");
  doc.setFontSize(40);
  doc.text(data.recipient, 40, bodyY + 38);

  // Underline flourish
  setDraw(doc, NEON);
  doc.setLineWidth(0.6);
  const nameW = Math.min(doc.getTextWidth(data.recipient) + 24, W - 320);
  doc.line(40, bodyY + 46, 40 + nameW, bodyY + 46);

  setText(doc, MUTED);
  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.text(
    `on completion of the Noob to Root course "${data.course}".`,
    40, bodyY + 64
  );

  /* Footer block */
  const footY = H - 110;

  // Signatures (left)
  drawSignature(doc, 40, footY, signatures[0]);
  if (signatures[1]) drawSignature(doc, 220, footY, signatures[1]);

  // Seal (right)
  drawHologramSeal(doc, W - 100, footY - 4, 56);

  /* Metadata grid */
  const metaY = H - 60;
  const cols = [
    { label: "Date", value: data.date },
    { label: "CPE Credits", value: data.cpeCredits != null ? String(data.cpeCredits) : "—" },
    { label: "Length", value: data.lengthHours ? `${data.lengthHours} hours` : "—" },
    { label: "Location", value: data.location ?? "Online" },
  ];
  cols.forEach((c, i) => drawMetaField(doc, 40 + i * 130, metaY, c.label, c.value));

  /* Subjects (only if there's room — small caption above metadata) */
  if (data.subjects && data.subjects.length) {
    setText(doc, MUTED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("SUBJECT AREAS COVERED", W - 40, metaY, { align: "right", charSpace: 1.4 });
    setText(doc, WHITE);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    const text = data.subjects.join(", ");
    const lines = doc.splitTextToSize(text, 320);
    doc.text(lines.slice(0, 2), W - 40, metaY + 12, { align: "right" });
  }

  /* Certificate ID (bottom strip) */
  setDraw(doc, FAINT);
  doc.setLineWidth(0.3);
  doc.line(40, H - 30, W - 40, H - 30);
  setText(doc, MUTED);
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.text(`CERTIFICATE ID:  ${data.number}`, 40, H - 18, { charSpace: 1 });
  setText(doc, FAINT);
  doc.setFont("helvetica", "normal");
  doc.text("Verify authenticity at  noobtoroot.com/verify", W - 40, H - 18, { align: "right" });

  doc.save(`noob-to-root-certificate-${data.number}.pdf`);
}
