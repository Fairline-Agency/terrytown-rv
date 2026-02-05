# TerryTown RV Website Clone - Design Document

## Overview

Create an exact visual clone of the TerryTown RV website (terrytownrv.com) using the Coast Technology inventory API as the data source. The site will be a fully responsive, production-ready Next.js application.

## API Endpoint

```
https://inventory.coasttechnology.org/api/v3/inventory/?filters[$and][0][displayOnWebsite][$eq]=true&sort[0]=lot_status%3Aasc&sort[1]=received_date%3Aasc&company[0]=43&withUnitData=0
```

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: React Context (for favorites/comparison)
- **Storage**: Local Storage (for favorites/comparison persistence)

## Project Structure

```
/app
  /page.tsx                    # Homepage
  /inventory/page.tsx          # Inventory listing with filters
  /inventory/[slug]/page.tsx   # Individual RV detail page
  /compare/page.tsx            # Comparison page
  /favorites/page.tsx          # Favorites/wishlist page
  /about/page.tsx              # About Us
  /financing/page.tsx          # Financing
  /service/page.tsx            # Service Department
  /parts/page.tsx              # Parts
  /careers/page.tsx            # Careers
  /contact/page.tsx            # Contact
  /blog/page.tsx               # Blog listing
  /layout.tsx                  # Root layout with header/footer
  /globals.css                 # Global styles
/components
  /layout
    /Header.tsx                # Main header with navigation
    /Footer.tsx                # Site footer
    /MobileNav.tsx             # Mobile navigation drawer
    /MegaMenu.tsx              # Dropdown mega menu
  /inventory
    /RVCard.tsx                # Individual RV card component
    /RVGrid.tsx                # Grid/list display of RVs
    /FilterPanel.tsx           # Sidebar filter panel
    /FilterDrawer.tsx          # Mobile filter drawer
    /SearchBar.tsx             # Quick search component
    /SortDropdown.tsx          # Sort options
    /Pagination.tsx            # Pagination controls
  /detail
    /ImageGallery.tsx          # Image gallery with lightbox
    /PricingBlock.tsx          # Price display component
    /SpecsTable.tsx            # Specifications tables
    /ContactForm.tsx           # Inquiry form
    /RelatedUnits.tsx          # Similar RVs carousel
  /features
    /CompareBar.tsx            # Fixed bottom compare bar
    /CompareTable.tsx          # Comparison table layout
    /FavoriteButton.tsx        # Heart icon button
  /ui
    /Button.tsx                # Reusable button component
    /Input.tsx                 # Form input component
    /Select.tsx                # Dropdown select
    /Slider.tsx                # Range slider
    /Modal.tsx                 # Modal/dialog component
    /Toast.tsx                 # Toast notifications
    /Skeleton.tsx              # Loading skeletons
    /Badge.tsx                 # Status badges
  /home
    /HeroBanner.tsx            # Homepage hero carousel
    /FeaturedInventory.tsx     # Featured RVs section
    /BrandShowcase.tsx         # Manufacturer logos
    /Testimonials.tsx          # Reviews carousel
    /ValueProps.tsx            # Why Terry Town section
/lib
  /api.ts                      # API client functions
  /types.ts                    # TypeScript interfaces
  /utils.ts                    # Helper functions
  /constants.ts                # Static values, filter options
/hooks
  /useInventory.ts             # Inventory fetching hook
  /useFilters.ts               # Filter state management
  /useLocalStorage.ts          # Local storage hook
  /useDebounce.ts              # Debounce hook for search
/context
  /FavoritesContext.tsx        # Favorites state provider
  /CompareContext.tsx          # Comparison state provider
/public
  /images                      # Static images, logos
  /fonts                       # Custom fonts if needed
```

## Page Specifications

### Homepage

**Header Component**
- Top utility bar with phone numbers (Sales & Service)
- Main navigation bar with logo and primary menu
- Mega-menu dropdowns for RV categories
- Mobile: Hamburger menu with slide-out drawer
- Sticky behavior on scroll

**Hero Section**
- Full-width carousel/slider with promotional content
- Call-to-action buttons linking to inventory

**Quick Search Bar**
- RV type dropdown
- Price range selector
- Keyword input
- Search button

**Featured Inventory**
- Grid of 8-12 featured RVs
- RV cards showing:
  - Primary image
  - Year/Make/Model
  - MSRP (strikethrough) and sale price
  - Key specs (length, sleeps, slideouts)
  - Compare and Favorite buttons

**Brand Showcase**
- Logo grid of manufacturers (Jayco, Keystone, Forest River, etc.)

**Value Propositions**
- "World's Largest Indoor Showroom" messaging
- Key selling points with icons

**Testimonials**
- Customer review carousel

**Footer**
- Multi-column layout with links
- Contact info and hours
- Social media icons
- Newsletter signup

### Inventory Listing Page

**Layout**
- Left sidebar (desktop): Filter panel
- Mobile: Filter button opens drawer
- Main area: Results count, sort, view toggle, RV grid

**Filter Panel**
- Keyword search input
- RV Type (checkboxes): Travel Trailers, Fifth Wheels, Class A/B/C Motorhomes, Toy Haulers, etc.
- Price Range: Dual-handle slider with min/max inputs
- Year Range: Dual-handle slider
- Make/Brand: Searchable checkbox list
- Model: Dynamic based on make selection
- Sleeping Capacity: Dropdown (2-10+)
- Weight/GVWR: Range slider
- Number of Slideouts: Checkboxes (0, 1, 2, 3+)
- Floorplan Features: Bunkhouse, Front Living, Outdoor Kitchen, Rear Living, etc.
- Clear All / Apply Filters buttons

**URL State**
- All filters synced to URL query parameters
- Shareable/bookmarkable filter states
- Example: `/inventory?type=travel-trailer&minPrice=20000&maxPrice=50000`

**Results Display**
- Grid view: 3 columns (desktop), 2 (tablet), 1 (mobile)
- List view: Single column horizontal cards
- Pagination at bottom

### RV Detail Page

**Image Gallery**
- Large primary image
- Thumbnail strip below
- Lightbox modal for full-screen viewing

**Primary Info**
- Title: Year / Make / Model / Trim
- Stock number and condition badge
- Pricing: MSRP, sale price, monthly estimate
- Action buttons: Request Quote, Schedule Viewing, Compare, Favorite

**Specifications Section (Tabs or Accordion)**
- Overview: Description and highlights
- Specifications:
  - Dimensions (length, height, width, dry weight, GVWR)
  - Capacities (fresh/gray/black water, fuel)
  - Sleeping (count, bed configurations)
  - Features (slideouts, awning)
- Engine & Chassis (motorhomes): Engine, HP, torque, chassis, fuel type
- Options & Amenities: Feature list from API

**Sidebar (Desktop)**
- Sticky pricing summary
- Quick contact form
- Click-to-call buttons
- Location with map link

**Related Units**
- Carousel of similar RVs by type/price range

### Comparison Page

**Layout**
- 2-4 columns side by side
- Sticky header row with images and basic info
- Specification rows below

**Features**
- Highlight differences between units
- Color coding for best values
- Remove individual units
- Clear all button
- Back to inventory link

### Favorites Page

**Layout**
- Grid of saved RVs (same card component as inventory)
- Empty state with CTA to browse

**Features**
- Remove individual or clear all
- Persistent via local storage

### Content Pages

**About Us**
- Hero banner
- Company history/mission
- Facility highlights
- Stats and achievements

**Financing**
- Hero with CTA
- Benefits section
- Application form/link
- FAQ accordion

**Service Department**
- Service offerings list
- Appointment request form
- Hours and contact
- Service area photos

**Parts**
- Department info
- Contact form
- Parts categories

**Careers**
- Job openings (placeholder)
- Culture section
- Application info

**Contact**
- Google Maps embed
- Address, phones, hours
- Contact form
- Directions

**Blog**
- Post grid with images/excerpts
- Category filtering
- Individual post template

## Features

### Comparison System

- Compare bar: Fixed bottom bar when 1+ units selected
- Maximum 4 units
- Thumbnails with remove option
- "Compare Now" button
- Persisted to local storage

### Favorites System

- Heart icon on all RV cards and detail pages
- Filled state when favorited
- Badge count in header
- Toast notifications on add/remove
- Persisted to local storage

### Local Storage Implementation

```typescript
// Context provides app-wide access
// useLocalStorage hook handles persistence
// Hydration handling for SSR compatibility

interface StorageState {
  favorites: string[];  // Array of unit IDs
  compare: string[];    // Array of unit IDs (max 4)
}
```

## Styling Approach

**Tailwind Configuration**
- Custom color palette matching Terry Town branding
- Custom font definitions
- Extended spacing/sizing if needed
- Component-level utility classes

**Visual Replication**
- Match exact colors from original site
- Replicate typography (fonts, sizes, weights)
- Match spacing, shadows, border radii
- Replicate hover states and transitions

**Responsive Breakpoints**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## API Integration

**Client Setup**
```typescript
// lib/api.ts
const BASE_URL = 'https://inventory.coasttechnology.org/api/v3';
const COMPANY_ID = 43;

export async function fetchInventory(params: FilterParams) {
  // Build query string from filter params
  // Handle pagination
  // Return typed response
}

export async function fetchUnit(id: string) {
  // Fetch single unit details
}
```

**Data Fetching Strategy**
- Server-side fetching for initial page loads (SEO)
- Client-side fetching for filter interactions
- React Query for caching and revalidation
- Stale-while-revalidate pattern

## Performance Considerations

- Next.js Image component for optimization
- Lazy loading below-fold content
- API response caching
- Server components where possible
- Code splitting per route

## SEO Implementation

- Dynamic metadata per page
- Open Graph / Twitter cards
- JSON-LD structured data for vehicles
- Sitemap generation
- Semantic HTML structure

## Error Handling

- Loading skeletons during fetch
- Error boundaries with friendly messages
- Empty states for no results
- API retry logic with exponential backoff
- Toast notifications for user actions

## Deployment

- Build output compatible with any Node.js hosting
- Environment variables for API configuration
- Production build optimizations
- Likely deployment target: Digital Ocean

## Implementation Order

1. Project setup (Next.js, Tailwind, dependencies)
2. API client and TypeScript types
3. Layout components (Header, Footer, Navigation)
4. Homepage with hero and featured inventory
5. Inventory listing page with filters
6. RV detail page
7. Comparison feature
8. Favorites feature
9. Content pages (About, Financing, Service, etc.)
10. SEO and metadata
11. Performance optimization
12. Testing and polish
