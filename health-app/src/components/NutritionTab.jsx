import { useState } from 'react'

const NutritionTab = ({ t }) => {
  const [familySize, setFamilySize] = useState(4)
  const [budget, setBudget] = useState(2)
  const [dietaryPref, setDietaryPref] = useState('veg')
  const [mealPlan, setMealPlan] = useState(null)

  const generateMealPlan = () => {
    const meals = [
      { name: "दाल चावल", cost: 35, ingredients: "दाल, चावल, प्याज", type: "नाश्ता" },
      { name: "सब्जी रोटी", cost: 28, ingredients: "गेहूं, आलू, टमाटर", type: "दोपहर का खाना" },
      { name: "खिचड़ी", cost: 32, ingredients: "चावल, दाल, आलू", type: "रात का खाना" }
    ]

    const totalCost = meals.reduce((sum, meal) => sum + (meal.cost * familySize), 0)
    setMealPlan({ meals, totalCost })
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
          className="w-full p-3 bg-blue-800 text-white border-none rounded-md cursor-pointer text-base font-medium my-2 transition-colors hover:bg-blue-900 active:bg-blue-950"
        >
          {t.createPlan}
        </button>
      </div>

      {mealPlan && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">आज का भोजन:</h3>
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
            कुल लागत: ₹{mealPlan.totalCost} ({familySize} लोगों के लिए)
          </p>
        </div>
      )}
    </div>
  )
}

export default NutritionTab