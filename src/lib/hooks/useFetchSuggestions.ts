import { useQuery } from "@tanstack/vue-query";
import { CACHE_TIME } from "../constants";
import { FetchSuggestionsResult, SearchMeals } from "../types";
import mealService from "../services/meal-service";

/**
 * A Vue Query hook to fetch meal suggestions based on the provided category.
 * @param searchParams A string containing the meal category to fetch suggestions for.
 * @returns An object with data, isLoading, isError, error, and refetch properties.
 */

export const useFetchSuggestions = (
  searchParams: SearchMeals["category"]
): FetchSuggestionsResult => {
  const { data, ...rest } = useQuery({
    queryKey: ["suggestions", searchParams],
    queryFn: () => mealService.fetchSuggestions(String(searchParams)),
    enabled: !!searchParams,
    cacheTime: CACHE_TIME,
  });

  return {
    data: data ?? null,
    ...rest,
  };
};
