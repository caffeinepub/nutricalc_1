import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Coffee,
  Droplets,
  Flame,
  Loader2,
  Moon,
  Sun,
  Sunset,
  Trash2,
  Wheat,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { MealEntry } from "../backend.d";
import {
  useClearEntriesForDate,
  useGetDailyTotals,
  useGetEntriesByMealType,
  useRemoveMealEntry,
} from "../hooks/useQueries";

const MEALS = [
  {
    key: "Breakfast",
    label: "Breakfast",
    icon: Coffee,
    color: "text-amber-400",
  },
  { key: "Lunch", label: "Lunch", icon: Sun, color: "text-yellow-400" },
  { key: "Dinner", label: "Dinner", icon: Sunset, color: "text-orange-400" },
  { key: "Snacks", label: "Snacks", icon: Moon, color: "text-purple-400" },
];

interface MealSectionProps {
  mealType: string;
  date: string;
  icon: React.ElementType;
  color: string;
}

function MealSection({ mealType, date, icon: Icon, color }: MealSectionProps) {
  const { data: entries = [], isLoading } = useGetEntriesByMealType(
    mealType,
    date,
  );
  const remove = useRemoveMealEntry(date);
  const subtotal = entries.reduce((sum, e) => sum + e.calories, 0);

  return (
    <AccordionItem value={mealType} className="border-border">
      <AccordionTrigger
        data-ocid="tracker.meal_toggle"
        className="px-4 hover:no-underline hover:bg-muted/20 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={color} />
          <span className="font-semibold text-foreground">{mealType}</span>
          <Badge
            variant="outline"
            className="ml-2 text-gold-500 border-gold-500/30 text-xs"
          >
            {subtotal} kcal
          </Badge>
          <span className="text-xs text-muted-foreground">
            {entries.length} items
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-12 rounded-lg bg-muted/40" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">
            No entries yet. Search for food and add it here!
          </p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry: MealEntry, i: number) => (
              <div
                key={String(entry.entryId)}
                data-ocid={`tracker.item.${i + 1}`}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className="font-medium text-foreground text-sm truncate">
                    {entry.foodName}
                  </p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {entry.quantity}
                      {entry.unit}
                    </span>
                    <span className="text-xs text-blue-400">
                      P {entry.protein}g
                    </span>
                    <span className="text-xs text-amber-400">
                      C {entry.carbs}g
                    </span>
                    <span className="text-xs text-red-400">F {entry.fat}g</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gold-500/20 text-gold-500 border-gold-500/30 text-xs font-bold">
                    {entry.calories} kcal
                  </Badge>
                  <Button
                    data-ocid="tracker.remove_button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    disabled={remove.isPending}
                    onClick={() => remove.mutate(entry.entryId)}
                  >
                    {remove.isPending ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

interface MealTrackerProps {
  date: string;
  onDateChange: (d: string) => void;
  calorieGoal: number;
  onGoalChange: (g: number) => void;
}

export default function MealTracker({
  date,
  onDateChange,
  calorieGoal,
  onGoalChange,
}: MealTrackerProps) {
  const { data: totals = [0, 0, 0, 0, 0] } = useGetDailyTotals(date);
  const clearDay = useClearEntriesForDate(date);

  const [calories, protein, carbs, fat] = totals;
  const calPct = Math.min(100, (calories / calorieGoal) * 100);
  const proteinTarget = Math.round((calorieGoal * 0.3) / 4);
  const carbsTarget = Math.round((calorieGoal * 0.5) / 4);
  const fatTarget = Math.round((calorieGoal * 0.2) / 9);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[140px]">
          <label
            htmlFor="date-input"
            className="text-xs text-muted-foreground font-medium mb-1 block"
          >
            Date
          </label>
          <Input
            id="date-input"
            data-ocid="tracker.date_input"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-card border-border text-foreground h-10"
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label
            htmlFor="goal-input"
            className="text-xs text-muted-foreground font-medium mb-1 block"
          >
            Daily Calorie Goal
          </label>
          <Input
            id="goal-input"
            data-ocid="tracker.goal_input"
            type="number"
            value={calorieGoal}
            onChange={(e) => onGoalChange(Number(e.target.value))}
            className="bg-card border-border text-foreground h-10"
          />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              data-ocid="tracker.clear_button"
              variant="outline"
              size="sm"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <Trash2 size={14} className="mr-1" /> Clear Day
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card border-border text-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all entries?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This will remove all meal entries for {date}. This cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                data-ocid="tracker.cancel_button"
                className="bg-muted border-border text-foreground"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                data-ocid="tracker.confirm_button"
                onClick={() => clearDay.mutate()}
                className="bg-destructive text-destructive-foreground"
              >
                {clearDay.isPending ? (
                  <Loader2 size={14} className="animate-spin mr-1" />
                ) : null}
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Summary bar */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Flame size={18} className="text-gold-500" /> Daily Summary
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              <span
                className={
                  calories > calorieGoal
                    ? "text-destructive font-bold"
                    : "text-primary font-bold"
                }
              >
                {calories}
              </span>{" "}
              / {calorieGoal} kcal
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Calories</span>
              <span>{Math.round(calPct)}%</span>
            </div>
            <Progress value={calPct} className="h-3" />
          </div>
          {[
            {
              label: "Protein",
              value: protein,
              target: proteinTarget,
              color: "bg-blue-500",
            },
            {
              label: "Carbs",
              value: carbs,
              target: carbsTarget,
              color: "bg-amber-500",
            },
            {
              label: "Fat",
              value: fat,
              target: fatTarget,
              color: "bg-red-500",
            },
          ].map((m) => (
            <div key={m.label}>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{m.label}</span>
                <span>
                  {m.value}g / {m.target}g
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${m.color} rounded-full transition-all duration-500`}
                  style={{
                    width: `${Math.min(100, (m.value / m.target) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Macro cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Calories",
            value: calories,
            unit: "kcal",
            icon: Flame,
            color: "text-gold-500",
            bg: "bg-gold-500/10",
          },
          {
            label: "Protein",
            value: protein,
            unit: "g",
            icon: Zap,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Carbs",
            value: carbs,
            unit: "g",
            icon: Wheat,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            label: "Fat",
            value: fat,
            unit: "g",
            icon: Droplets,
            color: "text-red-400",
            bg: "bg-red-500/10",
          },
        ].map((m) => (
          <Card key={m.label} className={`${m.bg} border-border`}>
            <CardContent className="p-4">
              <m.icon size={20} className={`${m.color} mb-2`} />
              <div className={`text-2xl font-bold ${m.color}`}>
                {m.value}
                <span className="text-sm font-normal ml-1">{m.unit}</span>
              </div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meal accordion */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Accordion type="multiple" defaultValue={["Breakfast"]}>
            {MEALS.map((meal) => (
              <MealSection
                key={meal.key}
                mealType={meal.key}
                date={date}
                icon={meal.icon}
                color={meal.color}
              />
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
