exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: { message: "Method not allowed" } }) };
  }
  try {
    const apiKey = event.headers["x-ll-key"] || process.env.ANTHROPIC_API_KEY || "";
    if (!apiKey) {
      return { statusCode: 401, body: JSON.stringify({ error: { message: "No API key" } }) };
    }
    const body = JSON.parse(event.body);
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
    const text = await resp.text();
    return { statusCode: resp.status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: text };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: e.message } }) };
  }
};
