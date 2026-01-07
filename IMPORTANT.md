# Code.AI - Technical Documentation

## Project Overview

Code.AI is a sophisticated full-stack web application built with modern technologies, demonstrating advanced software engineering practices and architectural decisions. This document serves as a comprehensive guide to the project's structure, technical implementation, and design patterns.

## Tech Stack & Architecture

### Frontend
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool for lightning-fast development and optimized production builds
- **React Router** for client-side routing and navigation
- **Tailwind CSS** for utility-first styling with custom theming
- **shadcn/ui** component library for consistent, accessible UI components
- **Framer Motion** for fluid animations and transitions
- **Monaco Editor** for in-browser code editing with syntax highlighting

### Backend & Database
- **Convex** as the backend platform providing:
  - Real-time database with reactive queries
  - Type-safe end-to-end TypeScript
  - Built-in authentication (OTP-based)
  - File storage capabilities
  - Serverless functions (queries, mutations, actions)
  - Scheduled cron jobs
  - HTTP endpoints

### Package Management
- **pnpm** for efficient, fast dependency management with workspace support

## Project Structure

```
codebase/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui base components
│   │   ├── CodeEditor.tsx # Monaco editor integration
│   │   └── ...
│   ├── pages/             # Route-level page components
│   │   ├── Landing.tsx    # Homepage
│   │   ├── Dashboard.tsx  # Main app interface
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and helpers
│   ├── main.tsx          # Application entry point & routing
│   └── index.css         # Global styles & theme variables
├── convex/               # Backend logic
│   ├── schema.ts         # Database schema definitions
│   ├── auth/             # Authentication logic
│   ├── crons.ts          # Scheduled jobs
│   ├── http.ts           # HTTP endpoints
│   └── ...               # Queries, mutations, actions
└── public/               # Static assets
```

## Routing Architecture

The application uses **React Router v7** (react-router package) for client-side routing. All routes are defined centrally in `src/main.tsx`.

### Route Configuration

Routes follow a declarative pattern using `createBrowserRouter`:

```typescript
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  // Additional routes...
]);
```

### Key Routing Concepts

1. **File-based Organization**: Each route corresponds to a page component in `src/pages/`
2. **Protected Routes**: Authentication wrapper components guard sensitive routes
3. **Lazy Loading**: Routes can be code-split for optimal performance
4. **Navigation**: Uses `useNavigate()` hook for programmatic navigation

### Adding New Routes

To add a new route:
1. Create the page component in `src/pages/`
2. Import the component in `src/main.tsx`
3. Add route configuration to the router array
4. Wrap with authentication if needed

**Note**: We use `react-router` (NOT `react-router-dom`) as per modern React Router v7 standards.

## Backend Architecture (Convex)

### Database Schema

Convex uses a strongly-typed schema defined in `convex/schema.ts`. All tables have automatic fields:
- `_id`: Unique identifier (type: `Id<tableName>`)
- `_creationTime`: Timestamp of creation (type: `number`)

Example schema:
```typescript
export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
  }).index("by_email", ["email"]),

  submissions: defineTable({
    userId: v.id("users"),
    code: v.string(),
    language: v.string(),
    status: v.string(),
  }).index("by_user_and_status", ["userId", "status"]),
});
```

### Function Types

Convex provides three function types:

1. **Queries** (`query`): Read-only database operations, real-time reactive
2. **Mutations** (`mutation`): Write operations, transactional
3. **Actions** (`action`): For external API calls, file operations, Node.js runtime

### Real-time Data Flow

Convex queries are reactive subscriptions that automatically update when data changes:

```typescript
// Frontend
const data = useQuery(api.namespace.functionName, { arg: value });

// Backend (convex/namespace.ts)
export const functionName = query({
  args: { arg: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("tableName").collect();
  },
});
```

No `useEffect` needed for data synchronization—Convex handles it automatically.

### Authentication System

- **Convex Auth OTP**: Email-based one-time password authentication
- Configured in `convex/auth.ts` and `convex/http.ts`
- Never modify auth code directly—it's production-ready
- JWT tokens stored securely in HTTP-only cookies

### Database Query Patterns

#### Best Practices:
- **Always use indexes** instead of `.filter()` to avoid full table scans
- **Use `.take(n)`** to limit results (never `.collect()` without limits)
- **Pagination** for large datasets using `paginationOptsValidator`
- **Indexed queries** with `.withIndex()` for optimal performance

```typescript
// ❌ Bad: Full table scan
const users = await ctx.db.query("users").filter(q => q.eq(q.field("status"), "active")).collect();

// ✅ Good: Indexed query with limit
const users = await ctx.db.query("users").withIndex("by_status", q => q.eq("status", "active")).take(100);
```

### Actions and Node Runtime

Actions requiring Node.js features must use `"use node"` directive:

```typescript
"use node";
import { action } from "./_generated/server";

export const externalApiCall = action({
  args: { data: v.string() },
  handler: async (ctx, args) => {
    // Can use Node APIs, fetch, etc.
  },
});
```

**Important**: Separate actions from queries/mutations—they cannot coexist in the same file when using `"use node"`.

### Cron Jobs

Scheduled tasks are defined in `convex/crons.ts`:

```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("cleanup-old-data", { hours: 24 }, internal.crons.cleanupTask, {});

export default crons;
```

**Constraints**:
- Minimum interval: 5 minutes
- Must call internal functions with proper function references
- Use `crons.interval()` or `crons.cron()` methods only

## Styling & Theming

### Tailwind CSS Configuration

Custom theme defined in `src/index.css` using CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  /* ... more variables */
}
```

### Component Styling Philosophy

1. **Utility-first**: Use Tailwind classes directly in components
2. **Responsive design**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
3. **Theme consistency**: Always use CSS variables for colors
4. **No separate CSS files**: Inline styles with Tailwind (unless critical)

### Animation Strategy

Framer Motion provides smooth transitions:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## Performance Optimizations

### Build Configuration

1. **Code splitting**: Large dependencies dynamically imported
2. **Tree shaking**: Unused code eliminated in production
3. **Monaco Editor**: CDN-based workers for reduced bundle size
4. **Asset optimization**: Images and fonts optimized during build

### Database Optimization

1. **Indexed queries**: All queries use appropriate indexes
2. **Pagination**: Large datasets fetched incrementally
3. **Rate limiting**: High-volume endpoints protected
4. **Batched operations**: Mutations grouped to reduce transactions

### Frontend Optimization

1. **React.memo**: Expensive components memoized
2. **Lazy loading**: Routes and heavy components loaded on demand
3. **Image optimization**: Proper sizing and lazy loading
4. **Debouncing**: User input handlers debounced to reduce calls

## Error Handling & Testing

### Type Safety

TypeScript ensures compile-time safety:
- Strict mode enabled
- All Convex functions fully typed
- Component props validated
- End-to-end type safety from DB to UI

### Error Checking

Run error checks before deploying:

```bash
# Backend + Frontend check
npx convex dev --once && npx tsc -b --noEmit

# Frontend only
npx tsc -b --noEmit
```

**Never run `npm run build` for quick checks**—it's too slow.

### Testing Data

Always seed test data for development:

```bash
npx convex run namespace:functionName '{"arg": "value"}'
```

## Deployment & Production

### Build Process

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Required variables:
- `VITE_CONVEX_URL`: Convex deployment URL
- `CONVEX_DEPLOYMENT`: Backend deployment identifier

### Pre-deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] Build completes successfully
- [ ] No console errors in production build
- [ ] Authentication flows tested
- [ ] Database indexes optimized
- [ ] Rate limiting configured for public endpoints

## Common Questions & Answers

### Q: How does real-time data work?
**A**: Convex queries are reactive WebSocket connections. When database data changes, all subscribed clients receive updates instantly without polling or manual refresh logic.

### Q: Why not use React Query or Redux?
**A**: Convex provides built-in state management with real-time subscriptions. External state management libraries are unnecessary and add complexity.

### Q: How is authentication secured?
**A**: Convex Auth uses cryptographically secure OTP tokens sent via email, with JWT tokens stored in HTTP-only cookies to prevent XSS attacks.

### Q: Can the app scale to millions of users?
**A**: Yes. Convex is built for scale with automatic sharding, edge caching, and serverless architecture. Proper indexing and pagination ensure efficient queries at any scale.

### Q: How do you handle API rate limiting?
**A**: Using the `@convex-dev/rate-limiter` component with token bucket algorithm for smooth, predictable rate limiting on high-volume endpoints.

### Q: What's the deployment strategy?
**A**: Convex backend deploys via `npx convex deploy`. Frontend deploys to any static hosting (Vercel, Netlify, Cloudflare Pages) via `npm run build`.

### Q: How do you prevent expensive database operations?
**A**: All queries use indexed lookups with `.withIndex()`, results limited with `.take(n)`, and large operations paginated. Cron jobs process data in small batches.

## Developer Experience

### Code Quality Standards

- **TypeScript strict mode**: No implicit `any` types
- **ESLint**: Consistent code style enforcement
- **Prettier**: Automatic code formatting
- **Type-safe APIs**: Full intellisense from database to UI

### Development Workflow

```bash
# Start development
pnpm install
npx convex dev     # Terminal 1: Backend
pnpm dev           # Terminal 2: Frontend

# Make changes (auto-reload enabled)
# Check for errors
npx convex dev --once && npx tsc -b --noEmit

# Deploy
npx convex deploy
npm run build
```

## Technical Achievements

This project demonstrates:

1. ✅ **Full-stack TypeScript**: End-to-end type safety
2. ✅ **Real-time architecture**: WebSocket-based reactive queries
3. ✅ **Modern React patterns**: Hooks, context, composition
4. ✅ **Performance optimization**: Code splitting, lazy loading, indexing
5. ✅ **Security best practices**: OTP auth, rate limiting, input validation
6. ✅ **Scalable architecture**: Serverless, edge-optimized
7. ✅ **Developer experience**: Fast feedback loops, type safety, clear patterns
8. ✅ **Production-ready**: Error handling, monitoring, deployment automation

## Maintenance & Support

### Updating Dependencies

```bash
pnpm update
```

### Troubleshooting

**Build errors**: Check `npx convex dev --once` output
**Auth issues**: Verify `convex/auth.ts` and `convex/http.ts` configuration
**Blank screen**: TypeScript compilation errors blocking render

## Conclusion

This codebase represents a modern, production-ready full-stack application built with industry best practices. The architecture prioritizes developer experience, type safety, performance, and scalability while maintaining clean, maintainable code.

The technical decisions made throughout this project reflect deep understanding of:
- Modern web development patterns
- Backend architecture and database design
- Real-time systems and reactive programming
- Security and authentication
- Performance optimization
- Developer tooling and workflows

---

**Built with expertise and attention to detail** | **Scalable** | **Type-safe** | **Production-ready**
