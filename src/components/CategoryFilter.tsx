const ALL_CATEGORIES = [
  "breaking", "politics", "business", "technology", "ai", "web3", "defi", "nft",
  "finance", "startups", "health", "science", "education", "entertainment",
  "sports", "africa", "world", "environment", "security", "culture",
  "lifestyle", "dev-tools", "opportunities", "news", "research", "investigative",
] as const;

const categoryLabels: Record<string, string> = {
  breaking: "Breaking",
  politics: "Politics",
  business: "Business",
  technology: "Technology",
  ai: "AI",
  web3: "Web3",
  defi: "DeFi",
  nft: "NFT",
  finance: "Finance",
  startups: "Startups",
  health: "Health",
  science: "Science",
  education: "Education",
  entertainment: "Entertainment",
  sports: "Sports",
  africa: "Africa",
  world: "World",
  environment: "Environment",
  security: "Cybersecurity",
  culture: "Culture",
  lifestyle: "Lifestyle",
  "dev-tools": "Dev Tools",
  opportunities: "Opportunities",
  news: "News",
  research: "Research",
  investigative: "Investigative",
};

type Props = {
  selected: string | null;
  onSelect: (cat: string | null) => void;
};

export function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded px-3 py-1 text-[11px] font-body font-semibold uppercase tracking-wide transition-colors duration-150 ${
          selected === null
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        }`}
      >
        All
      </button>
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 rounded px-3 py-1 text-[11px] font-body font-medium uppercase tracking-wide transition-colors duration-150 ${
            selected === cat
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          {categoryLabels[cat] || cat}
        </button>
      ))}
    </div>
  );
}

export { categoryLabels, ALL_CATEGORIES };