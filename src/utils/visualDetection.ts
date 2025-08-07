// src/utils/visualDetection.ts

export interface VisualDetectionResult {
  isVisual: boolean;
  confidence: number;
  searchTerms: string;
  detectedPatterns: string[];
}

export const VISUAL_PATTERNS = {
  explicit: [
    "show me",
    "can you show",
    "display",
    "visualize",
    "what does",
    "how does",
    "looks like",
    "look like",
    "diagram of",
    "picture of",
    "image of",
    "photo of",
    "illustration of",
    "drawing of",
    "sketch of",
    "screenshot",
  ],

  implicit: [
    "appearance",
    "structure",
    "anatomy",
    "design",
    "architecture",
    "layout",
    "composition",
    "shape",
    "color",
    "texture",
    "pattern",
    "form",
  ],

  comparison: [
    "difference between",
    "compare",
    "versus",
    "vs",
    "distinguish",
    "contrast",
    "similar to",
  ],

  educational: [
    "explain how",
    "understand",
    "work",
    "process",
    "mechanism",
    "system",
    "cycle",
    "flow",
  ],
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "been",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "can",
  "please",
  "help",
  "show",
  "me",
  "us",
  "tell",
  "explain",
  "what",
  "how",
  "why",
  "when",
  "where",
  "which",
]);

export function detectVisualIntent(message: string): VisualDetectionResult {
  if (!message || typeof message !== "string") {
    return {
      isVisual: false,
      confidence: 0,
      searchTerms: "",
      detectedPatterns: [],
    };
  }

  const lowerMessage = message.toLowerCase();
  const detectedPatterns: string[] = [];
  let confidence = 0;

  // Check patterns and assign confidence
  for (const pattern of VISUAL_PATTERNS.explicit) {
    if (lowerMessage.includes(pattern)) {
      detectedPatterns.push(pattern);
      confidence = Math.max(confidence, 0.9);
    }
  }

  for (const pattern of VISUAL_PATTERNS.comparison) {
    if (lowerMessage.includes(pattern)) {
      detectedPatterns.push(pattern);
      confidence = Math.max(confidence, 0.7);
    }
  }

  for (const pattern of VISUAL_PATTERNS.implicit) {
    if (lowerMessage.includes(pattern)) {
      detectedPatterns.push(pattern);
      confidence = Math.max(confidence, 0.6);
    }
  }

  const searchTerms = extractSearchTerms(lowerMessage);

  return {
    isVisual: confidence > 0.5,
    confidence,
    searchTerms,
    detectedPatterns: Array.from(new Set(detectedPatterns)),
  };
}

function extractSearchTerms(message: string): string {
  let cleaned = message
    .replace(/\?/g, "")
    .replace(/show me|can you show|please show|i need to see|let me see/gi, "")
    .replace(/what does|how does|what is|how is/gi, "")
    .replace(/look like|looks like|appear|appears/gi, "")
    .replace(/diagram of|picture of|image of|photo of/gi, "")
    .replace(/explain|tell me about|describe/gi, "");

  const words = cleaned
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));

  return words.join(" ").trim();
}
