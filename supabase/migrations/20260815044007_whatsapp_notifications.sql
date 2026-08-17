-- WhatsApp notifications: add phone number to speakers and log webhook statuses.

ALTER TABLE "discursantes" ADD COLUMN IF NOT EXISTS "Telefono" TEXT;

CREATE TABLE IF NOT EXISTS "whatsapp_webhook_events" (
  "id" BIGSERIAL PRIMARY KEY,
  "ward_id" TEXT NOT NULL,
  "message_id" TEXT,
  "status" TEXT,
  "fecha" DATE,
  "payload" JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS whatsapp_webhook_events_message_id_idx ON "whatsapp_webhook_events" ("message_id");
CREATE INDEX IF NOT EXISTS whatsapp_webhook_events_ward_id_idx ON "whatsapp_webhook_events" ("ward_id");

ALTER TABLE "whatsapp_webhook_events" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ward scoped select whatsapp_webhook_events" ON "whatsapp_webhook_events";
DROP POLICY IF EXISTS "Ward scoped insert whatsapp_webhook_events" ON "whatsapp_webhook_events";

CREATE POLICY "Ward scoped select whatsapp_webhook_events" ON "whatsapp_webhook_events"
  FOR SELECT TO authenticated
  USING ("ward_id" = public.current_org_id());

CREATE POLICY "Ward scoped insert whatsapp_webhook_events" ON "whatsapp_webhook_events"
  FOR INSERT TO authenticated
  WITH CHECK ("ward_id" = public.current_org_id());
