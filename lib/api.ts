// lib/api.ts

import { InventoryResponse, InventoryUnit, FilterParams } from "./types";

const BASE_URL = "https://inventory.coasttechnology.org/api/v3";
const COMPANY_ID = 43;

function buildFilterString(params: FilterParams): string {
  const filters: string[] = [];
  let filterIndex = 0;

  // Always include displayOnWebsite filter
  filters.push(
    `filters[$and][${filterIndex}][displayOnWebsite][$eq]=true`
  );
  filterIndex++;

  // Search/keyword filter - search in stock_number and title
  if (params.search) {
    filters.push(
      `filters[$and][${filterIndex}][$or][0][stock_number][$containsi]=${encodeURIComponent(params.search)}`
    );
    filters.push(
      `filters[$and][${filterIndex}][$or][1][title][$containsi]=${encodeURIComponent(params.search)}`
    );
    filterIndex++;
  }

  // Condition filter - API supports this via condition[name][$in]
  if (params.condition && params.condition.length > 0) {
    params.condition.forEach((c, i) => {
      filters.push(
        `filters[$and][${filterIndex}][condition][name][$in][${i}]=${encodeURIComponent(c)}`
      );
    });
    filterIndex++;
  }

  // Type filter - uses camelCase: unitClassification
  if (params.type && params.type.length > 0) {
    params.type.forEach((t, i) => {
      filters.push(
        `filters[$and][${filterIndex}][unitClassification][name][$in][${i}]=${encodeURIComponent(t)}`
      );
    });
    filterIndex++;
  }

  // Make filter - uses camelCase: unitMake
  if (params.make && params.make.length > 0) {
    params.make.forEach((m, i) => {
      filters.push(
        `filters[$and][${filterIndex}][unitMake][name][$in][${i}]=${encodeURIComponent(m)}`
      );
    });
    filterIndex++;
  }

  // Price range
  if (params.minPrice) {
    filters.push(
      `filters[$and][${filterIndex}][price_current][$gte]=${params.minPrice}`
    );
    filterIndex++;
  }
  if (params.maxPrice) {
    filters.push(
      `filters[$and][${filterIndex}][price_current][$lte]=${params.maxPrice}`
    );
    filterIndex++;
  }

  // Year range
  if (params.minYear) {
    filters.push(
      `filters[$and][${filterIndex}][year][$gte]=${params.minYear}`
    );
    filterIndex++;
  }
  if (params.maxYear) {
    filters.push(
      `filters[$and][${filterIndex}][year][$lte]=${params.maxYear}`
    );
    filterIndex++;
  }

  // Sleeping capacity
  if (params.minSleeps) {
    filters.push(
      `filters[$and][${filterIndex}][max_sleeping_count][$gte]=${params.minSleeps}`
    );
    filterIndex++;
  }

  // Weight
  if (params.maxWeight) {
    filters.push(
      `filters[$and][${filterIndex}][gvwr][$lte]=${params.maxWeight}`
    );
    filterIndex++;
  }

  // Slideouts
  if (params.slideouts && params.slideouts.length > 0) {
    params.slideouts.forEach((s, i) => {
      filters.push(
        `filters[$and][${filterIndex}][$or][${i}][number_of_slideouts][$eq]=${s}`
      );
    });
    filterIndex++;
  }

  return filters.join("&");
}

function buildSortString(sort?: string): string {
  switch (sort) {
    case "price-asc":
      return "sort[0]=price_current:asc";
    case "price-desc":
      return "sort[0]=price_current:desc";
    case "year-desc":
      return "sort[0]=year:desc";
    case "year-asc":
      return "sort[0]=year:asc";
    case "length-asc":
      return "sort[0]=vehicle_body_length:asc";
    case "length-desc":
      return "sort[0]=vehicle_body_length:desc";
    default:
      return "sort[0]=lot_status:asc&sort[1]=received_date:asc";
  }
}

export async function fetchInventory(
  params: FilterParams = {}
): Promise<InventoryResponse> {
  const page = params.page || 1;
  const perPage = params.pageSize || 12;

  const filterString = buildFilterString(params);
  const sortString = buildSortString(params.sort);

  // All filtering done by API
  const url = `${BASE_URL}/inventory/?${filterString}&${sortString}&company[0]=${COMPANY_ID}&withUnitData=1&page=${page}&per_page=${perPage}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: InventoryResponse = await response.json();
  return data;
}

export async function fetchUnitById(id: number): Promise<InventoryUnit | null> {
  const url = `${BASE_URL}/inventory/?filters[$and][0][id][$eq]=${id}&company[0]=${COMPANY_ID}&withUnitData=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: InventoryResponse = await response.json();
  return data.data[0] || null;
}

export async function fetchFeaturedInventory(): Promise<InventoryUnit[]> {
  const url = `${BASE_URL}/inventory/?filters[$and][0][displayOnWebsite][$eq]=true&filters[$and][1][web_settings][featured][$eq]=true&sort[0]=received_date:desc&company[0]=${COMPANY_ID}&withUnitData=1&per_page=12`;

  const response = await fetch(url);

  if (!response.ok) {
    // Fallback to regular inventory if no featured
    const fallback = await fetchInventory({ pageSize: 12 });
    return fallback.data;
  }

  const data: InventoryResponse = await response.json();

  // If no featured items, return regular inventory
  if (data.data.length === 0) {
    const fallback = await fetchInventory({ pageSize: 12 });
    return fallback.data;
  }

  return data.data;
}

export async function fetchMakes(): Promise<string[]> {
  const response = await fetchInventory({ pageSize: 200 });
  const makes = new Set<string>();

  response.data.forEach((unit) => {
    if (unit.unit_make?.name) {
      makes.add(unit.unit_make.name);
    }
  });

  return Array.from(makes).sort();
}

export async function fetchTypes(): Promise<string[]> {
  const response = await fetchInventory({ pageSize: 200 });
  const types = new Set<string>();

  response.data.forEach((unit) => {
    if (unit.unit_classification?.name) {
      types.add(unit.unit_classification.name);
    }
  });

  return Array.from(types).sort();
}

export async function fetchUnitsByIds(ids: number[]): Promise<InventoryUnit[]> {
  if (ids.length === 0) return [];

  // Build filter string for multiple IDs
  const idFilters = ids
    .map((id, index) => `filters[$and][0][$or][${index}][id][$eq]=${id}`)
    .join("&");

  const url = `${BASE_URL}/inventory/?${idFilters}&company[0]=${COMPANY_ID}&withUnitData=1&per_page=${ids.length}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: InventoryResponse = await response.json();
  return data.data;
}

export interface AvailableFilterOptions {
  types: string[];
  makes: string[];
  conditions: string[];
  yearRange: { min: number; max: number };
  priceRange: { min: number; max: number };
  sleepsRange: { min: number; max: number };
  slideoutOptions: number[];
}

export async function fetchAvailableFilters(): Promise<AvailableFilterOptions> {
  // Fetch all items to get available filter options
  const url = `${BASE_URL}/inventory/?filters[$and][0][displayOnWebsite][$eq]=true&company[0]=${COMPANY_ID}&withUnitData=1&per_page=500`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const response: InventoryResponse = await res.json();

  const types = new Set<string>();
  const makes = new Set<string>();
  const conditions = new Set<string>();
  const slideouts = new Set<number>();
  let minYear = Infinity;
  let maxYear = 0;
  let minPrice = Infinity;
  let maxPrice = 0;
  let minSleeps = Infinity;
  let maxSleeps = 0;

  response.data.forEach((unit) => {
    // Types
    if (unit.unit_classification?.name) {
      types.add(unit.unit_classification.name);
    }

    // Makes
    if (unit.unit_make?.name) {
      makes.add(unit.unit_make.name);
    }

    // Conditions
    const condition = typeof unit.condition === 'object' ? unit.condition?.name : unit.condition;
    if (condition) {
      conditions.add(condition);
    }

    // Year range
    if (unit.year) {
      minYear = Math.min(minYear, unit.year);
      maxYear = Math.max(maxYear, unit.year);
    }

    // Price range
    if (unit.price_current) {
      minPrice = Math.min(minPrice, unit.price_current);
      maxPrice = Math.max(maxPrice, unit.price_current);
    }

    // Sleeps range
    if (unit.max_sleeping_count) {
      minSleeps = Math.min(minSleeps, unit.max_sleeping_count);
      maxSleeps = Math.max(maxSleeps, unit.max_sleeping_count);
    }

    // Slideouts
    if (unit.number_of_slideouts !== null && unit.number_of_slideouts !== undefined) {
      slideouts.add(unit.number_of_slideouts);
    }
  });

  return {
    types: Array.from(types).sort(),
    makes: Array.from(makes).sort(),
    conditions: Array.from(conditions).sort(),
    yearRange: {
      min: minYear === Infinity ? 2000 : minYear,
      max: maxYear === 0 ? new Date().getFullYear() : maxYear
    },
    priceRange: {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice === 0 ? 500000 : maxPrice
    },
    sleepsRange: {
      min: minSleeps === Infinity ? 1 : minSleeps,
      max: maxSleeps === 0 ? 10 : maxSleeps
    },
    slideoutOptions: Array.from(slideouts).sort((a, b) => a - b),
  };
}
