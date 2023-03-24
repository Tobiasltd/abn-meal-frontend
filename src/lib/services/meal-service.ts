import { MealApiService } from "../http/meal-api-service";
import { MealHttpClient } from "../http/meal-http-client";

const mealHttpClient = new MealHttpClient();
const mealService = new MealApiService(mealHttpClient);

export default mealService;
