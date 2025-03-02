const { MealPlan } = require('../models/allModels');

// 支持的餐食类型
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'morningSnack', 'afternoonSnack'];
// 支持的营养类型
const NUTRITION_TYPES = ['carbohydrate', 'protein', 'vegetable', 'fruit', 'beverage'];

// 按餐食类型和营养类型分组膳食安排
const groupMeals = (meals) => {
    const grouped = {};
    MEAL_TYPES.forEach((mealType) => {
        grouped[mealType] = {};
        NUTRITION_TYPES.forEach((nutritionType) => {
            grouped[mealType][nutritionType] = [];
        });
    });

    meals.forEach((schedule) => {
        const { mealType, nutritionType, mealContent } = schedule;
        if (MEAL_TYPES.includes(mealType) && NUTRITION_TYPES.includes(nutritionType)) {
            grouped[mealType][nutritionType].push(mealContent);
        }
    });

    return grouped;
};

// 生成每种餐食的计划组合
const generateMealPlansForMealType = (mealTypeData) => {
    const combinations = [];
    const carbohydrateOptions = mealTypeData.carbohydrate;
    const proteinOptions = mealTypeData.protein;
    const vegetableOptions = mealTypeData.vegetable;
    const fruitOptions = mealTypeData.fruit;
    const beverageOptions = mealTypeData.beverage;

    carbohydrateOptions.forEach((carbohydrate) => {
        proteinOptions.forEach((protein) => {
            vegetableOptions.forEach((vegetable) => {
                fruitOptions.forEach((fruit) => {
                    beverageOptions.forEach((beverage) => {
                        combinations.push({
                            carbohydrate,
                            protein,
                            vegetable,
                            fruit,
                            beverage
                        });
                    });
                });
            });
        });
    });

    return combinations;
};

// 生成所有餐食的计划
const generateAllMealPlans = (groupedMeals) => {
    let mealPlanIdCounter = 1;
    const allMealPlans = [];

    for (const [mealType, mealTypeData] of Object.entries(groupedMeals)) {
        const mealCombinations = generateMealPlansForMealType(mealTypeData);
        mealCombinations.forEach((combination) => {
            const mealPlan = new MealPlan({
                mealPlanId: `MP${String(mealPlanIdCounter).padStart(3, '0')}`,
                mealType,
                ...combination
            });
            allMealPlans.push(mealPlan);
            mealPlanIdCounter++;
        });
    }

    return allMealPlans;
};

module.exports = {
    groupMeals,
    generateAllMealPlans
};