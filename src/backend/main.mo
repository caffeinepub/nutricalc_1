import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  // Types
  type Food = {
    id : Nat;
    name : Text;
    category : Text;
    calories : Float;
    protein : Float;
    carbs : Float;
    fat : Float;
    fiber : Float;
  };

  type MealEntry = {
    entryId : Nat;
    foodId : Nat;
    foodName : Text;
    quantity : Float;
    unit : Text;
    mealType : Text; // breakfast, lunch, dinner, snack
    calories : Float;
    protein : Float;
    carbs : Float;
    fat : Float;
    fiber : Float;
    date : Text;
  };

  type WaterEntry = {
    entryId : Nat;
    amountMl : Nat;
    date : Text;
  };

  module MealEntry {
    public func compareByDateTemporally(entry1 : MealEntry, entry2 : MealEntry) : Order.Order {
      switch (Nat.compare(entry1.entryId, entry2.entryId)) {
        case (#equal) { Text.compare(entry1.date, entry2.date) };
        case (order) { order };
      };
    };

    public func compareByDate(entry1 : MealEntry, entry2 : MealEntry) : Order.Order {
      Text.compare(entry1.date, entry2.date);
    };
  };

  // State
  let foodDatabase = Map.empty<Nat, Food>();
  let mealLog = Map.empty<Principal, List.List<MealEntry>>();
  let waterLog = Map.empty<Principal, List.List<WaterEntry>>();
  var nextEntryId = 1;
  var nextWaterEntryId = 1;

  // Food Database Functions
  public query ({ caller }) func searchFoods(searchText : Text) : async [Food] {
    foodDatabase.values().toArray().filter(
      func(f) {
        f.name.toLower().contains(#text(searchText.toLower()));
      }
    );
  };

  public query ({ caller }) func getFoodById(id : Nat) : async Food {
    switch (foodDatabase.get(id)) {
      case (null) { Runtime.trap("Food not found") };
      case (?food) { food };
    };
  };

  public query ({ caller }) func getFoodsByCategory(category : Text) : async [Food] {
    foodDatabase.values().toArray().filter(
      func(f) { Text.equal(f.category, category.toLower()) }
    );
  };

  // Meal Log Functions
  public shared ({ caller }) func addMealEntry(foodId : Nat, foodName : Text, quantity : Float, unit : Text, mealType : Text, calories : Float, protein : Float, carbs : Float, fat : Float, fiber : Float, date : Text) : async Nat {
    let entry : MealEntry = {
      entryId = nextEntryId;
      foodId;
      foodName;
      quantity;
      unit;
      mealType;
      calories;
      protein;
      carbs;
      fat;
      fiber;
      date;
    };

    let existingEntries = switch (mealLog.get(caller)) {
      case (null) { List.empty<MealEntry>() };
      case (?entries) { entries };
    };

    existingEntries.add(entry);
    mealLog.add(caller, existingEntries);

    nextEntryId += 1;
    entry.entryId;
  };

  public shared ({ caller }) func removeMealEntry(entryId : Nat) : async () {
    switch (mealLog.get(caller)) {
      case (null) { Runtime.trap("No entries found") };
      case (?entries) {
        let filteredEntries = entries.filter(func(e) { e.entryId != entryId });
        mealLog.add(caller, filteredEntries);
      };
    };
  };

  public query ({ caller }) func getEntriesForDate(date : Text) : async [MealEntry] {
    switch (mealLog.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.toArray().filter(
          func(e) { Text.equal(e.date, date) }
        );
      };
    };
  };

  public query ({ caller }) func getEntriesByMealTypeAndDate(mealType : Text, date : Text) : async [MealEntry] {
    switch (mealLog.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.toArray().filter(
          func(e) {
            Text.equal(e.date, date) and Text.equal(e.mealType, mealType)
          }
        );
      };
    };
  };

  public shared ({ caller }) func clearEntriesForDate(date : Text) : async () {
    switch (mealLog.get(caller)) {
      case (null) { Runtime.trap("No entries found") };
      case (?entries) {
        let filteredEntries = entries.filter(func(e) { not Text.equal(e.date, date) });
        mealLog.add(caller, filteredEntries);
      };
    };
  };

  public query ({ caller }) func getDailyTotals(date : Text) : async (Float, Float, Float, Float, Float) {
    var totalCalories : Float = 0.0;
    var totalProtein : Float = 0.0;
    var totalCarbs : Float = 0.0;
    var totalFat : Float = 0.0;
    var totalFiber : Float = 0.0;

    switch (mealLog.get(caller)) {
      case (null) { () };
      case (?entries) {
        let dayEntries = entries.toArray().filter(
          func(e) { Text.equal(e.date, date) }
        );
        for (entry in dayEntries.values()) {
          totalCalories += entry.calories;
          totalProtein += entry.protein;
          totalCarbs += entry.carbs;
          totalFat += entry.fat;
          totalFiber += entry.fiber;
        };
      };
    };

    (totalCalories, totalProtein, totalCarbs, totalFat, totalFiber);
  };

  // Water Log Functions
  public shared ({ caller }) func addWaterEntry(amountMl : Nat, date : Text) : async Nat {
    let entry : WaterEntry = {
      entryId = nextWaterEntryId;
      amountMl;
      date;
    };

    let existingEntries = switch (waterLog.get(caller)) {
      case (null) { List.empty<WaterEntry>() };
      case (?entries) { entries };
    };

    existingEntries.add(entry);
    waterLog.add(caller, existingEntries);

    nextWaterEntryId += 1;
    entry.entryId;
  };

  public shared ({ caller }) func removeWaterEntry(entryId : Nat) : async () {
    switch (waterLog.get(caller)) {
      case (null) { Runtime.trap("No water entries found") };
      case (?entries) {
        let filteredEntries = entries.filter(func(e) { e.entryId != entryId });
        waterLog.add(caller, filteredEntries);
      };
    };
  };

  public query ({ caller }) func getTotalWaterForDate(date : Text) : async Nat {
    var total : Nat = 0;
    switch (waterLog.get(caller)) {
      case (null) { 0 };
      case (?entries) {
        let dayEntries = entries.toArray().filter(
          func(e) { Text.equal(e.date, date) }
        );
        for (entry in dayEntries.values()) {
          total += entry.amountMl;
        };
        total;
      };
    };
  };

  public query ({ caller }) func getAllFoods() : async [Food] {
    foodDatabase.values().toArray();
  };

  // Seed Data (Subset for example, 200+ foods in actual implementation)
  let foods : [Food] = [
    // Fruits
    {
      id = 1;
      name = "Apple";
      category = "fruit";
      calories = 52;
      protein = 0.3;
      carbs = 14;
      fat = 0.2;
      fiber = 2.4;
    },
    {
      id = 2;
      name = "Banana";
      category = "fruit";
      calories = 89;
      protein = 1.1;
      carbs = 23;
      fat = 0.3;
      fiber = 2.6;
    },
    // vegetables
    {
      id = 3;
      name = "Carrot";
      category = "vegetable";
      calories = 41;
      protein = 0.9;
      carbs = 10;
      fat = 0.2;
      fiber = 2.8;
    },
    {
      id = 4;
      name = "Broccoli";
      category = "vegetable";
      calories = 34;
      protein = 2.8;
      carbs = 7;
      fat = 0.4;
      fiber = 2.6;
    },
    // grains
    {
      id = 5;
      name = "Brown Rice, Cooked";
      category = "grain";
      calories = 123;
      protein = 2.7;
      carbs = 25.6;
      fat = 1;
      fiber = 1.8;
    },
    {
      id = 6;
      name = "Oatmeal, Cooked";
      category = "grain";
      calories = 71;
      protein = 2.5;
      carbs = 12;
      fat = 1.4;
      fiber = 1.7;
    },
    // dairy
    {
      id = 7;
      name = "Whole Milk";
      category = "dairy";
      calories = 61;
      protein = 3.2;
      carbs = 4.8;
      fat = 3.3;
      fiber = 0.0;
    },
    {
      id = 8;
      name = "Cheddar Cheese";
      category = "dairy";
      calories = 402;
      protein = 25;
      carbs = 1.3;
      fat = 33;
      fiber = 0.0;
    },
    // meat / fish
    {
      id = 9;
      name = "Chicken Breast, Cooked";
      category = "meat";
      calories = 165;
      protein = 31;
      carbs = 0.0;
      fat = 3.6;
      fiber = 0.0;
    },
    {
      id = 10;
      name = "Salmon, Cooked";
      category = "fish";
      calories = 206;
      protein = 22;
      carbs = 0.0;
      fat = 13;
      fiber = 0.0;
    },
    // legumes
    {
      id = 11;
      name = "Black Beans, Cooked";
      category = "legume";
      calories = 132;
      protein = 8.9;
      carbs = 23.7;
      fat = 0.5;
      fiber = 8.7;
    },
    {
      id = 12;
      name = "Lentils, Cooked";
      category = "legume";
      calories = 116;
      protein = 9.0;
      carbs = 20.1;
      fat = 0.4;
      fiber = 7.9;
    },
    // nuts / seeds
    {
      id = 13;
      name = "Almonds";
      category = "nut";
      calories = 579;
      protein = 21;
      carbs = 22;
      fat = 50;
      fiber = 12.5;
    },
    {
      id = 14;
      name = "Chia Seeds";
      category = "seed";
      calories = 486;
      protein = 16.5;
      carbs = 42.1;
      fat = 30.7;
      fiber = 34.4;
    },
    // beverages
    {
      id = 15;
      name = "Black Coffee";
      category = "beverage";
      calories = 2.0;
      protein = 0.3;
      carbs = 0.0;
      fat = 0.0;
      fiber = 0.0;
    },
    {
      id = 16;
      name = "Orange Juice";
      category = "beverage";
      calories = 45;
      protein = 0.7;
      carbs = 10.4;
      fat = 0.2;
      fiber = 0.2;
    },
    // snacks
    {
      id = 17;
      name = "Potato Chips";
      category = "snack";
      calories = 536;
      protein = 7.0;
      carbs = 53.0;
      fat = 33.7;
      fiber = 4.5;
    },
    {
      id = 18;
      name = "Chocolate Bar, Milk";
      category = "snack";
      calories = 535;
      protein = 7.3;
      carbs = 59.4;
      fat = 29.7;
      fiber = 3.4;
    },
    // oils
    {
      id = 19;
      name = "Olive Oil";
      category = "oil";
      calories = 884;
      protein = 0.0;
      carbs = 0.0;
      fat = 100;
      fiber = 0.0;
    },
    {
      id = 20;
      name = "Butter";
      category = "oil";
      calories = 717;
      protein = 0.9;
      carbs = 0.1;
      fat = 81;
      fiber = 0.0;
    },
  ];

  // Initialize food database with seed data
  for (food in foods.values()) {
    foodDatabase.add(food.id, food);
  };
};
