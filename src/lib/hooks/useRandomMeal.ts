import { useQuery } from "@tanstack/vue-query";
import { CACHE_TIME_DAY } from "../constants";
import { MealDetails } from "../types";
import mealService from "../services/meal-service";

/**
 * A Vue Query hook to fetch a random meal.
 * @returns An object with data, isLoading, isError, and error properties.
 **/

export const useRandomMeal = () => {
  const { data, ...rest } = useQuery<MealDetails | null>({
    queryKey: ["randomMeal"],
    queryFn: () => mealService.fetchRandomMeal(),
    cacheTime: CACHE_TIME_DAY,
  });

  return {
    data: data ?? null,
    ...rest,
  };
};
