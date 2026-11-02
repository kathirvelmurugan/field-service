/**
 * Stream 3: Asset Management & Component Hierarchy
 * Issue #10: Multi-Tier OEM Model & Blade Component Mapping
 * 
 * Supports Wind Turbine Asset trees, Blade Coordinate zoning, and Bill of Materials.
 */

export interface ComponentHierarchyNode {
  id: string;
  code: string;
  name: string;
  layer: 'root' | 'spar_cap' | 'shear_web' | 'shell_ss' | 'shell_ps' | 'leading_edge' | 'trailing_edge' | 'lps_receptor';
  material: 'carbon_unidirectional' | 'glass_triaxial' | 'balsa_wood' | 'pvc_foam' | 'copper';
  spanRangeMeters: [number, number];
  inspectionIntervalMonths: number;
  criticalityScore: 1 | 2 | 3 | 4 | 5; // 5 = Flight-critical
}

export interface TurbineBladeAsset {
  oemName: string; // e.g. "GE Wind Energy", "Vestas", "Siemens Gamesa"
  turbineModel: string; // e.g. "Cypress 3.8-130", "V162-6.2 MW"
  bladeModel: string; // e.g. "AeroBlade 78.5m"
  lengthMeters: number;
  maxChordMeters: number;
  weightTonnes: number;
  hierarchies: ComponentHierarchyNode[];
}

export const OEM_PORTFOLIO: TurbineBladeAsset[] = [
  {
    oemName: "GE Wind Energy",
    turbineModel: "Cypress 3.8-130 / 5.3-158",
    bladeModel: "AeroBlade 78.5m (LM 77.4P Class)",
    lengthMeters: 78.5,
    maxChordMeters: 4.2,
    weightTonnes: 19.4,
    hierarchies: [
      {
        id: "NODE-GE-01",
        code: "RT-FLANGE",
        name: "Extruded Root Stud Flange & T-Bolts",
        layer: "root",
        material: "glass_triaxial",
        spanRangeMeters: [0.0, 4.5],
        inspectionIntervalMonths: 12,
        criticalityScore: 5
      },
      {
        id: "NODE-GE-02",
        code: "SPAR-CAP-UD",
        name: "High-Modulus Carbon Infused Spar Cap",
        layer: "spar_cap",
        material: "carbon_unidirectional",
        spanRangeMeters: [4.5, 68.0],
        inspectionIntervalMonths: 6,
        criticalityScore: 5
      },
      {
        id: "NODE-GE-03",
        code: "WEB-STRUCT",
        name: "Internal Dual Shear Web (PVC / Balsa Core)",
        layer: "shear_web",
        material: "pvc_foam",
        spanRangeMeters: [6.0, 72.0],
        inspectionIntervalMonths: 12,
        criticalityScore: 4
      },
      {
        id: "NODE-GE-04",
        code: "SHELL-SS",
        name: "Suction Side (SS) Aerodynamic Laminate",
        layer: "shell_ss",
        material: "balsa_wood",
        spanRangeMeters: [0.0, 78.5],
        inspectionIntervalMonths: 6,
        criticalityScore: 3
      },
      {
        id: "NODE-GE-05",
        code: "SHELL-PS",
        name: "Pressure Side (PS) Aerodynamic Laminate",
        layer: "shell_ps",
        material: "balsa_wood",
        spanRangeMeters: [0.0, 78.5],
        inspectionIntervalMonths: 6,
        criticalityScore: 3
      },
      {
        id: "NODE-GE-06",
        code: "LE-EROSION",
        name: "Leading Edge Protection (LEP Polyurethane)",
        layer: "leading_edge",
        material: "glass_triaxial",
        spanRangeMeters: [35.0, 78.5],
        inspectionIntervalMonths: 6,
        criticalityScore: 4
      },
      {
        id: "NODE-GE-07",
        code: "TE-BONDLINE",
        name: "Trailing Edge Structural Adhesive Bondline",
        layer: "trailing_edge",
        material: "glass_triaxial",
        spanRangeMeters: [10.0, 76.0],
        inspectionIntervalMonths: 6,
        criticalityScore: 4
      },
      {
        id: "NODE-GE-08",
        code: "LPS-CONDUCT",
        name: "Lightning Protection Receptor Pucks (Cu 50mm²)",
        layer: "lps_receptor",
        material: "copper",
        spanRangeMeters: [50.0, 78.5],
        inspectionIntervalMonths: 6,
        criticalityScore: 5
      }
    ]
  },
  {
    oemName: "Vestas",
    turbineModel: "EnVentus V162-6.2 MW",
    bladeModel: "AeroOptima 79.3m",
    lengthMeters: 79.3,
    maxChordMeters: 4.4,
    weightTonnes: 21.2,
    hierarchies: [
      {
        id: "NODE-VES-01",
        code: "V-ROOT",
        name: "Pre-formed Glass Root Ring",
        layer: "root",
        material: "glass_triaxial",
        spanRangeMeters: [0.0, 5.0],
        inspectionIntervalMonths: 12,
        criticalityScore: 5
      },
      {
        id: "NODE-VES-02",
        code: "V-SPAR",
        name: "Pultruded Carbon Plank Spar Cap",
        layer: "spar_cap",
        material: "carbon_unidirectional",
        spanRangeMeters: [5.0, 70.0],
        inspectionIntervalMonths: 6,
        criticalityScore: 5
      }
    ]
  }
];

export function findComponentBySpan(oemIndex: number, spanMeters: number): ComponentHierarchyNode[] {
  const asset = OEM_PORTFOLIO[oemIndex] || OEM_PORTFOLIO[0];
  return asset.hierarchies.filter(node => 
    spanMeters >= node.spanRangeMeters[0] && spanMeters <= node.spanRangeMeters[1]
  );
}
