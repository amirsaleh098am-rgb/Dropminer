import { Users, Copy, Share2, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { StatCard } from "@/components/StatCard";

export default function ReferralPage() {
  const { toast } = useToast();
  // Mock data for now
  const referralLink = "https://t.me/CryptoMinerBot?start=user123";
  const stats = {
    totalReferrals: 12,
    totalEarned: 4500,
    multiplier: 1.2
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Send it to your friends to earn rewards.",
    });
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 bg-background">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Invite Friends</h1>
        <p className="text-muted-foreground">Earn 10% of your friends' mining forever!</p>
      </header>

      {/* Hero Image / Illustration Placeholder */}
      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-primary/20 animate-float">
          <Users className="w-16 h-16 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard 
          title="Total Referrals" 
          value={stats.totalReferrals} 
          icon={<Users className="w-4 h-4" />} 
          className="bg-card"
        />
        <StatCard 
          title="Total Earned" 
          value={stats.totalEarned} 
          icon={<Award className="w-4 h-4" />} 
          className="bg-card"
        />
      </div>

      <div className="glass-panel p-6 rounded-2xl mb-8">
        <h3 className="font-bold text-lg mb-4">Your Referral Link</h3>
        <div className="flex gap-2">
          <div className="flex-1 bg-background/50 border border-border rounded-xl px-4 py-3 text-sm font-mono truncate text-muted-foreground">
            {referralLink}
          </div>
          <Button onClick={copyToClipboard} size="icon" className="shrink-0 bg-secondary hover:bg-secondary/80">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <Button className="w-full mt-4 bg-primary text-primary-foreground font-bold h-12 rounded-xl">
          <Share2 className="w-4 h-4 mr-2" /> Share Link
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg px-2">How it works</h3>
        <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary font-bold">1</div>
          <div>
            <h4 className="font-bold">Share your link</h4>
            <p className="text-sm text-muted-foreground">Send your unique link to friends and community.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary font-bold">2</div>
          <div>
            <h4 className="font-bold">They start mining</h4>
            <p className="text-sm text-muted-foreground">When they join and start mining coins.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary font-bold">3</div>
          <div>
            <h4 className="font-bold">You earn rewards</h4>
            <p className="text-sm text-muted-foreground">Get 10% commission on all their earnings instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
