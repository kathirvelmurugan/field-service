/**
 * GE Windmill Blade Field Service & Twin-Stream ERP
 * Master Domain Contracts & State Definitions
 * 
 * FROZEN CONTRACT: All parallel feature modules import from this file.
 * Do not modify without cross-module coordination.
 */

// 1. Role Personas
export type RolePersona = 'technician' | 'client_lead' | 'hr_payroll' | 'billing_ops';

// 2. Stage Lifecycle
export type LifecycleStage = 1 | 2 | 3 | 4 | 5 | 6;

// 3. Certification & Tooling (Stage 1)
export interface TechnicianCertification {
  windaId: string;
  technicianName: string;
  gwoBstValid: boolean;
  gwoArtValid: boolean;
  bladeRepairValid: boolean;
  irataLevel: 1 | 2 | 3;
  irataLicenseNo: string;
  expiryDate: string; // ISO 8601
}

export interface ChemicalBatch {
  epoxyBatchNumber: string;
  hardenerBatchNumber: string;
  mixRatio: string; // e.g. "100:30"
  shelfLifeRemainingDays: number;
  isExpired: boolean;
  potLifeMinutes: number;
}

// 4. Safety & LOTO (Stage 2)
export interface LotoVerification {
  turbineId: string;
  gpsCoordinates: { latitude: number; longitude: number };
  rotorPinEngaged: boolean;
  rotorPinPhotoHash: string; // SHA-256
  pitchFeatheredAngleDegrees: number; // 90° = feathered
  padlockNumber: string;
  geOperatorSignOff: boolean;
  timestamp: string;
}

export interface WeatherTelemetry {
  windSpeedMps: number;
  windGustMps: number;
  relativeHumidityPercent: number;
  ambientTempC: number;
  substrateTempC: number;
  dewPointC: number;
  isRopeAccessPermitted: boolean; // windSpeed < 10.0 && RH < 70%
  isWeatherStandbyActive: boolean;
}

// 5. Blade Coordinates & Damage (Stage 3)
export type BladeAeroFace = 'SS' | 'PS' | 'LE' | 'TE';
export type DnvDamageCategory = 1 | 2 | 3 | 4 | 5;

export interface BladeDamageDefect {
  id: string;
  spanMeters: number; // 0.0m to 78.5m
  face: BladeAeroFace;
  chordOffsetMm: number;
  category: DnvDamageCategory;
  lengthMm: number;
  widthMm: number;
  depthMm: number;
  tapTestResult: 'solid' | 'delamination' | 'void' | 'water_ingress';
  lpsResistanceOhms?: number;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
}

// 6. Composite Repair & Curing (Stage 4)
export interface CompositeScarfSpecification {
  defectDepthMm: number;
  scarfRatio: number; // 50 (50:1 standard)
  computedBevelWidthMm: number; // defectDepthMm * 50
  plySchedule: {
    plyNumber: number;
    fabricType: 'Triaxial 800g' | 'Biaxial 600g' | 'UD Carbon 600g';
    dimensionsMm: string;
  }[];
  vacuumLevelBar: number; // Must be < -0.85 bar
  dwellTemperatureC: number; // 70°C nominal
  dwellDurationHours: number; // 4.0 hrs nominal
}

// 7. BIRR Report & Sign-off (Stage 5)
export interface BirrReportPackage {
  reportId: string;
  turbineSerial: string;
  bladeSerial: string;
  leadTechnicianSignature: string;
  geClientSiteLeadSignature: string;
  signOffTimestamp: string;
  lotoReleaseAuthorized: boolean;
  pdfCryptographicHash: string;
}

// 8. Twin-Stream Calculation (Stage 6)
export interface TwinStreamFinancials {
  streamA_Payroll: {
    travelHours: number;
    travelPayRate: number;
    climbingHazardHours: number;
    climbingHazardPayRate: number; // Base + Hazard differential
    standbyHours: number;
    standbyPayRate: number;
    perDiemTotal: number;
    totalTechnicianPay: number;
  };
  streamB_Billing: {
    billableLaborHours: number;
    msaRatePerHour: number;
    billableStandbyHours: number;
    msaStandbyRatePerHour: number;
    consumablesCost: number;
    consumablesContractualMarkupPercent: number; // e.g. 18%
    equipmentPassThroughCost: number;
    equipmentHandlingFeePercent: number; // e.g. 10%
    warrantyStatus: 'warranty_reserve' | 'client_billable';
    totalClientInvoice: number;
  };
  reconciledGrossMarginDollars: number;
  reconciledGrossMarginPercent: number;
}
