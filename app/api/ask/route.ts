import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";

const API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6KM_ryxaORymuxPiP3gMsYkHVkNoQyhdo0B2-F0_p5gdg";

const client = new GoogleGenAI({
  apiKey: API_KEY
});

let legalDatabase: { name: string; content: string }[] = [];

async function loadLegalDatabase() {
  if (legalDatabase.length > 0) return;
  const dataDir = path.join(process.cwd(), "data");
  const files = [
    { name: "Constitution of Pakistan", path: "law.txt" },
    { name: "Pakistan Penal Code (PPC)", path: "ppc.txt" },
    { name: "Code of Criminal Procedure (CrPC)", path: "cpc.txt" },
    { name: "Qanun-e-Shahadat Order (QSO)", path: "QS.txt" },
  ];

  for (const file of files) {
    try {
      const fullPath = path.join(dataDir, file.path);
      const content = await fs.readFile(fullPath, "utf8");
      legalDatabase.push({ name: file.name, content });
    } catch (err) {
      console.warn(`File missing: ${file.name}`);
    }
  }
}

function getRelevantContext(query: string) {
  const keywords = query.toLowerCase().split(" ").filter(w => w.length > 3);
  let context = "";
  for (const doc of legalDatabase) {
    const lines = doc.content.split("\n");
    const matches = lines
      .filter(line => keywords.some(k => line.toLowerCase().includes(k)))
      .slice(0, 25);
    if (matches.length > 0) {
      context += `\n--- SOURCE: ${doc.name} ---\n${matches.join("\n")}\n`;
    }
  }
  return context.slice(0, 5000);
}

export async function POST(req: Request) {
  try {
    await loadLegalDatabase();
    const { query } = await req.json();

    if (!query) return NextResponse.json({ error: "Query missing" }, { status: 400 });

    const context = getRelevantContext(query);
    
    // Prompt logic for both Legal and Casual talk
    const systemPrompt = `
      You are "Lex Pro AI", a premium legal intelligence assistant for Pakistan.
      
      PERSONALITY:
      - If the user says "Hi", "Hello", "How are you?", or casual talk, respond politely as a professional legal expert.
      - Example: "I am Lex Pro AI, your legal consultant. How can I assist you with Pakistani law today? "
      
      LEGAL RULES:
      - If the user asks a legal question, use the Context: ${context || "General Law Knowledge"}.
      - Respond in the user's language (Urdu, Roman Urdu, or English).
      - Use these EXACT bold headings with middle dots for legal answers:
        • Legal Explanation
        • Relevant Law (Sections/Articles)
        • Legal Analysis
        • Example
        • Conclusion
      - Start legal answers with: "According to Pakistani Law..."
      
      User Query: ${query}
    `;

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [{ text: systemPrompt }]
      }]
    });

    const answerText = response?.text || "I apologize, I'm having trouble processing that right now.";

    return NextResponse.json({
      answer: answerText,
      metadata: { engine: "Gemini 3 Flash Turbo" }
    });

  } catch (error: any) {
    console.error("❌ Lex Pro API Error:", error.message);
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}