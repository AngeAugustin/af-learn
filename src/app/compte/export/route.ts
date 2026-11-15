import { getCurrentUser } from "@/lib/auth";
import { exportUserData, jsonDownload } from "@/lib/user-export";

export const dynamic = "force-dynamic";

/** Export de toutes les données personnelles du compte connecté (droit à la portabilité). */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new Response("Connexion requise.", { status: 401 });
  const data = await exportUserData(user.id);
  return jsonDownload(data, `cursus-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`);
}
