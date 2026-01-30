// Nutrition planning service with local food database
const localFoods = {
  grains: [
    { name: 'चावल', nameEn: 'Rice', cost: 0.15, protein: 2.7, carbs: 28, calories: 130 },
    { name: 'गेहूं', nameEn: 'Wheat', cost: 0.12, protein: 3.6, carbs: 22, calories: 110 },
    { name: 'बाजरा', nameEn: 'Millet', cost: 0.10, protein: 3.5, carbs: 23, calories: 119 }
  ],
  vegetables: [
    { name: 'आलू', nameEn: 'Potato', cost: 0.08, protein: 2, carbs: 17, calories: 77 },
    { name: 'प्याज', nameEn: 'Onion', cost: 0.06, protein: 1.1, carbs: 9, calories: 40 },
    { name: 'टमाटर', nameEn: 'Tomato', cost: 0.10, protein: 0.9, carbs: 4, calories: 18 },
    { name: 'पालक', nameEn: 'Spinach', cost: 0.05, protein: 2.9, carbs: 3.6, calories: 23 }
  ],
  legumes: [
    { name: 'दाल', nameEn: 'Lentils', cost: 0.20, protein: 9, carbs: 20, calories: 116 },
    { name: 'चना', nameEn: 'Chickpeas', cost: 0.18, protein: 8, carbs: 27, calories: 164 },
    { name: 'राजमा', nameEn: 'Kidney beans', cost: 0.22, protein: 9, carbs: 22, calories: 127 }
  ],
  dairy: [
    { name: 'दूध', nameEn: 'Milk', cost: 0.25, protein: 3.4, carbs: 5, calories: 42 },
    { name: 'दही', nameEn: 'Yogurt', cost: 0.15, protein: 10, carbs: 3.6, calories: 59 }
  ]
};

const mealTemplates = {
  breakfast: [
    { name: 'दलिया', ingredients: ['दलिया', 'दूध', 'गुड़'], cost: 0.30 },
    { name: 'पोहा', ingredients: ['चावल', 'प्याज', 'आलू'], cost: 0.25 },
    { name: 'रोटी सब्जी', ingredients: ['गेहूं', 'आलू', 'प्याज'], cost: 0.35 }
  ],
  lunch: [
    { name: 'दाल चावल', ingredients: ['दाल', 'चावल', 'प्याज'], cost: 0.45 },
    { name: 'सब्जी रोटी', ingredients: ['गेहूं', 'आलू', 'टमाटर'], cost: 0.40 },
    { name: 'खिचड़ी', ingredients: ['चावल', 'दाल', 'आलू'], cost: 0.38 }
  ],
  dinner: [
    { name: 'दाल रोटी', ingredients: ['दाल', 'गेहूं', 'प्याज'], cost: 0.42 },
    { name: 'चावल सब्जी', ingredients: ['चावल', 'पालक', 'टमाटर'], cost: 0.35 },
    { name: 'दलिया सब्जी', ingredients: ['दलिया', 'आलू', 'प्याज'], cost: 0.33 }
  ]
};

export const generateMealPlan = async ({ familySize, dailyBudget, language = 'hi' }) => {
  try {
    const budgetPerMeal = dailyBudget / 3; // Breakfast, lunch, dinner
    const budgetPerPerson = dailyBudget / familySize;
    
    // Select meals based on budget
    const selectedMeals = [];
    let totalCost = 0;
    
    // Breakfast
    const affordableBreakfast = mealTemplates.breakfast.filter(meal => 
      meal.cost * familySize <= budgetPerMeal * 1.2
    );
    const breakfast = affordableBreakfast[Math.floor(Math.random() * affordableBreakfast.length)];
    if (breakfast) {
      selectedMeals.push({ ...breakfast, type: 'नाश्ता', cost: breakfast.cost * familySize });
      totalCost += breakfast.cost * familySize;
    }
    
    // Lunch
    const affordableLunch = mealTemplates.lunch.filter(meal => 
      meal.cost * familySize <= budgetPerMeal * 1.3
    );
    const lunch = affordableLunch[Math.floor(Math.random() * affordableLunch.length)];
    if (lunch) {
      selectedMeals.push({ ...lunch, type: 'दोपहर का खाना', cost: lunch.cost * familySize });
      totalCost += lunch.cost * familySize;
    }
    
    // Dinner
    const remainingBudget = dailyBudget - totalCost;
    const affordableDinner = mealTemplates.dinner.filter(meal => 
      meal.cost * familySize <= remainingBudget
    );
    const dinner = affordableDinner[Math.floor(Math.random() * affordableDinner.length)];
    if (dinner) {
      selectedMeals.push({ ...dinner, type: 'रात का खाना', cost: dinner.cost * familySize });
      totalCost += dinner.cost * familySize;
    }
    
    // Calculate nutrition
    const totalNutrition = calculateNutrition(selectedMeals);
    
    return {
      meals: selectedMeals,
      totalCost: totalCost.toFixed(2),
      familySize,
      costPerPerson: (totalCost / familySize).toFixed(2),
      nutrition: totalNutrition,
      recommendations: generateRecommendations(totalNutrition, familySize, language)
    };
    
  } catch (error) {
    console.error('Meal planning error:', error);
    return {
      meals: [],
      totalCost: 0,
      error: 'भोजन योजना बनाने में त्रुटि हुई'
    };
  }
};

const calculateNutrition = (meals) => {
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalCalories = 0;
  
  meals.forEach(meal => {
    meal.ingredients.forEach(ingredient => {
      // Find ingredient in food database
      const food = findFoodByName(ingredient);
      if (food) {
        totalProtein += food.protein;
        totalCarbs += food.carbs;
        totalCalories += food.calories;
      }
    });
  });
  
  return {
    protein: totalProtein.toFixed(1),
    carbs: totalCarbs.toFixed(1),
    calories: totalCalories.toFixed(0)
  };
};

const findFoodByName = (name) => {
  const allFoods = [...localFoods.grains, ...localFoods.vegetables, ...localFoods.legumes, ...localFoods.dairy];
  return allFoods.find(food => food.name === name || food.nameEn.toLowerCase() === name.toLowerCase());
};

const generateRecommendations = (nutrition, familySize, language) => {
  const recommendations = [];
  
  const proteinPerPerson = nutrition.protein / familySize;
  const caloriesPerPerson = nutrition.calories / familySize;
  
  if (proteinPerPerson < 15) {
    recommendations.push(
      language === 'hi' 
        ? 'अधिक दाल और दूध शामिल करें'
        : 'Include more lentils and milk'
    );
  }
  
  if (caloriesPerPerson < 400) {
    recommendations.push(
      language === 'hi'
        ? 'अधिक अनाज और तेल का उपयोग करें'
        : 'Use more grains and cooking oil'
    );
  }
  
  recommendations.push(
    language === 'hi'
      ? 'हरी सब्जियां रोज खाएं'
      : 'Eat green vegetables daily'
  );
  
  return recommendations;
};

export const getFoodAvailability = (season = 'all') => {
  const seasonal = {
    summer: ['आम', 'तरबूज', 'खीरा', 'टमाटर'],
    monsoon: ['हरी सब्जियां', 'पालक', 'मेथी'],
    winter: ['गाजर', 'मूली', 'पत्तागोभी', 'फूलगोभी']
  };
  
  return season === 'all' ? localFoods : seasonal[season] || [];
};

export const calculateBudgetOptimization = (currentBudget, targetNutrition) => {
  // Algorithm to optimize food selection based on nutrition per rupee
  const efficiencyRatios = [];
  
  Object.values(localFoods).flat().forEach(food => {
    const nutritionScore = (food.protein * 4 + food.calories * 0.1) / food.cost;
    efficiencyRatios.push({ ...food, efficiency: nutritionScore });
  });
  
  return efficiencyRatios.sort((a, b) => b.efficiency - a.efficiency).slice(0, 10);
};