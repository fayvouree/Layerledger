export async function onRequest(context) {
  const { request } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-ll-key",
    "Content-Type": "application/json"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: { message: "Method not allowed" } }), {
      status: 405, headers: corsHeaders
    });
  }

  try {
    // Get API key from request header (sent by the app from localStorage)
    const apiKey = request.headers.get("x-ll-key") || "";
    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: "No API key provided. Enter your Anthropic API key in Settings → AI Features." } }), {
        status: 401, headers: corsHeaders
      });
    }

    const body = await request.json();

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2024-10-22",
        "anthropic-beta": "pdfs-2024-09-25"
      },
      body: JSON.stringify(body)
    });

    const responseText = await resp.text();
    return new Response(responseText, { status: resp.status, headers: corsHeaders });

  } catch (e) {
    return new Response(JSON.stringify({ error: { message: "Function error: " + e.message } }), {
      status: 500, headers: corsHeaders
    });
  }
}
