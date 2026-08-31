# E2E Test Infra: Jaydeep Exports 3D Immersive Architectural Redesign

## Test Philosophy
- **Opaque-box, requirement-driven**: Derived directly from `ORIGINAL_REQUEST.md` and user-facing architectural specs.
- **Methodology**: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial Testing + Real-World Workload Testing.
- **Verification mechanism**: Independent of internal implementation details.

## Feature Inventory & Test Coverage Matrix
| # | Feature | Requirement Source | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Scenario) |
|---|---------|-------------------|:----------------:|:-----------------:|:-----------------:|:-----------------:|
| 1 | Stage 1: Raw Earthen Monolith 3D | ORIGINAL_REQUEST §5-Stage | 5 | 5 | ✓ | ✓ |
| 2 | Stage 2: 1000°C Kiln Firing & Particles | ORIGINAL_REQUEST §5-Stage | 5 | 5 | ✓ | ✓ |
| 3 | Stage 3: Modernist Villa Facade & Shadows | ORIGINAL_REQUEST §5-Stage | 5 | 5 | ✓ | ✓ |
| 4 | Stage 4: 3D Customizer Studio | ORIGINAL_REQUEST §5-Stage | 5 | 5 | ✓ | ✓ |
| 5 | Stage 5: Export Deck & 3D Pallet | ORIGINAL_REQUEST §5-Stage | 5 | 5 | ✓ | ✓ |
| 6 | Scrollytelling Choreography & Viewports | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| 7 | Procedural 14+ Jali Patterns (Amber..Zebra) | ORIGINAL_REQUEST R2/R3 | 15 | 15 | ✓ | ✓ |
| 8 | Terracotta PBR Shaders & Normal Maps | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 9 | Customizer Parametric Controls (WxH, Mortar, Sun) | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| 10 | Container & Pallet Packing Calculator | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| 11 | Seaport Freight Constraints (Mundra/Nhava Sheva) | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| 12 | ASTM C652 & C1088 Technical Spec Sheet | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| 13 | Architectural CAD/BIM Downloader Modal | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| 14 | Multi-Product RFQ Drawer & Line Items | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| 15 | WhatsApp & Mailto Payload Generator | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| 16 | Swiss/Brutalist Typography & Design Tokens | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |
| 17 | Progressive Preloader & Firing Animation | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |
| 18 | WCAG 2.1 AA Accessibility & Keyboard Traps | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |
| 19 | 60 FPS Performance & Zero Console Errors | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Runner**: Playwright (`npx playwright test`)
- **Browser Engines**: Chromium, Firefox, WebKit
- **Test File Layout**:
  - `e2e/narrative-stages.spec.ts`: Stage 1 to 5 scrollytelling, camera transitions, 3D WebGL scenes
  - `e2e/customizer-patterns.spec.ts`: All 15 Jali patterns, WxH parametric grid, mortar toggle, sun scrubbing
  - `e2e/specifier-suite.spec.ts`: Calculator precision, metric/imperial unit toggle, Mundra vs Nhava Sheva limits
  - `e2e/rfq-and-cad.spec.ts`: Multi-product RFQ drawer, WhatsApp URL generation, CAD package download modal
  - `e2e/editorial-a11y.spec.ts`: Keyboard focus rings, skip link, dialog traps, contrast, 0 console errors
  - `e2e/scenarios-tier4.spec.ts`: Real-world architectural specifier workflows (Dubai hotel facade, London townhouse screen, Sydney villa partition)

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Luxury Dubai Hotel Facade Specification | Stage 3 shadow projection + Customizer 30x12m grid + Amber pattern + Mundra 27MT calculation + RFQ WhatsApp dispatch | High |
| 2 | London Conservation Townhouse Brick Screen | 1000°C Kiln ASTM C652/C1088 verification + CAD BIM .RVT download + Smoked Charcoal finish + Nhava Sheva CIF quote | High |
| 3 | Sydney Coastal Villa Sunken Courtyard | Lotus & Star pattern comparison + Dry-stack vs mortared mode + Golden hour solar scrub + Pallet tare weight check | Medium |
| 4 | Singapore Green Mark Zero-Energy Screen | Passive cooling -4°C to -6°C thermal check + Metric calculation + ASTM TDS PDF download + Multi-item cart drawer | Medium |
| 5 | Fast-Track Contractor Mobile Order | Mobile viewport (iPhone 14) + Touch slider scrub + Quick 20ft container fill check + Direct WhatsApp tap | High |

## Coverage Thresholds
- **Tier 1 (Feature Coverage)**: ≥105 test cases covering all individual features in isolation
- **Tier 2 (Boundary & Corner Cases)**: ≥105 test cases covering zero/negative dimensions, max limits, port limit overflows, special chars, and mobile viewports
- **Tier 3 (Cross-Feature Pairwise)**: ≥25 test cases verifying cross-feature interactions
- **Tier 4 (Real-World Application Scenarios)**: ≥5 comprehensive multi-step workflows
- **Total Minimum Target**: ≥240 test cases across the test matrix
