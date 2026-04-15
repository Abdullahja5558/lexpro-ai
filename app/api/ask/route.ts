import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let legalDatabase: { name: string; content: string }[] = [];

async function loadLegalDatabase() {
  if (legalDatabase.length > 0) return;

  const dataDir = path.join(process.cwd(), "data");

  const files = [
    { name: "Constitution of Pakistan", path: "law.txt" },
    { name: "Pakistan Penal Code (PPC)", path: "ppc.txt" },
    { name: "Code of Criminal Procedure (CrPC)", path: "cpc.txt" },
    { name: "Qanun-e-Shahadat Order (QSO), 1984", path: "QS.txt" },
  ];

  for (const file of files) {
    try {
      const fullPath = path.join(dataDir, file.path);
      const content = await fs.readFile(fullPath, "utf8");
      legalDatabase.push({ name: file.name, content });
    } catch (err) {
      console.warn(`Could not load ${file.name}`);
    }
  }
}

function getRelevantContext(query: string, limit = 35000) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((w) => w.length > 3);

  let context = "";

  for (const doc of legalDatabase) {
    const lines = doc.content.split("\n");

    const relevantLines = lines
      .filter((line) =>
        keywords.some((key) => line.toLowerCase().includes(key))
      )
      .slice(0, 80);

    if (relevantLines.length > 0) {
      context += `\n=== ${doc.name} ===\n${relevantLines.join("\n")}\n`;
    }
  }

  if (context.length < 500) {
    context = legalDatabase
      .map((d) => `=== ${d.name} ===\n${d.content.slice(0, 8000)}`)
      .join("\n\n");
  }

  return context.slice(0, limit);
}

export async function POST(req: Request) {
  try {
    await loadLegalDatabase();

    const { query, language = "English" } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const context = getRelevantContext(query);

    const systemPrompt = `
You are "Lex Pro AI", a professional legal assistant for Pakistan law.

🚨 RESPONSE RULES (VERY IMPORTANT):
1. Always give detailed answers (not short).
2. Always structure answer in clear headings.
3. Always explain step by step.
4. Always include real legal references from context.
5. Always include examples (very important).
6. Always start explanations with:
   "According to Pakistani Law..."
7. If user language is Urdu, respond fully in Urdu (legal Urdu style).
8. If English, use simple professional legal English.
9. If question is complex, break into sections.

📌 REQUIRED FORMAT:

• 1. Legal Explanation
• 2. Relevant Law (PPC / CrPC / Constitution / QSO)
• 3. Legal Analysis
• 4. Example Case / Scenario
• 5. Final Conclusion

📚 LEGAL DATABASE CONTEXT:
${context}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: query,
        },
      ],
    });

    return NextResponse.json({
      answer: response.choices[0].message.content,
      metadata: {
        engine: "Lex Pro AI - Enhanced Legal Reasoning",
        language_used: language,
        docs_used: legalDatabase.map((d) => d.name),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}