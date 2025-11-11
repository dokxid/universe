# Agent Guidelines for universe

## Build & Test Commands
- **Build**: `yarn build` (uses Next.js with Turbopack)
- **Dev**: `yarn dev` (with Turbopack hot reload)
- **Lint**: `yarn lint` (runs TypeScript check + ESLint)
- **Test**: `yarn test` (runs Jest)
- **Single test**: `yarn test <test-file-path>` (e.g., `yarn test __tests__/colorStringValidator.test.js`)
- **E2E tests**: `yarn e2e` (Cypress interactive), `yarn e2e:headless` (CI mode)
- **Prisma**: `yarn prisma` (generates client + pushes schema to DB)

## Code Style
- **Formatting**: 4 spaces (never tabs), LF line endings, Prettier with tabWidth=4
- **TypeScript**: Strict mode enabled, always type function parameters and returns
- **Imports**: Use `@/` alias for src imports (e.g., `@/lib/utils`), group by external → internal → types
- **Naming**: camelCase for variables/functions, PascalCase for components/types, kebab-case for files
- **Error handling**: Always wrap async operations in try-catch, return `{ success: false, error: string }` pattern
- **Server actions**: Mark with `"use server"` directive at top of file
- **Validation**: Use Zod schemas for all form validation (see `src/types/form-schemas/`)
- **Components**: Functional components with TypeScript, use Radix UI + Tailwind with `cn()` utility
- **Testing**: Jest for unit tests (describe/test blocks), Cypress for E2E, place tests in `__tests__/` dir
