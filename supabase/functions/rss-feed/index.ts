import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: signals } = await supabase
    .from("signals")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(50);

  const siteUrl = req.headers.get("origin") || "https://signalflow.app";

  const escapeXml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const items = (signals || [])
    .map(
      (s) => `    <item>
      <title>${escapeXml(s.title)}</title>
      <description>${escapeXml(s.summary)}</description>
      <link>${siteUrl}/signal/${s.id}</link>
      <guid isPermaLink="true">${siteUrl}/signal/${s.id}</guid>
      <pubDate>${new Date(s.published_at).toUTCString()}</pubDate>
      <category>${escapeXml(s.category)}</category>
      <author>${escapeXml(s.author_name || "SignalFlow")}</author>
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SignalFlow — AI &amp; Web3 Intelligence</title>
    <description>Real-time curated signals from AI, Web3, DeFi, and emerging tech</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/functions/v1/rss-feed" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>5</ttl>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300",
    },
  });
});
