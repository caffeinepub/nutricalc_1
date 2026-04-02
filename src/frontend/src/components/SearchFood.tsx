import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Droplets, Flame, Search, Wheat, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Food } from "../backend.d";
import { useGetFoodsByCategory, useSearchFoods } from "../hooks/useQueries";
import FoodModal from "./FoodModal";

const QUOTES = [
  "Eat well, live well.",
  "Your body is a reflection of your lifestyle.",
  "Small changes lead to big results.",
  "Fuel your body, not your emotions.",
  "Consistency beats perfection.",
  "You are what you eat.",
  "Health is the greatest wealth.",
  "Every meal is a choice.",
];

const CATEGORIES = [
  "All",
  "Fruits",
  "Vegetables",
  "Grains",
  "Dairy",
  "Meat/Fish",
  "Legumes",
  "Nuts/Seeds",
  "Beverages",
  "Snacks",
  "Oils",
];

interface SearchFoodProps {
  date: string;
}

export default function SearchFood({ date }: SearchFoodProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Rotating quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((i) => (i + 1) % QUOTES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const searchQuery = useSearchFoods(debouncedSearch);
  const categoryQuery = useGetFoodsByCategory(category);

  const foods = useCallback(() => {
    if (debouncedSearch.trim()) return searchQuery.data ?? [];
    return categoryQuery.data ?? [];
  }, [debouncedSearch, searchQuery.data, categoryQuery.data])();

  const isLoading = debouncedSearch.trim()
    ? searchQuery.isLoading
    : categoryQuery.isLoading;

  const openFood = (food: Food) => {
    setSelectedFood(food);
    setModalOpen(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden rounded-2xl mb-8 px-8 py-14 md:py-20">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold mb-4 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Track Your Nutrition
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black text-foreground leading-none tracking-tight mb-3">
            Nutri<span className="text-primary">Calc</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-semibold mb-6">
            Know What You Eat.{" "}
            <span className="text-foreground">Own Your Health.</span>
          </p>
          {/* Rotating quote */}
          <div className="min-h-[2rem] transition-all duration-500">
            <p
              key={quoteIdx}
              className="text-gold-500 font-medium italic text-lg animate-fade-in"
            >
              &ldquo;{QUOTES[quoteIdx]}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          data-ocid="search.search_input"
          className="pl-11 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground text-base rounded-xl"
          placeholder="Search 200+ foods — banana, chicken breast, oats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            data-ocid="search.category_tab"
            onClick={() => {
              setCategory(cat);
              setSearch("");
              setDebouncedSearch("");
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? "bg-primary text-primary-foreground shadow-glow"
                : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground mb-4">
          Showing{" "}
          <span className="text-primary font-semibold">{foods.length}</span>{" "}
          foods
          {debouncedSearch && (
            <>
              {" "}
              for &ldquo;
              <span className="text-foreground">{debouncedSearch}</span>&rdquo;
            </>
          )}
        </p>
      )}

      {/* Food grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => i).map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl bg-muted/40" />
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div data-ocid="food.empty_state" className="text-center py-16">
          <div className="text-5xl mb-4">🥗</div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No foods found
          </h3>
          <p className="text-muted-foreground text-sm">
            Try a different search term or category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {foods.map((food) => (
            <button
              key={String(food.id)}
              type="button"
              data-ocid="food.card"
              onClick={() => openFood(food)}
              className="text-left p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-glow transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 flex-1 mr-2">
                  {food.name}
                </h3>
                <Badge className="shrink-0 bg-gold-500/20 text-gold-500 border-gold-500/30 text-xs font-bold">
                  {food.calories} kcal
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {food.category} · per 100g
              </p>
              <div className="flex gap-1.5 flex-wrap">
                <span className="macro-pill bg-blue-500/15 text-blue-400">
                  <Zap size={10} /> P {food.protein}g
                </span>
                <span className="macro-pill bg-amber-500/15 text-amber-400">
                  <Wheat size={10} /> C {food.carbs}g
                </span>
                <span className="macro-pill bg-red-500/15 text-red-400">
                  <Droplets size={10} /> F {food.fat}g
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <FoodModal
        food={selectedFood}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        date={date}
      />
    </div>
  );
}
