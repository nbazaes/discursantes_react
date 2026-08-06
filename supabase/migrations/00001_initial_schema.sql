CREATE TABLE IF NOT EXISTS "discursantes" (
  "id" SERIAL PRIMARY KEY,
  "Nombres" VARCHAR(100) NOT NULL,
  "Apellidos" VARCHAR(100) NOT NULL,
  "Llamamiento" VARCHAR(150),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "discursos" (
  "id" SERIAL PRIMARY KEY,
  "Fecha" DATE NOT NULL,
  "Tema" VARCHAR(255) NOT NULL,
  "DiscursanteId" INTEGER NOT NULL REFERENCES "discursantes"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "discursos_Fecha_idx" ON "discursos" ("Fecha");
CREATE INDEX IF NOT EXISTS "discursos_DiscursanteId_idx" ON "discursos" ("DiscursanteId");

ALTER TABLE "discursantes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "discursos" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on discursantes" ON "discursantes";
DROP POLICY IF EXISTS "Allow all on discursos" ON "discursos";
CREATE POLICY "Allow all on discursantes" ON "discursantes" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on discursos" ON "discursos" FOR ALL USING (true) WITH CHECK (true);
