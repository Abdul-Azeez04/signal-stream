import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search signals..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow duration-150"
      />
    </div>
  );
}
