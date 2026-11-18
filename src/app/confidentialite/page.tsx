import type { Metadata } from "next";
import Link from "next/link";
import { Fill, LegalNav, PageHeader, ProseBody } from "@/components/layout/static-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Quelles données Cursus collecte, pourquoi, combien de temps elles sont conservées et comment exercer vos droits.",
};

const DATA: { what: string; why: string; kept: string }[] = [
  { what: "Nom, adresse électronique, mot de passe chiffré (empreinte bcrypt)", why: "Créer et sécuriser votre compte", kept: "Jusqu’à la suppression du compte" },
  { what: "Sections lues, résultats des évaluations, examens et révisions", why: "Suivre votre progression et planifier les révisions", kept: "Jusqu’à la suppression du compte" },
  { what: "Attestations (nom, parcours, scores, date, identifiant)", why: "Délivrer une attestation vérifiable", kept: "Jusqu’à la suppression du compte" },
  { what: "Cookie de session (empreinte du jeton stockée en base)", why: "Vous garder connecté", kept: "30 jours, ou jusqu’à la déconnexion" },
  { what: "Jeton de réinitialisation du mot de passe", why: "Vous permettre de choisir un nouveau mot de passe", kept: "1 heure" },
  { what: "Jeton de confirmation d'adresse électronique", why: "Vérifier votre adresse avant une attestation", kept: "24 heures" },
  { what: "Messages envoyés via le formulaire de contact", why: "Répondre à votre demande", kept: "12 mois après le dernier échange" },
  { what: "Pages vues : chemin, site d’origine, type d’appareil, empreinte quotidienne non réversible (sans cookie, l’adresse IP n’est jamais enregistrée)", why: "Mesurer la fréquentation du site, en interne", kept: "L’empreinte devient anonyme après 48 heures. Rien n’est collecté si votre navigateur envoie Do Not Track ou Global Privacy Control" },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Vos données"
        title="Politique de confidentialité"
        intro={`Nous collectons le strict nécessaire pour faire fonctionner la plateforme. Dernière mise à jour : ${SITE.legalUpdatedAt}.`}
      />
      <ProseBody>
        <h2>Responsable du traitement</h2>
        <p>
          Le responsable du traitement est <Fill value={SITE.editor.name} />, éditeur de {SITE.name} (voir les{" "}
          <Link href="/mentions-legales">mentions légales</Link>). Pour toute question : <Fill value={SITE.contactEmail} />.
        </p>

        <h2>Données collectées</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Données</th>
                <th>Finalité</th>
                <th>Durée de conservation</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((row) => (
                <tr key={row.what}>
                  <td>{row.what}</td>
                  <td>{row.why}</td>
                  <td>{row.kept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          La base légale est l’exécution du service que vous demandez en créant un compte (article 6.1.b du RGPD), et notre intérêt
          légitime pour répondre aux messages de contact et sécuriser la plateforme (article 6.1.f).
        </p>

        <h2>Ce que nous ne faisons pas</h2>
        <ul>
          <li>Aucune revente ni location de vos données.</li>
          <li>Aucun cookie publicitaire, aucun traceur de mesure d’audience tiers.</li>
          <li>Aucun profilage à des fins commerciales.</li>
        </ul>
        <p>
          La préférence de thème clair ou sombre est enregistrée uniquement dans votre navigateur et ne nous est jamais transmise.
        </p>

        <h2>Attestations et vérification publique</h2>
        <p>
          Chaque attestation porte un identifiant unique. Toute personne qui le connaît peut consulter, sur la page{" "}
          <Link href="/verifier">Vérifier une attestation</Link>, le nom inscrit, le parcours, les scores et la date de délivrance.
          C’est ce qui permet à un recruteur de confirmer son authenticité. Vous choisissez à qui vous transmettez cet identifiant.
        </p>

        <h2>Destinataires et sous-traitants</h2>
        <p>Vos données ne sont accessibles qu’à l’éditeur et aux prestataires techniques nécessaires au service :</p>
        <ul>
          <li>
            l’hébergeur du site et de la base de données : <Fill value={SITE.host.name} /> ;
          </li>
          <li>le prestataire d’envoi des emails transactionnels (réinitialisation du mot de passe, réponses au contact).</li>
        </ul>
        <p>
          Si l’un de ces prestataires traite des données hors de l’Union européenne, le transfert est encadré par les clauses
          contractuelles types de la Commission européenne.
        </p>

        <h2>Sécurité</h2>
        <p>
          Les mots de passe ne sont jamais stockés en clair. Les jetons de session et de réinitialisation ne sont conservés que sous
          forme d’empreinte. Les tentatives de connexion répétées sont limitées.
        </p>

        <h2>Vos droits</h2>
        <p>
          Vous disposez d’un droit d’accès, de rectification, d’effacement, de portabilité, de limitation et d’opposition. Depuis la
          page <Link href="/compte">Mon compte</Link>, vous pouvez directement :
        </p>
        <ul>
          <li>modifier votre nom et votre adresse électronique ;</li>
          <li>télécharger l’ensemble de vos données au format JSON ;</li>
          <li>supprimer définitivement votre compte et toutes les données associées.</li>
        </ul>
        <p>
          Pour toute autre demande, écrivez-nous via la <Link href="/contact">page de contact</Link>. Nous répondons sous un mois.
          Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).
        </p>
        <LegalNav current="/confidentialite" />
      </ProseBody>
    </>
  );
}
