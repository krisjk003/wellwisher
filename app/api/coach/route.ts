import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const key = process.env.ASTRA_API_KEY || process.env.ASTRA_KEY;
  const body = await request.json().catch(() => ({}));
  const prompt = typeof body?.prompt === "string" && body.prompt.trim()
    ? body.prompt.trim().slice(0, 4000)
    : "Give one kind, practical reflection prompt.";

  if (!key) {
    return NextResponse.json({
      available: false,
      message: "Coach is offline. Your data stays on this device."
    });
  }

  try {
    const response = await fetch("https://api.astra.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key
      },
      body: JSON.stringify({
        model: "astra-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 120
      }),
      cache: "no-store"
    });

    if (!response.ok) throw new Error(`Astra request failed: ${response.status}`);
    const json = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    return NextResponse.json({
      available: true,
      message: json.choices?.[0]?.message?.content || "Keep going, one small action at a time."
    });
  } catch {
    return NextResponse.json({
      available: false,
      message: "Coach is temporarily unavailable. Your data is safe locally."
    });
  }
}
