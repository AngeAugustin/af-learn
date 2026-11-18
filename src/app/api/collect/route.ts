import { createHash, randomBytes } from "node:crypto";
import { query, queryOne } from "@/lib/db";
import { clientIp, recordFailedAttempt, tooManyAttempts } from "@/lib/auth";
import { cleanCampaign, deviceFrom, isBot, isTrackablePath, referrerHost } from "@/lib/analytics";

/** Sel du jour, créé à la demande. Les sels de plus de 2 jours sont effacés : les empreintes deviennent anonymes. */
async function dailySalt(): Promise<string> {
  await query("INSERT INTO analytics_salts (day, salt) VALUES (current_date, $1) ON CONFLICT (day) DO NOTHING", [
    randomBytes(16).toString("hex"),
  ]);
  if (Math.random() < 0.05) await query("DELETE FROM analytics_salts WHERE day < current_date - 1");
  const row = await queryOne<{ salt: string }>("SELECT salt FROM analytics_salts WHERE day = current_date");
  return row!.salt;
}

export async function POST(request: Request): Promise<Response> {
  const headers = request.headers;
  const ua = headers.get("user-agent") ?? "";
  if (isBot(ua) || headers.get("dnt") === "1" || headers.get("sec-gpc") === "1") return new Response(null, { status: 204 });

  // Seul le navigateur du site envoie des mesures. Sans origine, ou depuis un autre site, on refuse.
  const origin = headers.get("origin");
  const host = headers.get("host");
  if (!origin || !host) return new Response(null, { status: 403 });
  try {
    if (new URL(origin).host !== host) return new Response(null, { status: 403 });
  } catch {
    return new Response(null, { status: 403 });
  }
  // Une mesure tient en quelques centaines d'octets ; au-delà, ou en rafale depuis une même IP, on refuse.
  if (Number(headers.get("content-length") ?? 0) > 2048) return new Response(null, { status: 413 });
  const ip = clientIp(headers);
  const rateKey = `collect:${ip}`;
  if (await tooManyAttempts(rateKey, 300)) return new Response(null, { status: 429 });
  await recordFailedAttempt(rateKey);

  let body: { path?: unknown; referrer?: unknown; utm?: unknown };
  try {
    const text = await request.text();
    if (text.length > 2048) return new Response(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!body || typeof body !== "object") return new Response(null, { status: 400 });
  const path = typeof body.path === "string" ? body.path.split("?")[0] : "";
  if (!isTrackablePath(path)) return new Response(null, { status: 204 });

  // L'IP ne sert qu'à calculer l'empreinte du jour ; elle n'est jamais écrite.
  const visitor = createHash("sha256").update(`${await dailySalt()}|${ip}|${ua}`).digest("hex").slice(0, 32);

  await query(
    "INSERT INTO page_views (path, referrer_host, utm_source, device, visitor) VALUES ($1, $2, $3, $4, $5)",
    [
      path,
      referrerHost(typeof body.referrer === "string" ? body.referrer : null, headers.get("host")),
      cleanCampaign(typeof body.utm === "string" ? body.utm : null),
      deviceFrom(ua),
      visitor,
    ],
  );
  return new Response(null, { status: 204 });
}
