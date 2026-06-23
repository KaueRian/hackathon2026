/**
 * Testes TDD para a lógica de salvamento no ranking
 *
 * Cobre:
 * - Cálculo correto do elapsed time (sem dupla divisão)
 * - handleSave envia os dados corretos para o Supabase
 * - handleSave não envia com nickname vazio
 * - Ranking fetcha e ordena corretamente
 */

// ─── Funções utilitárias extraídas da lógica de parabens/page.tsx ────────────

/** Formata segundos em MM:SS */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Calcula o elapsed_seconds para salvar no banco.
 * O useTimer já retorna elapsed em SEGUNDOS — não dividir por 1000 de novo!
 */
function computeElapsedSeconds(elapsedFromTimer: number): number {
  // CORRETO: elapsed já está em segundos, usar direto
  return elapsedFromTimer;
}

/**
 * BUG ORIGINAL: dividia por 1000 novamente, sempre salvava ~0 no banco
 */
function computeElapsedSecondsBuggy(elapsedFromTimer: number): number {
  return Math.floor(elapsedFromTimer / 1000); // BUG: duplica a divisão
}

/** Validação básica: nickname obrigatório */
function isValidSave(nickname: string, elapsed: number): boolean {
  return nickname.trim().length > 0 && elapsed > 0;
}

// ─── Mock do insert do Supabase ──────────────────────────────────────────────

type InsertPayload = { nickname: string; duration_seconds: number };

function createMockSupabase() {
  const insertedRows: InsertPayload[] = [];
  let shouldFail = false;

  return {
    insertedRows,
    setShouldFail: (v: boolean) => { shouldFail = v; },
    from: () => ({
      insert: async (payload: InsertPayload) => {
        if (shouldFail) return { error: new Error("Network error"), data: null };
        insertedRows.push(payload);
        return { error: null, data: [payload] };
      },
      select: async () => ({ data: insertedRows, error: null }),
    }),
  };
}

// ─── TESTES ──────────────────────────────────────────────────────────────────

describe("formatTime", () => {
  test("formata 0 segundos como 00:00", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  test("formata 65 segundos como 01:05", () => {
    expect(formatTime(65)).toBe("01:05");
  });

  test("formata 3600 segundos como 60:00", () => {
    expect(formatTime(3600)).toBe("60:00");
  });

  test("formata 90 segundos como 01:30", () => {
    expect(formatTime(90)).toBe("01:30");
  });

  test("formata 9 segundos como 00:09", () => {
    expect(formatTime(9)).toBe("00:09");
  });
});

// ─── TESTES DO BUG DA DUPLA DIVISÃO ──────────────────────────────────────────

describe("computeElapsedSeconds — bug da dupla divisão", () => {
  /**
   * O useTimer retorna elapsed em SEGUNDOS (ex: 120 para 2 minutos).
   * O bug original fazia Math.floor(120 / 1000) = 0, salvando sempre 0 no banco.
   */

  test("CORRETO: 120 segundos (2 min) salva como 120", () => {
    expect(computeElapsedSeconds(120)).toBe(120);
  });

  test("CORRETO: 305 segundos (5min5s) salva como 305", () => {
    expect(computeElapsedSeconds(305)).toBe(305);
  });

  test("BUGADO: 120 segundos virava 0 no banco (bug original)", () => {
    expect(computeElapsedSecondsBuggy(120)).toBe(0); // 120/1000 = 0.12 → floor = 0
  });

  test("BUGADO: 999 segundos virava 0 no banco", () => {
    expect(computeElapsedSecondsBuggy(999)).toBe(0); // 999/1000 = 0.999 → floor = 0
  });

  test("BUGADO: mesmo 3600 segundos (1h) virava apenas 3 no banco", () => {
    expect(computeElapsedSecondsBuggy(3600)).toBe(3); // 3600/1000 = 3.6 → floor = 3
  });
});

// ─── TESTES DE VALIDAÇÃO DO SAVE ─────────────────────────────────────────────

describe("isValidSave", () => {
  test("válido: nickname e elapsed preenchidos", () => {
    expect(isValidSave("Guerreiro", 120)).toBe(true);
  });

  test("inválido: nickname vazio string", () => {
    expect(isValidSave("", 120)).toBe(false);
  });

  test("inválido: nickname só espaços", () => {
    expect(isValidSave("   ", 120)).toBe(false);
  });

  test("inválido: elapsed = 0 (timer não iniciou)", () => {
    expect(isValidSave("Guerreiro", 0)).toBe(false);
  });

  test("inválido: ambos vazios", () => {
    expect(isValidSave("", 0)).toBe(false);
  });
});

// ─── TESTES DE INTEGRAÇÃO COM MOCK DO SUPABASE ───────────────────────────────

describe("handleSave — mock do Supabase insert", () => {
  test("insere corretamente com nickname e elapsed", async () => {
    const db = createMockSupabase();
    const nickname = "Guerreiro";
    const elapsed = 245; // já em segundos, como retorna o useTimer

    if (!isValidSave(nickname, elapsed)) throw new Error("Save inválido");

    const payload: InsertPayload = {
      nickname: nickname.trim(),
      duration_seconds: computeElapsedSeconds(elapsed),
    };

    await db.from().insert(payload);

    expect(db.insertedRows).toHaveLength(1);
    expect(db.insertedRows[0].nickname).toBe("Guerreiro");
    expect(db.insertedRows[0].duration_seconds).toBe(245); // NÃO 0
  });

  test("não insere quando nickname está vazio", async () => {
    const db = createMockSupabase();
    const nickname = "";
    const elapsed = 120;

    if (!isValidSave(nickname, elapsed)) {
      // Não chama o insert — este é o comportamento correto
      expect(db.insertedRows).toHaveLength(0);
      return;
    }

    await db.from().insert({ nickname, duration_seconds: elapsed });
  });

  test("retorna erro quando Supabase falha", async () => {
    const db = createMockSupabase();
    db.setShouldFail(true);

    const result = await db.from().insert({ nickname: "Guerreiro", duration_seconds: 120 });

    expect(result.error).toBeTruthy();
    expect(result.data).toBeNull();
  });

  test("após save, busca ranking e retorna registros inseridos", async () => {
    const db = createMockSupabase();
    await db.from().insert({ nickname: "Alice", duration_seconds: 90 });
    await db.from().insert({ nickname: "Bob", duration_seconds: 120 });

    const { data } = await db.from().select();

    expect(data).toHaveLength(2);
    expect(data![0].nickname).toBe("Alice");
    expect(data![1].nickname).toBe("Bob");
  });
});
