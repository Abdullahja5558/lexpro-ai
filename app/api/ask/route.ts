import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";


const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing in .env.local");
}

const client = new GoogleGenAI({
  apiKey: API_KEY || ""
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
    if (!API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    await loadLegalDatabase();
    const { query } = await req.json();

    if (!query) return NextResponse.json({ error: "Query missing" }, { status: 400 });

    const context = getRelevantContext(query);
    
    // Strict instructions to prevent
    const systemPrompt = `
      You are "Lex Pro AI", a premium legal assistant for Pakistan Law.
      
      PERSONALITY:
      - For casual greetings (Hi, Hello, How are you), respond as a polite professional.
      
      LEGAL RESPONSE RULES:
      - If answering a legal query, use the Context: ${context || "General Pakistan Law knowledge"}.
      - Respond in the user's language.
      - Start legal answers with: "According to Pakistani Law..."
      
      FORMATTING RULES (STRICT):
      - DO NOT wrap headings in extra symbols or excessive stars.
      - Use ONLY one middle dot (•) at the start and the end of each heading.
      - Use these EXACT headings:
        • Legal Explanation
        • Relevant Law (Sections/Articles)
        • Legal Analysis
        • Example
        • Conclusion

      User Query: ${query}
    `;

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [{ text: systemPrompt }]
      }]
    });

    // Final cleanup to ensure no weird wrapping symbols
    let answerText = response?.text || "I apologize, I cannot process this request right now.";
    
    return NextResponse.json({
      answer: answerText,
      metadata: { engine: "Gemini 3 Flash Turbo" }
    });

  } catch (error: any) {
    console.error("❌ API Error:", error.message);
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}