import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Flame, TrendingUp, Wheat, Zap } from "lucide-react";
import { toast } from "sonner";
import {
  useAddWaterEntry,
  useGetDailyTotals,
  useGetTotalWater,
} from "../hooks/useQueries";

interface DashboardProps {
  date: string;
  calorieGoal: number;
}

function CircularProgress({
  value,
  max,
  size = 180,
}: { value: number; max: number; size?: number }) {
  const pct = Math.min(1, value / max);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg
      width={size}
      height={size}
      className="-rotate-90"
      role="img"
      aria-label="Calorie progress ring"
    >
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="oklch(0.25 0.03 170)"
        strokeWidth="12"
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="oklch(0.72 0.18 162)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}

export default function NutritionDashboard({
  date,
  calorieGoal,
}: DashboardProps) {
  const { data: totals = [0, 0, 0, 0, 0] } = useGetDailyTotals(date);
  const { data: waterRaw = BigInt(0) } = useGetTotalWater(date);
  const addWater = useAddWaterEntry(date);

  const [calories, protein, carbs, fat, fiber] = totals;
  const waterMl = Number(waterRaw);
  const waterGoal = 2000;
  const glasses = Math.floor(waterMl / 250);

  const proteinTarget = Math.round((calorieGoal * 0.3) / 4);
  const carbsTarget = Math.round((calorieGoal * 0.5) / 4);
  const fatTarget = Math.round((calorieGoal * 0.2) / 9);

  const handleAddWater = (ml: number) => {
    addWater.mutate(ml);
    toast.success(`+${ml}ml water logged!`);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calorie ring */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame size={18} className="text-gold-500" /> Calorie Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative">
              <CircularProgress value={calories} max={calorieGoal} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">
                  {calories}
                </span>
                <span className="text-xs text-muted-foreground">
                  of {calorieGoal} kcal
                </span>
                <span className="text-xs text-primary font-medium mt-1">
                  {Math.max(0, calorieGoal - calories)} remaining
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <div className="text-center p-3 rounded-xl bg-muted/20 border border-border">
                <div className="text-lg font-bold text-primary">{calories}</div>
                <div className="text-xs text-muted-foreground">Consumed</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/20 border border-border">
                <div className="text-lg font-bold text-gold-500">
                  {Math.max(0, calorieGoal - calories)}
                </div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Macro bars */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp size={18} className="text-primary" /> Macro Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              {
                label: "Protein",
                value: protein,
                target: proteinTarget,
                color: "bg-blue-500",
                textColor: "text-blue-400",
                icon: Zap,
              },
              {
                label: "Carbohydrates",
                value: carbs,
                target: carbsTarget,
                color: "bg-amber-500",
                textColor: "text-amber-400",
                icon: Wheat,
              },
              {
                label: "Fat",
                value: fat,
                target: fatTarget,
                color: "bg-red-500",
                textColor: "text-red-400",
                icon: Droplets,
              },
              {
                label: "Fiber",
                value: fiber,
                target: 25,
                color: "bg-green-500",
                textColor: "text-green-400",
                icon: Zap,
              },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <m.icon size={14} className={m.textColor} />
                    <span className="text-sm font-medium text-foreground">
                      {m.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${m.textColor}`}>
                      {m.value}g
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {" "}
                      / {m.target}g
                    </span>
                  </div>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${m.color} rounded-full transition-all duration-700`}
                    style={{
                      width: `${Math.min(100, (m.value / m.target) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Water tracker */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base">
              <Droplets size={18} className="text-blue-400" /> Water Intake
            </div>
            <span className="text-sm font-normal text-muted-foreground">
              {waterMl}ml / {waterGoal}ml
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Glass icons */}
          <div className="flex gap-2 flex-wrap mb-5">
            {Array.from({ length: 8 }, (_, i) => i).map((i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-end w-10 h-14 rounded-lg border-2 transition-all ${
                  i < glasses
                    ? "bg-blue-500/30 border-blue-400 shadow-[0_0_8px_oklch(0.65_0.2_220/0.4)]"
                    : "bg-muted/20 border-border"
                }`}
              >
                <Droplets
                  size={16}
                  className={
                    i < glasses ? "text-blue-400" : "text-muted-foreground"
                  }
                />
                <span className="text-[9px] text-muted-foreground mt-0.5">
                  {(i + 1) * 250}ml
                </span>
              </div>
            ))}
          </div>
          {/* Progress */}
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (waterMl / waterGoal) * 100)}%`,
              }}
            />
          </div>
          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              data-ocid="dashboard.water_button"
              onClick={() => handleAddWater(250)}
              className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
              variant="outline"
            >
              <Droplets size={14} className="mr-1" /> +250ml
            </Button>
            <Button
              data-ocid="dashboard.water_button"
              onClick={() => handleAddWater(500)}
              className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
              variant="outline"
            >
              <Droplets size={14} className="mr-1" /> +500ml
            </Button>
            <Button
              data-ocid="dashboard.water_button"
              onClick={() => handleAddWater(1000)}
              className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
              variant="outline"
            >
              <Droplets size={14} className="mr-1" /> +1L
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Macro stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Calories",
            value: calories,
            unit: "kcal",
            icon: Flame,
            textColor: "text-gold-500",
            bgColor: "bg-gold-500/10",
            border: "border-gold-500/20",
          },
          {
            label: "Protein",
            value: protein,
            unit: "g",
            icon: Zap,
            textColor: "text-blue-400",
            bgColor: "bg-blue-500/10",
            border: "border-blue-500/20",
          },
          {
            label: "Carbs",
            value: carbs,
            unit: "g",
            icon: Wheat,
            textColor: "text-amber-400",
            bgColor: "bg-amber-500/10",
            border: "border-amber-500/20",
          },
          {
            label: "Fat",
            value: fat,
            unit: "g",
            icon: Droplets,
            textColor: "text-red-400",
            bgColor: "bg-red-500/10",
            border: "border-red-500/20",
          },
        ].map((m) => (
          <Card key={m.label} className={`${m.bgColor} ${m.border} border`}>
            <CardContent className="p-4">
              <m.icon size={22} className={`${m.textColor} mb-2`} />
              <div className={`text-3xl font-bold ${m.textColor}`}>
                {m.value}
                <span className="text-sm font-normal ml-1 text-muted-foreground">
                  {m.unit}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {m.label} today
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
