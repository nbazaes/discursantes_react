# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Leaders and secretaries of local LDS congregations (wards / "barrios") — whoever the
ward designates to organize sacrament meeting speakers. Several people per ward may
share the job; there is no single fixed role. The product is Spanish-first (Chilean
usage, e.g. +56 phone formats) with full English support.

## Product Purpose

Discursantes manages and schedules Sunday sacrament meeting speakers for a ward. It
replaces the paper/Excel workflow that caused duplicate assignments, missed Sundays,
manual lookups, and disorganization. Success means a leader can plan a Sunday in
minutes: pick a date, accept fair suggestions, assign topics, and notify speakers —
with a trustworthy record of every past talk.

## Positioning

Fair rotation is the headline mechanism: the app suggests speakers ranked by longest
time since their last talk (including "never spoken"), so no one is over- or
under-used. A spreadsheet can store names; it cannot tell you who should speak next.

## Operating Context

- Weekly rhythm: planning happens around the upcoming Sunday sacrament meeting.
- LDS vocabulary is native to the product: *discursante*, *llamamiento* (calling),
  *barrio* (ward), *domingo* (Sunday).
- WhatsApp is the channel where assigned speakers actually receive and read their
  date + topic notification; phone numbers are stored on the speaker record.
- Each ward operates as a Clerk Organization; members sign in and work inside their
  active organization.

## Capabilities and Constraints

- Multi-ward product: any ward can sign up; each ward's data is fully isolated.
  Tenancy is enforced by Supabase RLS: every row carries `ward_id`, defaulted and
  scoped via `current_org_id()` from the Clerk JWT (`org_id` / `o.id` claims).
  Ward isolation is a hard constraint for all future work.
- Features shipped: speaker roster (name, calling, WhatsApp phone), Sunday planning
  with fair-rotation suggestions, topic assignment, full history of talks by date,
  topic list, WhatsApp notifications (Supabase edge function + webhook event log),
  light/dark theme, Spanish (default/fallback) and English UI.
- Stack: React 19 + Vite client (`client/`), Supabase Postgres with timestamped
  additive migrations (`supabase/migrations/`), Clerk auth. No automated test suite
  as of this writing.
- Terminology in code is Spanish (`discursantes`, `discursos`); UI strings go
  through `src/i18n.js` and must stay translatable.

## Brand Commitments

- Product name: **Discursantes** (English UI: "Speakers").
- Voice: Spanish-first, plain and warm, using correct LDS terminology.
- Existing assets: `client/public/favicon.png`, `logo192.png`, `logo512.png`;
  privacy policy page at `client/public/privacy.html`.

## Evidence on Hand

- `README.md` / `README.es.md` describe the legacy version (React + Express +
  MySQL/Docker); treat their tech-stack and run sections as history, not current
  truth — the current product is the React + Supabase + Clerk rewrite in this repo.
- `screenshots/` holds legacy UI screenshots.
- Production data exists for at least one real ward (Barrio Villa Esmeralda,
  backfilled in migration `00002_multiward.sql`). Do not fabricate additional
  customers, testimonials, or usage claims.

## Product Principles

1. **Fair rotation first.** The suggestion engine (longest without speaking) is the
   reason the product exists; protect and surface it.
2. **Ward data is sacred.** Absolute per-ward isolation; every query and every new
   table respects RLS and `ward_id`.
3. **Spanish-first, LDS-native.** Copy speaks the ward's language and vocabulary;
   English is a full translation, never the source of truth.
4. **Faster than paper.** Every task the old paper/Excel workflow handled must be
   quicker and safer here — one source of truth, no duplicate or missed Sundays.
5. **Meet speakers where they are.** Notifications go through WhatsApp, the channel
   members actually read.
