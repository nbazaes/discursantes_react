# Repository Guidelines

## Project Structure & Module Organization

This repository contains a React client and Supabase database migrations. Work in
`client/` for the Vite application: `src/pages/` holds route-level screens,
`src/components/` contains reusable UI, `src/lib/` contains authentication,
theme, and data helpers, and `src/styles/` contains shared overrides. Static
files live in `client/public/`. Database schema changes belong in
`supabase/migrations/` and must be additive, timestamped SQL migrations. Keep
screenshots and other documentation media in `screenshots/`.

## Build, Test, and Development Commands

Run commands from `client/`:

```bash
npm install        # install locked frontend dependencies
npm run dev        # start Vite at http://localhost:3000
npm run build      # produce a production build in client/dist/
npm run preview    # serve the built app locally for verification
```

There is currently no automated test or lint script. Before opening a PR, run
`npm run build` and manually check the changed authenticated route in both
light and dark themes.

## Coding Style & Naming Conventions

Use JavaScript/JSX with two-space indentation, semicolons, and single quotes,
matching the existing source. Name React components and page files in PascalCase
(`SeleccionarDomingo.jsx`); use camelCase for functions, hooks, and variables.
Keep route views in `src/pages/`, import CSS explicitly near the component that
uses it, and favor existing helpers such as `db.js`, `theme.js`, and i18n keys
over duplicated logic. Keep UI strings translatable through `src/i18n.js`.

## Testing Guidelines

For UI changes, exercise the relevant route, responsive navigation, language
switching, and sign-in/sign-out behavior. For Supabase changes, review the SQL
against existing migrations and validate tenant/organization data isolation.
If adding tests, place them beside the feature or in a clear test directory and
name them `*.test.jsx` or `*.test.js`.

## Commit & Pull Request Guidelines

Recent history uses short imperative subjects, often Conventional Commit
prefixes: `feat: add ...`, `fix: correct ...`, and `chore: update ...`.
Keep commits focused. PRs should explain the user-facing effect, mention any
schema or environment-variable changes, link the relevant issue when available,
and include screenshots for visible UI changes.

## Security & Configuration

Never commit secrets. Configure Clerk and Supabase through Vite environment
variables (for example, `VITE_CLERK_PUBLISHABLE_KEY`); treat only public client
values as safe to expose.
