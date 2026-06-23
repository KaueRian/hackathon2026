// Pure validation functions for password rules
// Extracted here so they can be unit tested

export function digitSumIsPrime(s: string): boolean {
  const digits = s.split("").filter((c) => /\d/.test(c));
  const sum = digits.reduce((acc, d) => acc + parseInt(d), 0);
  if (sum < 2) return false;
  for (let i = 2; i <= Math.sqrt(sum); i++) {
    if (sum % i === 0) return false;
  }
  return true;
}

export function hasConsecutiveLetters(s: string): boolean {
  const lower = s.toLowerCase();
  for (let i = 0; i < lower.length - 1; i++) {
    const c1 = lower.charCodeAt(i);
    const c2 = lower.charCodeAt(i + 1);
    if (c2 - c1 === 1 && c1 >= 97 && c1 <= 122) return true;
  }
  return false;
}

export function countUppercase(s: string): number {
  return (s.match(/[A-Z]/g) || []).length;
}

export function hasEmoji(s: string): boolean {
  return s.includes("🔥");
}

export function hasRomanNumeral(s: string): boolean {
  return /[IVXLCDM]/.test(s);
}
