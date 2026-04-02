import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Food {
    id: bigint;
    fat: number;
    fiber: number;
    carbs: number;
    calories: number;
    name: string;
    category: string;
    protein: number;
}
export interface MealEntry {
    fat: number;
    fiber: number;
    carbs: number;
    date: string;
    calories: number;
    unit: string;
    entryId: bigint;
    quantity: number;
    mealType: string;
    foodName: string;
    foodId: bigint;
    protein: number;
}
export interface backendInterface {
    addMealEntry(foodId: bigint, foodName: string, quantity: number, unit: string, mealType: string, calories: number, protein: number, carbs: number, fat: number, fiber: number, date: string): Promise<bigint>;
    addWaterEntry(amountMl: bigint, date: string): Promise<bigint>;
    clearEntriesForDate(date: string): Promise<void>;
    getAllFoods(): Promise<Array<Food>>;
    getDailyTotals(date: string): Promise<[number, number, number, number, number]>;
    getEntriesByMealTypeAndDate(mealType: string, date: string): Promise<Array<MealEntry>>;
    getEntriesForDate(date: string): Promise<Array<MealEntry>>;
    getFoodById(id: bigint): Promise<Food>;
    getFoodsByCategory(category: string): Promise<Array<Food>>;
    getTotalWaterForDate(date: string): Promise<bigint>;
    removeMealEntry(entryId: bigint): Promise<void>;
    removeWaterEntry(entryId: bigint): Promise<void>;
    searchFoods(searchText: string): Promise<Array<Food>>;
}
