import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class MealHttpClient {
  private client: AxiosInstance;

  constructor() {
    const config: AxiosRequestConfig = {
      baseURL: "https://www.themealdb.com/api/json/v1/1/",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    this.client = axios.create(config);
  }

  /**
   * Fetches a random meal from TheMealDB API.
   * Returns the response data as a Promise.
   */
  async fetchRandomMeal() {
    return this.fetchData("random.php", {});
  }

  /**
   * Searches for meals by the given query string.
   * Returns the response data as a Promise.
   */
  async search(query: string) {
    return this.fetchData("search.php", { s: query });
  }

  /**
   * Fetches a meal by the given ID.
   * Returns the response data as a Promise.
   */
  async searchById(id: string) {
    return this.fetchData("lookup.php", { i: id });
  }

  /**
   * Filters meals by the given category.
   * Returns the response data as a Promise.
   */
  async filterByCategory(category: string) {
    return this.fetchData("filter.php", { c: category });
  }

  /**
   * Filters meals by the given area.
   * Returns the response data as a Promise.
   */
  async filterByArea(area: string) {
    return this.fetchData("filter.php", { a: area });
  }

  /**
   * Filters meals by the given ingredient.
   * Returns the response data as a Promise.
   */
  async filterByIngredient(ingredient: string) {
    return this.fetchData("filter.php", { i: ingredient });
  }

  /**
   * Builds the endpoint URL based on the provided endpoint and query parameters,
   * sends an HTTP GET request to the URL using `axios`, and returns the response data.
   * Returns the response data as a Promise.
   */
  private async fetchData(endpoint: string, params: Record<string, string>) {
    const url = new URL(endpoint, this.client.defaults.baseURL);
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );

    const response = await this.client.get(url.toString());

    return response.data;
  }
}
