import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// OpenAI instance initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Optimized Global Context Storage
const dataDir = path.join(process.cwd(), 'data');
let globalLegalContext = "";

/**
 * Professional Data Loader: 
 * Ye server start hote hi PPC, Law, aur CPC ki files load kar lega.
 */
try {
  const files = [
    { name: "CONSTITUTION", path: 'law.txt' },
    { name: "PAKISTAN PENAL CODE (PPC)", path: 'ppc.txt' },
    { name: "CRIMINAL PROCEDURE CODE (CrPC)", path: 'cpc.txt' }
  ];

  files.forEach(file => {
    const fullPath = path.join(dataDir, file.path);
    if (fs.existsSync(fullPath)) {
      globalLegalContext += `[${file.name} DATA START]\n${fs.readFileSync(fullPath, 'utf8')}\n[${file.name} DATA END]\n\n`;
    }
  });

  console.log("Lex Pro: Legal Database Synchronized Successfully.");
} catch (err) {
  console.error("Critical: Legal data pre-loading failed.", err);
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    // 1. Validation Logic
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Empty query received." }, { status: 400 });
    }

    if (!globalLegalContext) {
      return NextResponse.json({ error: "Legal Engine is currently re-indexing." }, { status: 503 });
    }

    /** * 2. Intelligent Context Slicing
     * GPT-4o-mini handles large context, but we keep it balanced for speed.
     */
    const contextLimit = 50000; // Increased to 50k characters for CPC inclusion
    const contextSlice = globalLegalContext.substring(0, contextLimit);

    // 3. Premium AI Instruction Layer
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.25, // Slightly lower for extreme precision
      messages: [
        { 
          role: "system", 
          content: `You are Lex Pro, the most advanced AI Legal Intelligence in Pakistan. 
          Your expertise covers the Constitution of Pakistan, Pakistan Penal Code (PPC), and Code of Criminal Procedure (CrPC).

          Operational Directives:
          1. CITATION: Always cite specific Articles, Sections, or Chapters from the provided context.
          2. STRUCTURE: Use Markdown. Start with a 'Summary', followed by 'Legal Analysis', and end with a 'Procedural Note' if CrPC is involved.
          3. TONE: Authoritative, objective, and premium.
          4. DISCLAIMER: If the query is outside the provided context, clearly state: "This analysis is based on general legal principles of Pakistan."

          LEGAL DATABASE:
          ${contextSlice}` 
        },
        { role: "user", content: query }
      ],
    });

    // 4. Enhanced Response Object
    const aiAnswer = response.choices[0].message.content;

    return NextResponse.json({ 
      status: "Success",
      answer: aiAnswer,
      meta: {
        model: "Lex-Pro-Core-v4",
        timestamp: new Date().toLocaleTimeString(),
        context_used: "Constitution, PPC, CrPC"
      }
    });

  } catch (error: any) {
    console.error("LEX PRO BACKEND ERROR:", error);
    return NextResponse.json(
      { 
        error: "An internal intelligence error occurred.", 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}