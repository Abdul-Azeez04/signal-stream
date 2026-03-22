import { Constants } from "@/integrations/supabase/types";

const categories = Constants.public.Enums.signal_category;

const categoryLabels: Record<string, string> = {
  ai: "AI",
  web3: "Web3",
  defi: "DeFi",
  nft: "NFT",
  "dev-tools": "Dev Tools",
  opportunities: "Opportunities",
  news: "News",
  research: "Research",
};

type Props = {
  selected: string | null;
  onSelect: (cat: string | null) => void;
};

export function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150 active:scale-95 ${
          selected === null
            ? "bg-foreground text-background"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150 active:scale-95 ${
            selected === cat
              ? "bg-foreground text-background"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {categoryLabels[cat]}
        </button>
      ))}
    </div>
  );
}
