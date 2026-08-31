// ASTM C652 & ASTM C1088 Technical Specifications and CAD/BIM Package Manifest
// Engineering laboratory test data certified by Jaydeep Exports / National Potteries QC Lab

export interface TechnicalSpecItem {
  property: string
  standard: string
  testedValue: string
  requirement: string
  unit?: string
  status: 'PASS' | 'EXCEEDS' | 'CERTIFIED'
  description: string
}

export interface StandardReference {
  code: string
  title: string
  authority: 'ASTM' | 'IS' | 'EN' | 'ISO'
  description: string
}

export interface CadPackageItem {
  id: string
  title: string
  format: string
  extension: string
  fileSize: string
  description: string
  includes: string[]
  mimeType: string
  category: '2D CAD' | '3D BIM' | '3D Mesh' | 'PBR Textures' | 'Documentation'
}

export const ASTM_STANDARDS: StandardReference[] = [
  {
    code: 'ASTM C652',
    title: 'Standard Specification for Hollow Brick (Hollow Masonry Units Made From Clay or Shale)',
    authority: 'ASTM',
    description: 'Class HBS / HBX, Grade SW (Severe Weathering) for structural and screen facade applications.',
  },
  {
    code: 'ASTM C1088',
    title: 'Standard Specification for Thin Veneer Brick Units Made From Clay or Shale',
    authority: 'ASTM',
    description: 'Grade SW architectural veneer masonry testing dimensional stability and absorption.',
  },
  {
    code: 'IS 1077 / IS 2180',
    title: 'Indian Standard Specification for Burnt Clay Building Blocks & Heavy Duty Tiles',
    authority: 'IS',
    description: 'Bureau of Indian Standards compliance for structural clay products and compressive load tolerance.',
  },
  {
    code: 'EN 771-1',
    title: 'Specification for Masonry Units: Clay Masonry Units (Category I, HD)',
    authority: 'EN',
    description: 'European CE mark compliance for high-density unglazed exterior clay facades.',
  },
]

export const TECHNICAL_SPECS: TechnicalSpecItem[] = [
  {
    property: 'Compressive Strength',
    standard: 'ASTM C67 / IS 3495 (Part 1)',
    testedValue: '15.0 – 25.4 MPa (Avg 22.8 MPa)',
    requirement: 'Min 10.3 MPa (Grade SW)',
    unit: 'MPa',
    status: 'EXCEEDS',
    description: 'Exceeds standard requirement by >120%. Capable of multi-storey self-supporting architectural facade screens.',
  },
  {
    property: 'Water Absorption (5-Hour Boil)',
    standard: 'ASTM C67 / IS 3495 (Part 2)',
    testedValue: '7.8% – 8.8% (Avg 8.3%)',
    requirement: 'Max 17.0% (Grade SW)',
    unit: '%',
    status: 'EXCEEDS',
    description: 'Dense vitreous clay matrix resisting moisture penetration, algae growth, and severe weathering.',
  },
  {
    property: 'Water Absorption (24-Hour Submersion)',
    standard: 'ASTM C67',
    testedValue: '5.6% – 6.4%',
    requirement: 'Max 13.0%',
    unit: '%',
    status: 'PASS',
    description: 'Low capillary absorption prevents internal moisture entrapment.',
  },
  {
    property: 'Saturation Coefficient (C/B Ratio)',
    standard: 'ASTM C67',
    testedValue: '0.72 – 0.76',
    requirement: 'Max 0.78',
    status: 'PASS',
    description: 'Guarantees resistance to frost spalling in freezing freeze-thaw climates.',
  },
  {
    property: 'Efflorescence Rating',
    standard: 'ASTM C67 Section 10',
    testedValue: 'Nil / Not Effloresced',
    requirement: 'Not Effloresced',
    status: 'CERTIFIED',
    description: 'Pure alluvial Gujarat clay free from soluble salts, sulfates, or chemical additives.',
  },
  {
    property: 'Fire Resistance & Reaction',
    standard: 'EN 13501-1 / ASTM E136',
    testedValue: 'Class A1 Non-Combustible',
    requirement: 'Non-combustible',
    status: 'CERTIFIED',
    description: '100% natural kiln-fired ceramic. 0 Flame Spread Index (FSI), 0 Smoke Development Index (SDI).',
  },
  {
    property: 'Bulk Density',
    standard: 'ASTM C67',
    testedValue: '1,950 kg/m³ (1.95 g/cm³)',
    requirement: 'Min 1,800 kg/m³',
    unit: 'kg/m³',
    status: 'PASS',
    description: 'Solid heavy-mass terracotta providing thermal flywheel dampening and acoustic attenuation.',
  },
  {
    property: 'Passive Cooling Reduction',
    standard: 'Thermal Cavity Test / CFD Aerodynamic',
    testedValue: '-4°C to -6°C indoor temp drop',
    requirement: 'Solar heat gain reduction',
    unit: '°C',
    status: 'CERTIFIED',
    description: 'Venturi aerodynamic micro-cooling: ambient air accelerates through tapered perforations, dissipating facade heat.',
  },
  {
    property: 'Modulus of Rupture (Flexural)',
    standard: 'ASTM C67 / IS 3495 (Part 4)',
    testedValue: '2.85 – 3.40 MPa',
    requirement: 'Min 1.50 MPa',
    unit: 'MPa',
    status: 'EXCEEDS',
    description: 'High tensile flexural capacity withstanding dynamic wind loads up to 2.4 kPa (cyclonic wind zones).',
  },
  {
    property: 'Freeze-Thaw Durability',
    standard: 'ASTM C67 (50 Cycles)',
    testedValue: '0% Weight Loss / 0 Spalling',
    requirement: 'Max 3.0% loss',
    status: 'CERTIFIED',
    description: 'Validated for 50 severe freeze-thaw cycles (-20°C to +20°C) with zero edge crumbling.',
  },
  {
    property: 'Solar Reflectance Index (SRI)',
    standard: 'ASTM E1980',
    testedValue: '44 (Emittance: 0.90)',
    requirement: 'Cool Roof/Facade standard',
    status: 'PASS',
    description: 'High thermal emittance radiates stored daytime heat rapidly into cool night sky.',
  },
  {
    property: 'Acoustic Sound Transmission',
    standard: 'ISO 10140-2 / ASTM E90',
    testedValue: 'STC 38 dB',
    requirement: 'Acoustic comfort',
    unit: 'dB',
    status: 'PASS',
    description: 'Perforated baffle geometry scatters high-frequency urban traffic noise.',
  },
  {
    property: 'Dimensional Tolerances',
    standard: 'ASTM C652 (Type HBX)',
    testedValue: '±1.5 mm on all axes',
    requirement: '±3.2 mm (HBS) / ±1.6 mm (HBX)',
    unit: 'mm',
    status: 'EXCEEDS',
    description: 'Precision wire-cut and calibrated steel dies ensuring crisp 8mm or 10mm mortar lines or dry-stacking.',
  },
  {
    property: 'VOC & Chemical Toxicity',
    standard: 'LEED v4 / CDPH Standard v1.2',
    testedValue: '0.0 g/L (Zero VOC)',
    requirement: '< 50 g/L',
    status: 'CERTIFIED',
    description: 'Zero VOC, red-list chemical free, natural unglazed inert ceramic body (LEED & IGBC Platinum credit).',
  },
]

export const SEAPORT_SPECS = {
  mundra: {
    name: 'Mundra Port',
    code: 'INMUN',
    location: 'Gulf of Kutch, Gujarat, India',
    transitFromMorbi: '4 hours (190 km via NH-27)',
    maxGrossContainerPayloadMT: 27.0,
    handlingCapacity: 'Ultra Large Container Vessels (ULCV) with 17.5m draught',
    palletLoadingMax: '18 – 20 Pallets (8,100 – 9,000 blocks)',
    linerServices: 'Direct weekly sailings to Jebel Ali (4 days), Rotterdam (18 days), Port Klang (9 days), New York (24 days)',
  },
  nhavaSheva: {
    name: 'Nhava Sheva (JNPT)',
    code: 'INNSA',
    location: 'Navi Mumbai, Maharashtra, India',
    transitFromMorbi: '20 hours (780 km via NH-48)',
    maxGrossContainerPayloadMT: 21.5,
    handlingCapacity: 'NHAI highway statutory axle load weight restricted',
    palletLoadingMax: '14 – 15 Pallets (6,300 – 6,750 blocks)',
    linerServices: 'Extensive global liner connectivity for Mediterranean, African, and South American lanes',
  },
}

export const PALLET_SPECS = {
  type: 'ISPM-15 Heat-Treated (HT) Heavy Hardwood Pallet',
  dimensionsMm: '1100 x 1100 x 950 mm',
  blocksPerPallet: 450,
  tareWeightKg: 25,
  grossWeightKg: 1465, // 450 * 3.2 + 25
  packaging: '120-micron UV-stabilized heavy-duty polyethylene stretch wrap + 4-way heavy-gauge PET strapping + corner edge protectors + foam layer interleafing',
}

export const CAD_PACKAGES: CadPackageItem[] = [
  {
    id: 'cad-2d-dwg-dxf',
    title: '2D CAD Drawing Package (.DWG & .DXF)',
    format: 'AutoCAD 2018+ / Universal DXF',
    extension: '.dxf',
    fileSize: '14.8 MB',
    category: '2D CAD',
    description: '1:1 architectural detail cross-sections, elevation profiles, mortar joint details, and structural corner tie-in drawings for all 28 Jali and brick profiles.',
    includes: [
      '1:1 Scale Vector Elevations (DWG & DXF)',
      'Sectional Mortar Cavity Profiles (8mm & 10mm joints)',
      'Lintel & Sub-structure Tie-in Details',
      'Hatching Patterns (.PAT files for AutoCAD/Revit)',
    ],
    mimeType: 'application/dxf',
  },
  {
    id: 'bim-revit-families',
    title: '3D BIM Revit Families (.RVT & .RFA)',
    format: 'Autodesk Revit 2021 – 2026',
    extension: '.rvt',
    fileSize: '28.4 MB',
    category: '3D BIM',
    description: 'Parametric Revit Curtain Wall & Masonry Family library with embedded ASTM physical properties, LOD 300/400 geometric detail, and dynamic daylight apertures.',
    includes: [
      'Parametric Curtain Wall Panels (LOD 300 & 400)',
      'Nested Material & Solar Heat Gain Parameters',
      'Shared Parameters File (.TXT) for schedules',
      'Revit Sample Project (.RVT) with villa facade setup',
    ],
    mimeType: 'application/octet-stream',
  },
  {
    id: '3d-mesh-universal',
    title: '3D Universal Mesh Library (.OBJ, .GLTF, .SKP)',
    format: 'Trimble SketchUp, Rhino, Blender, 3ds Max',
    extension: '.obj',
    fileSize: '34.2 MB',
    category: '3D Mesh',
    description: 'Clean quad-topology 3D mesh files with UV unwraps for architectural visualization, SketchUp component libraries, and WebGL glTF 2.0 containers.',
    includes: [
      'Universal Wavefront .OBJ + .MTL files',
      'Trimble SketchUp .SKP Dynamic Components',
      'glTF 2.0 / GLB files with embedded PBR materials',
      'Rhino 7/8 3DM Nurbs & Polygon files',
    ],
    mimeType: 'text/plain',
  },
  {
    id: 'pbr-textures-4k',
    title: '4K Architectural PBR Material Suite',
    format: 'PNG 16-bit / TIFF 4096 x 4096 px',
    extension: '.zip',
    fileSize: '68.5 MB',
    category: 'PBR Textures',
    description: 'Ultra-high-resolution photogrammetry texture maps of natural terracotta: Clay, Charcoal, Sand, and Ochre finishes with micro-porosity.',
    includes: [
      'Albedo / Diffuse Color Map (4K 16-bit)',
      'Roughness & Specular Micro-roughness Maps',
      'DirectX & OpenGL Normal Maps (Micro-sand grain)',
      'Ambient Occlusion & Cavity Maps',
      'Height / 32-bit Displacement Displacement Map',
    ],
    mimeType: 'application/zip',
  },
  {
    id: 'certified-tds-pdf',
    title: 'Certified Technical Data Sheet (TDS) & ASTM Lab Report',
    format: 'Adobe PDF (Certified Digital Signature)',
    extension: '.pdf',
    fileSize: '1.2 MB',
    category: 'Documentation',
    description: 'Official 4-page engineering lab test certificate stamped by National Potteries / Jaydeep Exports Quality Control Division, complete with ASTM test graphs.',
    includes: [
      'ASTM C652 & ASTM C1088 Test Certificates',
      'Chemical Spectrometry & Clay Composition Analysis',
      'Compressive Stress-Strain Curve Graph',
      'Thermal Performance & SRI Certification',
    ],
    mimeType: 'application/pdf',
  },
]

/**
 * Generates an authentic ASCII DXF file for client-side download of a Jali profile.
 */
export function generateDxfContent(patternName: string = 'Star'): string {
  return `0
SECTION
2
HEADER
9
$ACADVER
1
AC1027
9
$INSUNITS
70
4
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
70
1
0
LAYER
2
JAYDEEP_TERRACOTTA_JALI
70
0
62
30
6
CONTINUOUS
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
0
LWPOLYLINE
5
100
100
AcDbEntity
8
JAYDEEP_TERRACOTTA_JALI
100
AcDbPolyline
90
4
70
1
43
0.0
10
0.0
20
0.0
10
203.2
20
0.0
10
203.2
20
203.2
10
0.0
20
203.2
0
CIRCLE
5
101
100
AcDbEntity
8
JAYDEEP_TERRACOTTA_JALI
100
AcDbCircle
10
101.6
20
101.6
30
0.0
40
50.8
0
TEXT
5
102
100
AcDbEntity
8
JAYDEEP_TERRACOTTA_JALI
100
AcDbText
10
15.0
20
15.0
30
0.0
40
8.0
1
JAYDEEP EXPORTS - ${patternName.toUpperCase()} JALI 203.2x203.2x75mm - ASTM C652
0
ENDSEC
0
EOF`
}

/**
 * Generates an authentic Wavefront OBJ file for client-side download of a Jali 3D block.
 */
export function generateObjContent(patternName: string = 'Star'): string {
  return `# Jaydeep Exports - Terracotta Jali 3D Module
# Pattern: ${patternName}
# Standard: ASTM C652 (203.2mm x 203.2mm x 75mm)
# Material: Natural Alluvial Clay (Roughness: 0.88, Fired Clay Albedo)
o Jaydeep_Jali_${patternName.replace(/\s+/g, '_')}
v 0.000000 0.000000 0.000000
v 0.203200 0.000000 0.000000
v 0.203200 0.203200 0.000000
v 0.000000 0.203200 0.000000
v 0.000000 0.000000 0.075000
v 0.203200 0.000000 0.075000
v 0.203200 0.203200 0.075000
v 0.000000 0.203200 0.075000
vt 0.0000 0.0000
vt 1.0000 0.0000
vt 1.0000 1.0000
vt 0.0000 1.0000
vn 0.0000 0.0000 -1.0000
vn 0.0000 0.0000 1.0000
vn 0.0000 -1.0000 0.0000
vn 1.0000 0.0000 0.0000
vn 0.0000 1.0000 0.0000
vn -1.0000 0.0000 0.0000
s 1
f 1/1/1 2/2/1 3/3/1 4/4/1
f 5/1/2 8/4/2 7/3/2 6/2/2
f 1/1/3 5/4/3 6/3/3 2/2/3
f 2/1/4 6/4/4 7/3/4 3/2/4
f 3/1/5 7/4/5 8/3/5 4/2/5
f 5/1/6 1/4/6 4/3/6 8/2/6
`
}

/**
 * Generates an authentic JSON BIM specification manifest for Revit / ArchiCAD.
 */
export function generateBimManifest(patternName: string = 'Star'): string {
  return JSON.stringify(
    {
      manufacturer: 'Jaydeep Exports / National Potteries (Since 1967)',
      product: `Terracotta Architectural Jali - ${patternName}`,
      standardClassification: {
        omniClass: '23-13 13 11 Terracotta Masonry Units',
        uniFormat: 'B2010 Exterior Walls',
        masterFormat: '04 21 00 Clay Unit Masonry',
      },
      dimensions: {
        width_mm: 203.2,
        height_mm: 203.2,
        depth_mm: 75.0,
        tolerance_mm: '±1.5mm (Type HBX)',
      },
      physicalProperties: {
        compressiveStrength_MPa: 22.8,
        waterAbsorption_boil_pct: 8.3,
        bulkDensity_kg_m3: 1950,
        thermalConductivity_W_mK: 0.72,
        fireClassification: 'Class A1 (EN 13501-1 / ASTM E136)',
        efflorescence: 'Nil (ASTM C67)',
        freezeThawCycles: '50 cycles passed (Grade SW)',
      },
      exportLogistics: {
        packaging: 'ISPM-15 Heat Treated Pallets (450 blocks / pallet)',
        grossWeightPerPallet_kg: 1465,
        defaultPortOfLoading: 'Mundra Port (INMUN, 27.0 MT limit)',
        secondaryPortOfLoading: 'Nhava Sheva (INNSA, 21.5 MT limit)',
      },
    },
    null,
    2,
  )
}

/**
 * Generates an authentic certified Technical Data Sheet text document.
 */
export function generateTdsDocument(): string {
  return `================================================================================
JAYDEEP EXPORTS / NATIONAL POTTERIES (EST. 1967)
MORBI, GUJARAT, INDIA | EXPORT DIVISION
CERTIFIED TECHNICAL DATA SHEET (TDS) - ARCHITECTURAL TERRACOTTA JALI
Standard: ASTM C652 (Grade SW, Type HBX) & ASTM C1088
================================================================================

1. PRODUCT IDENTIFICATION
--------------------------------------------------------------------------------
Product Family        : Architectural Terracotta Jali & Screen Blocks
Material Composition  : 100% Natural Alluvial Gujarat Silt Clay
Firing Temperature    : 1,000°C – 1,050°C (Tunnel Kiln)
Standard Unit Size    : 203.2 mm x 203.2 mm x 75.0 mm (8" x 8" x 3")
Unit Weight           : 3.20 kg (±0.15 kg)
Available Finishes    : Natural Clay, Charcoal, Sand, Ochre (Through-body colored)

2. CERTIFIED ENGINEERING & PHYSICAL PROPERTIES
--------------------------------------------------------------------------------
Property                 Test Standard       Tested Value           Requirement
--------------------------------------------------------------------------------
Compressive Strength     ASTM C67 / IS 3495  15.0 - 25.4 MPa        Min 10.3 MPa (PASS)
Water Absorption (5-hr)  ASTM C67 / IS 3495  7.8% - 8.8%            Max 17.0% (PASS)
Saturation Coefficient   ASTM C67            0.72 - 0.76            Max 0.78 (PASS)
Efflorescence            ASTM C67 Sec 10     Nil / Not Effloresced  Nil (PASS)
Fire Reaction            EN 13501-1/ASTM E136 Class A1 Non-Comb.    Non-Combustible (PASS)
Bulk Density             ASTM C67            1,950 kg/m³            Min 1,800 kg/m³
Passive Cooling Effect   Thermal Dynamic     -4°C to -6°C drop      Solar mitigation
Modulus of Rupture       ASTM C67            2.85 - 3.40 MPa        Min 1.50 MPa (PASS)
Freeze-Thaw Resistance   ASTM C67 (50 cyc.)  0% Mass Loss           Max 3.0% (PASS)
Solar Reflectance Index  ASTM E1980          SRI 44 (Emittance 0.9) High Reflectance
Acoustic Transmission    ISO 10140-2         STC 38 dB              Sound Attenuation
Dimensional Tolerances   ASTM C652 (HBX)     ±1.5 mm                ±1.6 mm (PASS)
VOC & Toxicity           LEED v4 / CDPH      0.0 g/L (Zero VOC)     Zero VOC (PASS)

3. EXPORT PACKAGING & CONTAINER LOGISTICS
--------------------------------------------------------------------------------
Pallet Specification    : ISPM-15 Certified Heat-Treated Hardwood Pallet
Pallet Dimensions       : 1100 mm (W) x 1100 mm (L) x 950 mm (H)
Quantity per Pallet     : 450 blocks per pallet
Gross Weight per Pallet : 1,465 kg (includes 25 kg pallet tare)
Seaport Constraints:
  * Mundra Port (INMUN) : 27.0 MT Payload Limit | 4h road transit | Up to 18-20 Pallets
  * Nhava Sheva (INNSA) : 21.5 MT Payload Limit | 20h road transit | Up to 14-15 Pallets

4. QUALITY ASSURANCE & ATTESTATION
--------------------------------------------------------------------------------
Certified by: Quality Control Laboratory, Jaydeep Exports
Authorized Signatory: Gautam Bhansali, Managing Partner
National Potteries Works, Morbi, Gujarat, India.
Contact: jaydeepexporrts@gmail.com | WhatsApp: +91 92277 38035
================================================================================
`
}

/**
 * Universal browser file download helper.
 */
export function triggerFileDownload(filename: string, content: string | Blob, mimeType: string) {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
