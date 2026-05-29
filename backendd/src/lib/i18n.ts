// src/lib/i18n.ts
export type Language = "en" | "sn" | "nd";

export const translations = {
  en: {
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    career: "Career Explorer",
    chat: "Talk to Zoe",
    profile: "My Profile",
    parents: "For Parents",
    logout: "Sign Out",

    // Onboarding
    welcome: "Welcome to Danho Lomuso",
    welcomeSubtitle: "Your bridge to a brighter future",
    chooseLanguage: "Choose your language",
    getStarted: "Get Started",
    signIn: "Sign In",
    signUp: "Create Account",
    enterEmail: "Enter your email address",
    magicLinkSent: "Magic link sent! Check your email.",
    enterPhone: "Enter your phone number",
    otpSent: "OTP sent to your phone",

    // Dashboard
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    yourPoints: "Your Danho Points",
    chatTokens: "Chat Tokens Today",
    streak: "Day Streak",
    continueJourney: "Continue Your Journey",
    completedMilestones: "Milestones Achieved",

    // Zoe
    zoeName: "Zoe",
    zoeTagline: "Your AI Life & Career Guide",
    askZoe: "Ask Zoe anything...",
    zoeThinking: "Zoe is thinking...",
    tokensRemaining: "tokens remaining today",
    earnMoreTokens: "Earn more by completing activities",

    // Career
    exploreCareer: "Explore Career Paths",
    careerMatch: "Your Career Matches",
    viewPath: "View Path",
    vocationalTrack: "Vocational Track",
    universityTrack: "University Track",

    // Feedback
    giveFeedback: "Share Feedback",
    feedbackReward: "+3 Danho Points for your feedback!",
    submitFeedback: "Submit Feedback",

    // Common
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    next: "Next",
    back: "Back",
    points: "points",
    free: "Free",
    premium: "Premium",
  },

  sn: {
    // Navigation
    home: "Kumba",
    dashboard: "Panerero",
    career: "Kubata Basa",
    chat: "Taura naZoe",
    profile: "Vane Rangu",
    parents: "Kune Vabereki",
    logout: "Buda",

    // Onboarding
    welcome: "Mauya kuDanho Lomuso",
    welcomeSubtitle: "Nzira yako kuramangwana rakanaka",
    chooseLanguage: "Sarudza mutauro",
    getStarted: "Tanga Ino",
    signIn: "Pinda",
    signUp: "Ita Account",
    enterEmail: "Isa email yako",
    magicLinkSent: "Link yatumwa! Tarisa email yako.",
    enterPhone: "Isa nhamba yako yefoni",
    otpSent: "OTP yatumwa kufoni yako",

    // Dashboard
    goodMorning: "Mangwanani",
    goodAfternoon: "Masikati",
    goodEvening: "Manheru",
    yourPoints: "Danho Points Dzako",
    chatTokens: "Matokeni Enhasi",
    streak: "Mazuva Ateedzana",
    continueJourney: "Enda mberi nerwendo rwako",
    completedMilestones: "Zvaukabudirira",

    // Zoe
    zoeName: "Zoe",
    zoeTagline: "Mwanangu, ndiri pano kukubatsira",
    askZoe: "Bvunza Zoe chero chinhu...",
    zoeThinking: "Zoe ari kufunga...",
    tokensRemaining: "matokeni asara nhasi",
    earnMoreTokens: "Wana akawanda nekupedza mabasa",

    // Career
    exploreCareer: "Tsvaga Nzira yeBasa",
    careerMatch: "Mabasa Anokufanira",
    viewPath: "Ona Nzira",
    vocationalTrack: "Dzidziso yeHunyanzvi",
    universityTrack: "Nzira yeYunivhesiti",

    // Feedback
    giveFeedback: "Tipa Mafungiro Ako",
    feedbackReward: "+3 Danho Points nekuda kwemafungiro ako!",
    submitFeedback: "Tumira Mafungiro",

    // Common
    loading: "Miriro...",
    save: "Sevha",
    cancel: "Dzosera",
    next: "Mberi",
    back: "Dzoka",
    points: "mapoinzi",
    free: "Mahara",
    premium: "Yakakwira",
  },

  nd: {
    // Navigation
    home: "Ekhaya",
    dashboard: "Ikhasi Lami",
    career: "Izindlela Zemisebenzi",
    chat: "Khuluma loZoe",
    profile: "Iprofile Yami",
    parents: "Kubazali",
    logout: "Phuma",

    // Onboarding
    welcome: "Wamukelekile eDanho Lomuso",
    welcomeSubtitle: "Indlela yakho ikusasa elihle",
    chooseLanguage: "Khetha ulimi lwakho",
    getStarted: "Qalisa Lapha",
    signIn: "Ngena",
    signUp: "Yenza i-Account",
    enterEmail: "Faka i-email yakho",
    magicLinkSent: "I-link ithunyiwe! Bheka i-email yakho.",
    enterPhone: "Faka inombolo yakho yefoni",
    otpSent: "I-OTP ithunyiwe efonini yakho",

    // Dashboard
    goodMorning: "Lilizwi",
    goodAfternoon: "Sawubona",
    goodEvening: "Sawubona ntambama",
    yourPoints: "Izindawo Zakho zeDanho",
    chatTokens: "Amatokeni Namuhla",
    streak: "Izinsuku Ezilandelanayo",
    continueJourney: "Qhubeka uhambo lwakho",
    completedMilestones: "Izinto Oziphumelelileyo",

    // Zoe
    zoeName: "Zoe",
    zoeTagline: "Lomntanami, ngilapha ukukusiza",
    askZoe: "Buza u-Zoe noma yini...",
    zoeThinking: "U-Zoe uyacabanga...",
    tokensRemaining: "amatokeni asele namuhla",
    earnMoreTokens: "Thola amaningi ngokuqedela imisebenzi",

    // Career
    exploreCareer: "Hlola Izindlela Zemisebenzi",
    careerMatch: "Imisebenzi Efanele Wena",
    viewPath: "Bona Indlela",
    vocationalTrack: "Ukhondo Lwamakhono",
    universityTrack: "Ukhondo Lweyunivesithi",

    // Feedback
    giveFeedback: "Nika Imibono Yakho",
    feedbackReward: "+3 Danho Points ngomuso wakho!",
    submitFeedback: "Thumela Imibono",

    // Common
    loading: "Kulindile...",
    save: "Londoloza",
    cancel: "Khansela",
    next: "Phambili",
    back: "Emuva",
    points: "amaphuzu",
    free: "Mahhala",
    premium: "Ephezulu",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export function getGreeting(lang: Language): string {
  const hour = new Date().getHours();
  if (hour < 12) return t(lang, "goodMorning");
  if (hour < 17) return t(lang, "goodAfternoon");
  return t(lang, "goodEvening");
}