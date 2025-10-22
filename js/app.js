//document.getElementById("fetchButton").addEventListener("click", fetchMeals);

async function fetchMeals() {
  try {
    const letters = ["a","b","c","d","e"];
    let allMeals = [];

    for (const letter of letters) {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
      const data = await response.json();
      if (data.meals) allMeals.push(...data.meals);
    }

    // Filtrera tomma namn och sortera
    let filteredSortedMeals = allMeals
      .filter(meal => meal.strMeal && meal.strMeal.trim() !== "")
      .sort((a, b) => a.strMeal.trim().toLowerCase().localeCompare(b.strMeal.trim().toLowerCase()))
      .slice(0, 25); // Max 25

    console.log(`✅ Totalt antal måltider (max 25) hämtade: ${filteredSortedMeals.length}`);

    // Visa måltider visuellt


    filteredSortedMeals.forEach((meal, index) => {

      console.log(meal.strMeal);
      console.log(meal.strCategory);
    });

    const first5Meals = filteredSortedMeals
      .slice(0, 5)
      .map((meal, index) => `${index + 1}. ${meal.strMeal.trim()}`);
    console.log("🍽️ Första 5 måltider (A–E, alfabetiskt):");
    first5Meals.forEach(meal => console.log(meal));

    const givenCategory = "Seafood";
    const mealsByCategory = filteredSortedMeals.filter(
      meal => meal.strCategory && meal.strCategory.toLowerCase() === givenCategory.toLowerCase()
    );
    console.log(`\n🐟 Måltider i kategorin "${givenCategory}":`);
    mealsByCategory.forEach((meal, index) => console.log(`${index + 1}. ${meal.strMeal} (${meal.strCategory})`));

    const categoryCount = filteredSortedMeals.reduce((acc, meal) => {
      const category = meal.strCategory || "Okänd";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    console.log("\n📊 Antal måltider per kategori:", categoryCount);

    const groupedByCategory = groupBy(filteredSortedMeals, "strCategory");
    console.log("\n📦 Gruppade måltider efter kategori:", groupedByCategory);

    const mealSummaries = filteredSortedMeals.map(meal => selectAndReshape(meal));
    console.log("\n🧾 Förenklade måltidsobjekt:", mealSummaries);

    const ingredientFrequency = buildIngredientFrequency(filteredSortedMeals);
    console.log("\n🥄 Frekvens av ingredienser:", ingredientFrequency);

  } catch (error) {
    console.error("❌ Fel vid hämtning av måltider:", error);
  }
}

// ---------------------------------------------------
// Hjälpfunktioner för VG-kraven
// ---------------------------------------------------
function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const groupKey = item[key] || "Okänd";
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
}

function selectAndReshape(meal) {
  const ingredients = Object.keys(meal)
    .filter(key => key.startsWith("strIngredient") && meal[key] && meal[key].trim() !== "")
    .map(key => meal[key]);
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory,
    ingredients: ingredients
  };
}

function buildIngredientFrequency(meals) {
  return meals
    .flatMap(meal =>
      Object.keys(meal)
        .filter(key => key.startsWith("strIngredient") && meal[key] && meal[key].trim() !== "")
        .map(key => meal[key])
    )
    .reduce((acc, ingredient) => {
      acc[ingredient] = (acc[ingredient] || 0) + 1;
      return acc;
    }, {});
}
fetchMeals();
