import { getCurrentUser } from "@/lib/auth";
import { audit } from "@/lib/admin/audit";
import { exportUserData, jsonDownload } from "@/lib/user-export";

export const dynamic = "force-dynamic";

/** Export JSON des données d'un apprenant (pour répondre à une demande d'accès RGPD). */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return new Response("Accès refusé.", { status: 404 });
  const { id } = await params;
  const data = /^[0-9a-f-]{36}$/i.test(id) ? await exportUserData(id) : null;
  if (!data) return new Response("Compte introuvable.", { status: 404 });
  const account = data.compte as { nom: string; email: string };
  await audit(admin, "user.export", { id, label: `${account.nom} <${account.email}>` });
  return jsonDownload(data, `cursus-donnees-${id.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`);
}
