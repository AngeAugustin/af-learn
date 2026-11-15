import type { Metadata } from "next";
import Link from "next/link";
import { LegalNav, PageHeader, ProseBody } from "@/components/layout/static-page";
import { SITE } from "@/lib/site";
import { PASS_THRESHOLD } from "@/lib/quiz";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Les règles d'utilisation de la plateforme Cursus, des comptes et des attestations.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Règles d’usage"
        title="Conditions d’utilisation"
        intro={`En créant un compte ou en utilisant ${SITE.name}, vous acceptez ces conditions. Dernière mise à jour : ${SITE.legalUpdatedAt}.`}
      />
      <ProseBody>
        <h2>1. Objet</h2>
        <p>
          {SITE.name} est une plateforme d’apprentissage en ligne qui propose des parcours de formation aux métiers du numérique,
          organisés en modules, chapitres et sections, avec exercices corrigés, évaluations, révisions espacées et attestations de
          fin de parcours.
        </p>

        <h2>2. Compte</h2>
        <ul>
          <li>La création d’un compte est gratuite. Elle nécessite un nom, une adresse électronique valide et un mot de passe.</li>
          <li>Le compte est personnel. Vous êtes responsable de la confidentialité de votre mot de passe.</li>
          <li>Le nom indiqué apparaît sur vos attestations : utilisez votre vrai nom si vous comptez les présenter.</li>
          <li>
            Vous pouvez supprimer votre compte à tout moment depuis la page <Link href="/compte">Mon compte</Link>.
          </li>
        </ul>

        <h2>3. Utilisation des contenus</h2>
        <p>
          Les contenus sont mis à votre disposition pour votre usage personnel de formation. Il est interdit de les copier, de les
          republier ou de les revendre, en tout ou partie, sans autorisation. Les extraits de code des leçons peuvent être réutilisés
          dans vos propres projets.
        </p>

        <h2>4. Évaluations et attestations</h2>
        <ul>
          <li>Un chapitre est validé lorsque son évaluation est réussie avec au moins {PASS_THRESHOLD} % de bonnes réponses.</li>
          <li>
            L’attestation est délivrée une fois tous les chapitres validés et l’examen final réussi. Elle mentionne votre nom, le
            parcours, vos scores et la date de délivrance.
          </li>
          <li>
            Chaque attestation peut être vérifiée publiquement grâce à son identifiant sur la page{" "}
            <Link href="/verifier">Vérifier une attestation</Link>.
          </li>
          <li>
            L’attestation atteste de la réussite des évaluations de la plateforme. Ce n’est ni un diplôme ni une certification
            enregistrée au RNCP.
          </li>
          <li>
            Les évaluations doivent être passées par vous-même. Une attestation obtenue de manière frauduleuse peut être révoquée.
          </li>
        </ul>

        <h2>5. Comportements interdits</h2>
        <ul>
          <li>Tenter d’accéder aux comptes d’autres personnes ou aux systèmes de la plateforme sans autorisation.</li>
          <li>Extraire massivement les contenus ou les questions par des moyens automatisés.</li>
          <li>Perturber le fonctionnement du service ou l’utiliser à des fins illicites.</li>
        </ul>
        <p>En cas de manquement, l’éditeur peut suspendre ou supprimer le compte concerné après vous en avoir informé.</p>

        <h2>6. Disponibilité et évolution</h2>
        <p>
          Nous faisons notre possible pour que la plateforme reste accessible, sans pouvoir le garantir en permanence (maintenance,
          incidents). Les contenus peuvent être mis à jour, réorganisés ou enrichis ; votre progression est conservée autant que
          possible lors de ces évolutions.
        </p>

        <h2>7. Responsabilité</h2>
        <p>
          Les contenus ont une vocation pédagogique. Vous restez responsable de l’usage que vous faites des connaissances acquises,
          notamment dans un cadre professionnel.
        </p>

        <h2>8. Modification des conditions</h2>
        <p>
          Ces conditions peuvent évoluer. La date de dernière mise à jour figure en haut de la page. En cas de changement important,
          vous en serez informé lors de votre prochaine connexion ou par email.
        </p>

        <h2>9. Droit applicable et contact</h2>
        <p>
          Ces conditions sont régies par le droit français. Pour toute question ou réclamation, écrivez-nous via la{" "}
          <Link href="/contact">page de contact</Link>. Le traitement de vos données est décrit dans la{" "}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
        <LegalNav current="/conditions" />
      </ProseBody>
    </>
  );
}
