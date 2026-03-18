export interface Discursante {
  id: number;
  Nombres: string;
  Apellidos: string;
  Llamamiento: string | null;
  discursos?: Array<{
    Fecha: string;
    Tema: string;
  }>;
  ultimaFecha?: string | null;
}

export interface Discurso {
  id: number;
  Fecha: string;
  Tema: string;
  DiscursanteId: number;
  discursante?: Discursante;
}

export interface DomingoAgrupado {
  fecha: string;
  discursos: Discurso[];
}
