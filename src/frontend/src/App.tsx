import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BarChart3,
  Calculator,
  CalendarDays,
  Leaf,
  Lightbulb,
  Search,
} from "lucide-react";
import { useState } from "react";
import BMRCalculator from "./components/BMRCalculator";
import MealTracker from "./components/MealTracker";
import NutritionDashboard from "./components/NutritionDashboard";
import SearchFood from "./components/SearchFood";
import TipsMotivation from "./components/TipsMotivation";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function AppInner() {
  const [date, setDate] = useState(getToday());
  const [calorieGoal, setCalorieGoal] = useState(2000);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf size={18} className="text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              NutriCalc
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
              {date}
            </span>
            <span>·</span>
            <span>{calorieGoal} kcal goal</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="search" className="space-y-6">
          {/* Tab navigation */}
          <div className="overflow-x-auto">
            <TabsList className="inline-flex h-11 bg-card border border-border rounded-xl p-1 gap-0.5 min-w-max">
              {[
                { value: "search", icon: Search, label: "Search Food" },
                { value: "tracker", icon: CalendarDays, label: "Meal Tracker" },
                { value: "dashboard", icon: BarChart3, label: "Dashboard" },
                { value: "bmr", icon: Calculator, label: "BMR Calc" },
                { value: "tips", icon: Lightbulb, label: "Tips & Motivation" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground transition-all"
                >
                  <tab.icon size={15} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="search" className="mt-0">
            <SearchFood date={date} />
          </TabsContent>

          <TabsContent value="tracker" className="mt-0">
            <div>
              <div className="mb-6">
                <h2 className="font-display text-4xl font-bold text-foreground mb-1">
                  Meal Tracker
                </h2>
                <p className="text-muted-foreground">
                  Log and manage your daily meals
                </p>
              </div>
              <MealTracker
                date={date}
                onDateChange={setDate}
                calorieGoal={calorieGoal}
                onGoalChange={setCalorieGoal}
              />
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-0">
            <div>
              <div className="mb-6">
                <h2 className="font-display text-4xl font-bold text-foreground mb-1">
                  Nutrition Dashboard
                </h2>
                <p className="text-muted-foreground">
                  Your nutrition overview for {date}
                </p>
              </div>
              <NutritionDashboard date={date} calorieGoal={calorieGoal} />
            </div>
          </TabsContent>

          <TabsContent value="bmr" className="mt-0">
            <BMRCalculator />
          </TabsContent>

          <TabsContent value="tips" className="mt-0">
            <TipsMotivation />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()}. Built with</span>
            <span className="text-rose-400">♥</span>
            <span>using</span>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Track smarter. Eat better. Live longer.
          </p>
        </div>
      </footer>

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
