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
    expect(parcoursPrefix("nouveau-parcours")).toMatch(/^[A-Z]{3}$/);
  });

  it("normalise un code saisi à la main", () => {
    expect(normalizeCertificateCode("  cur-aie-7k4q-m29x ")).toBe("CUR-AIE-7K4Q-M29X");
    expect(CERTIFICATE_CODE.test(normalizeCertificateCode("cur-aie-7k4q-m29x"))).toBe(true);
  });
});
