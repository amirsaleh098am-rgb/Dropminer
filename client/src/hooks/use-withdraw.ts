import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Coin, Withdrawal, CreateWithdrawalRequest } from "@shared/schema";

// Types derived from schema or API contract
interface CoinsResponse {
  coins: Coin[];
}

interface HistoryResponse {
  withdrawals: Withdrawal[];
}

export function useCoins() {
  return useQuery<CoinsResponse>({
    queryKey: ["/api/withdraw/coins"],
  });
}

export function useWithdrawalHistory() {
  return useQuery<HistoryResponse>({
    queryKey: ["/api/withdraw/history"],
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateWithdrawalRequest) => {
      const res = await apiRequest("POST", "/api/withdraw", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/withdraw/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mining/status"] }); // Balance changes
    },
  });
}
