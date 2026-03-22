import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: signals } = await supabase
    .from("signals")
    .select("id, published_at")
    .order("published_at", { ascending: false })
    .limit(500);

  const siteUrl = req.headers.get("origin") || "https://signalflow.app";

  const urls = [
    `  <url><loc>${siteUrl}/</loc><changefreq>always</changefreq><priority>1.0</priority></url>`,
    ...(signals || []).map(
      (s) =>
        `  <url><loc>${siteUrl}/signal/${s.id}</loc><lastmod>${new Date(s.published_at).toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    ),
  ].join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
