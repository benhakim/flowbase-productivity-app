# FlowBase Cozy Theme

This file documents the initial UI theme tokens and design guidelines for the FlowBase productivity app.

## Goals
- Cozy, modern, and clean UI
- Friendly spacing and readable typography
- Colorful, subtle icon accents

## Color palette
- Primary: #0f172a (navy) — used for primary buttons and logo background
- Background (app): #fbf6ef (cozy cream)
- Surface / Card: #ffffff (clean white)
- Muted / Text: #475569 (soft slate)
- Accent colors (for colorful icons):
  - Sky: #0ea5e9
  - Violet: #7c3aed
  - Rose: #fb7185
  - Amber: #f59e0b
  - Green: #10b981
  - Fuchsia: #d946ef
  - Indigo: #6366f1
  - Pink: #ec4899

## Typography
- Base font-size: 16px
- Headings: 600–700 weight for clarity
- Body: 400–500 weight for readability

## Spacing
- Small: 4px
- Default: 8–12px
- Medium: 16px
- Large: 24–32px

## Components / Sidebar behavior
- Sidebar is collapsible: expanded shows icons + labels; collapsed shows icons only.
- Icons should be colorful with rounded backgrounds and white glyphs.

## Files
- `app/dashboard/layout.tsx` — dashboard layout and main content area
- `components/Sidebar.tsx` — collapsible sidebar implementation

Adjust tokens as the design matures.
