import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file) {
      throw new Error("No se recibió ningún PDF");
    }

    if (file.type !== "application/pdf") {
      throw new Error("Solo se aceptan archivos PDF");
    }

    if (!jobDescription) {
      throw new Error("No se recibió oferta de trabajo");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const text = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (errData: any) => {
        reject(errData.parserError);
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        let extracted = "";

        pdfData.Pages.forEach((page: any) => {
          page.Texts.forEach((item: any) => {
            item.R.forEach((run: any) => {
              extracted += decodeURIComponent(run.T) + " ";
            });
          });
        });

        resolve(extracted);
      });

      pdfParser.parseBuffer(buffer);
    });

        const prompt = `
    Actúa como un Senior Technical Recruiter con 15 años de experiencia en filtros ATS (Applicant Tracking Systems). 
    Tu tarea es realizar una auditoría implacable entre el CV del candidato y la oferta de trabajo.

    ====================
    CURRÍCULUM (CONTEXTO)
    ====================
    ${text}

    ====================
    OFERTA DE TRABAJO (OBJETIVO)
    ====================
    ${jobDescription}

    ====================
    REGLAS DE EVALUACIÓN (ESTRICTAS):
    1. RELEVANCIA TOTAL: Si el CV y la Oferta de Trabajo no pertenecen a la misma industria o el perfil no tiene ninguna relación (ej. un Chef aplicando a Senior Java Developer), el "score" DEBE ser 0.
    2. PENALIZACIÓN: No regales puntos. Si faltan más del 50% de las "hard skills" obligatorias, el score no debe superar 30.
    3. FORMATO: Devuelve exclusivamente un objeto JSON válido.

    Estructura JSON requerida:
    {
      "score": number,
      "resumen": "Análisis ejecutivo de la compatibilidad.",
      "puntosFuertes": ["Máximo 5 logros o skills alineadas"],
      "puntosMejora": ["Máximo 5 brechas críticas detectadas"],
      "veredicto": "Decisión final: 'Contratar', 'Entrevistar con dudas' o 'Descartar inmediatamente'.",
      "keywordsEncontradas": ["Tecnologías/herramientas validadas"],
      "keywordsFaltantes": ["Tecnologías/herramientas requeridas y ausentes"]
    }

    ADVERTENCIA: No incluyas explicaciones, ni etiquetas de código, ni texto adicional. Solo el objeto JSON.
    `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content || "{}";

    const clean = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(clean);

    const result = {
      score: parsed.score ?? 0,
      resumen: parsed.resumen ?? "Sin resumen",
      puntosFuertes: parsed.puntosFuertes ?? [],
      puntosMejora: parsed.puntosMejora ?? [],
      veredicto: parsed.veredicto ?? "Sin veredicto",
      keywordsEncontradas: parsed.keywordsEncontradas ?? [],
      keywordsFaltantes: parsed.keywordsFaltantes ?? [],
    };

    return NextResponse.json(result);

  } catch (error: any) {
    console.log("ERROR REAL:", error);

    return NextResponse.json({
      score: 0,
      resumen: "Error leyendo PDF o analizando CV",
      puntosFuertes: [],
      puntosMejora: [String(error.message)],
      veredicto: "Error",
      keywordsEncontradas: [],
      keywordsFaltantes: [],
    });
  }
}

