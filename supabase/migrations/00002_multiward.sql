-- Multi-ward tenancy: each row belongs to exactly one Ward (a Clerk Organization).
-- RLS scopes all access to the requesting user's active organization.

-- Returns the active Clerk Organization id from the request JWT.
-- Handles both legacy v1 claim (org_id) and current v2 compact claim (o.id).
CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    nullif(auth.jwt() ->> 'org_id', ''),
    (auth.jwt() -> 'o' ->> 'id')
  );
$$;

-- Add column as nullable first (a NOT NULL DEFAULT with a JWT-based expression
-- cannot be backfilled outside a request context).
ALTER TABLE "discursantes" ADD COLUMN IF NOT EXISTS "ward_id" TEXT;
ALTER TABLE "discursos" ADD COLUMN IF NOT EXISTS "ward_id" TEXT;

-- Backfill existing rows into the first ward (Barrio Villa Esmeralda).
UPDATE "discursantes" SET "ward_id" = 'org_3HWkSI36ijfjNYWNrz6gJD7sEdY' WHERE "ward_id" IS NULL;
UPDATE "discursos" SET "ward_id" = 'org_3HWkSI36ijfjNYWNrz6gJD7sEdY' WHERE "ward_id" IS NULL;

ALTER TABLE "discursantes" ALTER COLUMN "ward_id" SET NOT NULL;
ALTER TABLE "discursos" ALTER COLUMN "ward_id" SET NOT NULL;

ALTER TABLE "discursantes" ALTER COLUMN "ward_id" SET DEFAULT public.current_org_id();
ALTER TABLE "discursos" ALTER COLUMN "ward_id" SET DEFAULT public.current_org_id();

CREATE INDEX IF NOT EXISTS discursantes_ward_id_idx ON "discursantes" ("ward_id");
CREATE INDEX IF NOT EXISTS discursos_ward_id_idx ON "discursos" ("ward_id");

-- Replace permissive policies with ward-scoped ones.
DROP POLICY IF EXISTS "Allow all on discursantes" ON "discursantes";
DROP POLICY IF EXISTS "Allow all on discursos" ON "discursos";

-- discursantes
CREATE POLICY "Ward scoped select discursantes" ON "discursantes"
  FOR SELECT TO authenticated
  USING ("ward_id" = public.current_org_id());

CREATE POLICY "Ward scoped insert discursantes" ON "discursantes"
  FOR INSERT TO authenticated
  WITH CHECK ("ward_id" = public.current_org_id());

CREATE POLICY "Ward scoped update discursantes" ON "discursantes"
  FOR UPDATE TO authenticated
  USING ("ward_id" = public.current_org_id())
  WITH CHECK ("ward_id" = public.current_org_id());

CREATE POLICY "Ward scoped delete discursantes" ON "discursantes"
  FOR DELETE TO authenticated
  USING ("ward_id" = public.current_org_id());

-- discursos
CREATE POLICY "Ward scoped select discursos" ON "discursos"
  FOR SELECT TO authenticated
  USING ("ward_id" = public.current_org_id());

CREATE POLICY "Ward scoped insert discursos" ON "discursos"
  FOR INSERT TO authenticated
  WITH CHECK ("ward_id" = public.current_org_id());

CREATE POLICY "Ward scoped update discursos" ON "discursos"
  FOR UPDATE TO authenticated
  USING ("ward_id" = public.current_org_id())
  WITH CHECK ("ward_id" = public.current_org_id());

CREATE POLICY "Ward scoped delete discursos" ON "discursos"
  FOR DELETE TO authenticated
  USING ("ward_id" = public.current_org_id());
