import { Coin } from "@shared/schema";
import { cn } from "@/lib/utils";

interface CoinCardProps {
  coin: Coin;
  selected?: boolean;
  onClick?: () => void;
}

export function CoinCard({ coin, selected, onClick }: CoinCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center gap-3 bg-card hover:bg-card/80",
        selected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="w-12 h-12 rounded-full bg-background p-2 border border-border/50 shadow-inner flex items-center justify-center">
        {/* Fallback icon if URL fails, or use standard crypto icons */}
        <img
          src={coin.iconUrl}
          alt={coin.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=random`;
          }}
        />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-lg">{coin.symbol}</h3>
        <p className="text-xs text-muted-foreground">{coin.name}</p>
      </div>
      <div className="mt-auto w-full pt-2 border-t border-border/50">
        <div className="flex justify-between text-[10px] uppercase font-medium text-muted-foreground">
          <span>Min</span>
          <span className="text-foreground">{coin.minWithdrawal}</span>
        </div>
      </div>
      
      {selected && (
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary ring-2 ring-background animate-pulse" />
      )}
    </div>
  );
}
