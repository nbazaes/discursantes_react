-- Grant API roles access to sequences and the webhook table.
-- (Supabase's new cloud default no longer auto-exposes new entities.)

GRANT USAGE ON SEQUENCE "public"."discursantes_id_seq" TO "authenticated";
GRANT USAGE ON SEQUENCE "public"."discursos_id_seq" TO "authenticated";
GRANT USAGE ON SEQUENCE "public"."whatsapp_webhook_events_id_seq" TO "authenticated";

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."whatsapp_webhook_events" TO "authenticated";
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."whatsapp_webhook_events" TO "service_role";

-- Atomic replace of a Sunday's discursos (delete + insert in one transaction),
-- scoped to the caller's ward so RLS isolation is preserved under SECURITY DEFINER.
CREATE OR REPLACE FUNCTION public.replace_discursos_fecha(p_fecha DATE, p_rows JSONB DEFAULT '[]')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org TEXT := public.current_org_id();
  v_row RECORD;
BEGIN
  IF v_org IS NULL OR v_org = '' THEN
    RAISE EXCEPTION 'No active organization';
  END IF;

  FOR v_row IN
    SELECT (r ->> 'DiscursanteId')::INTEGER AS id
    FROM jsonb_array_elements(p_rows) r
  LOOP
    IF NOT EXISTS (SELECT 1 FROM discursantes WHERE id = v_row.id AND ward_id = v_org) THEN
      RAISE EXCEPTION 'Discursante % does not belong to the current organization', v_row.id;
    END IF;
  END LOOP;

  DELETE FROM discursos WHERE "Fecha" = p_fecha AND ward_id = v_org;

  IF jsonb_array_length(p_rows) > 0 THEN
    INSERT INTO discursos ("Fecha", "Tema", "DiscursanteId", "ward_id")
    SELECT p_fecha, r ->> 'Tema', (r ->> 'DiscursanteId')::INTEGER, v_org
    FROM jsonb_array_elements(p_rows) r;
  END IF;

  RETURN (
    SELECT coalesce(jsonb_agg(to_jsonb(d)), '[]'::jsonb)
    FROM (
      SELECT * FROM discursos WHERE "Fecha" = p_fecha AND ward_id = v_org ORDER BY id
    ) d
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.replace_discursos_fecha(DATE, JSONB) TO authenticated;
