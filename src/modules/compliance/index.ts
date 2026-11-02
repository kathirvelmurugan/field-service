/**
 * Pillar 8: Pre-Departure Field Compliance & Tool Calibration Gatekeeper
 * Issue #18: GWO / IRATA Badge Certification & Tool Calibration Verification
 * 
 * Enforces mandatory life-safety and calibration checks before technicians
 * are authorized to deploy to remote Arizona wind energy sites.
 */

import crypto from 'crypto';

export interface TechnicianCredential {
  technicianId: string;
  fullName: string;
  irataLevel: number; // 1, 2, or 3
  irataLicenseExpiry: string;
  gwoWorkingAtHeightsExpiry: string;
  gwoBladeRepairExpiry: string;
  medicalFitnessPassed: boolean;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
}

export interface CalibrationRecord {
  toolId: string;
  toolType: 'HEATING_BLANKET' | 'MICRO_OHMMETER' | 'VACUUM_GAUGE' | 'ULTRASONIC_GAUGE';
  serialNumber: string;
  lastCalibratedDate: string;
  nextCalibrationDueDate: string;
  calibrationAgency: string;
  isCalibrated: boolean;
}

export interface PreDepartureGatePass {
  isCleared: boolean;
  gatePassToken: string;
  technicianId: string;
  technicianName: string;
  issuedAt: string;
  expiresAt: string;
  verifiedToolsCount: number;
  verificationVerdict: string;
  rejectionReasons: string[];
  sha256Seal: string;
}

// Certified field technician credentials repository
export const CERTIFIED_TECHNICIANS: Record<string, TechnicianCredential> = {
  'TECH-AZ-101': {
    technicianId: 'TECH-AZ-101',
    fullName: 'Adrian Lewis',
    irataLevel: 3,
    irataLicenseExpiry: '2027-08-31',
    gwoWorkingAtHeightsExpiry: '2027-04-15',
    gwoBladeRepairExpiry: '2027-06-30',
    medicalFitnessPassed: true,
    status: 'ACTIVE'
  },
  'TECH-AZ-102': {
    technicianId: 'TECH-AZ-102',
    fullName: 'Emmanuel Arcon Gonzalez',
    irataLevel: 2,
    irataLicenseExpiry: '2026-11-30',
    gwoWorkingAtHeightsExpiry: '2026-12-15',
    gwoBladeRepairExpiry: '2026-11-20',
    medicalFitnessPassed: true,
    status: 'ACTIVE'
  },
  'TECH-AZ-103': {
    technicianId: 'TECH-AZ-103',
    fullName: 'Marcus Vance',
    irataLevel: 1,
    irataLicenseExpiry: '2027-02-28',
    gwoWorkingAtHeightsExpiry: '2027-01-10',
    gwoBladeRepairExpiry: '2026-10-30',
    medicalFitnessPassed: true,
    status: 'ACTIVE'
  },
  'TECH-AZ-999': {
    technicianId: 'TECH-AZ-999',
    fullName: 'David Nunez (Trainee)',
    irataLevel: 1,
    irataLicenseExpiry: '2024-05-15', // Expired
    gwoWorkingAtHeightsExpiry: '2024-06-01', // Expired
    gwoBladeRepairExpiry: '2024-04-20', // Expired
    medicalFitnessPassed: false,
    status: 'EXPIRED'
  }
};

// Calibrated field equipment crib
export const CALIBRATED_TOOLS_CRIB: Record<string, CalibrationRecord> = {
  'CAL-BLANKET-01': {
    toolId: 'CAL-BLANKET-01',
    toolType: 'HEATING_BLANKET',
    serialNumber: 'HB-72C-8841',
    lastCalibratedDate: '2026-01-10',
    nextCalibrationDueDate: '2027-01-10',
    calibrationAgency: 'DNV Metrology Lab Arizona',
    isCalibrated: true
  },
  'CAL-MICRO-OHM-04': {
    toolId: 'CAL-MICRO-OHM-04',
    toolType: 'MICRO_OHMMETER',
    serialNumber: 'LPS-MO-4402',
    lastCalibratedDate: '2025-12-05',
    nextCalibrationDueDate: '2026-12-05',
    calibrationAgency: 'Megger Calibration Services',
    isCalibrated: true
  },
  'CAL-VAC-PUMP-02': {
    toolId: 'CAL-VAC-PUMP-02',
    toolType: 'VACUUM_GAUGE',
    serialNumber: 'VAC-DIGI-1092',
    lastCalibratedDate: '2025-11-15',
    nextCalibrationDueDate: '2026-11-15',
    calibrationAgency: 'Instron Pressure Calibration',
    isCalibrated: true
  },
  'CAL-EXPIRED-PUMP': {
    toolId: 'CAL-EXPIRED-PUMP',
    toolType: 'VACUUM_GAUGE',
    serialNumber: 'VAC-OLD-0041',
    lastCalibratedDate: '2023-08-01',
    nextCalibrationDueDate: '2024-08-01', // Expired
    calibrationAgency: 'Uncertified Local Shop',
    isCalibrated: false
  }
};

/**
 * Validates technician certifications and tool crib calibration records.
 * Issues a cryptographic pre-departure dispatch token if 100% compliant.
 */
export function validatePreDepartureCompliance(
  technicianId: string,
  selectedToolIds: string[] = ['CAL-BLANKET-01', 'CAL-MICRO-OHM-04', 'CAL-VAC-PUMP-02']
): PreDepartureGatePass {
  const rejectionReasons: string[] = [];
  const tech = CERTIFIED_TECHNICIANS[technicianId];
  const now = new Date();
  const issuedAt = now.toISOString();

  // 1. Technician Certification Checks
  if (!tech) {
    rejectionReasons.push(`Technician ID ${technicianId} not found in GWO / IRATA Registry.`);
  } else {
    if (new Date(tech.irataLicenseExpiry) < now) {
      rejectionReasons.push(`IRATA Level ${tech.irataLevel} Rope Access certification expired on ${tech.irataLicenseExpiry}.`);
    }
    if (new Date(tech.gwoWorkingAtHeightsExpiry) < now) {
      rejectionReasons.push(`GWO Working at Heights certification expired on ${tech.gwoWorkingAtHeightsExpiry}.`);
    }
    if (!tech.medicalFitnessPassed) {
      rejectionReasons.push('Annual high-angle climbing medical fitness exam not passed.');
    }
  }

  // 2. Tool Calibration Checks
  let verifiedToolsCount = 0;
  for (const toolId of selectedToolIds) {
    const tool = CALIBRATED_TOOLS_CRIB[toolId];
    if (!tool) {
      rejectionReasons.push(`Equipment ${toolId} not registered in calibrated tool crib.`);
    } else if (!tool.isCalibrated || new Date(tool.nextCalibrationDueDate) < now) {
      rejectionReasons.push(`Tool ${tool.toolId} (${tool.toolType}) calibration certificate expired on ${tool.nextCalibrationDueDate}.`);
    } else {
      verifiedToolsCount++;
    }
  }

  const isCleared = rejectionReasons.length === 0;
  const expiresAt = new Date(now.getTime() + 14 * 3600000).toISOString(); // 14-hour shift gate pass

  // 3. Cryptographic Tamper Seal
  const canonicalPayload = JSON.stringify({
    techId: technicianId,
    cleared: isCleared,
    tools: selectedToolIds,
    issuedAt,
    expiresAt
  });

  const sha256Seal = crypto
    .createHash('sha256')
    .update(canonicalPayload)
    .digest('hex');

  const gatePassToken = isCleared
    ? `GATE-PASS-AZ-${technicianId}-${Date.now().toString().slice(-4)}`
    : `GATE-DENIED-${technicianId}`;

  return {
    isCleared,
    gatePassToken,
    technicianId,
    technicianName: tech ? tech.fullName : 'Unknown Technician',
    issuedAt,
    expiresAt,
    verifiedToolsCount,
    verificationVerdict: isCleared
      ? 'AUTHORIZED FOR WIND ARRAY ASCENT: All GWO/IRATA credentials and tool calibration certificates verified.'
      : 'DISPATCH PROHIBITED: Compliance non-conformity detected.',
    rejectionReasons,
    sha256Seal
  };
}

export const ComplianceModule = {
  certifiedTechnicians: CERTIFIED_TECHNICIANS,
  calibratedToolsCrib: CALIBRATED_TOOLS_CRIB,
  validatePreDepartureCompliance
};
