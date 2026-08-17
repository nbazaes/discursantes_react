// WhatsApp Cloud API webhook.
//
// In Meta App Dashboard > WhatsApp > Configuration:
// - Callback URL: https://<project-ref>.supabase.co/functions/v1/whatsapp-webhook
// - Verify token: the WHATSAPP_VERIFY_TOKEN secret value.
// - Subscribe to the "messages" field.
//
// GET verifies the endpoint (echoes hub.challenge); POST validates the
// X-Hub-Signature-256 HMAC (WHATSAPP_APP_SECRET) and stores delivery statuses.
//
// Deploy WITHOUT JWT verification (Meta is the caller):
//   supabase functions deploy whatsapp-webhook --no-verify-jwt
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const verifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN');
const appSecret = Deno.env.get('WHATSAPP_APP_SECRET');

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

function normalizePhone(raw) {
  if (!raw) return null;
  let digits = String(raw).replace(/[^\d]/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length < 10) return null;
  return digits;
}

async function verifySignature(rawBody, signatureHeader) {
  if (!appSecret || !signatureHeader) return false;
  const expected = signatureHeader.replace(/^sha256=/, '');
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(appSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
  const actual = [...new Uint8Array(sig)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return actual === expected;
}

async function recordStatus(status) {
  const wamid = status?.wamid;
  const recipient = status?.recipient_id;
  if (!wamid || !recipient) return;

  const phone = normalizePhone(recipient);
  if (!phone) return;

  const { data: speakers } = await supabase
    .from('discursantes')
    .select('Telefono, ward_id');
  const byPhone = new Map();
  for (const s of speakers || []) {
    const p = normalizePhone(s.Telefono);
    if (p) byPhone.set(p, s.ward_id);
  }
  const wardId = byPhone.get(phone);
  if (!wardId) return;

  await supabase
    .from('whatsapp_webhook_events')
    .upsert({
      message_id: wamid,
      status: status.status,
      ward_id: wardId,
      payload: status,
    }, { onConflict: 'message_id' });
}

async function handlePost(req) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-hub-signature-256');
  const valid = await verifySignature(rawBody, signature);
  if (!valid) {
    return new Response('Invalid signature', { status: 400 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response('Invalid payload', { status: 400 });
  }

  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value || {};
      for (const status of value.statuses || []) {
        await recordStatus(status);
      }
    }
  }

  return new Response('OK', { status: 200 });
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    if (mode === 'subscribe' && token && token === verifyToken && challenge) {
      return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
  }

  if (req.method === 'POST') {
    return handlePost(req);
  }

  return new Response('Method not allowed', { status: 405 });
});
