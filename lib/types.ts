// lib/types.ts

export interface InventoryUnit {
  id: number;
  stock_number: string;
  vin: string;
  year: number;
  condition: {
    name: string;
  } | string;
  lot_status: string;

  // Pricing
  price_msrp: number;
  price_current: number;
  price_hidden: number;
  price_monthly: number | null;
  price_biweekly: number | null;
  price_lowest: number | null;
  freight_cost: number | null;

  // Make/Model
  unit_make: {
    id: number;
    name: string;
  };
  unit_model: {
    id: number;
    name: string;
  };
  unit_trim: {
    id: number;
    name: string;
  } | null;
  unit_classification: {
    id: number;
    name: string;
    vehicle_type: {
      id: number;
      name: string;
    };
    vehicle_category: {
      id: number;
      name: string;
    };
  };

  // Specifications
  vehicle_body_length: number | null;
  vehicle_body_height: number | null;
  vehicle_body_width: number | null;
  dry_weight: number | null;
  gvwr: number | null;
  number_of_slideouts: number | null;
  max_sleeping_count: number | null;
  hitch_weight: number | null;

  // Capacities
  total_fresh_water_tank_capacity: number | null;
  total_gray_water_tank_capacity: number | null;
  total_black_water_tank_capacity: number | null;
  fuel_tank_capacity: number | null;
  water_heater_tank_capacity: number | null;

  // Climate
  air_conditioning_btu: number | null;
  heater_btu: number | null;
  awning_length: number | null;

  // Engine (for motorhomes)
  engine: string | null;
  horsepower: number | null;
  torque: number | null;
  fuel_type: string | null;
  chassis_brand: string | null;
  driveline_type: string | null;
  towing_capacity: number | null;

  // Media
  display_image: string | null;
  media: MediaItem[];

  // Descriptions
  inventory_unit_descriptions: UnitDescription[];
  inventory_unit_attributes: UnitAttribute[];
  inventory_unit_options: UnitOption[];

  // Location
  company_location: CompanyLocation;

  // Web
  web_settings: WebSettings | null;
  inventory_website_taglines: Tagline[];

  // URLs
  urls: {
    detail: string;
  } | null;
}

export interface MediaItem {
  id: number;
  url: string;
  type: string;
  order: number;
}

export interface UnitDescription {
  id: number;
  heading: string;
  description: string;
}

export interface UnitAttribute {
  id: number;
  name: string;
  value: string;
}

export interface UnitOption {
  id: number;
  name: string;
  category: string | null;
}

export interface CompanyLocation {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  company: {
    id: number;
    name: string;
  };
}

export interface WebSettings {
  featured: boolean;
  special: boolean;
}

export interface Tagline {
  id: number;
  tagline: string;
}

export interface InventoryResponse {
  ids: number[];
  data: InventoryUnit[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  available_filters: AvailableFilters;
}

export interface AvailableFilters {
  year: { min: number; max: number };
  price_current: { min: number; max: number };
  price_msrp: { min: number; max: number };
  vehicle_body_length: { min: number; max: number };
  dry_weight: { min: number; max: number };
  gvwr: { min: number; max: number };
  max_sleeping_count: { min: number; max: number };
  number_of_slideouts: { min: number; max: number };
}

export interface FilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string[];
  make?: string[];
  model?: string[];
  condition?: string[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minSleeps?: number;
  maxSleeps?: number;
  minWeight?: number;
  maxWeight?: number;
  slideouts?: number[];
  features?: string[];
  sort?: string;
}
