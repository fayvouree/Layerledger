// functions/claude.js  — Cloudflare Pages Function
// Proxies requests to Anthropic API and handles CORS preflight (OPTIONS)

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-ll-key",
  "Access-Control-Max-Age": "86400",
};

export async function onRequest(context) {
  const { request } = context;

  // ── 1. Handle CORS preflight ──────────────────────────────────────────────
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  // ── 2. Only allow POST beyond this point ──────────────────────────────────
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── 3. Extract API key from header ────────────────────────────────────────
  const apiKey = request.headers.get("x-ll-key");
  if (!apiKey || !apiKey.startsWith("sk-ant-")) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid Anthropic API key. Add it in Settings → AI Features." }),
      {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // ── 4. Parse request body ─────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── 5. Forward to Anthropic ───────────────────────────────────────────────
  let anthropicResponse;
  try {
    anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: body.model ?? "claude-sonnet-4-20250514",
        max_tokens: body.max_tokens ?? 2048,
        messages: body.messages,
        ...(body.system ? { system: body.system } : {}),
      }),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to reach Anthropic API", detail: err.message }),
      {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // ── 6. Return Anthropic's response with CORS headers ─────────────────────
  const responseBody = await anthropicResponse.text();
  return new Response(responseBody, {
    status: anthropicResponse.status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    },
  });
}
