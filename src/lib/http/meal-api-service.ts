import { MealHttpClient } from "./meal-http-client";
import { Meal, MealDetails, SearchMeals } from "../types";

export class MealApiService {
  constructor(private mealHttpClient: MealHttpClient) {}

  /**
   * Fetches a random meal
   * The method returns a single random meal.
   * @returns A single meal.
   */
  async fetchRandomMeal(): Promise<MealDetails> {
    try {
      const meal = await this.mealHttpClient.fetchRandomMeal();

      const filteredResults = meal.meals.filter(this.isMealDetails);

      return filteredResults[0];
    } catch (error) {
      throw new Error("Something went wrong.");
    }
  }

  /**
   * Fetches a meal by its ID.
   * The method returns a single meal with the given ID.
   * @param id The ID of the meal to fetch.
   * @returns A single meal with the given ID.
   */
  async searchById(id: string): Promise<MealDetails> {
    try {
      const meal = await this.mealHttpClient.searchById(id);
      return meal.meals[0];
    } catch (error) {
      throw new Error("Something went wrong.");
    }
  }

  /**
   * Search for meals using the provided SearchMealsDto.
   * It allows searching by query, category, area, and ingredient.
   * The method returns an array of unique meals that match the criteria.
   * @param searchMealsDto An instance of SearchMealsDto containing search parameters.
   * @returns An array of unique meals.
   */
  async searchMeals(searchMealsDto: SearchMeals): Promise<MealDetails[]> {
    const { query, category, area, ingredient } = searchMealsDto;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchPromises: Promise<any>[] = [];

    if (query) {
      searchPromises.push(this.mealHttpClient.search(query));
    }

    if (category) {
      searchPromises.push(this.mealHttpClient.filterByCategory(category));
    }

    if (area) {
      searchPromises.push(this.mealHttpClient.filterByArea(area));
    }

    if (ingredient) {
      searchPromises.push(this.mealHttpClient.filterByIngredient(ingredient));
    }

    const results = await Promise.allSettled(searchPromises);

    const fulfilledResults = results.flatMap((result) => {
      if (result.status === "fulfilled") {
        return result.value.meals;
      } else {
        throw new Error("Something went wrong.");
      }
    });

    const filteredResults = fulfilledResults.filter(this.isMealDetails);

    const amountOfSearchParameters =
      this.amountOfSearchParameters(searchMealsDto);

    if (amountOfSearchParameters > 1) {
      return this.getIntersection(filteredResults, amountOfSearchParameters);
    } else {
      return filteredResults;
    }
  }
  /**
   * Checks if the provided object is a Meal.
   * The method returns true if the object is a Meal, and false otherwise.
   * @param object The object to check.
   * @returns A boolean value indicating whether the object is a Meal.
   */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isMealDetails(object: any): object is MealDetails {
    return (
      object &&
      typeof object.strMeal === "string" &&
      typeof object.strMealThumb === "string" &&
      typeof object.idMeal === "string"
    );
  }

  /**
   * Determines the amount of non-empty search parameters in the provided SearchMealsDto.
   * @param searchMealsDto An instance of SearchMealsDto containing search parameters.
   * @returns The amount of non-empty search parameters.
   */
  amountOfSearchParameters(searchMealsDto: SearchMeals): number {
    const { query, category, area, ingredient } = searchMealsDto;
    const params = [query, category, area, ingredient];
    const nonEmptyParams = params.filter(
      (param) => param !== undefined && param !== ""
    );

    return nonEmptyParams.length;
  }

  /**
   * Filters out any meals that do not match all search criteria.
   * @param meals An array of meals to filter.
   * @param amountOfSearchParameters The amount of non-empty search parameters.
   * @returns An array of meals that match all search criteria.
   */
  getIntersection(
    meals: MealDetails[],
    amountOfSearchParameters: number
  ): MealDetails[] {
    const mealCount = meals.reduce((countMap, meal) => {
      countMap[meal.idMeal] = (countMap[meal.idMeal] || 0) + 1;
      return countMap;
    }, {} as { [key: string]: number });

    return meals.filter(
      (meal, index, self) =>
        mealCount[meal.idMeal] === amountOfSearchParameters &&
        index === self.findIndex((m) => m.idMeal === meal.idMeal)
    );
  }

  /**
   * Fetches 4 meal suggestions within the given category.
   * @param category The category to fetch meal suggestions for
   * @returns An array containing 4 meals in the given category
   */
  async fetchSuggestions(category: string): Promise<Meal[]> {
    try {
      const mealsInCategory = await this.mealHttpClient.filterByCategory(
        category
      );

      const filteredResults = mealsInCategory.meals.filter(this.isMealDetails);

      const selection = filteredResults.slice(0, 4);
      return selection;
    } catch (error) {
      throw new Error("Something went wrong.");
    }
  }
}
