/**
 * Stream 3: Asset Management & Component Hierarchy
 * Issue #10: Multi-Tier OEM Model & Component Mapping
 */

export interface ComponentHierarchyNode {
  id: string;
  name: string;
  layer: 'root' | 'spar_cap' | 'shear_web' | 'shell_ss' | 'shell_ps' | 'leading_edge' | 'trailing_edge' | 'lps_receptor';
  material: 'carbon_unidirectional' | 'glass_triaxial' | 'balsa_wood' | 'pvc_foam' | 'copper';
  inspectionIntervalMonths: number;
}

export interface TurbineBladeAsset {
  oemName: string; // e.g. "GE Wind Energy", "Vestas", "Siemens Gamesa"
  turbineModel: string; // e.g. "Cypress 3.8-130"
  bladeModel: string; // e.g. "AeroBlade 78.5m"
  lengthMeters: number;
  hierarchies: ComponentHierarchyNode[];
}

export const SAMPLE_BLADE_TAXONOMY: TurbineBladeAsset = {
  oemName: "GE Wind Energy",
  turbineModel: "Cypress 3.8-130",
  bladeModel: "AeroBlade 78.5m",
  lengthMeters: 78.5,
  hierarchies: [
    { id: "NODE-01", name: "Root Extruded Flange", layer: "root", material: "glass_triaxial", inspectionIntervalMonths: 12 },
    { id: "NODE-02", name: "High-Modulus Main Spar Cap", layer: "spar_cap", material: "carbon_unidirectional", inspectionIntervalMonths: 6 },
    { id: "NODE-03", name: "Internal Shear Web Sandwich", layer: "shear_web", material: "pvc_foam", inspectionIntervalMonths: 12 },
    { id: "NODE-04", name: "Suction Side (SS) Aerodynamic Shell", layer: "shell_ss", material: "balsa_wood", inspectionIntervalMonths: 6 },
    { id: "NODE-05", name: "Erosion Protected Leading Edge (LEP)", layer: "leading_edge", material: "glass_triaxial", inspectionIntervalMonths: 6 },
    { id: "NODE-06", name: "Lightning Protection Receptor & Down-Conductor", layer: "lps_receptor", material: "copper", inspectionIntervalMonths: 6 }
  ]
};
