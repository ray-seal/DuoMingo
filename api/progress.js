import { neon } from "@neondatabase/serverless";
import { createRemoteJWKSet, jwtVerify } from "jose";

let jwks;
async function authenticate(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !process.env.NEON_AUTH_JWKS_URL) return null;
  try {
    jwks ||= createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL));
    const { payload } = await jwtVerify(token, jwks);
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch { return null; }
}
function send(res, status, body) {
  res.status(status).setHeader("Cache-Control", "no-store").json(body);
}
export default async function handler(req, res) {
  if (!["GET", "PUT"].includes(req.method)) {
    res.setHeader("Allow", "GET, PUT");
    return send(res, 405, { error: "Method not allowed" });
  }
  const userId = await authenticate(req);
  if (!userId) return send(res, 401, { error: "Please sign in to sync progress." });
  if (!process.env.DATABASE_URL) return send(res, 503, { error: "Database is not configured." });
  try {
    const sql = neon(process.env.DATABASE_URL);
    if (req.method === "GET") {
      const [row] = await sql`SELECT xp, completed_lessons, learned_phrases FROM public.user_progress WHERE user_id = ${userId} LIMIT 1`;
      return send(res, 200, row ? {
        xp: row.xp, completedLessons: row.completed_lessons, learnedPhrases: row.learned_phrases
      } : { xp: 0, completedLessons: [], learnedPhrases: [] });
    }
    const body = req.body || {};
    const xp = Math.max(0, Math.min(10000000, Math.floor(Number(body.xp) || 0)));
    const completed = Array.isArray(body.completedLessons) ? body.completedLessons.filter(x => typeof x === "string").slice(0, 500) : [];
    const learned = Array.isArray(body.learnedPhrases) ? body.learnedPhrases.filter(x => typeof x === "string").slice(0, 5000) : [];
    await sql`
      INSERT INTO public.user_progress (user_id, xp, completed_lessons, learned_phrases, updated_at)
      VALUES (${userId}, ${xp}, ${JSON.stringify(completed)}::jsonb, ${JSON.stringify(learned)}::jsonb, now())
      ON CONFLICT (user_id) DO UPDATE SET xp = EXCLUDED.xp,
        completed_lessons = EXCLUDED.completed_lessons,
        learned_phrases = EXCLUDED.learned_phrases, updated_at = now()
    `;
    return send(res, 200, { ok: true });
  } catch (error) {
    console.error("DuoMingo progress API error:", error?.message || "unknown");
    return send(res, 500, { error: "Could not sync progress. Please try again." });
  }
}