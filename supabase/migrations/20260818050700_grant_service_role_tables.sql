-- Grant service_role access to core tables so Edge Functions can read/write them.
-- (This project has auto-expose off, so table privileges must be granted explicitly.)

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."discursos" TO "service_role";
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."discursantes" TO "service_role";

GRANT USAGE ON SEQUENCE "public"."discursos_id_seq" TO "service_role";
GRANT USAGE ON SEQUENCE "public"."discursantes_id_seq" TO "service_role";
GRANT USAGE ON SEQUENCE "public"."whatsapp_webhook_events_id_seq" TO "service_role";