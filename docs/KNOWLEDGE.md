# Terry Town RV Website - Technical Knowledge Base

## Overview

A Next.js 14 website clone for Terry Town RV dealership, using the Coast Technology Inventory API for real-time inventory data.


---

## Coast Technology Inventory API

### Base Configuration

```typescript
const BASE_URL = "https://inventory.coasttechnology.org/api/v3";
const COMPANY_ID = 43;  // Terry Town RV
```

### Authentication

No authentication required - public API.

### Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /inventory/` | List inventory with filters |

### Pagination

Uses Laravel-style pagination:

```
?page=1&per_page=12
```

Response includes:
```json
{
  "pagination": {
    "total": 176,
    "per_page": 12,
    "current_page": 1,
    "last_page": 15
  }
}
```

### Filter Syntax

The API uses a Strapi-like nested filter syntax:

```
filters[$and][INDEX][FIELD][$OPERATOR]=VALUE
```

**Operators:**
- `$eq` - Equals
- `$in` - In array (for multiple values)
- `$gte` - Greater than or equal
- `$lte` - Less than or equal
- `$containsi` - Case-insensitive contains (for search)

**Combining with $or:**
```
filters[$and][0][$or][0][field1][$eq]=value1
filters[$and][0][$or][1][field2][$eq]=value2
```

### Working Filters

| Filter | API Syntax | Notes |
|--------|------------|-------|
| Display on website | `filters[$and][0][displayOnWebsite][$eq]=true` | Always include |
| Company | `company[0]=43` | Required |
| **Type (RV Classification)** | `filters[$and][N][unitClassification][name][$in][0]=Travel Trailer` | **camelCase!** |
| **Make** | `filters[$and][N][unitMake][name][$in][0]=Forest River` | **camelCase!** |
| **Condition** | `filters[$and][N][condition][name][$in][0]=New` | Works with $in |
| Price min | `filters[$and][N][price_current][$gte]=10000` | |
| Price max | `filters[$and][N][price_current][$lte]=50000` | |
| Year min | `filters[$and][N][year][$gte]=2020` | |
| Year max | `filters[$and][N][year][$lte]=2024` | |
| Sleeps min | `filters[$and][N][max_sleeping_count][$gte]=4` | |
| Weight max | `filters[$and][N][gvwr][$lte]=10000` | |
| Slideouts | `filters[$and][N][$or][0][number_of_slideouts][$eq]=2` | Use $or for multiple |
| Search | `filters[$and][N][$or][0][stock_number][$containsi]=TERM` | Search stock# and title |

### Critical API Gotchas

1. **Use camelCase for relation fields:**
   - `unitClassification` NOT `unit_classification`
   - `unitMake` NOT `unit_make`
   - Using snake_case returns 500 errors

2. **The `$or` operator with `condition[name]` causes 500 errors** - use `$in` instead

3. **`withUnitData=1` is required** to get full unit details (make, model, images, etc.)
   - `withUnitData=0` returns minimal data with empty arrays

### Sorting

```
sort[0]=field:direction
sort[1]=field:direction
```

**Options:**
- `price_current:asc` / `price_current:desc`
- `year:asc` / `year:desc`
- `vehicle_body_length:asc` / `vehicle_body_length:desc`
- `lot_status:asc` (default) + `received_date:asc`

### Example API Call

```bash
curl "https://inventory.coasttechnology.org/api/v3/inventory/?\
filters[$and][0][displayOnWebsite][$eq]=true&\
filters[$and][1][unitClassification][name][$in][0]=Travel%20Trailer&\
filters[$and][1][unitClassification][name][$in][1]=Fifth%20Wheel&\
filters[$and][2][condition][name][$in][0]=New&\
sort[0]=price_current:asc&\
company[0]=43&\
withUnitData=1&\
page=1&\
per_page=12"
```

---

## Data Types

### InventoryUnit (Key Fields)

```typescript
interface InventoryUnit {
  id: number;
  stock_number: string;
  year: number;

  // Pricing
  price_msrp: number;
  price_current: number;
  price_monthly: number | null;

  // Relations (populated with withUnitData=1)
  unit_make: { id: number; name: string };
  unit_model: { id: number; name: string };
  unit_classification: { id: number; name: string };
  condition: { name: string } | string;  // Can be object or string

  // Specs
  vehicle_body_length: number | null;
  max_sleeping_count: number | null;
  number_of_slideouts: number | null;
  dry_weight: number | null;
  gvwr: number | null;

  // Media
  display_image: string | null;
  images: ImageItem[];  // Array of image objects

  // Location
  company_location: CompanyLocation;
}
```

### ImageItem

```typescript
interface ImageItem {
  url: string;
  color: string | null;
  collection_name: string;
  placeholder_url: string;
  responsive_image_url: string[];
}
```

---

## Project Architecture

### Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **Icons:** Lucide React

### Key Directories

```
├── app/
│   ├── page.tsx              # Homepage
│   ├── inventory/
│   │   ├── page.tsx          # Inventory listing (client component)
│   │   └── [id]/page.tsx     # Unit detail page (server component)
│   └── layout.tsx            # Root layout with providers
├── components/
│   ├── home/                 # Homepage components
│   ├── inventory/            # Inventory listing components
│   ├── detail/               # Unit detail components
│   └── layout/               # Header, Footer, Navigation
├── lib/
│   ├── api.ts                # API client functions
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # Utility functions
├── context/
│   ├── FavoritesContext.tsx  # Saved units (localStorage)
│   └── CompareContext.tsx    # Compare units (localStorage)
└── public/
    ├── logo.png              # Terry Town RV logo
    └── hero-showroom.png     # Homepage hero image
```

### Data Flow

1. **Inventory Page** (Client Component)
   - URL params synced with filter state
   - TanStack Query fetches from API
   - FilterPanel updates URL params
   - InventoryGrid displays results

2. **Detail Page** (Server Component)
   - Fetches unit by ID server-side
   - Generates SEO metadata
   - Fetches related units

### Image Handling

Images come from multiple CDNs configured in `next.config.js`:
- `storage.googleapis.com`
- `cdn.coasttechnology.org`
- `*.cloudinary.com`

---

## Common Tasks

### Add a New Filter

1. Add to `FilterParams` interface in `lib/types.ts`
2. Add filter building in `buildFilterString()` in `lib/api.ts`
3. Add UI in `FilterPanel.tsx`
4. Add URL param handling in `app/inventory/page.tsx`

### Change Company/Dealer

Update `COMPANY_ID` in `lib/api.ts`:
```typescript
const COMPANY_ID = 43;  // Change to new dealer ID
```

### Debug API Issues

```bash
# Test filter directly
curl -s "https://inventory.coasttechnology.org/api/v3/inventory/?\
filters[$and][0][displayOnWebsite][$eq]=true&\
company[0]=43&\
withUnitData=1&\
per_page=1" | jq '.pagination.total'
```

---

## Deployment

### DigitalOcean App Platform

- Auto-deploys from `main` branch
- Build command: `npm run build`
- Start command: `npm start`
- Port: 8080

### Environment Variables

None required - API is public.

---

## Troubleshooting

### "500 Error" on Filter

- Check field name is camelCase (`unitClassification` not `unit_classification`)
- Check you're not using `$or` with `condition[name]` - use `$in` instead

### Empty Filter Options

- Ensure `withUnitData=1` in the fetch call
- Check API is returning data in the response

### Images Not Loading

- Verify domain is in `next.config.js` remotePatterns
- Check if image URL is valid (not null)

### Filters Not Working

- Check browser Network tab for actual API request
- Verify filter index (`filterIndex`) is incrementing correctly
- Test filter directly with curl
