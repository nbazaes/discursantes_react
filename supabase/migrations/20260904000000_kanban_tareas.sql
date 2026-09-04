-- Kanban de coordinación: tabla de tareas genéricas del obispado.
-- Cada fila pertenece a un barrio (Clerk Organization); RLS scoped por ward_id.

CREATE TABLE IF NOT EXISTS "tareas" (
  "id" SERIAL PRIMARY KEY,
  "ward_id" TEXT NOT NULL DEFAULT public.current_org_id(),
  "titulo" TEXT NOT NULL,
  "descripcion" TEXT,
  "DiscursanteId" INTEGER REFERENCES "discursantes"("id") ON DELETE SET NULL,
  "estado" TEXT NOT NULL DEFAULT 'pendiente'
    CHECK ("estado" IN ('pendiente', 'asignado', 'en_progreso', 'completado')),
  "posicion" INTEGER NOT NULL DEFAULT 0,
  "fecha_limite" DATE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tareas_ward_id_idx ON "tareas" ("ward_id");
CREATE INDEX IF NOT EXISTS tareas_estado_idx ON "tareas" ("estado", "posicion");
CREATE INDEX IF NOT EXISTS tareas_discursante_id_idx ON "tareas" ("DiscursanteId");

ALTER TABLE "tareas" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ward scoped select tareas" ON "tareas";
DROP POLICY IF EXISTS "Ward scoped insert tareas" ON "tareas";
DROP POLICY IF EXISTS "Ward scoped update tareas" ON "tareas";
DROP POLICY IF EXISTS "Ward scoped delete tareas" ON "tareas";

CREATE POLICY "Ward scoped select tareas" ON "tareas"
  FOR SELECT TO authenticated
  USING ("ward_id" = public.current_org_id());

CREATE POLICY "Ward scoped insert tareas" ON "tareas"
  FOR INSERT TO authenticated
  WITH CHECK ("ward_id" = public.current_org_id());

CREATE POLICY "Ward scoped update tareas" ON "tareas"
  FOR UPDATE TO authenticated
  USING ("ward_id" = public.current_org_id())
  WITH CHECK ("ward_id" = public.current_org_id());

CREATE POLICY "Ward scoped delete tareas" ON "tareas"
  FOR DELETE TO authenticated
  USING ("ward_id" = public.current_org_id());

-- Grants (proyecto con auto-expose off: los privilegios se otorgan explícitamente).
GRANT USAGE ON SEQUENCE "public"."tareas_id_seq" TO "authenticated";
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."tareas" TO "authenticated";
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."tareas" TO "service_role";