// Wacky Works — "Start a project" enquiry handler.
//
// The public form POSTs here. We (1) store the enquiry in project_enquiries so a
// lead is never lost, then (2) email it to elliot@wackyworks.co.uk. Storing is the
// source of truth: if the email provider hiccups we still return ok, mark it
// un-emailed, and the lead is safe in the table / admin.
//
// Deploy:  supabase functions deploy send-enquiry --project-ref vvsrtrjbedsnnmafcajj --no-verify-jwt
// Env it needs (Supabase → Project → Edge Functions → Secrets):
//   RESEND_API_KEY   the Resend key that sends the email
//   ENQUIRY_FROM     verified sender, e.g. "Wacky Works <hello@wackyworks.co.uk>"
//   ENQUIRY_TO       where leads land (default elliot@wackyworks.co.uk)
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const esc = (s: string) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const FIELDS: Array<[keyof Payload, string]> = [
  ["venue_setting", "Indoors / outdoors"],
  ["venue_status", "Existing or new venue"],
  ["location", "Location in the UK"],
  ["holes", "Holes"],
  ["opening_date", "Opening date"],
  ["budget", "Approx. budget"],
  ["heard", "Heard about us"],
  ["first_name", "First name"],
  ["last_name", "Last name"],
  ["email", "Email"],
  ["phone", "Telephone"],
];

type Payload = {
  venue_setting: string; venue_status: string; location: string; holes: string;
  opening_date: string; budget: string; heard: string;
  first_name: string; last_name: string; email: string; phone: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let b: Partial<Payload>;
  try { b = await req.json(); } catch { return json({ error: "Bad request." }, 400); }

  // Trim + require every field, and sanity-check the email.
  const v = {} as Payload;
  for (const [k] of FIELDS) v[k] = String((b as any)[k] ?? "").trim();
  const missing = FIELDS.filter(([k]) => !v[k]).map(([, label]) => label);
  if (missing.length) return json({ error: `Missing: ${missing.join(", ")}` }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return json({ error: "That email doesn't look right." }, 400);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 1) Store first — this is what guarantees the lead survives.
  const { data: row, error: dbErr } = await supabase
    .from("project_enquiries")
    .insert({ ...v, user_agent: req.headers.get("user-agent") || null })
    .select("id")
    .single();
  if (dbErr) return json({ error: "Could not save your enquiry. Please email us directly." }, 500);

  // 2) Email it. Best-effort: a send failure never fails the request.
  const RESEND = (Deno.env.get("RESEND_API_KEY") || "").trim();
  const TO = (Deno.env.get("ENQUIRY_TO") || "elliot@wackyworks.co.uk").trim();
  const FROM = (Deno.env.get("ENQUIRY_FROM") || "Wacky Works <onboarding@resend.dev>").trim();
  let emailed = false;
  if (RESEND) {
    const rows = FIELDS.map(([k, label]) =>
      `<tr><td style="padding:6px 14px 6px 0;color:#a8a397;white-space:nowrap;vertical-align:top">${esc(label)}</td><td style="padding:6px 0;color:#111;font-weight:600">${esc(v[k])}</td></tr>`
    ).join("");
    const html = `<div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="margin:0 0 4px">New project enquiry</h2>
      <p style="color:#666;margin:0 0 18px">${esc(v.first_name)} ${esc(v.last_name)} · ${esc(v.location)}</p>
      <table style="border-collapse:collapse;font-size:14px">${rows}</table></div>`;
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM, to: [TO], reply_to: v.email,
          subject: `New project enquiry — ${v.first_name} ${v.last_name} (${v.location})`,
          html,
        }),
      });
      emailed = r.ok;
      if (emailed) await supabase.from("project_enquiries").update({ emailed: true }).eq("id", row.id);
    } catch { /* stored already — the lead is safe */ }
  }

  return json({ ok: true, emailed });
});
