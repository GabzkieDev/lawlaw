const NAMES: Record<string, string> = {
  PH: "Philippines",
  US: "United States",
  AR: "Argentina",
  AU: "Australia",
  BR: "Brazil",
  CA: "Canada",
  CN: "China",
  DE: "Germany",
  ES: "Spain",
  FR: "France",
  GB: "United Kingdom",
  HK: "Hong Kong",
  ID: "Indonesia",
  IN: "India",
  IT: "Italy",
  JP: "Japan",
  KR: "South Korea",
  MY: "Malaysia",
  MX: "Mexico",
  NL: "Netherlands",
  NZ: "New Zealand",
  QA: "Qatar",
  SA: "Saudi Arabia",
  SG: "Singapore",
  TH: "Thailand",
  TW: "Taiwan",
  AE: "United Arab Emirates",
  VN: "Vietnam",
  XX: "Unknown",
};

export function countryName(code: string): string {
  const c = code.toUpperCase();
  if (NAMES[c]) return NAMES[c];
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "region" });
    return dn.of(c) ?? c;
  } catch {
    return c;
  }
}

export function countryFlag(code: string): string {
  const c = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(c) || c === "XX") return "🌐";
  return String.fromCodePoint(...[...c].map((ch) => 127397 + ch.charCodeAt(0)));
}
