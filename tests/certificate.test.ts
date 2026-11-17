import { describe, expect, it } from "vitest";
import { CERTIFICATE_CODE, generateCertificateCode, normalizeCertificateCode, parcoursPrefix } from "@/lib/certificate-code";

describe("identifiants d'attestation", () => {
  it("produit des codes au format CUR-XXX-XXXX-XXXX, sans caractères ambigus", () => {
    for (let i = 0; i < 200; i++) {
      const code = generateCertificateCode("ai-engineering");
      expect(code).toMatch(CERTIFICATE_CODE);
      expect(code.slice(8)).not.toMatch(/[01OIL]/);
    }
  });

  it("produit des codes non séquentiels et sans doublon sur un échantillon", () => {
    const codes = new Set(Array.from({ length: 2000 }, () => generateCertificateCode("cybersecurite")));
    expect(codes.size).toBe(2000);
  });

  it("utilise un préfixe lisible par parcours", () => {
    expect(parcoursPrefix("ai-engineering")).toBe("AIE");
    expect(parcoursPrefix("data-engineering")).toBe("DAT");
    expect(parcoursPrefix("data-analyst")).toBe("DAN");
    expect(parcoursPrefix("data-scientist")).toBe("DSC");
    expect(parcoursPrefix("analyste-bi")).toBe("ABI");
    expect(parcoursPrefix("devops")).toBe("OPS");
    expect(parcoursPrefix("project-manager")).toBe("PMG");
    expect(parcoursPrefix("marketing-digital")).toBe("MKT");
    expect(parcoursPrefix("product-manager")).toBe("PRD");
    expect(parcoursPrefix("business-analyst")).toBe("BAN");
    expect(parcoursPrefix("bi-engineer")).toBe("BIE");
    expect(parcoursPrefix("nouveau-parcours")).toMatch(/^[A-Z]{3}$/);
  });

  it("normalise un code saisi à la main", () => {
    expect(normalizeCertificateCode("  cur-aie-7k4q-m29x ")).toBe("CUR-AIE-7K4Q-M29X");
    expect(CERTIFICATE_CODE.test(normalizeCertificateCode("cur-aie-7k4q-m29x"))).toBe(true);
  });
});

describe("saisie d'un identifiant d'attestation", () => {
  it("met en forme la frappe", async () => {
    const { formatCertificateInput } = await import("@/lib/certificate-format");
    expect(formatCertificateInput("cur aie 7k4qm29x")).toBe("CUR-AIE-7K4Q-M29X");
    expect(formatCertificateInput("cura")).toBe("CUR-A");
    expect(formatCertificateInput("CUR-AIE-7K4Q-M29X-EXTRA")).toBe("CUR-AIE-7K4Q-M29X");
    expect(formatCertificateInput("")).toBe("");
  });

  it("extrait le code d'un QR code scanné", async () => {
    const { codeFromScan } = await import("@/lib/certificate-format");
    expect(codeFromScan("https://cursus.example/verifier/CUR-AIE-7K4Q-M29X")).toBe("CUR-AIE-7K4Q-M29X");
    expect(codeFromScan("https://autre-site.example/promo")).toBeNull();
  });
});
