import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    score: 82,
    resumen: "Conexión backend correcta.",
    puntosFuertes: [
      "Frontend conectado",
      "Formulario funcionando",
      "API responde correctamente"
    ],
    puntosMejora: [
      "Falta leer PDF",
      "Falta análisis IA"
    ],
    veredicto: "Base del sistema funcionando."
  });
}