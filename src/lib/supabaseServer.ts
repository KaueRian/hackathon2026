import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Variáveis de ambiente do servidor não configuradas: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias.'
  );
}

/**
 * Cliente Supabase com privilégios de administrador (service_role key).
 *
 * ⚠️  ATENÇÃO: Este cliente bypassa o RLS e tem acesso total ao banco.
 *     NUNCA importe este arquivo em componentes com "use client".
 *     Use APENAS em Server Actions ou Route Handlers (código de servidor).
 */
export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    // Desabilita persistência de sessão de usuário no servidor
    persistSession: false,
    autoRefreshToken: false,
  },
});
