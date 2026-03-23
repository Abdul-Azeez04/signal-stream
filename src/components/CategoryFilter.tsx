const ALL_CATEGORIES = [
  "breaking", "politics", "business", "technology", "ai", "web3", "defi", "nft",
  "finance", "startups", "health", "science", "education", "entertainment",
  "sports", "africa", "world", "environment", "security", "culture",
  "lifestyle", "dev-tools", "opportunities", "news", "research", "investigative",
] as const;

const categoryLabels: Record<string, string> = {
  breaking: "🔴 Breaking",
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
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150 active:scale-95 ${
          selected === null
            ? "bg-foreground text-background"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        All
      </button>
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150 active:scale-95 ${
            selected === cat
              ? "bg-foreground text-background"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {categoryLabels[cat] || cat}
        </button>
      ))}
    </div>
  );
}

export { categoryLabels, ALL_CATEGORIES };
