/**
 * Stream 4: QMS Composite Repair & Quality System
 * Issue #11: 50:1 Scarf Calculator, Cure Profile, and BIRR Package
 */

export interface ScarfCalculationResult {
  defectDepthMm: number;
  scarfRatio: number; // 50 (50:1)
  totalBevelWidthMm: number;
  halfBevelMm: number; // per side
  requiredPliesCount: number;
  plyOrientationSchedule: string[];
}

export function calculate50To1Scarf(damageDepthMm: number): ScarfCalculationResult {
  const scarfRatio = 50;
  const totalBevelWidthMm = Number((damageDepthMm * scarfRatio).toFixed(1));
  const halfBevelMm = Number((totalBevelWidthMm / 2).toFixed(1));
  
  // Rule: 1 ply per ~0.6mm laminate thickness
  const requiredPliesCount = Math.max(2, Math.ceil(damageDepthMm / 0.6));
  
  const plyOrientationSchedule = [
    "Ply 1: Triaxial 800g/m² [0°/±45°]",
    "Ply 2: Triaxial 800g/m² [0°/±45°]",
    "Ply 3: Biaxial 600g/m² [±45°]",
    "Ply 4: Triaxial 800g/m² [0°/±45°]",
    "Ply 5: Protective Surface Veil Scrim"
  ];

  return {
    defectDepthMm: damageDepthMm,
    scarfRatio,
    totalBevelWidthMm,
    halfBevelMm,
    requiredPliesCount,
    plyOrientationSchedule
  };
}

export const CURE_PROFILE_SPEC = {
  rampRateMaxDegCPerMin: 1.0,
  dwellTemperatureTargetDegC: 70.0,
  dwellDurationHours: 4.0,
  vacuumThresholdBar: -0.85,
  minLpsContinuityResistanceOhms: 0.50
};
