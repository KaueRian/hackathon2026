import { createClient } from "@supabase/supabase-js";

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

interface RankingBody {
  nickname: string;
  duration_seconds: number;
}

/**
 * Cloudflare Pages Function — POST /api/ranking
 *
 * Recebe nickname e duration_seconds do front-end (estático),
 * valida os dados e insere no Supabase usando a service_role key
 * (que fica segura nas variáveis de ambiente da Cloudflare, nunca
 * exposta ao navegador).
 *
 * O RLS da tabela `sessions` bloqueia INSERTs da anon key pública,
 * mas esta função bypassa o RLS via service_role key.
 */
export const onRequestPost = async (context: {
  request: Request;
  env: { NEXT_PUBLIC_SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
}) => {
  const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = context.env;

  if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json(
      { success: false, error: "Configuração de servidor incompleta." },
      { status: 500 }
    );
  }

  // ── Parse do body ──────────────────────────────────────────────────────────
  let body: RankingBody;
  try {
    body = await context.request.json<RankingBody>();
  } catch {
    return Response.json(
      { success: false, error: "Body inválido." },
      { status: 400 }
    );
  }

  const { nickname, duration_seconds } = body;

  // ── Validação ──────────────────────────────────────────────────────────────
  const trimmedNickname = nickname?.trim() ?? "";

  if (!trimmedNickname) {
    return Response.json(
      { success: false, error: "Nickname não pode ser vazio." },
      { status: 400 }
    );
  }

  if (trimmedNickname.length > 30) {
    return Response.json(
      { success: false, error: "Nickname não pode ter mais de 30 caracteres." },
      { status: 400 }
    );
  }

  if (
    typeof duration_seconds !== "number" ||
    !isFinite(duration_seconds) ||
    duration_seconds <= 0
  ) {
    return Response.json(
      { success: false, error: "Tempo inválido." },
      { status: 400 }
    );
  }

  // Limite de 24 horas (evita valores absurdos)
  if (duration_seconds > 86_400) {
    return Response.json(
      { success: false, error: "Tempo excede o limite permitido." },
      { status: 400 }
    );
  }

  // ── INSERT seguro via service_role (bypassa RLS) ───────────────────────────
  const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("sessions").insert({
    nickname: trimmedNickname,
    duration_seconds: Math.round(duration_seconds),
    completed: true,
    finished_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[/api/ranking] Erro Supabase:", error.message);
    return Response.json(
      { success: false, error: "Erro interno ao salvar no ranking." },
      { status: 500 }
    );
  }

  return Response.json({ success: true }, { status: 201 });
};
