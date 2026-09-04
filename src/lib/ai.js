import { base44 } from '@/api/base44Client';

// Single entry point for every AI feature. All InvokeLLM calls now go through
// the auth-gated `aiGateway` backend function, which owns the prompts, schemas,
// and model — so integration credits can't be spent by anonymous visitors or
// with arbitrary prompts. Returns the LLM result (string or parsed object).
export async function ai(operation, data = {}) {
  const res = await base44.functions.invoke('aiGateway', { operation, data });
  return res.data.result;
}

// Single entry point for every outgoing app email. Routed through the
// auth-gated `sendAppEmail` backend function.
export async function sendAppEmail(operation, data = {}) {
  const res = await base44.functions.invoke('sendAppEmail', { operation, data });
  return res.data;
}