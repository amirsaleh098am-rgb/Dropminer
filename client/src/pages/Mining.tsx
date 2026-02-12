import { useMiningStatus, useCollectMining, useWatchAd } from "@/hooks/use-mining";
import { Button } from "@/components/ui/button";
import { Zap, PlayCircle, Loader2, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function MiningPage() {
  const { data: status, isLoading } = useMiningStatus();
  const collectMutation = useCollectMining();
  const watchAdMutation = useWatchAd();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCollect = () => {
    collectMutation.mutate(undefined, {
      onSuccess: () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    });
  };

  const handleWatchAd = () => {
    watchAdMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="inline-block p-1 px-3 rounded-full bg-accent/10 text-accent text-xs font-bold border border-accent/20 mb-4">
          LIVE MINING SESSION
        </div>
        <h1 className="text-4xl font-black mb-2 tracking-tighter">
          Crypto<span className="text-primary">Miner</span>
        </h1>
        <p className="text-muted-foreground">Mine coins and withdraw instantly</p>
      </header>

      {/* Balance Circle */}
      <div className="flex flex-col items-center justify-center my-10">
        <div className="relative">
          <motion.div 
            className="w-48 h-48 rounded-full border-4 border-primary/20 bg-card/50 flex items-center justify-center relative z-10 backdrop-blur-sm"
            animate={{ boxShadow: "0 0 40px -10px rgba(124, 58, 237, 0.3)" }}
          >
            <div className="text-center">
              <span className="block text-sm text-muted-foreground font-medium mb-1">BALANCE</span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={status?.balance}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="block text-4xl font-black text-foreground font-display"
                >
                  {status?.balance.toLocaleString()}
                </motion.span>
              </AnimatePresence>
              <span className="text-xs text-primary font-bold mt-1">PTS</span>
            </div>
          </motion.div>
          
          {/* Animated rings */}
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_3s_linear_infinite]" />
          <div className="absolute inset-0 rounded-full border border-primary/10 animate-[ping_4s_linear_infinite]" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
        <Button 
          size="lg" 
          onClick={handleCollect} 
          disabled={collectMutation.isPending}
          className="h-16 text-lg font-bold rounded-2xl relative overflow-hidden group bg-gradient-to-r from-primary to-purple-600 hover:to-purple-500 shadow-lg shadow-primary/25"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          {collectMutation.isPending ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            <Zap className="mr-2 h-6 w-6 fill-current" />
          )}
          {collectMutation.isPending ? "Mining..." : "Collect Coins"}
        </Button>

        <Button 
          size="lg" 
          variant="outline" 
          onClick={handleWatchAd}
          disabled={watchAdMutation.isPending}
          className="h-14 font-semibold rounded-2xl border-2 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all"
        >
          {watchAdMutation.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <PlayCircle className="mr-2 h-5 w-5" />
          )}
          Watch Ad (+500 PTS)
        </Button>
      </div>

      {/* Stats/Info */}
      <div className="mt-8 max-w-sm mx-auto grid grid-cols-2 gap-4">
        <div className="bg-card/50 p-4 rounded-2xl border border-white/5 text-center">
          <Coins className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
          <div className="text-2xl font-bold">100%</div>
          <div className="text-xs text-muted-foreground">Uptime</div>
        </div>
        <div className="bg-card/50 p-4 rounded-2xl border border-white/5 text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold">1.5x</div>
          <div className="text-xs text-muted-foreground">Multiplier</div>
        </div>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">💰</div>
        </div>
      )}
    </div>
  );
}
