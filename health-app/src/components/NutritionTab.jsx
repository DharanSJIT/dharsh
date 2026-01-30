import { useState } from 'react'
import { getHealthAdvice } from '../services/geminiService'

const NutritionTab = ({ t, currentLanguage }) => {
  const [familySize, setFamilySize] = useState(4)
  const [budget, setBudget] = useState(2)
  const [dietaryPref, setDietaryPref] = useState('veg')
  const [mealPlan, setMealPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateMealPlan = async () => {
    setIsLoading(true)
    
    const budgetInRs = budget * 80 // Convert $ to ₹
    
    const prompt = currentLanguage === 'hi' ?
      `${familySize} लोगों के परिवार के लिए ₹${budgetInRs} दैनिक बजट में ${dietaryPref === 'veg' ? 'शाकाहारी' : dietaryPref === 'nonveg' ? 'मांसाहारी' : 'वीगन'} भोजन योजना बनाएं। केवल भोजन सुझाव दें:

नाश्ता:
- व्यंजन का नाम
- सामग्री
- लागत (₹ में)

दोपहर का खाना:
- व्यंजन का नाम
- सामग्री
- लागत (₹ में)

रात का खाना:
- व्यंजन का नाम
- सामग्री
- लागत (₹ में)

कुल लागत: ₹___

सरल बिंदुओं में जवाब दें। कोई अतिरिक्त सलाह न दें।` :
      `Create a ${dietaryPref === 'veg' ? 'vegetarian' : dietaryPref === 'nonveg' ? 'non-vegetarian' : 'vegan'} meal plan for a family of ${familySize} people with a daily budget of ₹${budgetInRs}. Only provide meal suggestions:

Breakfast:
- Dish name
- Ingredients
- Cost (in ₹)

Lunch:
- Dish name
- Ingredients
- Cost (in ₹)

Dinner:
- Dish name
- Ingredients
- Cost (in ₹)

Total Cost: ₹___

Answer in simple bullet points. No additional advice.`

    try {
      const response = await getHealthAdvice(prompt, currentLanguage)
      let cleanResponse = response.replace(/\*/g, '').replace(/\$/g, '₹')
      
      // Replace standalone numbers with ₹ prefix for costs
      cleanResponse = cleanResponse.replace(/- (\d+)$/gm, '- ₹$1')
      cleanResponse = cleanResponse.replace(/Cost: (\d+)/gi, 'Cost: ₹$1')
      cleanResponse = cleanResponse.replace(/Total Cost: (\d+)/gi, 'Total Cost: ₹$1')
      
      setMealPlan({
        plan: cleanResponse,
        totalCost: budgetInRs * familySize
      })
    } catch (error) {
      console.error('Error generating meal plan:', error)
      generateFallbackPlan()
    } finally {
      setIsLoading(false)
    }
  }

  const generateFallbackPlan = () => {
    const mealsData = {
      hi: {
        meals: [
          { name: "दाल चावल", cost: 35, ingredients: "दाल, चावल, प्याज", type: "नाश्ता" },
          { name: "सब्जी रोटी", cost: 28, ingredients: "गेहूं, आलू, टमाटर", type: "दोपहर का खाना" },
          { name: "खिचड़ी", cost: 32, ingredients: "चावल, दाल, आलू", type: "रात का खाना" }
        ],
        todayMeal: "आज का भोजन:",
        totalCost: "कुल लागत:",
        forPeople: "लोगों के लिए"
      },
      en: {
        meals: [
          { name: "Dal Rice", cost: 35, ingredients: "Lentils, Rice, Onion", type: "Breakfast" },
          { name: "Vegetable Roti", cost: 28, ingredients: "Wheat, Potato, Tomato", type: "Lunch" },
          { name: "Khichdi", cost: 32, ingredients: "Rice, Lentils, Potato", type: "Dinner" }
        ],
        todayMeal: "Today's Meal:",
        totalCost: "Total Cost:",
        forPeople: "for people"
      }
    }

    const data = mealsData[currentLanguage] || mealsData.hi
    const totalCost = data.meals.reduce((sum, meal) => sum + (meal.cost * familySize), 0)
    setMealPlan({ ...data, totalCost })
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-800">{t.nutritionTitle}</h2>
      
      <div className="space-y-4">
        <input
          type="number"
          value={familySize}
          onChange={(e) => setFamilySize(e.target.value)}
          placeholder={t.familySize}
          className="w-full p-3 border border-gray-300 rounded-md text-base bg-white transition-colors focus:outline-none focus:border-blue-800 focus:shadow-sm focus:shadow-blue-800/10"
        />
        
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder={t.dailyBudget}
          className="w-full p-3 border border-gray-300 rounded-md text-base bg-white transition-colors focus:outline-none focus:border-blue-800 focus:shadow-sm focus:shadow-blue-800/10"
        />
        
        <select
          value={dietaryPref}
          onChange={(e) => setDietaryPref(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md text-base bg-white text-gray-700"
        >
          <option value="veg">{t.vegetarian}</option>
          <option value="nonveg">{t.nonVegetarian}</option>
          <option value="vegan">{t.vegan}</option>
        </select>
        
        <button
          onClick={generateMealPlan}
          disabled={isLoading}
          className="w-full p-3 bg-blue-800 text-white border-none rounded-md cursor-pointer text-base font-medium my-2 transition-colors hover:bg-blue-900 active:bg-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (currentLanguage === 'hi' ? 'योजना बना रहे हैं...' : 'Creating Plan...') : t.createPlan}
        </button>
      </div>

      {mealPlan && (
        <div className="mt-6">
          {mealPlan.plan ? (
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                {mealPlan.plan}
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-4">{mealPlan.todayMeal}</h3>
              {mealPlan.meals.map((meal, index) => (
                <div key={index} className="bg-white p-5 my-4 rounded-lg border-l-4 border-green-600 border border-gray-200 shadow-sm">
                  <div className="font-semibold text-base text-gray-800 mb-1">
                    {meal.type}: {meal.name}
                  </div>
                  <div className="text-green-600 my-2 font-semibold text-sm">
                    ₹{meal.cost * familySize}
                  </div>
                  <div className="text-gray-600 text-sm">{meal.ingredients}</div>
                </div>
              ))}
              <p className="font-bold">
                {mealPlan.totalCost} ₹{mealPlan.totalCost} ({familySize} {mealPlan.forPeople})
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default NutritionTab