---
name: Discursantes
description: Gestión de discursantes y discursos dominicales — Sunday speakers and talks management for LDS wards
colors:
  primary: "#5B3A8C"
  primary-dark: "#4A2F73"
  primary-light: "#8B6CB8"
  primary-fade: "rgba(91, 58, 140, 0.08)"
  accent: "#d97706"
  accent-light: "#f59e0b"
  success: "#4d7c59"
  success-light: "#6fa37c"
  danger: "#be123c"
  danger-light: "#e11d48"
  warning: "#b45309"
  warning-bg: "#fffbeb"
  info: "#2b6cb0"
  bg: "#faf9f7"
  surface: "#ffffff"
  surface-raised: "#ffffff"
  border: "#e5e0d8"
  text: "#1f2937"
  text-muted: "#6b7280"
  text-inverse: "#ffffff"
  line: "rgba(91, 58, 140, 0.08)"
  line-active: "#5B3A8C"
typography:
  display:
    fontFamily: "'Crimson Pro', Georgia, serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.2
  headline:
    fontFamily: "'Crimson Pro', Georgia, serif"
    fontSize: "1.35rem"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "'Crimson Pro', Georgia, serif"
    fontSize: "1.3rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "'Source Sans 3', system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Source Sans 3', system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.08em"
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.78rem"
    fontWeight: 500
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  full: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
    padding: "0.65rem 1.15rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.text-inverse}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "0.65rem 1.15rem"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  suggestion-node:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "0.7rem 1rem"
  suggestion-node-nunca:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning}"
    rounded: "{rounded.md}"
  gen-node:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "1rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "0.45rem 0.8rem"
  nav-link-active:
    backgroundColor: "{colors.primary-fade}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
---

# Design System: Discursantes

## Overview

**Creative North Star: "El Árbol de Generaciones"**

Discursantes looks like what it is: the ward is one family, and every member is
a node on the family tree. Sundays are generations — a row of connected nodes —
and planning one is pulling the right people onto the line. The signature
grammar is the **connected node**: members and Sundays are nodes, and nodes
only ever appear joined by ruled ink lines. A purple line is a speaker wired
into a Sunday; a dashed connector is a speaker waiting to be wired in. Nothing
in the product floats unconnected.

The mood is **warm, orderly, reverent, and unmistakably operational**. This is
an Operate-mode tool — ward leaders plan the upcoming Sunday on their phone,
between meetings, in low light — so scanability and the real usage scene
outrank atmosphere. But the interface refuses to be generic: the connection
lines carry the composition, the rotation counters are exact mono readouts,
and the whole surface reads like a well-kept record book rather than an admin
panel.

The palette is pinned by the client and never drifts: **Púrpura Litúrgico** is
the action and the wire; **Ámbar Vela** marks who has never spoken; the warm
paper neutrals keep the surface a record, not a dashboard. A matched dark
"capilla nocturna" register carries the same system in a night key. Icons are
thin-stroke line SVGs drawn in the world's own ink-line grammar — never emoji.

**Key Characteristics:**
- Connected nodes: people and Sundays are nodes joined by ruled ink lines
- The generation line (horizontal on desktop, a vertical spine on mobile) with
  connector ticks beading assigned speakers into the Sunday
- Pending suggestion nodes wait on dashed connectors with exact day counters
- Editorial serif display voice (Crimson Pro) over a utilitarian sans body,
  with a mono face reserved for rotation measurement
- Liturgical purple + candle amber on warm paper; matched dark "capilla nocturna"
- Drawn line icons (thin 1.6px stroke), never emoji or glyph substitutes
- Staggered `fadeInUp` entry; a single authored `wireIn` flash when a speaker
  joins the generation

## Colors

A liturgical duo — purple for action, amber for attention — resting on warm
paper neutrals, with a reserved semantic set that only ever signals state.
This palette is pinned by the client and carries over from the previous world.

### Primary
- **Púrpura Litúrgico** (#5B3A8C): the voice of action and the wire. Fills the
  primary button, the active nav node, the filled connection line, the brand
  wordmark, and focus rings. Its rarity is its authority — one dominant purple
  element per viewport.
- **Púrpura Profundo** (#4A2F73): hover/active depth of the primary; purple-on-paper text.
- **Púrpura Suave** (#8B6CB8): borders and accents leaning purple without
  committing — hovered card and input borders, branch dots, empty-state icons.
- **Velo Púrpura** (rgba(91, 58, 140, 0.08)): the primary fade — row hovers,
  the ward badge, active nav wash, and the resting color of every connection line.

### Secondary
- **Ámbar Vela** (#d97706): candlelight. Reserved for attention that is not an
  error — the "nunca ha hablado" suggestion nodes and their counters. Never a
  primary action, never an error.
- **Ámbar Vela Alta** (#f59e0b): the brighter dark-theme register.

### Tertiary (semantic set)
- **Verde Sacristía** (#4d7c59): success states and the add-speaker action.
- **Rojo Rubrica** (#be123c): destructive actions and form errors.
- **Ocre de Aviso** (#b45309) on **Crema de Aviso** (#fffbeb): warning badges
  and the never-spoken node's name and counter.
- **Azul Lectionario** (#2b6cb0): informational badges only.

### Neutral
- **Papel Dominical** (#faf9f7): the page background; warm, not clinical.
- **Blanco Altar** (#ffffff): surfaces and raised cards in light theme.
- **Lino** (#e5e0d8): the only border color; a linen-soft 1px everywhere,
  dashed where a connection is pending.
- **Tinta** (#1f2937): primary text.
- **Tinta Suave** (#6b7280): secondary text, muted metadata.
- **Tinta Inversa** (#ffffff): text on filled purple.

### Connection lines
- **Línea en Reposo** (rgba(91, 58, 140, 0.08)): every connection line at rest —
  the generation spine, branch stubs, history date rules.
- **Línea Activa** (#5B3A8C): the line once a speaker is wired into the Sunday.

### Dark theme — "Capilla Nocturna"

The same system in a night register, token-for-token (defined on
`[data-theme="dark"]` and under `prefers-color-scheme`):

| Token | Dark value | Note |
|---|---|---|
| primary | #9B7ED8 | brighter violet for dark contrast |
| primary-dark | #B8A4E6 | **inversion quirk:** the lighter hover shade in dark |
| primary-light | #7B5DB8 | deepens instead of lightens |
| accent | #f59e0b | becomes the base amber |
| bg | #1F1A2E | midnight violet paper |
| surface | #2a2342 | raised: #342b50 |
| border | #4b4458 | violet-grey linen |
| text | #f3f4f6 | muted: #9ca3af; inverse: #1f2937 |
| success / danger / warning / info | #6fa37c / #f43f5e / #fbbf24 / #63b3ed | brightened for dark |
| warning-bg | #3f2d0b | ember instead of cream |
| shadows | rgba(0,0,0,0.30–0.55) | black replaces tinted ink |

### Named Rules
**La Regla del Nodo (The Node Rule).** Every person and every Sunday is a node,
and a node never floats unconnected: it hangs from the generation spine, a
branch stub, a nav dot, or a connector tick. If an element has no connection
line, it does not belong on the page.

**La Regla de la Línea (The Line Rule).** Purple wires; amber waits. A solid
purple line means "wired into this Sunday"; a dashed connector means "pending."
A line is only ever drawn for a real connection — never as decoration.

**La Regla del Púrpura Único (The One Purple Rule).** Only one filled purple
element dominates any viewport. Purple on ≤10% of the screen; its scarcity is
its authority.

**La Regla del Ámbar (The Amber Rule).** Amber means "this needs your attention
but nothing is wrong" — never-spoken speakers and their counters. It never
fills a primary action and never signals an error.

**La Regla Semántica (The Semantic Rule).** Verde, Rojo, Ocre, and Azul exist
only to describe state. They never decorate, never brand, and never appear in
large fills.

## Typography

**Display Font:** Crimson Pro (with Georgia, serif fallback)
**Body Font:** Source Sans 3 (with system-ui, -apple-system, sans-serif fallback)
**Mono Font:** JetBrains Mono (with ui-monospace, monospace fallback)

**Character:** The serif is the record heading — it speaks the Sunday date,
names, titles, and the brand. The sans is the annotation — everything
functional. The mono is the instrument — rotation counters and only rotation
counters, set with tabular numerals so fairness reads as a measurement.

### Hierarchy
- **Display** (600, 2rem → 2.6rem at ≥768px, 1.65rem at ≤640px, line-height 1.2): page titles in `.page-header`; always Crimson Pro.
- **Date heading** (600, 1.9rem → 2.3rem at ≥768px): the Sunday date at the top of the plan, always Crimson Pro.
- **Headline** (600, 1.35rem, line-height 1.2): card titles.
- **Title** (600, 1.3rem): dashboard node titles; history dates run 1.25rem/700.
- **Node name** (600, 1.05–1.1rem): speaker names on suggestion and generation nodes, always Crimson Pro.
- **Brand wordmark** (700, 1.4rem, letter-spacing -0.01em): navbar brand; auth brand at 1.9rem; always primary purple.
- **Body** (400, 1rem, line-height 1.55): Source Sans 3; descriptions at 0.95rem in muted ink.
- **Label** (700, 0.75rem, letter-spacing 0.08em, uppercase): table headers and micro-labels; always sans, always muted.
- **Counter** (500, 0.78rem, tabular-nums): the mono rotation readout on suggestion nodes.

### Named Rules
**La Regla de las Dos Voces (The Two Voices Rule).** Crimson Pro speaks only
for headings, dates, names, and the brand; Source Sans 3 handles everything
functional. Never set body copy in the serif; never set a page title in the
sans.

**La Regla del Rótulo (The Label Rule).** Labels and table headers are small,
loud, and quiet at once: 0.75rem, 700 weight, uppercase, 0.08em tracking,
always muted — structure you can scan, not read.

**La Regla del Contador (The Counter Rule).** The rotation metric is always an
exact mono readout — "hace 214 días" or the amber "(nunca)". Fairness is
measured, never implied; no decorative badges, no rounded approximations.

## Layout

A single centered column of work: content maxes at 1140px (`--max-content-width`),
padded `1.5rem/1rem` on mobile opening to `2rem` gutters at ≥768px. A 64px
sticky navbar anchors the top. Breakpoints live at 640px (cards and forms gain
a second column), 768px (page titles grow, the generation goes horizontal),
and 900px (desktop nav replaces the slide-in mobile menu).

The signature composition is the **generation**: assigned speakers bead onto a
ruled line. On desktop the line runs horizontally behind the node cards
(gap-based, so the line shows only between nodes); on mobile it becomes a
vertical spine with each node connected by a short horizontal tick. Suggestion
nodes stack as pending rows with dashed left connectors. The dashboard is the
**tree root**: a horizontal rail with a root node in the center, each tile
hanging from it on a colored branch stub.

Density is comfortable: `--space-md` (1rem) is the working rhythm, cards carry
`1.5rem` internal padding, and sections separate by `--space-lg` or more.
Responsive behavior favors transformation over squeezing: tables become card
lists, the generation line rotates 90°, buttons go full-width at ≤640px, and
the dashboard grid collapses to a single column. Print styles strip
navigation and actions entirely — the printed Sunday program is a real output.

## Elevation & Depth

Hybrid: ambient at rest, lifted by interaction, with the connection lines doing
quiet structural work underneath. Surfaces at rest carry only `--shadow-sm`;
hovering a dashboard node raises it 4px into `--shadow-lg`; modals float on
`--shadow-xl` over a blurred 55%-black backdrop. Depth is earned by interaction,
never painted on.

### Shadow Vocabulary
- **Resting** (`0 1px 2px rgba(31, 41, 55, 0.04)`): cards, navbar; barely-there contact shadow. (Dark: rgba(0,0,0,0.3).)
- **Raised** (`0 4px 12px rgba(31, 41, 55, 0.08)`): hovered nodes and buttons. (Dark: 0.35.)
- **Lifted** (`0 12px 32px rgba(31, 41, 55, 0.14)`): hovered dashboard nodes, Clerk cards and popovers. (Dark: 0.45.)
- **Floating** (`0 24px 60px rgba(31, 41, 55, 0.18)`): modals only. (Dark: 0.55.)

### Named Rules
**La Regla del Ascenso (The Ascension Rule).** Elevation is earned by
interaction. At rest, surfaces keep only the resting shadow; the lifted and
floating registers exist solely as feedback to hover, focus, or overlay.

## Shapes

Soft geometry on a 6/10/14/20px scale plus the full pill, with one rule
carrying the world: **nodes are squares or gently-rounded boxes; choices and
people are pills.** Suggestion nodes, buttons, and fields take the gentle 10px
middle radius; cards, modals, and popovers take 14px; badges and the language
switch are full pills; connection dots and branch nodes are circles. Dashed
borders (1px Lino dashed) mark *pending* — a connector waiting to be wired —
the only place the record uses broken lines.

## Components

### The Generation Line (signature)
The spine of the Sunday plan. On desktop a 2px resting line runs horizontally
behind the assigned nodes, visible only in the gaps, beading them together; on
mobile it turns 90° into a left spine with each node joined by a short
horizontal tick ending in a small purple dot. New nodes enter with a single
`wireIn` flash (a purple ring that fades to the resting shadow). The line is
drawn from `--color-line` and the composition is nothing more than nodes on a
wire — the signature must never be flattened back into separate cards.

### Buttons
Tactile and confident; they compress when pressed (`scale(0.97)` on `:active`).
- **Shape:** gently rounded (10px); compact 40px minimum height.
- **Primary:** Púrpura Litúrgico fill, Tinta Inversa text, padded 0.65rem 1.15rem; hover deepens to Púrpura Profundo with a soft purple glow. One dominant primary per screen.
- **Secondary / Ghost:** Blanco Altar fill, 1px Lino border; hover lifts the border toward Púrpura Suave and tints the text purple.
- **Success / Danger:** Verde Sacristía and Rojo Rubrica fills, used only for genuinely constructive/destructive actions.
- **Sizes:** small (32px min-height, 0.85rem) and large (1.05rem) variants; icon-only square at 36px.

### Suggestion Nodes (pending)
The fair-rotation UI — the product's signature interactive element.
- **Style:** a full-width row (10px radius), Blanco Altar fill, 1px Lino *dashed* border, and a dashed circular connector dot on the left.
- **Content:** name in Crimson Pro (1.02rem), calling in muted small sans, and the mono rotation counter ("hace 214 días").
- **State:** hover fills the whole node Púrpura Litúrgico fade, turns the dashed connector solid and purple, and lifts the border to the primary — commitment preview. The `.nunca` (never-spoken) variant wears Crema de Aviso with a dashed Ámbar connector and an Ocre name + counter; hover fills it with the amber tint.
- **Behavior:** a ghosted circular × remove control hides a suggestion; tapping the node wires the speaker into the generation below with a `wireIn` flash.

### Generation Nodes (assigned)
Each assigned speaker is a node on the generation line.
- **Style:** Blanco Altar card (10px radius, 1px Lino border, resting shadow), 1rem padding, connected to the spine by its tick.
- **Content:** name in Crimson Pro, calling in muted small sans, a speaker select and a topic input on Papel Dominical.
- **State:** hover lifts the border to Púrpura Suave; the remove control turns Rojo Rubrica on hover; manual (unselected) nodes are dashed and filled with the paper tone.

### Cards / Containers
- **Corner Style:** softly rounded (14px).
- **Background:** Blanco Altar in light theme (surface token); 1px Lino border.
- **Shadow Strategy:** resting shadow only; see La Regla del Ascenso.
- **Internal Padding:** 1.5rem, compressing to 1rem on small screens.

### Dashboard Node (tree root)
The home screen's navigation tile: a card hanging from the central rail on a
vertical branch stub ending in a colored dot — purple, green, amber, blue in
sequence. Hover lifts the card 4px, doubles the dot's glow, and the line icon
scales and tilts -3°. Entrance is a staggered `fadeInUp` (75ms apart).

### Inputs / Fields
- **Style:** 1.5px Lino stroke on Blanco Altar, 10px radius, 44px minimum height, padded 0.75rem 1rem.
- **Focus:** border turns Púrpura Litúrgico with a 4px Velo Púrpura ring.
- **Search:** the same field as a full pill with a leading line icon, max-width 360px.
- **Error / Disabled:** error text in Rojo Rubrica at 0.85rem; required markers in the same red.

### Navigation
A 64px sticky bar on Blanco Altar with Lino bottom border, backdrop blur, and
the resting shadow. Links are rounded rects with a small **connector dot** —
the nav link is a node. Muted ink by default; hover washes in Velo Púrpura;
the active link fills Velo Púrpura, tints purple, fills its dot with Púrpura
Litúrgico, and grows a 2px purple underline. The language switch is a
segmented pill of uppercase 0.75rem codes; the theme toggle is a 36px circle
that rotates 15° on hover; the ward badge is a Velo Púrpura pill with a pin
line icon. Below 900px the bar collapses to a hamburger that slides a
full-height menu in from the right; the active underline turns vertical on
mobile.

### Tables
Bordered container (1px Lino, 10px radius) with uppercase micro-label headers
(see La Regla del Rótulo) on a Papel Dominical strip; rows hover into Velo
Púrpura. On small screens tables are replaced by card lists, not squeezed.

### Badges & Status Pills
Small pills (0.25rem 0.7rem, 0.8rem/600) in tinted-background/saturated-text
pairs from the semantic set; status badges run slightly larger with an icon
gap. Never neutral grey — a badge always says something.

### Icons
Drawn line SVG icons only: a 1.6px stroke, round caps and joins, 24px viewBox.
The set is the world's own ink line — the tree (brand/home), the calendar
(Sunday), joined nodes (speakers), the open book (topics), the archive lines
(history), the message bubble (WhatsApp), the spark (suggestions). Emoji never
stands in for the icon system.

### Modal & Toast
Modals are 14px-radius cards floating on the floating shadow over a blurred
dark backdrop, entering with a scale-and-rise `modalIn`. Toasts slide in from
the right as tinted semantic panels with a drawn × control.

### Empty & Loading States
Empty states are dashed-Lino panels with a floating line icon and a clear call
to action. Loading is a simple spinner: a 32px ring in Lino with a Púrpura
Litúrgico top quarter.

## Do's and Don'ts

### Do:
- **Do** build every color from the CSS custom properties — both themes and the Clerk overrides consume them; a hard-coded hex breaks dark mode silently.
- **Do** draw every connection as a real connection: purple wire = wired in, dashed connector = pending, tick + dot = on the spine (La Regla de la Línea).
- **Do** show the rotation as an exact mono readout with tabular numerals (La Regla del Contador).
- **Do** use Crimson Pro for titles, dates, names, and the brand; Source Sans 3 for everything functional (La Regla de las Dos Voces).
- **Do** draw icons as thin-stroke line SVGs in the world's grammar — never emoji, never a glyph standing in for an icon.
- **Do** let elevation answer interaction: resting shadow at rest, lifted on hover, floating for modals only (La Regla del Ascenso).
- **Do** use the staggered `fadeInUp` entrance for new surfaces and the single `wireIn` flash when a speaker joins the generation; honor `prefers-reduced-motion`.
- **Do** theme the browser surfaces from the palette: selection, caret, scrollbar, focus ring.
- **Do** use the violet/purple palette exactly as pinned — Púrpura Litúrgico action and wire, Ámbar Vela for never-spoken attention.

### Don't:
- **Don't** introduce new hues; the palette is purple + amber + the semantic set, and La Regla Semántica keeps state colors out of decoration.
- **Don't** flatten the generation line back into separate cards — nodes without a connection are not the world (La Regla del Nodo).
- **Don't** fill large areas with Púrpura Litúrgico — one dominant purple element per viewport (La Regla del Púrpura Único); use Velo Púrpura for presence.
- **Don't** use Ámbar Vela for primary actions or errors (La Regla del Ámbar).
- **Don't** add shadows to resting surfaces beyond the resting token, or stack shadows on top of the connection lines.
- **Don't** set body copy in Crimson Pro or a page title in Source Sans 3.
- **Don't** draw a line that is not a real connection; decorative rules are a different world's grammar.