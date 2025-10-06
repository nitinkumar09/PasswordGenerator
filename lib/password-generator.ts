export interface PasswordOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
}

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = 'il1Lo0O';

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  const required: string[] = [];

  if (options.lowercase) {
    const chars = options.excludeSimilar
      ? LOWERCASE.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('')
      : LOWERCASE;
    charset += chars;
    if (chars.length > 0) {
      required.push(chars[Math.floor(Math.random() * chars.length)]);
    }
  }

  if (options.uppercase) {
    const chars = options.excludeSimilar
      ? UPPERCASE.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('')
      : UPPERCASE;
    charset += chars;
    if (chars.length > 0) {
      required.push(chars[Math.floor(Math.random() * chars.length)]);
    }
  }

  if (options.numbers) {
    const chars = options.excludeSimilar
      ? NUMBERS.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('')
      : NUMBERS;
    charset += chars;
    if (chars.length > 0) {
      required.push(chars[Math.floor(Math.random() * chars.length)]);
    }
  }

  if (options.symbols) {
    charset += SYMBOLS;
    required.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  }

  if (charset.length === 0) {
    charset = LOWERCASE + UPPERCASE + NUMBERS;
  }

  let password = '';
  const crypto = window.crypto || (window as any).msCrypto;

  for (let i = 0; i < options.length - required.length; i++) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % charset.length;
    password += charset[randomIndex];
  }

  password = shuffleString(password + required.join(''));

  return password.slice(0, options.length);
}

function shuffleString(str: string): string {
  const arr = str.split('');
  const crypto = window.crypto || (window as any).msCrypto;

  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.join('');
}

export function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.6) score += 1;

  const strength = Math.min(score, 8);

  if (strength <= 2) {
    return { score: strength, label: 'Weak', color: 'bg-red-500' };
  } else if (strength <= 4) {
    return { score: strength, label: 'Fair', color: 'bg-orange-500' };
  } else if (strength <= 6) {
    return { score: strength, label: 'Good', color: 'bg-yellow-500' };
  } else {
    return { score: strength, label: 'Strong', color: 'bg-green-500' };
  }
}
