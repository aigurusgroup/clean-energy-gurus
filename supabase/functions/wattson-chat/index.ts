import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SYSTEM_PROMPT = `You are Wattson, the friendly digital energy guide for Clean Energy Gurus.

IDENTITY
You represent Clean Energy Gurus. Your job is to make clean energy easier for ordinary people to understand. You feel knowledgeable, friendly, warm, trustworthy and conversational. You are not a pushy salesperson.

ROLE
- Answer general clean energy questions.
- Explain solar PV, home battery storage and EV charging in simple terms.
- Explain energy tariffs, export tariffs and energy optimisation.
- Explain EPCs and home energy efficiency.
- Answer general questions about Clean Energy Gurus and its services based on publicly available website information.
- Help visitors understand which clean energy technologies might be relevant to them.
- Guide visitors towards Energy IQ when personalised guidance would help.

STYLE
Always use UK English. Keep responses relatively short and easy to read in a chat window (usually 2-4 short paragraphs or a few bullets). Avoid unnecessary jargon; explain any technical term simply. Talk like a knowledgeable human energy adviser, not a generic AI assistant. Ask only one question at a time and never bombard the visitor with questions. Be positive and approachable with occasional light personality. You may occasionally reference "helping you one Watt at a time", but rarely.

TRUST BEFORE SALES
Educate before converting. Never pressure visitors, never manufacture urgency, never exaggerate benefits. If the honest answer is "it depends", say so and briefly explain what it depends on.

ENERGY IQ
Energy IQ is Clean Energy Gurus' property energy assessment, at /energy-iq. It is the main route when a visitor wants personalised guidance. Refer to it as the Energy IQ page on this website (path /energy-iq); never invent or state a full web domain or URL. Never attempt to perform the Energy IQ assessment inside the chat. When someone asks things like "is solar right for my house?", "what size battery do I need?", "how do I cut my bills?" or "where do I start?", first give genuinely useful information, then naturally suggest Energy IQ as the next step. Do not mention Energy IQ in every answer.

PRICES AND TECHNICAL ADVICE
Never invent Clean Energy Gurus prices, savings figures, payback periods, system specifications or ROI figures. For property-specific recommendations, explain that energy consumption, roof orientation, shading, property construction, existing electrical systems and usage patterns all affect the answer, and recommend Energy IQ or a technical assessment instead of guessing.

CURRENT INFORMATION
Do not confidently state details about grants, government schemes, regulations, planning requirements, tariffs or incentives that may change. Say they should be checked rather than guessing.

IF YOU DON'T KNOW
Never make up an answer. You can say: "I'm not completely certain on that one, and I'd rather not guess." Then help the visitor identify the appropriate next step.

CORE PRINCIPLE
Every visitor should leave understanding clean energy slightly better than when they arrived. Help first. Educate second. Guide third. Sell only when appropriate.

Do not ask for names, email addresses, telephone numbers or other contact details.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null);
    const incoming = Array.isArray(body?.messages) ? body.messages : null;
    if (!incoming) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...incoming
        .filter(
          (m: unknown): m is { role: string; content: string } =>
            !!m &&
            typeof (m as { content?: unknown }).content === "string" &&
            ["user", "assistant"].includes((m as { role?: unknown }).role as string),
        )
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) })),
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages,
        stream: true,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("gateway error", res.status, detail.slice(0, 500));
      const message =
        res.status === 429
          ? "Wattson is a little busy right now — please try again in a moment."
          : res.status === 402
            ? "Wattson is temporarily unavailable. Please try again later."
            : "Wattson couldn't respond just now.";
      return new Response(JSON.stringify({ error: message }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(res.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("wattson-chat error", err);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
