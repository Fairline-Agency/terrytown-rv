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

  // Search/keyword filter
  if (params.search) {
    filters.push(
      `filters[$and][${filterIndex}][$or][0][stock_number][$containsi]=${encodeURIComponent(params.search)}`
    );
    filters.push(
      `filters[$and][${filterIndex}][$or][1][unit_make][name][$containsi]=${encodeURIComponent(params.search)}`
    );
    filters.push(
      `filters[$and][${filterIndex}][$or][2][unit_model][name][$containsi]=${encodeURIComponent(params.search)}`
    );
    filterIndex++;
  }

  // Type filter (classification name)
  if (params.type && params.type.length > 0) {
    params.type.forEach((t, i) => {
      filters.push(
        `filters[$and][${filterIndex}][$or][${i}][unit_classification][name][$eqi]=${encodeURIComponent(t)}`
      );
    });
    filterIndex++;
  }

  // Make filter
  if (params.make && params.make.length > 0) {
    params.make.forEach((m, i) => {
      filters.push(
        `filters[$and][${filterIndex}][$or][${i}][unit_make][name][$eqi]=${encodeURIComponent(m)}`
      );
    });
    filterIndex++;
  }

  // Condition filter
  if (params.condition && params.condition.length > 0) {
    params.condition.forEach((c, i) => {
      filters.push(
        `filters[$and][${filterIndex}][$or][${i}][condition][$eqi]=${encodeURIComponent(c)}`
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
  const pageSize = params.pageSize || 12;

  const filterString = buildFilterString(params);
  const sortString = buildSortString(params.sort);

  const url = `${BASE_URL}/inventory/?${filterString}&${sortString}&company[0]=${COMPANY_ID}&withUnitData=1&page=${page}&pageSize=${pageSize}`;

  const response = await fetch(url, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchUnitById(id: number): Promise<InventoryUnit | null> {
  const url = `${BASE_URL}/inventory/?filters[$and][0][id][$eq]=${id}&company[0]=${COMPANY_ID}&withUnitData=1`;

  const response = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: InventoryResponse = await response.json();
  return data.data[0] || null;
}

export async function fetchFeaturedInventory(): Promise<InventoryUnit[]> {
  const url = `${BASE_URL}/inventory/?filters[$and][0][displayOnWebsite][$eq]=true&filters[$and][1][web_settings][featured][$eq]=true&sort[0]=received_date:desc&company[0]=${COMPANY_ID}&withUnitData=1&pageSize=12`;

  const response = await fetch(url, {
    next: { revalidate: 300 },
  });

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

  const url = `${BASE_URL}/inventory/?${idFilters}&company[0]=${COMPANY_ID}&withUnitData=1&pageSize=${ids.length}`;

  const response = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: InventoryResponse = await response.json();
  return data.data;
}
