import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CATEGORIES = ["ai", "web3", "defi", "nft", "dev-tools", "opportunities", "news", "research"];

const TOPICS = {
  ai: [
    "new LLM release", "AI regulation update", "open-source AI model", "AI startup funding",
    "AI research paper", "AI benchmark results", "AI hardware announcement", "AI safety development",
    "multimodal AI progress", "AI agent framework", "code generation tool", "AI inference optimization"
  ],
  web3: [
    "blockchain protocol upgrade", "DAO governance proposal", "cross-chain bridge launch",
    "layer 2 scaling solution", "Web3 social platform", "decentralized identity standard",
    "Web3 gaming milestone", "blockchain interoperability", "zero-knowledge proof advancement"
  ],
  defi: [
    "DEX volume record", "lending protocol update", "yield farming strategy", "stablecoin development",
    "DeFi hack postmortem", "liquidity mining program", "DeFi governance vote", "real-world asset tokenization"
  ],
  nft: [
    "NFT marketplace update", "digital art collection launch", "NFT utility innovation",
    "music NFT platform", "NFT gaming integration", "brand NFT campaign"
  ],
  "dev-tools": [
    "new JavaScript framework", "developer tool launch", "IDE plugin release", "CI/CD improvement",
    "API platform update", "open-source library milestone", "database technology release"
  ],
  opportunities: [
    "crypto airdrop announcement", "hackathon launch", "grant program opening",
    "bounty program update", "beta testing opportunity", "early access program"
  ],
  news: [
    "tech industry acquisition", "regulatory decision", "market trend analysis",
    "industry conference recap", "platform policy change", "notable partnership"
  ],
  research: [
    "academic paper breakthrough", "security vulnerability disclosure", "performance benchmark study",
    "protocol analysis report", "market research findings", "technology comparison study"
  ],
};

const SOURCES = [
  "X (Twitter)", "Discord", "Telegram", "GitHub", "Hacker News", "Reddit",
  "CoinDesk", "The Block", "TechCrunch", "Decrypt", "DeFi Llama", "Messari",
  "Arxiv", "Wired", "Ars Technica", "Protocol", "The Verge"
];

const AUTHORS = [
  "Vitalik Buterin", "Sam Altman", "Balaji Srinivasan", "Naval Ravikant",
  "Andre Cronje", "Hayden Adams", "Stani Kulechov", "Robert Leshner",
  "Demis Hassabis", "Ilya Sutskever", "Andrej Karpathy", "Yann LeCun",
  "Chris Dixon", "Li Jin", "Packy McCormick", "Mario Gabriele",
  "Hsaka", "Cobie", "DegenSpartan", "Tetranode"
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Pick random category and topic
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const topicList = TOPICS[category as keyof typeof TOPICS];
    const topic = topicList[Math.floor(Math.random() * topicList.length)];
    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
    const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];

    const today = new Date().toISOString().split("T")[0];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        tools: [
          {
            type: "function",
            function: {
              name: "create_signal",
              description: "Create a news signal/article about emerging technology",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Compelling, specific headline (50-80 chars). Must reference real or realistic projects/tools/protocols. No generic titles." },
                  summary: { type: "string", description: "2-3 sentence summary with key facts and numbers (100-200 chars)" },
                  content: { type: "string", description: "Full 3-5 paragraph article with analysis, data points, and implications. Use specific numbers and realistic details. 300-600 words." },
                  importance: { type: "number", description: "Signal importance 1-10. Breaking news=9-10, major update=7-8, notable=5-6, informational=3-4" },
                  tags: { type: "array", items: { type: "string" }, description: "3-5 relevant tags (lowercase, specific)" },
                  source_url: { type: "string", description: "A realistic URL where this could be found" },
                },
                required: ["title", "summary", "content", "importance", "tags", "source_url"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_signal" } },
        messages: [
          {
            role: "system",
            content: `You are a senior tech journalist covering AI, Web3, blockchain, and emerging technologies. Write factual-sounding, professional intelligence signals. Today is ${today}. Write as if reporting on breaking developments. Use specific numbers, protocol names, and realistic details. Never use generic filler.`,
          },
          {
            role: "user",
            content: `Write a ${category} signal about: "${topic}". Make it timely for ${today}. Source: ${source}. The content should be unique, insightful, and include specific technical details or data points that would be valuable to developers and investors.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const signal = JSON.parse(toolCall.function.arguments);

    // Insert into database
    const { error: insertErr } = await supabase.from("signals").insert({
      title: signal.title,
      summary: signal.summary,
      content: signal.content,
      category,
      importance: Math.min(10, Math.max(1, signal.importance)),
      tags: signal.tags,
      source,
      source_url: signal.source_url,
      author_name: author,
      published_at: new Date().toISOString(),
    });

    if (insertErr) throw new Error(`DB insert failed: ${insertErr.message}`);

    console.log(`Generated signal: "${signal.title}" [${category}]`);

    return new Response(
      JSON.stringify({ success: true, title: signal.title, category }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-signals error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
