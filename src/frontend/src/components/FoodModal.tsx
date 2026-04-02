import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Droplets, Flame, Loader2, Plus, Wheat, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Food } from "../backend.d";
import { useAddMealEntry } from "../hooks/useQueries";

interface FoodModalProps {
  food: Food | null;
  open: boolean;
  onClose: () => void;
  date: string;
}

function calcNutrition(food: Food, quantity: number, unit: string) {
  let grams = quantity;
  if (unit === "oz") grams = quantity * 28.35;
  else if (unit === "piece") grams = quantity * 100;
  const ratio = grams / 100;
  return {
    calories: Math.round(food.calories * ratio),
    protein: Math.round(food.protein * ratio * 10) / 10,
    carbs: Math.round(food.carbs * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
    fiber: Math.round(food.fiber * ratio * 10) / 10,
    grams: Math.round(grams),
  };
}

export default function FoodModal({
  food,
  open,
  onClose,
  date,
}: FoodModalProps) {
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState("grams");
  const [mealType, setMealType] = useState("Breakfast");
  const addMeal = useAddMealEntry(date);

  useEffect(() => {
    if (open) {
      setQuantity(100);
      setUnit("grams");
      setMealType("Breakfast");
    }
  }, [open]);

  if (!food) return null;

  const nutrition = calcNutrition(food, quantity, unit);

  const handleAdd = async () => {
    await addMeal.mutateAsync({
      foodId: food.id,
      foodName: food.name,
      quantity,
      unit,
      mealType,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      fiber: nutrition.fiber,
      date,
    });
    toast.success(`${food.name} added to ${mealType}!`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-md bg-card border-border text-foreground"
        data-ocid="food.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            {food.name}
          </DialogTitle>
          <Badge
            variant="outline"
            className="w-fit text-muted-foreground border-border"
          >
            {food.category}
          </Badge>
        </DialogHeader>

        {/* Per 100g base info */}
        <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-muted/30 border border-border">
          {[
            {
              label: "Calories",
              value: food.calories,
              unit: "kcal",
              color: "text-gold-500",
              icon: <Flame size={14} />,
            },
            {
              label: "Protein",
              value: food.protein,
              unit: "g",
              color: "text-blue-400",
              icon: <Zap size={14} />,
            },
            {
              label: "Carbs",
              value: food.carbs,
              unit: "g",
              color: "text-amber-400",
              icon: <Wheat size={14} />,
            },
            {
              label: "Fat",
              value: food.fat,
              unit: "g",
              color: "text-red-400",
              icon: <Droplets size={14} />,
            },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <div
                className={`flex items-center justify-center gap-1 text-xs font-medium ${m.color}`}
              >
                {m.icon} {m.label}
              </div>
              <div className="text-sm font-bold text-foreground mt-0.5">
                {m.value}
                {m.unit !== "kcal" ? m.unit : ""}
              </div>
              <div className="text-[10px] text-muted-foreground">per 100g</div>
            </div>
          ))}
        </div>

        {/* Quantity + Unit */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Quantity</Label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="grams">Grams (g)</SelectItem>
                <SelectItem value="oz">Ounces (oz)</SelectItem>
                <SelectItem value="piece">Piece</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Live nutrition */}
        <div className="p-3 rounded-xl border border-primary/30 bg-primary/5">
          <div className="text-xs text-primary font-semibold mb-2 uppercase tracking-wider">
            Calculated Nutrition
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Calories</span>
              <span className="font-bold text-gold-500">
                {nutrition.calories} kcal
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Protein</span>
              <span className="font-bold text-blue-400">
                {nutrition.protein}g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Carbs</span>
              <span className="font-bold text-amber-400">
                {nutrition.carbs}g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fat</span>
              <span className="font-bold text-red-400">{nutrition.fat}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fiber</span>
              <span className="font-bold text-green-400">
                {nutrition.fiber}g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weight</span>
              <span className="font-bold text-foreground">
                {nutrition.grams}g
              </span>
            </div>
          </div>
        </div>

        {/* Meal type */}
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Meal Type</Label>
          <Select value={mealType} onValueChange={setMealType}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {["Breakfast", "Lunch", "Dinner", "Snacks"].map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAdd}
          disabled={addMeal.isPending}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          data-ocid="food.add_button"
        >
          {addMeal.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" /> Adding...
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" /> Add to {mealType}
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
