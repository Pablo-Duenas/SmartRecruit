import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";
import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file) {
      throw new Error("No se recibió ningún PDF");
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
Analiza este currículum frente a una oferta de trabajo.

====================
CV DEL CANDIDATO
====================
${text}

====================
OFERTA DE TRABAJO
====================
${jobDescription}

Devuelve SOLO JSON válido con esta estructura exacta:

{
  "score": number,
  "resumen": "string",
  "puntosFuertes": ["string", "string", "string"],
  "puntosMejora": ["string", "string", "string"],
  "veredicto": "string",
  "keywordsEncontradas": ["string", "string", "string"],
  "keywordsFaltantes": ["string", "string", "string"]
}

REGLAS:
- score entre 0 y 100
- resumen corto y profesional
- puntosFuertes claros y concretos
- puntosMejora accionables
- veredicto útil y honesto
- keywordsEncontradas = tecnologías, herramientas o skills presentes en CV y relevantes para la oferta
- keywordsFaltantes = requisitos importantes no detectados en el CV
- máximo 6 elementos por lista
- no inventar tecnologías
- no escribas texto fuera del JSON
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

    const raw = completion.choices[0].message.content || "{}";

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
      veredicto: "Revisa backend",
      keywordsEncontradas: [],
      keywordsFaltantes: [],
    });
  }
}