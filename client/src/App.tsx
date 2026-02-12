import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import MiningPage from "@/pages/Mining";
import WithdrawPage from "@/pages/Withdraw";
import HistoryPage from "@/pages/History";
import ReferralPage from "@/pages/Referral";
import { BottomNav } from "@/components/BottomNav";

function Router() {
  return (
    <div className="bg-background min-h-screen text-foreground font-sans selection:bg-primary/20">
      <Switch>
        <Route path="/" component={MiningPage} />
        <Route path="/withdraw" component={WithdrawPage} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/referral" component={ReferralPage} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
