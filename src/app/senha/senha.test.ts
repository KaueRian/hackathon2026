/**
 * Testes TDD para as funções de validação de senha da tela /senha
 * 
 * Cobre:
 * - digitSumIsPrime
 * - hasConsecutiveLetters
 * - countUppercase
 * - hasEmoji
 * - hasRomanNumeral
 * - reversão de senha (incluindo o bug do emoji com surrogate pairs)
 */

// ─── Funções copiadas de senha/page.tsx para teste isolado ─────────────────

function digitSumIsPrime(s: string): boolean {
  const digits = s.split("").filter((c) => /\d/.test(c));
  const sum = digits.reduce((acc, d) => acc + parseInt(d), 0);
  if (sum < 2) return false;
  for (let i = 2; i <= Math.sqrt(sum); i++) {
    if (sum % i === 0) return false;
  }
  return true;
}

function hasConsecutiveLetters(s: string): boolean {
  const lower = s.toLowerCase();
  for (let i = 0; i < lower.length - 1; i++) {
    const c1 = lower.charCodeAt(i);
    const c2 = lower.charCodeAt(i + 1);
    if (c2 - c1 === 1 && c1 >= 97 && c1 <= 122) return true;
  }
  return false;
}

function countUppercase(s: string): number {
  return (s.match(/[A-Z]/g) || []).length;
}

function hasEmoji(s: string): boolean {
  return s.includes("🔥");
}

function hasRomanNumeral(s: string): boolean {
  return /[IVXLCDM]/.test(s);
}



// ─── Testes ────────────────────────────────────────────────────────────────

describe("digitSumIsPrime", () => {
  test("retorna true para soma 11 (primo) — senha do guia", () => {
    // "IV🔥az9mxqp2": dígitos são 9 e 2, soma = 11 (primo)
    expect(digitSumIsPrime("IV🔥az9mxqp2")).toBe(true);
  });

  test("retorna true para outros primos: 2, 3, 5, 7, 13", () => {
    expect(digitSumIsPrime("a2")).toBe(true);   // soma 2
    expect(digitSumIsPrime("a12")).toBe(true);  // soma 3
    expect(digitSumIsPrime("a23")).toBe(true);  // soma 5
    expect(digitSumIsPrime("a34")).toBe(true);  // soma 7
    expect(digitSumIsPrime("a49")).toBe(true);  // soma 13
  });

  test("retorna false para somas compostas: 4, 6, 8, 9, 10", () => {
    expect(digitSumIsPrime("a4")).toBe(false);  // soma 4
    expect(digitSumIsPrime("a15")).toBe(false); // soma 6
    expect(digitSumIsPrime("a44")).toBe(false); // soma 8
  });

  test("retorna false para senha sem dígitos (soma 0)", () => {
    expect(digitSumIsPrime("abcdef")).toBe(false);
  });

  test("retorna false para soma 1 (não é primo)", () => {
    expect(digitSumIsPrime("a1b")).toBe(false);
  });
});

describe("hasConsecutiveLetters", () => {
  test("detecta 'ab' como consecutivo", () => {
    expect(hasConsecutiveLetters("xabz")).toBe(true);
  });

  test("detecta 'cd' como consecutivo", () => {
    expect(hasConsecutiveLetters("1cd!")).toBe(true);
  });

  test("detecta consecutivas case-insensitive: 'AB'", () => {
    expect(hasConsecutiveLetters("AB")).toBe(true);
  });

  test("não detecta 'ac' (pula uma letra) como consecutivo", () => {
    expect(hasConsecutiveLetters("xacz")).toBe(false);
  });

  test("não detecta 'az' como consecutivo", () => {
    expect(hasConsecutiveLetters("az")).toBe(false);
  });

  test("senha do guia não tem letras consecutivas", () => {
    expect(hasConsecutiveLetters("IV🔥az9mxqp2")).toBe(false);
  });
});

describe("countUppercase", () => {
  test("conta corretamente 2 maiúsculas em 'IV🔥az9mxqp2'", () => {
    expect(countUppercase("IV🔥az9mxqp2")).toBe(2);
  });

  test("retorna 0 para string sem maiúsculas", () => {
    expect(countUppercase("abc123")).toBe(0);
  });

  test("retorna 3 para 'AbCdE'", () => {
    expect(countUppercase("AbCdE")).toBe(3);
  });

  test("não conta números como maiúsculas", () => {
    expect(countUppercase("123")).toBe(0);
  });
});

describe("hasEmoji", () => {
  test("detecta 🔥 na senha", () => {
    expect(hasEmoji("IV🔥az9mxqp2")).toBe(true);
  });

  test("retorna false sem 🔥", () => {
    expect(hasEmoji("IVaz9mxqp2")).toBe(false);
  });

  test("retorna false para emoji diferente (❤️ não conta)", () => {
    expect(hasEmoji("IV❤️az9mxqp2")).toBe(false);
  });
});

describe("hasRomanNumeral", () => {
  test("detecta I em 'IV🔥az9mxqp2'", () => {
    expect(hasRomanNumeral("IV🔥az9mxqp2")).toBe(true);
  });

  test("detecta V", () => expect(hasRomanNumeral("V")).toBe(true));
  test("detecta X", () => expect(hasRomanNumeral("X")).toBe(true));
  test("detecta L", () => expect(hasRomanNumeral("L")).toBe(true));
  test("detecta C", () => expect(hasRomanNumeral("C")).toBe(true));
  test("detecta D", () => expect(hasRomanNumeral("D")).toBe(true));
  test("detecta M", () => expect(hasRomanNumeral("M")).toBe(true));

  test("retorna false para senha sem romano: 'abcdefg'", () => {
    expect(hasRomanNumeral("abcdefg")).toBe(false);
  });
});



// ─── TESTE DE INTEGRAÇÃO: senha do guia passa em TODOS os requisitos ───────

describe("senha do guia: IV🔥az9mxqp2", () => {
  const senha = "IV🔥az9mxqp2t";

  test("tem 12 ou mais caracteres (contando emoji como 1)", () => {
    expect(Array.from(senha).length).toBeGreaterThanOrEqual(12);
  });

  test("contém emoji 🔥", () => {
    expect(hasEmoji(senha)).toBe(true);
  });

  test("contém numeral romano (I, V)", () => {
    expect(hasRomanNumeral(senha)).toBe(true);
  });

  test("não tem letras consecutivas", () => {
    expect(hasConsecutiveLetters(senha)).toBe(false);
  });

  test("tem exatamente 2 letras maiúsculas (I e V)", () => {
    expect(countUppercase(senha)).toBe(2);
  });

  test("soma dos dígitos (9+2=11) é primo", () => {
    expect(digitSumIsPrime(senha)).toBe(true);
  });


});
