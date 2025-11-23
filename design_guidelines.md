# Design Guidelines: Financial Advisor Pricing & Market Analysis Platform

## Design Approach
**Framework**: Carbon Design System principles adapted for financial data applications
**References**: Stripe Dashboard (clean SaaS aesthetics), Tableau (data visualization clarity), Linear (modern navigation patterns)
**Rationale**: Enterprise-grade data tool requiring information density, scanning efficiency, and professional credibility

## Core Design Principles
1. **Data-First Hierarchy**: Information clarity over decoration
2. **Scannable Layouts**: Enable rapid data comparison and analysis
3. **Professional Trust**: Clean, authoritative interface for financial context
4. **Efficient Workflows**: Minimize clicks to insights

---

## Typography System

**Font Stack**: 
- Primary: Inter (via Google Fonts) - excellent for data/numbers
- Monospace: JetBrains Mono - for API keys, code snippets

**Hierarchy**:
- Page Titles: text-3xl font-semibold
- Section Headers: text-xl font-semibold
- Card Titles: text-lg font-medium
- Body Text: text-base font-normal
- Data Labels: text-sm font-medium
- Metrics/Numbers: text-2xl font-bold (monospace for precision)
- Table Headers: text-sm font-semibold uppercase tracking-wide
- Captions/Metadata: text-xs

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4, p-6
- Section spacing: gap-6, gap-8
- Card spacing: p-6
- Table cell padding: px-4 py-3

**Grid Structure**:
- Main container: max-w-7xl mx-auto
- Dashboard grid: grid-cols-12 for flexible layouts
- Stat cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Content + Sidebar: 3:1 or 4:1 ratio

---

## Application Structure

### Primary Navigation
Left sidebar (fixed, 240px width on desktop):
- Logo/branding top
- Main navigation items with icons (Heroicons)
- API Management section
- User profile bottom
- Mobile: collapsible hamburger menu

### Dashboard Layout
Main content area with:
- Top bar: Page title, date range selector, export buttons, API status indicator
- KPI Cards Row: 4-column grid showing key metrics (Total Competitors Tracked, Market Trend, Avg Price Change, Data Points)
- Primary Content: Two-column layout
  - Left (67%): Large comparison chart showing competitor pricing over time
  - Right (33%): Top competitors ranking list
- Data Tables Section: Sortable, filterable competitor pricing table with pagination
- Market Trends Section: Multiple smaller charts showing different trend analyses

---

## Component Library

### Cards
- Elevated cards with subtle borders
- Consistent p-6 padding
- Header section with title + action button
- Clear visual separation between sections within cards

### Data Tables
- Sticky headers for long scrolls
- Alternating row treatment for scannability
- Sortable columns with arrow indicators
- Inline edit capability for competitor data
- Row hover states for clarity
- Cell padding: px-4 py-3

### Charts & Visualizations
Use Chart.js or similar library
- Line charts: Pricing trends over time
- Bar charts: Competitor comparisons
- Area charts: Market trend analysis
- Consistent axis styling and grid lines
- Tooltips on hover with precise values
- Legend placement: top-right for multi-series

### Forms & Inputs
- Label above input pattern
- Input fields: Full width within containers, h-10, px-4
- Select dropdowns: Chevron icon right
- Date pickers: Calendar icon left
- Search: Magnifying glass icon left
- Validation: Inline error messages below fields

### Buttons
- Primary CTA: px-6 py-2.5 rounded-lg font-medium
- Secondary: Same padding, outline variant
- Icon buttons: w-10 h-10 for consistency
- Button groups: Connected buttons for related actions

### API Management Interface
Dedicated section featuring:
- API key generation form
- Active keys table with creation date, last used, permissions
- Copy-to-clipboard functionality
- Code snippets showing integration examples
- Rate limit monitoring visualization
- Webhook configuration interface

### Filters & Controls
- Date range selector: Dropdown with presets (Last 7 days, 30 days, Quarter, Year, Custom)
- Multi-select filters for competitors
- Search bar for quick filtering
- "Clear all filters" reset button
- Applied filters display as dismissible chips

---

## Data Visualization Patterns

**Pricing Comparison View**:
- Multi-line chart showing 5-8 competitors simultaneously
- Different line styles for distinction
- Y-axis: Price range
- X-axis: Time period
- Interactive legend to toggle competitors

**Market Trends Dashboard**:
- Grid of 6 smaller charts (grid-cols-2 lg:grid-cols-3)
- Each showing different market indicator
- Consistent height: h-64 per chart

**Competitor Detail Modal**:
- Full-screen overlay with detailed competitor analysis
- Historical pricing table
- Trend graphs
- Notes/annotations section

---

## Navigation Patterns

**Main Dashboard**: Default view with overview metrics
**Competitors**: Full list/grid view with add/edit capabilities
**Market Analysis**: Deep-dive into trend analysis
**Reports**: Export and schedule report generation
**API Access**: Developer documentation and key management
**Settings**: User preferences and data source configuration

---

## Responsive Behavior

Desktop (lg+): Full sidebar + multi-column layouts
Tablet (md): Collapsed sidebar icon-only + 2-column grids
Mobile: Hidden sidebar (hamburger menu) + single-column stacks

---

## Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation for tables (arrow keys)
- Focus indicators on all focusable elements
- Screen reader announcements for data updates
- High contrast for data visualization

---

## No Images Required
This is a data-centric business tool - no hero images or decorative photography needed. Interface clarity through typography, spacing, and data visualization is paramount.