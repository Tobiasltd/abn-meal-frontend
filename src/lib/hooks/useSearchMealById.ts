import { useQuery } from "@tanstack/vue-query";
import { Ref, watch } from "vue";
import { CACHE_TIME } from "../constants";
import { SearchMealResult } from "../types";
import mealService from "../services/meal-service";

/**
 * A Vue Query hook to search meals based on the provided search parameters.
 *
 * @param searchParams - A reactive reference to an object of type SearchMeals, containing search parameters.
 * @returns An object with data, isLoading, isError, error, and refetch properties.
 */

export const useSearchMealById = (id: Ref<string>): SearchMealResult => {
  const { data, refetch, ...rest } = useQuery({
    queryKey: ["meal", id.value],
    queryFn: () => mealService.searchById(id.value),
    enabled: !!id.value && id.value !== "",
    cacheTime: CACHE_TIME,
  });

  watch(id, () => {
    refetch();
  });

  return {
    data: data ?? null,
    refetch,
    ...rest,
  };
};
