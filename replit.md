# AI Image Studio

## Overview

AI Image Studio is a web application that enables users to generate images using AI models like DALL-E. Users can create images from text prompts, view their generation history, and download their creations. The application provides a modern, visual-first interface inspired by creative platforms like Midjourney and DALL-E, with authentication powered by Replit's OAuth system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, built using Vite as the build tool.

**UI Library**: The application uses shadcn/ui components built on top of Radix UI primitives, providing a comprehensive set of accessible, customizable components. The design system follows a "New York" style variant with custom theming.

**Styling**: Tailwind CSS with custom design tokens for colors, spacing, and typography. The design guidelines emphasize a visual-first approach with gradients, soft shadows, and a premium feel. Dark mode support is implemented through CSS custom properties.

**State Management**: TanStack Query (React Query) handles server state, API calls, and caching. The query client is configured with infinite stale time and disabled automatic refetching to optimize performance.

**Routing**: Wouter provides lightweight client-side routing. The app has two main routes: a landing page for unauthenticated users and a home page for authenticated users.

**Form Handling**: React Hook Form with Zod validation schemas for type-safe form validation.

### Backend Architecture

**Runtime**: Node.js with Express.js serving both the API and static assets.

**Development vs Production**: Separate entry points (`index-dev.ts` and `index-prod.ts`) handle different environments. Development mode integrates Vite's middleware for hot module replacement, while production serves pre-built static files.

**API Structure**: RESTful endpoints under `/api` prefix:
- `/api/auth/*` - Authentication endpoints (login, user info, logout)
- `/api/generate` - Image generation endpoint
- `/api/images/*` - Image management (list, delete)

**Middleware**: Express middleware handles JSON parsing with raw body preservation (for webhook verification if needed), request logging, and session management.

### Authentication System

**Provider**: Replit OAuth using OpenID Connect (OIDC) protocol.

**Session Management**: PostgreSQL-backed sessions using `connect-pg-simple` with a 7-day TTL. Sessions are stored in a dedicated `sessions` table.

**Implementation**: Passport.js with a custom OpenID Client strategy handles the OAuth flow. User information is synchronized to the local database on login, storing profile details like email, name, and profile image.

**Security**: HTTP-only, secure cookies with SameSite protection. Session secrets are environment-based. An `isAuthenticated` middleware protects API routes.

### Data Storage

**Database**: PostgreSQL accessed through Neon's serverless driver with WebSocket support.

**ORM**: Drizzle ORM provides type-safe database operations with zero-cost abstractions. Schema definitions are shared between client and server using Zod for runtime validation.

**Schema Design**:
- `sessions` table: Stores Express session data with automatic expiration
- `users` table: Stores user profiles synced from Replit OAuth (id, email, name, profile image, timestamps)
- `generatedImages` table: Stores generated image metadata (id, userId, prompt, imageUrl, model, size, quality, revisedPrompt, createdAt) with cascade deletion on user removal

**Migrations**: Drizzle Kit manages schema migrations with configurations pointing to `./migrations` directory.

### External Dependencies

**AI Image Generation**: OpenAI API (DALL-E 2 and DALL-E 3 models) for generating images from text prompts. The implementation includes lazy initialization of the OpenAI client with error handling for missing API keys.

**Authentication Service**: Replit OAuth (OIDC) for user authentication and identity management.

**Database Hosting**: Neon serverless PostgreSQL with WebSocket connectivity for low-latency database access.

**CDN/Fonts**: Google Fonts for typography (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter).

**Component Libraries**: 
- Radix UI for accessible, unstyled component primitives
- Lucide React for iconography
- Various specialized libraries (date-fns for date handling, cmdk for command palette, vaul for drawer components)

### Design System

**Typography**: Multi-font system with Inter as primary, DM Sans as secondary, and monospace options for technical content.

**Color Palette**: Extensive HSL-based color system with semantic tokens for backgrounds, foregrounds, borders, and component states. Supports light and dark modes through CSS custom properties.

**Component Variants**: Class Variance Authority (CVA) manages component variants and responsive behavior. Components support multiple sizes (sm, md, lg, icon) and variants (default, outline, destructive, secondary, ghost).

**Accessibility**: All interactive components built on Radix UI primitives ensure ARIA compliance, keyboard navigation, and focus management.