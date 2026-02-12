import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface MiningStatus {
  balance: number;
  miningRate?: number; // Optional, inferred from context
}

export function useMiningStatus() {
  return useQuery<MiningStatus>({
    queryKey: ["/api/mining/status"],
    // Mock data for development if backend isn't ready
    initialData: { balance: 0, miningRate: 10 }, 
  });
}

export function useCollectMining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/mining/collect");
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/mining/status"], (old: MiningStatus | undefined) => ({
        ...old,
        balance: data.newBalance,
      }));
      // Also invalidate to be sure
      queryClient.invalidateQueries({ queryKey: ["/api/mining/status"] });
    },
  });
}

export function useWatchAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // Simulate ad watching delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const res = await apiRequest("POST", "/api/mining/ad");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mining/status"] });
    },
  });
}
