import { useWithdrawalHistory } from "@/hooks/use-withdraw";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function HistoryPage() {
  const { data, isLoading } = useWithdrawalHistory();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-destructive" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case 'rejected': return "text-destructive bg-destructive/10 border-destructive/20";
      default: return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 bg-background">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">History</h1>
        <p className="text-muted-foreground">Track your past transactions</p>
      </header>

      {!data?.withdrawals.length ? (
        <div className="flex flex-col items-center justify-center h-64 text-center p-6 border border-dashed border-border rounded-2xl bg-card/30">
          <Clock className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No history yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Start mining to make your first withdrawal!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.withdrawals.map((withdrawal) => (
            <div 
              key={withdrawal.id} 
              className="bg-card border border-border p-4 rounded-xl flex items-center justify-between hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-full border", getStatusColor(withdrawal.status))}>
                  {getStatusIcon(withdrawal.status)}
                </div>
                <div>
                  <h4 className="font-bold text-base">{withdrawal.coin} Withdrawal</h4>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(withdrawal.createdAt!), "MMM d, yyyy • h:mm a")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-lg text-primary">
                  {withdrawal.amount}
                </span>
                <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block mt-1", getStatusColor(withdrawal.status))}>
                  {withdrawal.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
