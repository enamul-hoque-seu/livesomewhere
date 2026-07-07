// Default signatures shown on every certificate.
// Drop transparent PNGs into src/assets/cert-signatures/ and uncomment the imports.
//
// import sig1 from "@/assets/cert-signatures/founder.png";
// import sig2 from "@/assets/cert-signatures/mentor.png";

export type CertSignature = {
  /** Optional PNG (data URL or imported asset URL). If omitted we typeset the name in italic script. */
  image?: string;
  name: string;
  role: string;
};

export const DEFAULT_SIGNATURES: CertSignature[] = [
  // { image: sig1, name: "Mir Hasibul Hasan", role: "Founder, Live Somewhere" },
  // { image: sig2, name: "Lead Mentor",       role: "Course Instructor" },
  { name: "Mir Hasibul Hasan", role: "Founder, Live Somewhere" },
  { name: "Live Somewhere Team", role: "Course Instructor" },
];
