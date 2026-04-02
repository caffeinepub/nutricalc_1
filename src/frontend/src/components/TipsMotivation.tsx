import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Heart,
  Leaf,
  Shield,
  Star,
  Zap,
} from "lucide-react";

const MOTIVATIONAL_QUOTES = [
  {
    quote: "Eat well, live well.",
    author: "Ancient Wisdom",
    gradient: "from-emerald-900/60 to-teal-800/40",
  },
  {
    quote: "Your body is a reflection of your lifestyle.",
    author: "Health Philosophy",
    gradient: "from-blue-900/60 to-indigo-800/40",
  },
  {
    quote: "Small changes lead to big results.",
    author: "Fitness Mindset",
    gradient: "from-purple-900/60 to-pink-800/40",
  },
  {
    quote: "Fuel your body, not your emotions.",
    author: "Nutrition Science",
    gradient: "from-amber-900/60 to-orange-800/40",
  },
  {
    quote: "Consistency beats perfection every time.",
    author: "Athlete Mindset",
    gradient: "from-rose-900/60 to-red-800/40",
  },
  {
    quote: "You are what you eat — choose wisely.",
    author: "Hippocrates",
    gradient: "from-green-900/60 to-emerald-800/40",
  },
  {
    quote: "Health is the greatest wealth.",
    author: "Virgil",
    gradient: "from-cyan-900/60 to-sky-800/40",
  },
  {
    quote: "Every meal is a chance to nourish your future self.",
    author: "Modern Nutrition",
    gradient: "from-violet-900/60 to-purple-800/40",
  },
];

const NUTRITION_MISTAKES = [
  {
    title: "Skipping Breakfast",
    desc: "Breakfast kick-starts your metabolism. Skipping it often leads to overeating later in the day.",
    icon: AlertCircle,
  },
  {
    title: "Not Tracking Protein",
    desc: "Protein keeps you full and preserves muscle. Aim for 0.8-1.2g per kg of body weight daily.",
    icon: AlertCircle,
  },
  {
    title: "Underestimating Liquid Calories",
    desc: "Juices, sodas, and lattes pack hundreds of hidden calories. Track everything you drink.",
    icon: AlertCircle,
  },
  {
    title: "Eating Too Fast",
    desc: "Your brain takes 20 minutes to register fullness. Slow down and chew thoroughly.",
    icon: AlertCircle,
  },
  {
    title: "Fear of Healthy Fats",
    desc: "Avocado, nuts, and olive oil support brain health and hormone production. Don't cut them out.",
    icon: AlertCircle,
  },
  {
    title: "Ignoring Fiber Intake",
    desc: "Most people get less than half the recommended 25-38g daily. Fiber feeds gut bacteria and aids digestion.",
    icon: AlertCircle,
  },
];

const WHY_TRACK = [
  {
    title: "Awareness",
    desc: "See exactly what you're consuming and make informed decisions.",
    icon: Brain,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Reach Goals Faster",
    desc: "Data-driven tracking accelerates fat loss and muscle gain.",
    icon: Zap,
    color: "text-gold-500",
    bg: "bg-gold-500/10",
  },
  {
    title: "Build Better Habits",
    desc: "Consistent logging rewires your relationship with food.",
    icon: Heart,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    title: "Prevent Disease",
    desc: "A balanced diet dramatically reduces risk of chronic illness.",
    icon: Shield,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

export default function TipsMotivation() {
  return (
    <div className="space-y-12">
      {/* Quote cards */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Star size={22} className="text-gold-500" />
          <h2 className="font-display text-3xl font-bold text-foreground">
            Daily Motivation
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOTIVATIONAL_QUOTES.map((q) => (
            <div
              key={q.quote}
              className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${q.gradient} border border-border`}
            >
              <div className="text-4xl leading-none text-primary/40 font-serif mb-2">
                &ldquo;
              </div>
              <p className="text-foreground font-semibold text-sm leading-relaxed mb-3">
                {q.quote}
              </p>
              <p className="text-xs text-muted-foreground italic">
                — {q.author}
              </p>
              <Leaf
                size={48}
                className="absolute -bottom-2 -right-2 text-primary/10"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Why track */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Zap size={22} className="text-primary" />
          <h2 className="font-display text-3xl font-bold text-foreground">
            Why Track Nutrition?
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY_TRACK.map((item) => (
            <Card key={item.title} className={`${item.bg} border-border`}>
              <CardContent className="p-5">
                <item.icon size={28} className={`${item.color} mb-3`} />
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Nutrition mistakes */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle size={22} className="text-amber-400" />
          <h2 className="font-display text-3xl font-bold text-foreground">
            Common Nutrition Mistakes
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NUTRITION_MISTAKES.map((mistake, mistakeIdx) => (
            <div
              key={mistake.title}
              className="flex gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-amber-400 font-bold text-sm">
                  {mistakeIdx + 1}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={14} className="text-primary" />
                  <h3 className="font-semibold text-foreground text-sm">
                    {mistake.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {mistake.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Macro guide */}
      <section className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">
          Quick Macro Reference Guide
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <h3 className="font-bold text-blue-400">🥩 Protein (4 kcal/g)</h3>
            <ul className="space-y-0.5 text-muted-foreground">
              <li>Chicken breast: 31g/100g</li>
              <li>Greek yogurt: 10g/100g</li>
              <li>Lentils: 9g/100g</li>
              <li>Eggs: 13g/100g</li>
            </ul>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-amber-400">
              🌾 Carbohydrates (4 kcal/g)
            </h3>
            <ul className="space-y-0.5 text-muted-foreground">
              <li>Brown rice: 77g/100g</li>
              <li>Oats: 66g/100g</li>
              <li>Sweet potato: 20g/100g</li>
              <li>Banana: 23g/100g</li>
            </ul>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-red-400">
              🥑 Healthy Fats (9 kcal/g)
            </h3>
            <ul className="space-y-0.5 text-muted-foreground">
              <li>Avocado: 15g/100g</li>
              <li>Almonds: 50g/100g</li>
              <li>Olive oil: 100g/100g</li>
              <li>Salmon: 13g/100g</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
