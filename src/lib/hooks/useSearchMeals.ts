import { useQuery } from "@tanstack/vue-query";
import { Ref, watch } from "vue";
import { CACHE_TIME } from "../constants";
import { SearchMealsResult, SearchMeals } from "../types";
import mealService from "../services/meal-service";

/**
 *A Vue Query hook to search meals based on the provided search parameters.
 @param searchParams A reactive reference to an object of type SearchMeals, containing search parameters.
 * @returns An object with data, isLoading, isError, error, and refetch properties.
*/

export const useSearchMeals = (
  searchParams: Ref<SearchMeals>
): SearchMealsResult => {
  const { data, ...rest } = useQuery({
    queryKey: ["meals", searchParams.value],
    queryFn: () => mealService.searchMeals(searchParams.value),
    enabled: false,
    cacheTime: CACHE_TIME,
  });

  watch(searchParams, () => {
    rest.refetch();
  });

  return {
    data: data ?? null,
    ...rest,
  };
};
