// WhatsApp notification sender for Sunday talks.
//
// Meta prerequisites:
// - Approved template with 3 text params in this order: {1} name, {2} topic, {3} date
//   (e.g. body: "Estimado {{1}}, recordatorio: su discurso \"{{2}}\" es el {{3}}.").
// - Permanent access token (whatsapp_business_messaging permission) and phone number ID.
//
// Secrets (supabase secrets set WHATSAPP_VERIFY_TOKEN=... WHATSAPP_APP_SECRET=...
//   WHATSAPP_ACCESS_TOKEN=... WHATSAPP_PHONE_NUMBER_ID=... WHATSAPP_TEMPLATE_NAME=...
//   SUPABASE_SERVICE_ROLE_KEY=...):
// - WHATSAPP_TEMPLATE_NAME: name of the approved template above.
// - WHATSAPP_TEMPLATE_LANGUAGE: template language code (default "es"). Must match
//   the language the template was created with in Meta.
//
// Deploy: supabase functions deploy send-notifications
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GRAPH_VERSION = 'v21.0';
const GRAPH_URL = `https://graph.facebook.com/${GRAPH_VERSION}`;
const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
const templateName = Deno.env.get('WHATSAPP_TEMPLATE_NAME');
const templateLanguage = Deno.env.get('WHATSAPP_TEMPLATE_LANGUAGE') || 'es';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

function decodeJwt(token) {
  try {
    const part = token.split('.')[1];
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(padded), c => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function currentOrgId(authHeader) {
  if (!authHeader) return null;
  const claims = decodeJwt(authHeader.replace(/^Bearer\s+/i, ''));
  if (!claims) return null;
  return claims.org_id || claims.o?.id || null;
}

function normalizePhone(raw) {
  if (!raw) return null;
  let digits = String(raw).replace(/[^\d]/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length < 10) return null;
  return digits;
}

function formatFecha(fecha) {
  if (!fecha) return '';
  const [y, m, d] = String(fecha).split('-');
  if (!y || !m || !d) return String(fecha);
  return `${d}/${m}/${y}`;
}

async function sendTemplate(to, params) {
  const res = await fetch(`${GRAPH_URL}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: templateLanguage },
        components: [
          {
            type: 'body',
            parameters: params.map(p => ({ type: 'text', text: p })),
          },
        ],
      },
    }),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    return { ok: false, message: data.error?.message || `HTTP ${res.status}` };
  }
  return { ok: true, wamid: data.messages?.[0]?.id ?? null };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Max-Age': '86400',
};

function respond(body, status = 200, extraHeaders = {}) {
  return new Response(body, {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return respond('Method not allowed', 405, { 'Content-Type': 'text/plain' });
  }

  const orgId = currentOrgId(req.headers.get('authorization'));
  if (!orgId) {
    return respond('Unauthorized', 401);
  }

  if (!accessToken || !phoneNumberId || !templateName) {
    return respond(JSON.stringify({ error: 'WhatsApp not configured' }), 500);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return respond(JSON.stringify({ error: 'Invalid payload' }), 400);
  }
  const fecha = body?.fecha;
  if (!fecha) {
    return respond(JSON.stringify({ error: 'Missing fecha' }), 400);
  }

  const { data: discursos, error } = await supabase
    .from('discursos')
    .select('id, Fecha, Tema, DiscursanteId, discursante:discursantes(id, Nombres, Apellidos, Telefono)')
    .eq('Fecha', fecha)
    .eq('ward_id', orgId);

  if (error) {
    return respond(JSON.stringify({ error: error.message }), 500);
  }

  const sent = [];
  const skipped = [];
  const failed = [];

  for (const disc of discursos || []) {
    const speaker = disc.discursante;
    const phone = speaker?.Telefono ? normalizePhone(speaker.Telefono) : null;
    const nombre = `${speaker?.Nombres || ''} ${speaker?.Apellidos || ''}`.trim();
    if (!phone || !nombre) {
      skipped.push({ discursante: disc.DiscursanteId, reason: 'no-phone' });
      continue;
    }

    const result = await sendTemplate(phone, [
      nombre,
      disc.Tema,
      formatFecha(disc.Fecha),
    ]);

    if (!result.ok) {
      failed.push({ discursante: disc.DiscursanteId, telefono: phone, error: result.message });
      continue;
    }

    sent.push({ discursante: disc.DiscursanteId, telefono: phone, message_id: result.wamid });

    if (result.wamid) {
      await supabase
        .from('whatsapp_webhook_events')
        .upsert({
          message_id: result.wamid,
          status: 'sent',
          ward_id: orgId,
          fecha,
        }, { onConflict: 'message_id' });
    }
  }

  return respond(JSON.stringify({ sent, skipped, failed }));
});
