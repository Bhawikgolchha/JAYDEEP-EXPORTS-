# Project: Jaydeep Exports 3D Immersive Architectural Redesign

## Architecture
- **Framework & Runtime**: Vite 6.0.7 + React 18.3.1 + TypeScript 5.7.2 + Tailwind CSS 4.1.13 + Motion 12.23.12
- **3D Graphics & Shaders**: Three.js 0.170.0 + @react-three/fiber 8.18.0 + Custom GLSL Blackbody & Terracotta PBR Shaders
- **Design System**: Swiss/Brutalist Architectural Editorial (Archivo Variable Font, WCAG AAA Dark Clay Palette, Mortar Divider Masks, Raking Sun Lights)
- **Testing & Verification**: Playwright E2E Test Runner (Chromium, Firefox, WebKit) across desktop and mobile viewports

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Stage 1: Raw Earthen Monolith | Macro 3D perspective of raw clay tile with micro-porosity normal mapping, rotating earthen textures and depth | M1 | ORIGINAL_REQUEST §5-Stage, Explorer 2 |
| 2 | Stage 2: 1000°C Kiln Firing | Thermal transformation simulation, blackbody glow shader, ember particles, compressive strength & ASTM compliance highlights | M1 | ORIGINAL_REQUEST §5-Stage, Explorer 2 |
| 3 | Stage 3: Modernist Villa Facade | Full 3D architectural facade with dynamic solar trajectory, projecting moving geometric dappled shadows across interior surfaces | M1 | ORIGINAL_REQUEST §5-Stage, Explorer 2 |
| 4 | Stage 4: Interactive Customizer 3D View | Parametric wall generation in 3D viewport responding to pattern swaps, dimensions, mortar joints, and sun angle | M1, M2 | ORIGINAL_REQUEST §5-Stage, Explorer 2 |
| 5 | Stage 5: Global Export Deck & Logistics 3D | 3D export pallet visualizer, ISPM-15 heat-treated wood pallet, stacked tiles, shrink-wrap material, strapping bands | M1 | ORIGINAL_REQUEST §5-Stage, Explorer 2 |
| 6 | Spring-Damped Camera & Scrollytelling Choreography | Smooth scroll-synchronized 3D camera trajectory, seamless canvas lifecycle, responsive viewport framing, 60 FPS | M1 | ORIGINAL_REQUEST R1, Explorer 2 |
| 7 | Procedural Jali Geometry Engine (14+ Patterns) | Algorithmic 3D extrusion of Amber, Arrow, Circle, Cross, Diamond, Leaf, Lotus, Omega, Opal, Pearl, Star, Swastik, TV, Window, Zebra | M2 | ORIGINAL_REQUEST R2/R3, Explorer 2 |
| 8 | Terracotta PBR Material Engine | High-fidelity terracotta shader with roughness variations, micro-porosity, and real-time shadow casting through perforated geometries | M1, M2 | ORIGINAL_REQUEST R2, Explorer 2 |
| 9 | Customizer Parametric Controls | Live UI controls for wall width, height, mortar joint thickness (mortared vs dry-stack), finish swatches, sun azimuth/elevation, rotation | M2 | ORIGINAL_REQUEST R3, Explorer 2 |
| 10 | Real-Time Container/Pallet Packing Calculator | Parametric calculator converting sq.ft/sq.m to tile count (+5% reserve), pallets, metric tons, and 20ft container utilization % | M3 | ORIGINAL_REQUEST R4, Explorer 3 |
| 11 | Seaport Freight & Weight Constraint Engine | Port-specific logistics engine for Mundra Port (INMUN, 27 MT limit) vs Nhava Sheva (INNSA, 21.5 MT limit) with road transit times | M3 | ORIGINAL_REQUEST R4, Explorer 3 |
| 12 | ASTM C652 & C1088 Spec Sheet Suite | Engineering physical/mechanical data display (compressive strength >15MPa, water absorption <9%, efflorescence nil, fire Class A1) | M3 | ORIGINAL_REQUEST R4, Explorer 3 |
| 13 | Architectural CAD / BIM Downloader Modal | Downloader modal for 2D CAD (.DWG/.DXF), 3D BIM (.RVT/.RFA), 3D Mesh (.OBJ/.GLTF/.SKP), PBR Textures, and certified TDS PDF | M3 | ORIGINAL_REQUEST R4, Explorer 3 |
| 14 | Multi-Product RFQ Drawer | Cart drawer supporting multi-item selection, finish choices, specifier details validation, shipping terms (FOB/CIF), and port selector | M3 | ORIGINAL_REQUEST R4, Explorer 3 |
| 15 | Structured WhatsApp & Email Payload Generator | Automated generation of structured WhatsApp quote link (`wa.me/919227738035`) and RFC-compliant mailto drafts | M3 | ORIGINAL_REQUEST R4, Explorer 3 |
| 16 | Swiss/Brutalist Editorial Design System | Typography hierarchy using Archivo variable font, deep charcoal/clay color tokens, strict 0px border radius with pill CTA, raking light | M4 | ORIGINAL_REQUEST R5, Explorer 3 |
| 17 | Progressive Asset Preloader & Firing Animation | Thermal kiln firing animation preloader with font & asset readiness checks and 2.5s fallback timeout | M4 | ORIGINAL_REQUEST R5, Explorer 3 |
| 18 | WCAG 2.1 AA Accessibility & Keyboard Navigation | High-contrast terracotta focus rings, skip navigation links, dialog focus traps, Escape key dismissals, ARIA semantics | M4 | ORIGINAL_REQUEST R5, Explorer 3 |
| 19 | 60 FPS Performance & Zero Console Errors | InstancedMesh GPU rendering, memory cleanup, responsive canvas lifecycle, clean console logs across all devices | M4 | ORIGINAL_REQUEST R5, Explorer 1, 2 |
| 20 | E2E Testing Suite (Tiers 1-4) | Comprehensive Playwright test suite covering feature tests, boundary cases, pairwise interactions, and real-world scenarios | E2E_Track | ORIGINAL_REQUEST Acceptance Criteria |
| 21 | Final 100% E2E Pass & Adversarial Hardening (Tier 5) | Full verification against E2E test suite and adversarial stress testing | M5 | ORIGINAL_REQUEST Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Requirement-driven opaque-box 4-tier test suite with runner & publish TEST_READY.md | none | IN_PROGRESS |
| M1 | 5-Stage Narrative & WebGL Scrollytelling | Stages 1-5 3D scenes, camera trajectories, kiln shader, villa facade shadows, 3D export pallet | none | IN_PROGRESS |
| M2 | Procedural 14+ Jali Engine & Customizer Studio | 15 procedural patterns geometry factory, live parametric controls (WxH, mortar, finishes, sun) | none | IN_PROGRESS |
| M3 | High-Conversion Specifier Suite & Logistics | Container/pallet calculator, Mundra/Nhava Sheva limits, ASTM C652/C1088 specs, CAD downloader, RFQ drawer | none | IN_PROGRESS |
| M4 | Swiss/Brutalist Editorial UI/UX & a11y | Archivo typography, tokens, FiringLoader, raking light, WCAG 2.1 AA a11y, zero console errors | M1, M2, M3 | PLANNED |
| M5 | Final E2E Test Pass & Hardening | 100% E2E test pass (Tiers 1-4) + Tier 5 adversarial stress testing | M1, M2, M3, M4, E2E | PLANNED |

## Interface Contracts

### JaliGeometryFactory ↔ CustomizerStudio & 3D Stages
```typescript
export type JaliPatternId =
  | 'amber' | 'arrow' | 'circle' | 'cross' | 'diamond'
  | 'leaf' | 'lotus' | 'omega' | 'opal' | 'pearl'
  | 'star' | 'swastik' | 'tv' | 'window' | 'zebra'

export type ClayFinish = 'clay' | 'charcoal' | 'sand' | 'ochre'

export interface JaliGeometryOptions {
  patternId: JaliPatternId
  bevelEnabled?: boolean
  thickness?: number
}

export function createJaliGeometry(options: JaliGeometryOptions): THREE.BufferGeometry
```

### Specifier Calculator ↔ RFQ Drawer & Logistics Engine
```typescript
export interface PackingCalcResult {
  width: number
  height: number
  unit: 'ft' | 'm'
  across: number
  down: number
  baseBlocks: number
  reserveBlocks: number
  palletCount: number
  netWeightKg: number
  grossWeightMT: number
  containerPort: 'Mundra' | 'Nhava Sheva'
  containerFillPct: number
  containerPayloadLimitMT: number
}

export interface RFQLineItem {
  id: string
  productSlug: string
  productName: string
  patternId?: JaliPatternId
  finish: ClayFinish
  quantity: number
  unit: 'pieces' | 'sqft' | 'sqm'
  application: 'facade' | 'screen' | 'partition' | 'cladding' | 'other'
}
```

## Code Layout
- `src/components/3d/` or `src/components/`:
  - `JaliGeometryFactory.ts`: Procedural geometry generator for all 15 Jali patterns
  - `JaliTile.tsx` / `JaliWall.tsx`: 3D tile and wall component with InstancedMesh and PBR material
  - `SunRig.tsx`: Dynamic solar lighting and shadow-casting rig
  - `KilnScene.tsx`: Thermal transformation 1000°C shader scene
  - `PalletScene.tsx`: 3D export pallet visualizer with ISPM-15 pallet, stacked tiles, shrink wrap
  - `CustomizerStudio.tsx`: Live 3D customizer interactive studio
  - `CoverageCalc.tsx`: Packing & shipping container calculator
  - `CadDownloadModal.tsx`: ASTM C652/C1088 spec sheet and CAD/BIM downloader
  - `RfqDrawer.tsx`: Multi-product RFQ drawer with WhatsApp generator
  - `FiringLoader.tsx`: Thermal kiln firing preloader
  - `Nav.tsx`, `Lightbox.tsx`, `RakeLight.tsx`, `Footer.tsx`
- `src/data/`:
  - `patterns.ts`, `products.ts`, `finishes.ts`, `contact.ts`, `astmSpecs.ts`
- `src/sections/`:
  - `Top.tsx` (Stage 1), `Light.tsx` (Stage 2/3), `Made.tsx` (Material science & ASTM), `Catalogue.tsx`, `Patterns.tsx` (Stage 4), `Enquire.tsx` (Stage 5 & Specifier Suite)
- `src/styles/`:
  - `tokens.css`, `index.css`
- `e2e/`:
  - `e2e/landing-page.spec.ts`, `e2e/customizer.spec.ts`, `e2e/calculator.spec.ts`, `e2e/rfq.spec.ts`, `e2e/accessibility.spec.ts`
