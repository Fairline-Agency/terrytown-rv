// components/detail/SpecsTable.tsx

import { InventoryUnit } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface SpecsTableProps {
  unit: InventoryUnit;
}

interface SpecItem {
  label: string;
  value: string | number | null;
  unit?: string;
}

interface SpecSection {
  title: string;
  specs: SpecItem[];
}

function SpecRow({ label, value, unit }: SpecItem) {
  if (value === null || value === undefined) return null;

  const formattedValue =
    typeof value === "number" ? formatNumber(value) : value;

  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">
        {formattedValue}
        {unit && ` ${unit}`}
      </span>
    </div>
  );
}

function SpecSectionComponent({
  title,
  specs,
}: {
  title: string;
  specs: SpecItem[];
}) {
  // Filter out null values
  const validSpecs = specs.filter(
    (spec) => spec.value !== null && spec.value !== undefined
  );

  if (validSpecs.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <h3 className="bg-gray-50 px-4 py-3 font-heading font-semibold text-gray-900 border-b border-gray-200">
        {title}
      </h3>
      <div className="px-4 py-2">
        {validSpecs.map((spec, index) => (
          <SpecRow key={index} {...spec} />
        ))}
      </div>
    </div>
  );
}

export function SpecsTable({ unit }: SpecsTableProps) {
  const sections: SpecSection[] = [
    {
      title: "Dimensions & Weight",
      specs: [
        {
          label: "Length",
          value: unit.vehicle_body_length,
          unit: "ft",
        },
        {
          label: "Height",
          value: unit.vehicle_body_height,
          unit: "in",
        },
        {
          label: "Width",
          value: unit.vehicle_body_width,
          unit: "in",
        },
        {
          label: "Dry Weight",
          value: unit.dry_weight,
          unit: "lbs",
        },
        {
          label: "GVWR",
          value: unit.gvwr,
          unit: "lbs",
        },
        {
          label: "Hitch Weight",
          value: unit.hitch_weight,
          unit: "lbs",
        },
      ],
    },
    {
      title: "Capacities",
      specs: [
        {
          label: "Fresh Water Tank",
          value: unit.total_fresh_water_tank_capacity,
          unit: "gal",
        },
        {
          label: "Gray Water Tank",
          value: unit.total_gray_water_tank_capacity,
          unit: "gal",
        },
        {
          label: "Black Water Tank",
          value: unit.total_black_water_tank_capacity,
          unit: "gal",
        },
        {
          label: "Fuel Tank",
          value: unit.fuel_tank_capacity,
          unit: "gal",
        },
        {
          label: "Water Heater",
          value: unit.water_heater_tank_capacity,
          unit: "gal",
        },
      ],
    },
    {
      title: "Features",
      specs: [
        {
          label: "Sleeps",
          value: unit.max_sleeping_count,
          unit: undefined,
        },
        {
          label: "Slideouts",
          value: unit.number_of_slideouts,
          unit: undefined,
        },
        {
          label: "Awning Length",
          value: unit.awning_length,
          unit: "ft",
        },
        {
          label: "Air Conditioning",
          value: unit.air_conditioning_btu,
          unit: "BTU",
        },
        {
          label: "Heater",
          value: unit.heater_btu,
          unit: "BTU",
        },
      ],
    },
    {
      title: "Engine & Performance",
      specs: [
        {
          label: "Engine",
          value: unit.engine,
          unit: undefined,
        },
        {
          label: "Horsepower",
          value: unit.horsepower,
          unit: "HP",
        },
        {
          label: "Torque",
          value: unit.torque,
          unit: "lb-ft",
        },
        {
          label: "Chassis",
          value: unit.chassis_brand,
          unit: undefined,
        },
        {
          label: "Fuel Type",
          value: unit.fuel_type,
          unit: undefined,
        },
        {
          label: "Towing Capacity",
          value: unit.towing_capacity,
          unit: "lbs",
        },
      ],
    },
  ];

  // Filter out sections that have no valid specs
  const validSections = sections.filter((section) =>
    section.specs.some(
      (spec) => spec.value !== null && spec.value !== undefined
    )
  );

  if (validSections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-2xl font-bold text-gray-900">
        Specifications
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {validSections.map((section, index) => (
          <SpecSectionComponent
            key={index}
            title={section.title}
            specs={section.specs}
          />
        ))}
      </div>
    </div>
  );
}
