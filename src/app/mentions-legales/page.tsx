import type { Metadata } from "next";
import Link from "next/link";
import { Fill, LegalNav, PageHeader, ProseBody } from "@/components/layout/static-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergeur et informations légales de la plateforme Cursus.",
};

export default function LegalNoticePage() {
  const { editor, host } = SITE;
  return (
    <>
      <PageHeader eyebrow="Informations légales" title="Mentions légales" intro={`Dernière mise à jour : ${SITE.legalUpdatedAt}.`} />
      <ProseBody>
        <h2>Éditeur du site</h2>
        <p>
          Le site {SITE.name} est édité par <Fill value={editor.name} />, <Fill value={editor.status} />.
        </p>
        <ul>
          <li>
            Adresse : <Fill value={editor.address} />
          </li>
          <li>
            Immatriculation : <Fill value={editor.registration} />
          </li>
          <li>
            Contact : <Fill value={SITE.contactEmail} />, ou via la <Link href="/contact">page de contact</Link>
          </li>
          <li>
            Direction de la publication : <Fill value={editor.publicationDirector} />
          </li>
        </ul>

        <h2>Hébergement</h2>
        <ul>
          <li>
            Hébergeur : <Fill value={host.name} />
          </li>
          <li>
            Adresse : <Fill value={host.address} />
          </li>
          <li>
            Site : <Fill value={host.website} />
          </li>
        </ul>

        <h2>Propriété intellectuelle</h2>
        <p>
          Les contenus publiés sur {SITE.name} (textes des chapitres, exercices, questions d’évaluation, illustrations, sketchnotes,
          logo et charte graphique) sont protégés par le droit d’auteur. Toute reproduction ou diffusion, totale ou partielle, sans
          autorisation écrite préalable de l’éditeur est interdite, sauf pour un usage strictement personnel et pédagogique.
        </p>
        <p>
          Les extraits de code présentés dans les leçons peuvent être réutilisés librement dans vos propres projets.
        </p>

        <h2>Données personnelles</h2>
        <p>
          Le traitement de vos données est décrit dans la <Link href="/confidentialite">politique de confidentialité</Link>. Les
          règles d’usage de la plateforme figurent dans les <Link href="/conditions">conditions d’utilisation</Link>.
        </p>

        <h2>Cookies</h2>
        <p>
          {SITE.name} n’utilise qu’un cookie strictement nécessaire au maintien de votre connexion. Aucun cookie publicitaire ni
          de mesure d’audience n’est déposé ; aucun consentement n’est donc requis.
        </p>

        <h2>Responsabilité</h2>
        <p>
          L’éditeur s’efforce de fournir des contenus exacts et à jour, sans pouvoir garantir l’absence d’erreurs. Les liens
          vers des sites tiers sont fournis à titre indicatif ; l’éditeur n’est pas responsable de leur contenu.
        </p>
        <LegalNav current="/mentions-legales" />
      </ProseBody>
    </>
  );
}
