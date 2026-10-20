---
name: Siduduzo Ndlovu portfolio
description: A cinematic blue developer portfolio featuring education and interactive work
colors:
  night: "#071726"
  night-deep: "#06121e"
  panel: "#102a3e"
  panel-light: "#183f5e"
  blue: "#398fca"
  blue-bright: "#83d1ff"
  ice: "#f1f9ff"
  secondary: "#c4d9e8"
  quiet: "#a8c0d0"
  line: "#3c5c72"
typography:
  display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(54px, 5vw, 76px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(54px, 6.5vw, 96px)"
    lineHeight: 0.99
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "16px"
    lineHeight: 1.75
  label:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  action: "5px"
  selector: "8px"
  screen: "16px"
  preview: "14px"
  tag: "3px"
components:
  button-primary:
    backgroundColor: "{colors.blue-bright}"
    textColor: "{colors.night-deep}"
    rounded: "{rounded.action}"
    padding: "13px 18px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.night-deep}"
  project-selector:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.selector}"
    padding: "15px 17px 20px"
  technology-tag:
    textColor: "{colors.ice}"
    rounded: "{rounded.tag}"
    padding: "6px 9px"
---

# Design System: Siduduzo Ndlovu portfolio

## Overview

**Creative North Star: "The Blue Screening Room"**

The portfolio inhabits a deep ocean-ink field. Ice-white architectural type, precise blue-gray rules, and a luminous blue project screen create a cinematic setting without simulated grain. Education has its own large typographic chapter immediately after the screen, making the academic foundation as visible as the working projects.

This system documents the current implementation. The featured-project screen, selector, and page sequence belong to the index.html Experience surface; they are not mandatory compositions for future screens.

**Key Characteristics:**
- Dark navy layers carry the frame; luminous blue identifies attention and state.
- Large, tightly tracked Archivo headlines contrast with steady Public Sans reading text.
- Light and depth concentrate on the project preview, while the university chapter uses scale rather than card decoration.

## Colors

The primary accent is luminous sky blue against deep navy neutrals.

### Primary
- **Screen Blue** (blue-bright): selected-project underline, primary action, focus outline, and highlighted lettering.
- **Structural Blue** (blue): quieter supporting accent in the ocean-blue family.

### Neutral
- **Ocean Night** (night): principal page ground and header.
- **Deep Screening Ink** (night-deep): work ground and dark ink on blue actions.
- **Dark Panel** (panel) and **Lifted Panel** (panel-light): control and stage depth.
- **Ice White** (ice): primary text and hover contrast.
- **Soft Ice Blue** (secondary) and **Quiet Blue-Gray** (quiet): reading text and metadata.
- **Quiet Rule** (line): borders and dividers.

**The Blue Signal Rule.** Use luminous blue for attention, selection, and focus; keep long-form copy in ice or softened neutrals.

## Typography

**Display Font:** Archivo (sans-serif fallback). **Body Font:** Public Sans (sans-serif fallback).

Archivo gives large names and section titles an architectural, closely set silhouette. Public Sans keeps descriptions, controls, navigation, and project facts readable. Compact uppercase labels identify metadata; they do not replace semantic headings.

### Hierarchy
- **Display:** tightly tracked, bold type for the name and first-frame statement.
- **Headline:** oversized, tight-line section headings for major transitions.
- **Body:** regular Public Sans with generous leading for project and biography copy.
- **Label:** small, strong Public Sans for categories, counts, and navigation metadata.

**The Two-Voice Rule.** Reserve Archivo for emphatic titles and selected component names; use Public Sans for text people need to scan or read.

## Layout

The desktop surface uses generous outer gutters and a reserved caption lane beside a screening frame. At 801px and wider, the first viewport is a two-column grid: introduction copy on the left, full-width project stage plus three-choice selector on the right—siblings, never overlaid. At 800px and narrower, it becomes a sequential introduction followed by the screen. The header compresses at 800px; navigation changes to a toggle menu at 620px, where the project chooser also stacks into a single column.

Immediately after the screen, education becomes a full-width chapter with a DUT typographic mark balanced against university/qualification details. It stacks to one column below 800px. The work rows use number/type, description, and link columns on wider screens; at 620px they reflow into compact two-column rows. About stays a quieter diptych; skills compress into a denser toolkit strip (two columns from 901px). Section anchors account for the sticky header, and the smallest viewport receives a further 380px fit pass. Density follows the reel: sparse frame and credential, medium project rows, tight skills, sparse contact.

## Elevation & Depth

Most content is flat, divided by tonal changes and quiet rules. The project screen has darker framing, directional glow, a shadowed interface concept, and optional WebGL projection planes. The illustrative preview has a stronger shadow than information rows; the latter remain flat at rest.

**The Screen-Only Depth Rule.** Keep spatial depth where an artifact is being inspected. Do not add ambient card shadows to factual reading sections.

## Shapes

The field and work rows are precise and mostly rectilinear. Actions have small softened corners, selectors are slightly rounder, and the screen and preview windows receive the broadest rounding. Technology tags use compact corners; outbound work links are circular. Interface concepts may use their own contextual geometry because they represent distinct applications, not shared site primitives.

## Components

### Actions and navigation
The filled primary action is bright blue with dark text and changes to ice on hover. The text action relies on a restrained underline. The sticky header includes a direct Education route, muted links that brighten when active, and a bordered contact action on desktop. At mobile width, navigation becomes an accessible toggle panel. Keyboard focus uses a visible blue outline across links and buttons.

### Project screen and selector
The screen is a dark, rounded field with compact stage metadata and a tilted live screenshot of the selected project (Atmos weather, Movie Explorer, or this portfolio). Its three selector buttons have subdued idle states, brighter hover/focus edges, and an active blue line. Aria-pressed and arrow-key selection communicate the chosen project without relying on color or motion alone. Stage copy labels the media as a live project screenshot.

### Work rows and tags
Work rows pair number, factual description, technology tags, and a direct outbound demo link. Hover changes the row's dark tone without shifting its horizontal padding; the outbound link has a circular outline that fills blue on hover. Tags are quiet, outlined metadata rather than interactive filters.

### Motion and fallback
Focal sequence: welcome count with blur-in, blue burst, and shutter split, then the project stage lights first and the caption lane follows. Project changes are reel changes—stage flash, title blur crossfade, and a snappier Spring swap with stronger pointer tilt. Scroll owns only chapter peaks (education monogram wipe, work list stagger, contact headline), not a fade on every block. Stage light sweep and availability pulse are continuous but pause under reduced motion. Intro skip (button/Escape), hash loads, and `prefers-reduced-motion` omit spatial choreography while keeping state feedback.

## Do's and Don'ts

### Do:
- **Do** keep ice-white text and softened blue supporting copy legible on dark layers.
- **Do** expose obvious keyboard focus and a non-motion route to every project and contact link.
- **Do** label illustrative interface concepts honestly and preserve links to the live applications.

### Don't:
- **Don't** bring purple, the discarded lime exhibition accent, or fake film grain into this world.
- **Don't** turn the current page's project-screen layout into a global component requirement.
- **Don't** invent employment, outcomes, screenshots, or other claims absent from the CV and source material.
