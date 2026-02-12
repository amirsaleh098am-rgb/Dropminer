import { useCoins, useCreateWithdrawal } from "@/hooks/use-withdraw";
import { useMiningStatus } from "@/hooks/use-mining";
import { CoinCard } from "@/components/CoinCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const withdrawSchema = z.object({
  amount: z.coerce.number().positive(),
  email: z.string().email("Invalid email address"),
});

type WithdrawFormValues = z.infer<typeof withdrawSchema>;

export default function WithdrawPage() {
  const { data: coinsData, isLoading: isCoinsLoading } = useCoins();
  const { data: miningStatus } = useMiningStatus();
  const createWithdrawal = useCreateWithdrawal();
  const { toast } = useToast();
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState<string | null>(null);

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 0,
      email: "",
    },
  });

  const selectedCoin = coinsData?.coins.find(c => c.symbol === selectedCoinSymbol);

  const onSubmit = (values: WithdrawFormValues) => {
    if (!selectedCoin) {
      toast({
        title: "Select a coin",
        description: "Please select a cryptocurrency to withdraw.",
        variant: "destructive",
      });
      return;
    }

    if (values.amount < selectedCoin.minWithdrawal) {
      toast({
        title: "Amount too low",
        description: `Minimum withdrawal is ${selectedCoin.minWithdrawal}`,
        variant: "destructive",
      });
      return;
    }

    if (values.amount > selectedCoin.maxWithdrawal) {
      toast({
        title: "Amount too high",
        description: `Maximum withdrawal is ${selectedCoin.maxWithdrawal}`,
        variant: "destructive",
      });
      return;
    }

    if (miningStatus?.balance && values.amount > miningStatus.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough coins.",
        variant: "destructive",
      });
      return;
    }

    createWithdrawal.mutate({
      coin: selectedCoin.symbol,
      amount: values.amount,
      email: values.email,
    }, {
      onSuccess: () => {
        toast({
          title: "Withdrawal Requested",
          description: "Your request has been submitted successfully.",
        });
        form.reset();
        setSelectedCoinSymbol(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  if (isCoinsLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 bg-background">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Withdraw</h1>
        <p className="text-muted-foreground">Transfer your earnings to FaucetPay</p>
      </header>

      <div className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Select Currency</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {coinsData?.coins.map((coin) => (
            <motion.div key={coin.symbol} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <CoinCard 
                coin={coin} 
                selected={selectedCoinSymbol === coin.symbol}
                onClick={() => setSelectedCoinSymbol(coin.symbol)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Transfer Details
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <Label>Amount</Label>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        className="pl-4 pr-12 text-lg font-medium bg-background/50 border-border" 
                        {...field} 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                        {selectedCoinSymbol || "PTS"}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                  {selectedCoin && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Min: {selectedCoin.minWithdrawal} - Max: {selectedCoin.maxWithdrawal}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>FaucetPay Email</Label>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      className="bg-background/50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                disabled={!selectedCoinSymbol || createWithdrawal.isPending}
              >
                {createWithdrawal.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>Confirm Withdrawal <ArrowRight className="ml-2 w-5 h-5" /></>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-200">
        <AlertCircle className="h-4 w-4 stroke-blue-500" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription className="text-xs opacity-90">
          Make sure your FaucetPay email is correct. Withdrawals are processed instantly but may take a few minutes to appear.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function Wallet(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}
