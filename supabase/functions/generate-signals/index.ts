import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CATEGORIES = [
  "breaking", "politics", "business", "ai", "web3", "defi", "nft",
  "finance", "startups", "health", "science", "education", "entertainment",
  "sports", "africa", "world", "environment", "security", "culture",
  "lifestyle", "dev-tools", "opportunities", "news", "research", "investigative",
];

const TOPICS: Record<string, string[]> = {
  breaking: [
    "major geopolitical event", "natural disaster update", "global market crash",
    "emergency government announcement", "unprecedented tech outage", "breaking political scandal"
  ],
  politics: [
    "election results analysis", "policy reform debate", "diplomatic relations shift",
    "legislative vote outcome", "political party strategy", "sanctions and trade policy"
  ],
  business: [
    "major acquisition announcement", "quarterly earnings surprise", "supply chain disruption",
    "corporate restructuring", "IPO filing", "executive leadership change"
  ],
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
  finance: [
    "central bank rate decision", "stock market analysis", "commodity price surge",
    "fintech funding round", "banking regulation change", "cryptocurrency market movement"
  ],
  startups: [
    "startup unicorn valuation", "seed round announcement", "accelerator program launch",
    "founder interview insights", "startup acquisition", "pivot strategy analysis"
  ],
  health: [
    "medical research breakthrough", "pandemic update", "drug approval announcement",
    "mental health technology", "healthcare AI application", "public health policy"
  ],
  science: [
    "space exploration milestone", "climate research findings", "quantum computing advance",
    "gene editing breakthrough", "particle physics discovery", "ocean exploration update"
  ],
  education: [
    "edtech platform launch", "university AI curriculum", "online learning trends",
    "education policy reform", "coding bootcamp innovation", "research funding announcement"
  ],
  entertainment: [
    "streaming platform update", "gaming industry milestone", "AI in creative arts",
    "social media platform change", "content creator economy", "virtual reality experience"
  ],
  sports: [
    "major tournament update", "athlete transfer news", "sports technology innovation",
    "esports tournament results", "sports analytics breakthrough", "league policy change"
  ],
  africa: [
    "African tech hub growth", "fintech adoption in Africa", "African startup funding",
    "continental trade agreement", "mobile money innovation", "African AI development"
  ],
  world: [
    "UN resolution update", "international trade deal", "global health initiative",
    "climate summit outcome", "humanitarian crisis update", "international security"
  ],
  environment: [
    "renewable energy milestone", "carbon capture technology", "deforestation alert",
    "ocean conservation effort", "electric vehicle adoption", "climate policy update"
  ],
  security: [
    "major data breach", "ransomware attack", "zero-day vulnerability disclosure",
    "cybersecurity framework update", "state-sponsored hacking", "security tool release"
  ],
  culture: [
    "digital art movement", "cultural preservation tech", "museum digitization",
    "language preservation AI", "cultural festival innovation", "heritage technology"
  ],
  lifestyle: [
    "wellness technology", "remote work trend", "sustainable living innovation",
    "smart home technology", "travel technology update", "food technology advance"
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
  investigative: [
    "corporate fraud investigation", "data privacy scandal", "regulatory compliance failure",
    "whistleblower revelations", "market manipulation probe", "environmental violation report"
  ],
};

const SOURCES = [
  "X (Twitter)", "Discord", "Telegram", "GitHub", "Hacker News", "Reddit",
  "CoinDesk", "The Block", "TechCrunch", "Decrypt", "DeFi Llama", "Messari",
  "Arxiv", "Wired", "Ars Technica", "The Verge", "BBC", "CNN", "Al Jazeera",
  "Reuters", "Bloomberg", "Financial Times", "Nature", "Science Magazine",
  "MIT Technology Review", "The Guardian", "Forbes", "Business Insider"
];

const AUTHORS = [
  "Vitalik Buterin", "Sam Altman", "Balaji Srinivasan", "Naval Ravikant",
  "Andre Cronje", "Hayden Adams", "Stani Kulechov", "Robert Leshner",
  "Demis Hassabis", "Ilya Sutskever", "Andrej Karpathy", "Yann LeCun",
  "Chris Dixon", "Li Jin", "Packy McCormick", "Mario Gabriele",
  "Staff Reporter", "Editorial Team", "Analysis Desk", "Investigative Unit"
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

    // Generate 3 signals per invocation for higher throughput
    const results = [];
    
    for (let i = 0; i < 3; i++) {
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const topicList = TOPICS[category] || TOPICS["news"];
      const topic = topicList[Math.floor(Math.random() * topicList.length)];
      const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
      const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
      const today = new Date().toISOString().split("T")[0];

      try {
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
                  description: "Create a professional news article",
                  parameters: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "Professional news headline, 50-90 chars. Must be specific, factual, and compelling. Use active voice." },
                      summary: { type: "string", description: "2-3 sentence news lede with the most critical facts. 120-200 chars. Answer who/what/when/where." },
                      content: { type: "string", description: "Full 4-6 paragraph news article in inverted pyramid style. Lead with the most important facts. Include quotes, data points, context, and implications. 400-800 words. Professional journalism tone." },
                      importance: { type: "number", description: "Newsworthiness 1-10. Breaking=9-10, major=7-8, notable=5-6, routine=3-4" },
                      tags: { type: "array", items: { type: "string" }, description: "4-6 relevant tags (lowercase, specific)" },
                      source_url: { type: "string", description: "Realistic URL for this article" },
                      image_url: { type: "string", description: "A relevant Unsplash image URL using https://images.unsplash.com/photo-{id}?w=800&h=400&fit=crop format with a real photo ID relevant to the topic" },
                    },
                    required: ["title", "summary", "content", "importance", "tags", "source_url", "image_url"],
                    additionalProperties: false,
                  },
                },
              },
            ],
            tool_choice: { type: "function", function: { name: "create_signal" } },
            messages: [
              {
                role: "system",
                content: `You are a senior journalist at a major global news agency. Write factual, balanced, professional news articles. Today is ${today}. Use inverted pyramid structure. Include specific numbers, names, and quotes. Vary your writing style — sometimes analytical, sometimes narrative, sometimes breaking news urgent. Never use generic filler or placeholder language. Every article must feel like it could appear in Reuters or Bloomberg.`,
              },
              {
                role: "user",
                content: `Write a ${category} news article about: "${topic}". Make it timely for ${today}. Attribution: ${source}. Include specific data, expert quotes, and real-world context. For image_url, use a relevant Unsplash image URL.`,
              },
            ],
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error(`AI error for signal ${i}:`, response.status, errText);
          if (response.status === 429 || response.status === 402) continue;
          continue;
        }

        const data = await response.json();
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        if (!toolCall) continue;

        const signal = JSON.parse(toolCall.function.arguments);

        const { error: insertErr } = await supabase.from("signals").insert({
          title: signal.title,
          summary: signal.summary,
          content: signal.content,
          category,
          importance: Math.min(10, Math.max(1, signal.importance)),
          tags: signal.tags,
          source,
          source_url: signal.source_url,
          image_url: signal.image_url || null,
          author_name: author,
          published_at: new Date().toISOString(),
          moderated: true,
        });

        if (insertErr) {
          console.error(`DB insert failed for signal ${i}:`, insertErr.message);
          continue;
        }

        results.push({ title: signal.title, category });
        console.log(`Generated: "${signal.title}" [${category}]`);
      } catch (e) {
        console.error(`Signal ${i} error:`, e);
        continue;
      }
    }

    return new Response(
      JSON.stringify({ success: true, generated: results.length, signals: results }),
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
