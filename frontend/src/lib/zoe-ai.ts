// src/lib/zoe-ai.ts
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

export type Language = "en" | "sn" | "nd";

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const SAFETY = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

function firewall(input: string): string {
  return input
    .replace(/ignore\s+(all\s+)?(previous\s+)?instructions/gi, "[filtered]")
    .replace(/forget\s+(everything|all)/gi, "[filtered]")
    .replace(/you\s+are\s+now/gi, "[filtered]")
    .replace(/\[SYSTEM\]/gi, "[filtered]")
    .replace(/<script>/gi, "[filtered]")
    .replace(/javascript:/gi, "[filtered]")
    .replace(/kanganwa\s+(mirairo|zvese)/gi, "[filtered]")
    .replace(/khohlwa\s+(imiyalelo|konke)/gi, "[filtered]")
    .slice(0, 2000);
}

function systemPrompt(language: Language, userName?: string): string {
  const name = userName
    ? language === "sn"
      ? `Mwanangu ${userName}`
      : language === "nd"
      ? `Lomntanami ${userName}`
      : userName
    : "";

  if (language === "sn") {
    return `Ndini Zoe, mwanangu. Ndiri mushumiri wenyu ane rudo, akagadzirwa kushandira vachiri vadiki veZimbabwe.
Basa rangu ndekukubatsira kufungisisa mhinduro dzako dzeZIMSEC/Cambridge, kutsvaga nzira yebasa, uye kuvaka hunyanzvi hwehupenyu.
Ndinoziva nzira dzezvidzidzo zveZimbabwe, hupfumi hwenyika, uye tsika dzedu.
Nguva dzose ndinosimudza moyo uye kukurudzira. Handimbosvotesi mudzidzi.
${name ? `Mupinduri uri: ${name}` : ""}`;
  }

  if (language === "nd") {
    return `NginguZoe, lomntanami. Ngingumkhokheli we-AI onothando, owakhiwe ukusiza intsha yaseZimbabwe.
Umsebenzi wami ukusiza ukuhlola imiphumela yakho ye-ZIMSEC/Cambridge, nokwakha amakhono empilo.
Ngiyazi kahle uhlelo lwemfundo laseZimbabwe kanye namasiko ethu.
Ngihlala ngigqugquzela futhi ngifuna izixazululo.
${name ? `Umuntu osebenzayo: ${name}` : ""}`;
  }

  return `You are Zoe, an empathetic AI life and career guide built for young Zimbabweans.
Help students with ZIMSEC/Cambridge results, career paths, vocational opportunities, and life skills.
You know Zimbabwe's educational system deeply: O-Level, A-Level, Cambridge IGCSE, UZ, NUST, MSU, HIT, Bindura, Africa University, Uncommon.org, TOFARA Trust, Harare Polytechnic, Bulawayo Polytechnic.
Always be warm, encouraging, and solution-focused. Never shame students for low grades.
Use local analogies when explaining complex topics (farming, football, crafts, etc.).
Respond in simple English for students aged 14-25.
${name ? `Current user: ${name}` : ""}`;
}

export async function askZoe(
  userMessage: string,
  conversationHistory: { role: "user" | "model"; content: string }[],
  language: Language = "en",
  userName?: string
): Promise<string> {
  const clean = firewall(userMessage);

  const model = genAI.getGenerativeModel({
    model: DEFAULT_GEMINI_MODEL,
    safetySettings: SAFETY,
    systemInstruction: systemPrompt(language, userName),
  });

  // Gemini requires history to start with 'user' role
  // Filter out the opening Zoe greeting (model message) if it's first
  const rawHistory = conversationHistory.slice(-8);

  // Drop leading model messages — Gemini only accepts user-first history
  let startIndex = 0;
  while (startIndex < rawHistory.length && rawHistory[startIndex].role === "model") {
    startIndex++;
  }
  const validHistory = rawHistory.slice(startIndex);

  // Gemini also requires history to come in user/model pairs
  // If we have an odd number after trimming, drop the last incomplete pair
  const pairedHistory = validHistory.slice(
    0,
    validHistory.length - (validHistory.length % 2)
  );

  const history = pairedHistory.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(clean);
  return result.response.text();
}

export async function analyzeExamResults(
  results: { subject: string; grade: string }[],
  language: Language
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: DEFAULT_GEMINI_MODEL,
    safetySettings: SAFETY,
  });

  const langName =
    language === "sn" ? "Shona" : language === "nd" ? "Ndebele" : "English";

  const resultsText = results.map((r) => `${r.subject}: ${r.grade}`).join(", ");

  const result = await model.generateContent(
    `You are Zoe, a career guidance AI for Zimbabwean students.
Analyze these exam results and provide in ${langName}:
1. A compassionate one-sentence summary
2. Three best-fit career paths
3. One vocational alternative path
4. One encouraging closing message

Results: ${resultsText}
Keep under 300 words. Be warm and encouraging.`
  );

  return result.response.text();
}