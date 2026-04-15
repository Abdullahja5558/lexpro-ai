import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs/promises'; 
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


let legalDatabase: { name: string, content: string }[] = [];


async function loadLegalDatabase() {
  if (legalDatabase.length > 0) return; 

  const dataDir = path.join(process.cwd(), 'data');
  const files = [
    { name: "Constitution of Pakistan", path: 'law.txt' },
    { name: "Pakistan Penal Code (PPC)", path: 'ppc.txt' },
    { name: "Code of Criminal Procedure (CrPC)", path: 'cpc.txt' }
  ];

  for (const file of files) {
    try {
      const fullPath = path.join(dataDir, file.path);
      const content = await fs.readFile(fullPath, 'utf8');
      legalDatabase.push({ name: file.name, content });
    } catch (err) {
      console.warn(`Warning: Could not load ${file.name}`);
    }
  }
}


 
 

function getRelevantContext(query: string, limit: number = 40000): string {
  const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
  let context = "";

  legalDatabase.forEach(doc => {
    
    const lines = doc.content.split('\n');
    const relevantLines = lines.filter(line => 
      keywords.some(key => line.toLowerCase().includes(key))
    ).slice(0, 100); 

    context += `\n[SOURCE: ${doc.name}]\n${relevantLines.join('\n')}\n`;
  });

  
  if (context.length < 500) {
    context = legalDatabase.map(d => d.content.substring(0, 15000)).join('\n');
  }

  return context.substring(0, limit);
}

export async function POST(req: Request) {
  try {
    await loadLegalDatabase();
    const { query, language = "English" } = await req.json();

    if (!query) return NextResponse.json({ error: "No query provided" }, { status: 400 });

    const contextSlice = getRelevantContext(query);

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use GPT-4o for superior legal reasoning
      temperature: 0.1, // Near-zero for factual consistency
      messages: [
        { 
          role: "system", 
          content: `You are Lex Pro Core v4, a high-level Legal Intelligence System for Pakistan.
          
          GOAL: Provide actionable, cited, and cross-referenced legal analysis.
          
          STRICT PROTOCOLS:
          1. CROSS-REFERENCE: Link CrPC procedures to PPC offenses. (e.g., "Under PPC 302, the procedure for bail is governed by CrPC 497").
          2. HIERARCHY: Always check if the Constitution overrides the specific Section mentioned.
          3. LANGUAGE: Respond in ${language}. If Urdu, use professional legal terminology (Adalati Zuban).
          
          
          LEGAL REFERENCE DATA:
          ${contextSlice}` 
        },
        { role: "user", content: query }
      ],
    });

    return NextResponse.json({ 
      answer: response.choices[0].message.content,
      metadata: {
        engine: "Lex Pro AI - Sovereign Edition",
        reliability_score: "High",
        docs_consulted: legalDatabase.map(d => d.name)
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}