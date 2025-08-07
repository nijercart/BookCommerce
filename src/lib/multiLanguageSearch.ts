// Multi-language search utility for Bangla and English
export interface SearchableItem {
  id: string;
  title: string;
  author: string;
  description?: string;
  category?: string;
  [key: string]: any;
}

// Common Bangla to English transliteration patterns
const transliterationMap: Record<string, string[]> = {
  // Vowels
  'আ': ['a', 'aa'],
  'ই': ['i', 'ee'],
  'ঈ': ['i', 'ee'],
  'উ': ['u', 'oo'],
  'ঊ': ['u', 'oo'],
  'এ': ['e', 'ay'],
  'ও': ['o', 'oh'],
  
  // Consonants
  'ক': ['k', 'c'],
  'খ': ['kh'],
  'গ': ['g'],
  'ঘ': ['gh'],
  'চ': ['ch', 'c'],
  'ছ': ['chh'],
  'জ': ['j'],
  'ঝ': ['jh'],
  'ট': ['t'],
  'ঠ': ['th'],
  'ড': ['d'],
  'ঢ': ['dh'],
  'ণ': ['n'],
  'ত': ['t'],
  'থ': ['th'],
  'দ': ['d'],
  'ধ': ['dh'],
  'ন': ['n'],
  'প': ['p'],
  'ফ': ['ph', 'f'],
  'ব': ['b', 'v'],
  'ভ': ['bh'],
  'ম': ['m'],
  'য': ['j', 'y'],
  'র': ['r'],
  'ল': ['l'],
  'শ': ['sh', 's'],
  'ষ': ['sh', 's'],
  'স': ['s'],
  'হ': ['h'],
  'য়': ['y'],
  'ড়': ['r'],
  'ঢ়': ['rh'],
  'ৎ': ['t'],
  'ং': ['ng'],
  'ঃ': ['h'],
  'ঁ': [''],
};

// Common English to Bangla phonetic patterns
const phoneticMap: Record<string, string[]> = {
  'a': ['আ', 'এ'],
  'i': ['ই', 'ঈ'],
  'u': ['উ', 'ঊ'],
  'e': ['এ', 'ই'],
  'o': ['ও', 'অ'],
  'k': ['ক'],
  'g': ['গ'],
  'ch': ['চ', 'ছ'],
  'j': ['জ', 'য'],
  't': ['ত', 'ট'],
  'd': ['দ', 'ড'],
  'n': ['ন', 'ণ'],
  'p': ['প'],
  'b': ['ব'],
  'v': ['ভ', 'ব'],
  'm': ['ম'],
  'r': ['র'],
  'l': ['ল'],
  'sh': ['শ', 'ষ'],
  's': ['স', 'শ', 'ষ'],
  'h': ['হ'],
  'y': ['য', 'য়'],
  'f': ['ফ'],
  'th': ['থ', 'ঠ'],
  'dh': ['ধ', 'ঢ'],
  'kh': ['খ'],
  'gh': ['ঘ'],
  'ph': ['ফ'],
  'bh': ['ভ'],
  'ng': ['ং'],
};

// Common Bangla book-related terms and their English equivalents
const commonTerms: Record<string, string[]> = {
  'বই': ['book', 'books', 'boi'],
  'গল্প': ['story', 'golpo', 'galpo'],
  'উপন্যাস': ['novel', 'uponnash', 'uponyas'],
  'কবিতা': ['poem', 'poetry', 'kobita'],
  'ইতিহাস': ['history', 'itihas'],
  'বিজ্ঞান': ['science', 'biggan', 'vigyan'],
  'গণিত': ['math', 'mathematics', 'gonit'],
  'ধর্ম': ['religion', 'dharma', 'dhormmo'],
  'রাজনীতি': ['politics', 'rajniti'],
  'অর্থনীতি': ['economics', 'orthoniti'],
  'দর্শন': ['philosophy', 'dorshon'],
  'মনোবিজ্ঞান': ['psychology', 'monobiggan'],
  'সাহিত্য': ['literature', 'sahitya'],
  'প্রবন্ধ': ['essay', 'probondho'],
  'আত্মজীবনী': ['biography', 'autobiography', 'atmojiboni'],
  'রহস্য': ['mystery', 'rohoshsho'],
  'রোমান্স': ['romance', 'romantic'],
  'কল্পবিজ্ঞান': ['science fiction', 'sci-fi', 'kolpobiggan'],
  'ভ্রমণ': ['travel', 'bhromon'],
  'রান্না': ['cooking', 'recipe', 'ranna'],
  'স্বাস্থ্য': ['health', 'shasthyo'],
  'শিশু': ['children', 'kids', 'shishu'],
  'তরুণ': ['young adult', 'teenage', 'tarun'],
  'প্রাপ্তবয়স্ক': ['adult', 'praptoboyoshko'],
};

/**
 * Generate transliteration variations for Bangla text
 */
function generateTransliterations(banglaText: string): string[] {
  const variations: string[] = [];
  let current = '';
  
  for (const char of banglaText) {
    const transliterations = transliterationMap[char];
    if (transliterations) {
      // For now, just use the first transliteration
      current += transliterations[0];
    } else {
      current += char;
    }
  }
  
  if (current) {
    variations.push(current);
  }
  
  return variations;
}

/**
 * Generate phonetic variations for English text
 */
function generatePhoneticVariations(englishText: string): string[] {
  const variations: string[] = [];
  const words = englishText.toLowerCase().split(/\s+/);
  
  for (const word of words) {
    // Check for direct matches in phonetic map
    for (const [english, banglaChars] of Object.entries(phoneticMap)) {
      if (word.includes(english)) {
        for (const banglaChar of banglaChars) {
          variations.push(word.replace(english, banglaChar));
        }
      }
    }
  }
  
  return variations;
}

/**
 * Check if text contains Bangla characters
 */
function isBanglaText(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

/**
 * Normalize text by removing diacritics and converting to lowercase
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u0981\u09BC\u09CD]/g, '') // Remove Bangla diacritics
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Calculate similarity score between two strings using Levenshtein distance
 */
function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;
  
  const matrix: number[][] = [];
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const maxLen = Math.max(len1, len2);
  return maxLen === 0 ? 1 : (maxLen - matrix[len1][len2]) / maxLen;
}

/**
 * Check if query matches text using various strategies
 */
function matchesQuery(text: string, query: string, threshold: number = 0.6): { matches: boolean; score: number } {
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  
  // Exact match
  if (normalizedText.includes(normalizedQuery)) {
    return { matches: true, score: 1 };
  }
  
  // Word-by-word matching
  const textWords = normalizedText.split(/\s+/);
  const queryWords = normalizedQuery.split(/\s+/);
  
  let matchedWords = 0;
  let totalScore = 0;
  
  for (const queryWord of queryWords) {
    let bestWordScore = 0;
    
    for (const textWord of textWords) {
      const similarity = calculateSimilarity(textWord, queryWord);
      bestWordScore = Math.max(bestWordScore, similarity);
    }
    
    if (bestWordScore >= threshold) {
      matchedWords++;
    }
    totalScore += bestWordScore;
  }
  
  const score = matchedWords > 0 ? totalScore / queryWords.length : 0;
  return { matches: score >= threshold, score };
}

/**
 * Advanced multi-language search function
 */
export function multiLanguageSearch<T extends SearchableItem>(
  items: T[],
  query: string,
  options: {
    threshold?: number;
    searchFields?: Array<keyof T>;
    includeTransliteration?: boolean;
    includePhonetic?: boolean;
  } = {}
): Array<T & { searchScore: number }> {
  if (!query.trim()) {
    return items.map(item => ({ ...item, searchScore: 0 }));
  }
  
  const {
    threshold = 0.4,
    searchFields = ['title', 'author', 'description', 'category'],
    includeTransliteration = true,
    includePhonetic = true,
  } = options;
  
  const normalizedQuery = normalizeText(query);
  const isBanglaQuery = isBanglaText(query);
  
  // Generate search variations
  const searchVariations = [normalizedQuery];
  
  // Add common term translations
  for (const [bangla, englishTerms] of Object.entries(commonTerms)) {
    if (isBanglaQuery && normalizedQuery.includes(bangla)) {
      searchVariations.push(...englishTerms);
    } else if (!isBanglaQuery) {
      for (const englishTerm of englishTerms) {
        if (normalizedQuery.includes(englishTerm)) {
          searchVariations.push(bangla);
        }
      }
    }
  }
  
  // Add transliteration variations
  if (includeTransliteration) {
    if (isBanglaQuery) {
      searchVariations.push(...generateTransliterations(normalizedQuery));
    } else if (includePhonetic) {
      searchVariations.push(...generatePhoneticVariations(normalizedQuery));
    }
  }
  
  const results: Array<T & { searchScore: number }> = [];
  
  for (const item of items) {
    let bestScore = 0;
    let hasMatch = false;
    
    // Search across specified fields
    for (const field of searchFields) {
      const fieldValue = item[field];
      if (typeof fieldValue !== 'string') continue;
      
      // Test all search variations
      for (const searchVariation of searchVariations) {
        const { matches, score } = matchesQuery(fieldValue, searchVariation, threshold);
        
        if (matches) {
          hasMatch = true;
          bestScore = Math.max(bestScore, score);
        }
      }
    }
    
    if (hasMatch) {
      results.push({ ...item, searchScore: bestScore });
    }
  }
  
  // Sort by search score (highest first)
  return results.sort((a, b) => b.searchScore - a.searchScore);
}

/**
 * Get search suggestions based on partial input
 */
export function getSearchSuggestions(
  items: SearchableItem[],
  partialQuery: string,
  maxSuggestions: number = 5
): string[] {
  if (partialQuery.length < 2) return [];
  
  const suggestions = new Set<string>();
  const normalizedQuery = normalizeText(partialQuery);
  
  for (const item of items) {
    const searchableTexts = [item.title, item.author];
    if (item.description) searchableTexts.push(item.description);
    if (item.category) searchableTexts.push(item.category);
    
    for (const text of searchableTexts) {
      const words = normalizeText(text).split(/\s+/);
      
      for (const word of words) {
        if (word.startsWith(normalizedQuery) && word.length > normalizedQuery.length) {
          suggestions.add(word);
        }
      }
      
      // Add full text if it contains the query
      if (normalizeText(text).includes(normalizedQuery)) {
        suggestions.add(text);
      }
    }
  }
  
  return Array.from(suggestions).slice(0, maxSuggestions);
}

/**
 * Highlight matching text in search results
 */
export function highlightSearchText(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const normalizedQuery = normalizeText(query);
  const normalizedText = normalizeText(text);
  
  // Find matches
  const regex = new RegExp(`(${normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  
  return text.replace(regex, '<mark>$1</mark>');
}