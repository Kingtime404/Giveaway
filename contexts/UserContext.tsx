import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { User, WithdrawHistory } from "@/types/user";

const USER_STORAGE_KEY = "giveaway_user";
const WITHDRAW_HISTORY_KEY = "withdraw_history";

export const [UserProvider, useUser] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawHistory[]>([]);

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as User;
      }
      return null;
    },
  });

  const withdrawHistoryQuery = useQuery({
    queryKey: ["withdrawHistory"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(WITHDRAW_HISTORY_KEY);
      if (stored) {
        return JSON.parse(stored) as WithdrawHistory[];
      }
      return [];
    },
  });

  useEffect(() => {
    if (withdrawHistoryQuery.data !== undefined) {
      setWithdrawHistory(withdrawHistoryQuery.data);
    }
  }, [withdrawHistoryQuery.data]);

  useEffect(() => {
    if (userQuery.data !== undefined) {
      setUser(userQuery.data);
    }
  }, [userQuery.data]);

  const registerMutation = useMutation({
    mutationFn: async (newUser: Omit<User, "id" | "registeredAt" | "participatedGiveaways" | "balance">) => {
      const userToSave: User = {
        ...newUser,
        id: Date.now().toString(),
        registeredAt: new Date().toISOString(),
        participatedGiveaways: [],
        balance: 0,
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToSave));
      return userToSave;
    },
    onSuccess: (savedUser) => {
      setUser(savedUser);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const participateMutation = useMutation({
    mutationFn: async (giveawayId: string) => {
      if (!user) throw new Error("User not found");
      const updatedUser: User = {
        ...user,
        participatedGiveaways: [...user.participatedGiveaways, giveawayId],
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      return null;
    },
    onSuccess: () => {
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async ({ amount, accountNumber }: { amount: number; accountNumber: string }) => {
      if (!user) throw new Error("User not found");
      if (amount > user.balance) throw new Error("Saldo tidak cukup");
      
      const newWithdraw: WithdrawHistory = {
        id: Date.now().toString(),
        amount,
        date: new Date().toISOString(),
        status: 'pending',
        accountNumber,
      };
      
      const updatedUser: User = {
        ...user,
        balance: user.balance - amount,
      };
      
      const updatedHistory = [...withdrawHistory, newWithdraw];
      
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      await AsyncStorage.setItem(WITHDRAW_HISTORY_KEY, JSON.stringify(updatedHistory));
      
      return { user: updatedUser, history: updatedHistory };
    },
    onSuccess: (data) => {
      setUser(data.user);
      setWithdrawHistory(data.history);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawHistory"] });
    },
  });

  const updateBalanceMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!user) throw new Error("User not found");
      const updatedUser: User = {
        ...user,
        balance: user.balance + amount,
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const register = (userData: Omit<User, "id" | "registeredAt" | "participatedGiveaways" | "balance">) => {
    registerMutation.mutate(userData);
  };

  const participate = (giveawayId: string) => {
    participateMutation.mutate(giveawayId);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const withdraw = (amount: number, accountNumber: string) => {
    return withdrawMutation.mutateAsync({ amount, accountNumber });
  };

  const addBalance = (amount: number) => {
    updateBalanceMutation.mutate(amount);
  };

  const hasParticipated = useCallback(
    (giveawayId: string) => {
      return user?.participatedGiveaways.includes(giveawayId) ?? false;
    },
    [user]
  );

  return {
    user,
    isLoading: userQuery.isLoading,
    isRegistering: registerMutation.isPending,
    isWithdrawing: withdrawMutation.isPending,
    withdrawHistory,
    register,
    participate,
    logout,
    hasParticipated,
    withdraw,
    addBalance,
  };
});
