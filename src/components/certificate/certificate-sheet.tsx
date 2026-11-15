import type { CertificateWithParcours } from "@/lib/certificates";
import { PASS_THRESHOLD } from "@/lib/quiz";

const formatDate = (d: Date) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(d));

/** Sceau rouge « Parcours validé · Cursus · année ». */
function Seal({ year }: { year: number }) {
  return (
    <svg className="cert-seal" viewBox="0 0 120 120" aria-hidden>
      <defs>
        <path id="cert-ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="#a41623" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="#a41623" strokeWidth="0.8" strokeDasharray="2 2.5" />
      <circle cx="60" cy="60" r="34" fill="#a41623" />
      <text fontFamily="JetBrains Mono Variable, monospace" fontSize="8.6" fontWeight="600" letterSpacing="2.3" fill="#a41623">
        <textPath href="#cert-ring">{`PARCOURS VALIDÉ · CURSUS · ${year} · `}</textPath>
      </text>
      <text x="60" y="58" textAnchor="middle" fontFamily="Sora Variable, sans-serif" fontWeight="800" fontSize="16" fill="#fff">
        {PASS_THRESHOLD} %
      </text>
      <text x="60" y="72" textAnchor="middle" fontFamily="JetBrains Mono Variable, monospace" fontSize="6.5" letterSpacing="1" fill="#f8e8ea">
        SEUIL
      </text>
    </svg>
  );
}

/** Attestation au format A4 paysage (toujours en thème clair, imprimable). */
export function CertificateSheet({ cert, qr }: { cert: CertificateWithParcours; qr: string }) {
  const hours = Math.round(cert.minutes / 60);
  return (
    <div className="cert-wrap force-light">
      <article className="cert" aria-label={`Attestation de réussite de ${cert.holder_name}, parcours ${cert.parcours_title}`}>
        <aside className="cert-side">
          <div className="cert-logo">
            <i aria-hidden>C</i>Cursus
          </div>
          <p className="cert-tagline">
            Formations aux métiers du numérique,
            <br />
            validées chapitre par chapitre.
          </p>
          <div className="cert-facts">
            <div>
              <b>{cert.chapter_count}</b>
              <span>chapitres validés</span>
            </div>
            <div>
              <b>
                {cert.final_score}
                <small>%</small>
              </b>
              <span>examen final</span>
            </div>
            <div>
              <b>
                ≈ {hours}
                <small>h</small>
              </b>
              <span>de formation</span>
            </div>
          </div>
          <div className="cert-verify">
            <div className="cert-qr" role="img" aria-label="QR code de vérification" dangerouslySetInnerHTML={{ __html: qr }} />
            <p>
              Vérifier l&apos;authenticité
              <b>{cert.code}</b>
              Scannez ou saisissez l&apos;identifiant sur la page de vérification.
            </p>
          </div>
        </aside>

        <section className="cert-main">
          <div className="cert-head">
            <p className="cert-label">Attestation de réussite</p>
            <p className="cert-meta">
              Parcours certifiant
              <br />
              Niveau {cert.parcours_level.toLowerCase()}
            </p>
          </div>
          <p className="cert-attests">Cursus atteste que</p>
          <p className="cert-name">{cert.holder_name}</p>
          <div className="cert-rule" aria-hidden />
          <p className="cert-attests">a validé l&apos;intégralité du parcours</p>
          <p className="cert-course">
            {cert.parcours_title}
            <small>
              {cert.module_count} modules · {cert.chapter_count} évaluations réussies (seuil {PASS_THRESHOLD} %) · score moyen{" "}
              {cert.average_score} %
            </small>
          </p>

          {cert.outcomes.length > 0 && (
            <div className="cert-skills">
              <p className="cert-label cert-label-muted">Compétences validées</p>
              <ul>
                {cert.outcomes.slice(0, 6).map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="cert-foot">
            <div className="cert-sig">
              <span className="cert-hand">Cursus</span>
              <p>
                L&apos;équipe pédagogique<span>Cursus</span>
              </p>
            </div>
            <div className="cert-date">
              <p className="cert-label cert-label-muted">Délivrée le</p>
              <b>{formatDate(cert.issued_at)}</b>
            </div>
            <Seal year={new Date(cert.issued_at).getFullYear()} />
          </div>
        </section>
      </article>
    </div>
  );
}
