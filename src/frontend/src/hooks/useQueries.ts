import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Food, MealEntry } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllFoods() {
  const { actor, isFetching } = useActor();
  return useQuery<Food[]>({
    queryKey: ["allFoods"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFoods();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSearchFoods(searchText: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Food[]>({
    queryKey: ["searchFoods", searchText],
    queryFn: async () => {
      if (!actor) return [];
      if (!searchText.trim()) return actor.getAllFoods();
      return actor.searchFoods(searchText);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
  });
}

export function useGetFoodsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Food[]>({
    queryKey: ["foodsByCategory", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getAllFoods();
      return actor.getFoodsByCategory(category);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetEntriesForDate(date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<MealEntry[]>({
    queryKey: ["entriesForDate", date],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEntriesForDate(date);
    },
    enabled: !!actor && !isFetching && !!date,
  });
}

export function useGetEntriesByMealType(mealType: string, date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<MealEntry[]>({
    queryKey: ["entriesByMealType", mealType, date],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEntriesByMealTypeAndDate(mealType, date);
    },
    enabled: !!actor && !isFetching && !!date,
  });
}

export function useGetDailyTotals(date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<[number, number, number, number, number]>({
    queryKey: ["dailyTotals", date],
    queryFn: async () => {
      if (!actor) return [0, 0, 0, 0, 0];
      return actor.getDailyTotals(date);
    },
    enabled: !!actor && !isFetching && !!date,
  });
}

export function useGetTotalWater(date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalWater", date],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalWaterForDate(date);
    },
    enabled: !!actor && !isFetching && !!date,
  });
}

export function useAddMealEntry(date: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      foodId: bigint;
      foodName: string;
      quantity: number;
      unit: string;
      mealType: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      date: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addMealEntry(
        params.foodId,
        params.foodName,
        params.quantity,
        params.unit,
        params.mealType,
        params.calories,
        params.protein,
        params.carbs,
        params.fat,
        params.fiber,
        params.date,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entriesForDate", date] });
      qc.invalidateQueries({ queryKey: ["entriesByMealType"] });
      qc.invalidateQueries({ queryKey: ["dailyTotals", date] });
    },
  });
}

export function useRemoveMealEntry(date: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entryId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.removeMealEntry(entryId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entriesForDate", date] });
      qc.invalidateQueries({ queryKey: ["entriesByMealType"] });
      qc.invalidateQueries({ queryKey: ["dailyTotals", date] });
    },
  });
}

export function useClearEntriesForDate(date: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.clearEntriesForDate(date);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entriesForDate", date] });
      qc.invalidateQueries({ queryKey: ["entriesByMealType"] });
      qc.invalidateQueries({ queryKey: ["dailyTotals", date] });
    },
  });
}

export function useAddWaterEntry(date: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (amountMl: number) => {
      if (!actor) throw new Error("No actor");
      return actor.addWaterEntry(BigInt(amountMl), date);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["totalWater", date] });
    },
  });
}
