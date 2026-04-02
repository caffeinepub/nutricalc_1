import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Calculator,
  Flame,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const ACTIVITY_LEVELS = [
  {
    value: "sedentary",
    label: "Sedentary (little/no exercise)",
    multiplier: 1.2,
  },
  { value: "light", label: "Light (1-3 days/week)", multiplier: 1.375 },
  { value: "moderate", label: "Moderate (3-5 days/week)", multiplier: 1.55 },
  { value: "active", label: "Very Active (6-7 days/week)", multiplier: 1.725 },
  {
    value: "extra",
    label: "Extra Active (athlete/physical job)",
    multiplier: 1.9,
  },
];

export default function BMRCalculator() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("moderate");
  const [results, setResults] = useState<null | { bmr: number; tdee: number }>(
    null,
  );

  const calculate = () => {
    const a = Number(age);
    const w = Number(weight);
    const h = Number(height);
    if (!a || !w || !h) return;
    const bmr =
      gender === "male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;
    const multiplier =
      ACTIVITY_LEVELS.find((l) => l.value === activity)?.multiplier ?? 1.55;
    setResults({ bmr: Math.round(bmr), tdee: Math.round(bmr * multiplier) });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-4xl font-bold text-foreground mb-2">
          BMR Calculator
        </h2>
        <p className="text-muted-foreground">
          Discover your Basal Metabolic Rate and daily calorie needs
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator size={18} className="text-primary" /> Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger
                  data-ocid="bmr.gender_select"
                  className="bg-input border-border text-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Age (years)
              </Label>
              <Input
                data-ocid="bmr.age_input"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Weight (kg)
              </Label>
              <Input
                data-ocid="bmr.weight_input"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Height (cm)
              </Label>
              <Input
                data-ocid="bmr.height_input"
                type="number"
                placeholder="175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Activity Level
            </Label>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger
                data-ocid="bmr.activity_select"
                className="bg-input border-border text-foreground"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {ACTIVITY_LEVELS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            data-ocid="bmr.submit_button"
            onClick={calculate}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11"
          >
            <Calculator size={16} className="mr-2" /> Calculate My BMR
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-4 animate-fade-in-up">
          {/* BMR + TDEE highlight */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6 text-center">
                <Activity size={28} className="text-primary mx-auto mb-2" />
                <div className="text-4xl font-bold text-primary">
                  {results.bmr}
                </div>
                <div className="text-sm font-semibold text-foreground mt-1">
                  kcal/day BMR
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Calories your body burns at complete rest
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gold-500/10 border-gold-500/30">
              <CardContent className="p-6 text-center">
                <Flame size={28} className="text-gold-500 mx-auto mb-2" />
                <div className="text-4xl font-bold text-gold-500">
                  {results.tdee}
                </div>
                <div className="text-sm font-semibold text-foreground mt-1">
                  kcal/day TDEE
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total daily energy expenditure with activity
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Goals */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Cut (Lose Weight)",
                calories: results.tdee - 500,
                icon: TrendingDown,
                color: "text-blue-400",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20",
                desc: "500 kcal deficit · ~0.5kg/week loss",
              },
              {
                label: "Maintain",
                calories: results.tdee,
                icon: Minus,
                color: "text-green-400",
                bg: "bg-green-500/10",
                border: "border-green-500/20",
                desc: "Maintain current weight",
              },
              {
                label: "Bulk (Gain Muscle)",
                calories: results.tdee + 300,
                icon: TrendingUp,
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20",
                desc: "300 kcal surplus · lean gaining",
              },
            ].map((g) => (
              <Card key={g.label} className={`${g.bg} ${g.border} border`}>
                <CardContent className="p-4 text-center">
                  <g.icon size={22} className={`${g.color} mx-auto mb-2`} />
                  <div className={`text-2xl font-bold ${g.color}`}>
                    {g.calories}
                  </div>
                  <div className="text-xs font-semibold text-foreground mt-0.5">
                    {g.label}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {g.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
