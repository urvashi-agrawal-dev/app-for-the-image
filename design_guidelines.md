# Design Guidelines: AI Image Generation Platform

## Design Approach
**Framework**: Modern creative platform inspired by Midjourney, DALL-E, and Runway
**References**: Linear (clean navigation), Dribbble (creative showcase), Notion (intuitive UX)
**Rationale**: Creative tool for AI image generation requiring visual appeal, intuitive workflows, and gallery-focused design

## Core Design Principles
1. **Visual-First**: Showcase generated images prominently with large previews
2. **Creative Flow**: Smooth, uninterrupted generation workflow from prompt to download
3. **Modern Aesthetic**: Contemporary design with gradients, soft shadows, and premium feel
4. **Accessible Creation**: Simple, clear interface that welcomes all skill levels

---

## Typography System

**Font Stack**: 
- Primary: Inter (via Google Fonts) - modern, clean, professional
- Monospace: JetBrains Mono - for prompts and technical details

**Hierarchy**:
- Hero Titles: text-4xl md:text-5xl font-bold
- Page Titles: text-3xl font-bold
- Section Headers: text-2xl font-semibold
- Card Titles: text-lg font-semibold
- Body Text: text-base font-normal
- Captions/Metadata: text-sm text-muted-foreground
- Small Labels: text-xs font-medium

---

## Color System

**Primary Brand Colors**:
- Primary: Vibrant purple gradient (from violet to fuchsia)
- Secondary: Soft blue accent
- Success: Green for completed generations
- Destructive: Red for errors and deletions

**UI Colors**:
- Background: Clean white (light mode), deep dark (dark mode)
- Cards: Slightly elevated from background
- Borders: Subtle, low-contrast
- Text: High contrast for readability

---

## Layout System

**Spacing Primitives**: Consistent spacing using 4, 6, 8, 12, 16, 24
- Page padding: p-6 md:p-8
- Card padding: p-6
- Section gaps: gap-6 md:gap-8
- Grid gaps: gap-4 md:gap-6

**Grid Structure**:
- Main container: max-w-7xl mx-auto
- Image gallery: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Model selection: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Full-width generation interface

---

## Application Structure

### Landing Page (Logged Out)
- Hero section with gradient background
- Large heading describing the platform
- Example generated images in background
- Prominent "Get Started" CTA button linking to /api/login
- Features section highlighting AI models available
- Clean, minimal footer

### Home/Dashboard (Logged In)
- Top navigation bar with logo, user menu, logout
- Main content area with:
  - Welcome message with user's name
  - Quick action: "Create New Image" button
  - Recent generations gallery (grid of image cards)
  - Model selector cards

### Image Generation Interface
- Full-width textarea for prompt input
- Model selector dropdown (DALL-E 3, DALL-E 2, future: Stable Diffusion, Midjourney)
- Size/quality options
- "Generate Image" primary button
- Loading state with progress indicator
- Generated image display with large preview
- Download and Share action buttons

### Gallery View
- Masonry or grid layout of all user's generated images
- Image cards with:
  - Large thumbnail
  - Prompt text (truncated)
  - Generation date
  - Model used badge
  - Quick actions: View, Download, Delete
- Infinite scroll or pagination
- Filter by model/date

### Image Detail View
- Full-size image display
- Complete prompt text
- Metadata: model, size, date, time
- Download button (various sizes)
- Delete button
- Share options (copy link, social media)
- Attribution text crediting the platform creator

---

## Component Library

### Cards
- Soft shadows for depth
- Rounded corners (rounded-lg)
- Hover states with subtle lift effect
- Image cards have aspect-ratio preservation
- Padding: p-4 or p-6 depending on content density

### Buttons
- Primary: Gradient background, white text, rounded-lg
- Secondary: Outline with hover fill
- Ghost: Transparent with hover background
- Icon buttons: Consistent size, subtle hover
- Loading states with spinner

### Forms & Inputs
- Textarea for prompts: Large, auto-expanding, placeholder text
- Select dropdowns: Custom styled with icons
- Input fields: Clean borders, focus rings
- Labels: Above inputs, font-medium

### Image Display
- Aspect ratio containers to prevent layout shift
- Skeleton loaders while images load
- Lazy loading for performance
- Zoom on click for detail view
- Download/share overlays on hover

### Loading States
- Skeleton cards in gallery
- Progress bar during generation
- Spinner for quick actions
- Animated gradient for long operations

### Empty States
- Centered messaging
- Illustrative icons
- Clear call-to-action
- Friendly, encouraging copy

---

## AI Model Integration

### Supported Models (Initial)
1. **DALL-E 3** (Default, Recommended)
   - Highest quality
   - Best prompt understanding
   - 1024x1024, 1024x1792, 1792x1024 sizes
   
2. **DALL-E 2**
   - Faster generation
   - 256x256, 512x512, 1024x1024 sizes
   - Cost-effective option

### Model Selection UI
- Card-based selector with model logos/icons
- Brief description of each model's strengths
- Recommended badge on DALL-E 3
- Visual distinction between models

---

## User Flows

### First-Time User
1. Land on homepage → See compelling hero with example images
2. Click "Get Started" → Redirect to auth (Replit Auth handles this)
3. After login → Welcome to dashboard with empty state
4. Click "Create Image" → Generation interface
5. Enter prompt → Select model → Generate
6. View result → Download/Share → Success!

### Returning User
1. Login → Dashboard with recent generations
2. Quick access to create new or view gallery
3. Seamless generation workflow
4. Gallery management and downloads

---

## Responsive Behavior

**Desktop (lg+)**: 
- Full navigation
- Multi-column grids
- Large image previews
- Sidebar for filters/options

**Tablet (md)**:
- 2-column grids
- Collapsible sections
- Touch-optimized buttons

**Mobile (sm)**:
- Single column
- Stack all content
- Bottom navigation for key actions
- Full-width prompts and previews

---

## Dark Mode Support

- Fully implement dark mode toggle
- Dark backgrounds with proper contrast
- Adjust gradients for dark theme
- Images display well on both backgrounds
- Smooth transition between modes

---

## Attribution & Crediting

- Footer on all pages: "Platform created by [Creator Name]"
- Share feature includes attribution
- Downloaded images have optional watermark
- About section explains the platform

---

## Accessibility

- Alt text for all images (use generation prompts)
- Keyboard navigation throughout
- ARIA labels on interactive elements
- Focus indicators
- High contrast mode support
- Screen reader friendly
