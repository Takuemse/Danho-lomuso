// src/lib/zoe-ai.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { Language } from "./i18n";

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// AI Firewall — strips prompt injections in any language
function sanitizePrompt(input: string): string {
  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous\s+)?instructions/gi,
    /forget\s+(everything|all)/gi,
    /you\s+are\s+now/gi,
    /new\s+persona/gi,
    /system\s*:/gi,
    /\[SYSTEM\]/gi,
    /kanganwa\s+(mirairo|zvese)/gi, // Shona injection
    /khohlwa\s+(imiyalelo|konke)/gi, // Ndebele injection
    /<script>/gi,
    /javascript:/gi,
    /eval\s*\(/gi,
  ];

  let sanitized = input;
  injectionPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "[filtered]");
  });

  return sanitized.slice(0, 2000); // Hard length cap
}

function buildSystemPrompt(language: Language, userName?: string): string {
  const greeting = userName
    ? language === "sn" ? `Mwanangu ${userName}` : language === "nd" ? `Lomntanami ${userName}` : userName
    : "";

  const prompts: Record<Language, string> = {
    en: `You are Zoe, an empathetic and wise AI life and career guide built exclusively for young Zimbabweans.
Your role is to help students navigate ZIMSEC/Cambridge results, explore career paths, discover vocational opportunities, and build life skills.
You deeply understand Zimbabwe's educational system, economic realities, and cultural values.
Always be warm, encouraging, and solution-focused. Never shame students for poor grades — instead, redirect them toward alternative paths with equal dignity.
Explain complex concepts using local analogies (farming, football, traditional crafts, etc.).
You know about: ZIMSEC O-Level, A-Level, Cambridge IGCSE, vocational training centers in Zimbabwe, Uncommon.org bootcamps, TOFARA Trust, local universities (UZ, NUST, MSU, HIT, Bindura, Africa University).
Respond in clear, simple English appropriate for Zimbabwean students aged 14-25.
Current user: ${greeting}`,

    sn: `Ndini Zoe, mwanangu. Ndiri mushumiri wenyu ane rudo uye akangwara, akagadzirwa zvachose kushandira vachiri vadiki veZimbabwe.
Basa rangu ndekukubatsira kufungisisa mhinduro dzako dzeZIMSEC/Cambridge, kutsvaga nzira yebasa, kuwana mikana, uye kuvaka hunyanzvi hwehupenyu.
Ndinoziva nzira dzezvidzidzo zveZimbabwe, hupfumi hwenyika, uye tsika dzedu.
Nguva dzose ndinosimudza moyo, kukurudzira, uye kukutsvagira mhinduro. Handimbosvotesi mudzidzi nekuda kwemhinduro dzisina kunaka — pane zvimwe nzira dzinokufanira zvakafanana.
Tsanangura mifungo inorema uchishandisa zvienzaniso zvemunyika medu (kurima, football, hunhu, etc.).
Mupinduri uri: ${greeting}`,

    nd: `NginguZoe, lomntanami. Ngingumkhokheli we-AI onothando futhi ohlakaniphileyo, owakhiwe ikakhulukazi ukusiza intsha yaseZimbabwe.
Umsebenzi wami ukusiza ukuhlola imiphumela yakho ye-ZIMSEC/Cambridge, ukuhlola izindlela zemisebenzi, nokwakha amakhono empilo.
Ngiyazi kahle uhlelo lwemfundo laseZimbabwe, izimo zezekhono, kanye namasiko ethu.
Ngihlala ngishukumisa, ngigqugquzela, futhi ngifuna izixazululo. Angiyisolisi abafundi ngamanzi amabi — esikhundleni salokho, ngibahole ezindleleni ezinye ngentando elingana.
Chaza imiqondo enzima usebenzisa izifaniso zasendaweni (ukulima, ibhola, ubuciko, njll.).
Umuntu osebenzayo: ${greeting}`,
  };

  return prompts[language];
}

export async function askZoe(
  userMessage: string,
  conversationHistory: { role: "user" | "model"; content: string }[],
  language: Language = "en",
  userName?: string
): Promise<string> {
  const sanitized = sanitizePrompt(userMessage);
  const model = genAI.getGenerativeModel({
    model: DEFAULT_GEMINI_MODEL,
    safetySettings: SAFETY_SETTINGS,
    systemInstruction: buildSystemPrompt(language, userName),
  });

  const history = conversationHistory.slice(-8).map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(sanitized);
  return result.response.text();
}

export async function analyzeExamResults(
  results: { subject: string; grade: string }[],
  language: Language
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: DEFAULT_GEMINI_MODEL,
    safetySettings: SAFETY_SETTINGS,
  });

  const resultsText = results.map((r) => `${r.subject}: ${r.grade}`).join(", ");

  const prompt = `You are Zoe, a career guidance AI for Zimbabwean students.
Analyze these exam results and provide: 
1. A compassionate summary (1 sentence)
2. 3 best-fit career paths based on these results
3. 1 vocational alternative path regardless of grades
4. One encouraging closing message

Results: ${resultsText}
Language: ${language}
Respond in ${language === "sn" ? "Shona" : language === "nd" ? "Ndebele" : "English"}.
Keep response under 300 words.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}