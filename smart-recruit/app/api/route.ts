import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!file || !jobDescription) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Extraer texto del PDF
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const pdf = require('pdf-parse'); // Importación dinámica para evitar errores
    const data = await pdf(buffer);

    // Configurar Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Analiza este CV basándote en la descripción del empleo.
      EMPLEO: ${jobDescription}
      CV: ${data.text}
      Responde SOLO con un objeto JSON:
      { "score": 0-100, "resumen": "", "puntosFuertes": [], "puntosMejora": [], "veredicto": "" }
    `;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text().replace(/```json|```/g, "");
    return NextResponse.json(JSON.parse(textResponse));

  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}