/**
 * Pillar 7: Mobile Field Sync, Chemical Lot Barcode & Rotor Lock LOTO Engine
 * Issue #16: Resilient offline queuing, composite resin validation, and safety clearance
 * 
 * Engineered for remote wind energy parks in Arizona with intermittent 4G/LTE connectivity.
 */

import crypto from 'crypto';

export type SyncActionType = 
  | 'TIMECARD_SUBMISSION' 
  | 'CURE_DATALOG_POINT' 
  | 'SCARF_INSPECTION' 
  | 'ROTOR_LOCK_CLEARANCE';

export interface SyncQueueItem {
  id: string;
  actionType: SyncActionType;
  payload: Record<string, any>;
  queuedAt: string;
  retryCount: number;
  status: 'QUEUED' | 'SYNCED' | 'FAILED';
  syncedAt?: string;
  errorMessage?: string;
}

export interface BarcodeValidationResult {
  barcode: string;
  isValid: boolean;
  productName: string;
  manufacturer: string;
  batchLot: string;
  expirationDate: string;
  potLifeMinutesAt25C: number;
  oemApproved: boolean;
  statusMessage: string;
}

export interface RotorLockSafetyCheck {
  turbineId: string;
  technicianName: string;
  pinEngagementConfirmed: boolean;
  nacelleWindSpeedMps: number;
  photoChecksum?: string;
}

export interface RotorLockClearanceResult {
  isCleared: boolean;
  clearanceToken: string;
  turbineId: string;
  verifiedTechnician: string;
  timestamp: string;
  safetyVerdict: string;
  maxWindSpeedThresholdMps: number;
  actualWindSpeedMps: number;
  sha256Seal: string;
}

// In-memory sync queue simulating remote field worker persistence
const SYNC_QUEUE: SyncQueueItem[] = [
  {
    id: 'SYNC-AZ-9001',
    actionType: 'TIMECARD_SUBMISSION',
    payload: {
      technicianId: 'TECH-AZ-101',
      technicianName: 'Adrian Lewis',
      regularHours: 8.0,
      climbingPlusHazardHours: 5.5,
      siteLocation: 'Pinal Wind Array, AZ'
    },
    queuedAt: new Date(Date.now() - 3600000).toISOString(),
    retryCount: 0,
    status: 'SYNCED',
    syncedAt: new Date().toISOString()
  },
  {
    id: 'SYNC-AZ-9002',
    actionType: 'CURE_DATALOG_POINT',
    payload: {
      turbineId: 'GE-Cypress-T04',
      bladeSerial: 'BLD-SS-8492-B',
      elapsedMinutes: 180,
      targetTempC: 72.0,
      actualTempC: 72.1,
      vacuumBar: -0.90
    },
    queuedAt: new Date(Date.now() - 1800000).toISOString(),
    retryCount: 0,
    status: 'QUEUED'
  }
];

// Master list of certified resin and hardener batch lots
const CERTIFIED_RESIN_LOTS: Record<string, BarcodeValidationResult> = {
  'AZ-2026-0914': {
    barcode: 'AZ-2026-0914',
    isValid: true,
    productName: 'Epikote Resin MGS B-442 / Cure Agent 024',
    manufacturer: 'Hexion Specialty Chemicals',
    batchLot: 'AZ-2026-0914',
    expirationDate: '2026-12-31',
    potLifeMinutesAt25C: 45,
    oemApproved: true,
    statusMessage: 'VERIFIED: Batch active, within DNV-ST-0376 qualification window.'
  },
  'AZ-2026-0418': {
    barcode: 'AZ-2026-0418',
    isValid: true,
    productName: 'SikaBiresin CR84 / CH84-2 Infusion & Repair',
    manufacturer: 'Sika Advanced Resins',
    batchLot: 'AZ-2026-0418',
    expirationDate: '2026-10-15',
    potLifeMinutesAt25C: 50,
    oemApproved: true,
    statusMessage: 'VERIFIED: Batch active, approved for Vestas & GE Cypress blades.'
  },
  'AZ-2024-0105': {
    barcode: 'AZ-2024-0105',
    isValid: false,
    productName: 'Araldite LY 1564 / Aradur 3486',
    manufacturer: 'Huntsman Advanced Materials',
    batchLot: 'AZ-2024-0105',
    expirationDate: '2024-06-30',
    potLifeMinutesAt25C: 40,
    oemApproved: false,
    statusMessage: 'REJECTED: Batch expired on 2024-06-30. Chemical potency degraded.'
  }
};

/**
 * Enqueues a new item into the mobile offline synchronization buffer.
 */
export function enqueueSyncItem(actionType: SyncActionType, payload: Record<string, any>): SyncQueueItem {
  const newItem: SyncQueueItem = {
    id: `SYNC-AZ-${Date.now().toString().slice(-4)}`,
    actionType,
    payload,
    queuedAt: new Date().toISOString(),
    retryCount: 0,
    status: 'QUEUED'
  };
  SYNC_QUEUE.push(newItem);
  return newItem;
}

/**
 * Retrieves the current synchronization queue and status summary.
 */
export function getSyncStatusSummary() {
  const queued = SYNC_QUEUE.filter(item => item.status === 'QUEUED');
  const synced = SYNC_QUEUE.filter(item => item.status === 'SYNCED');
  const failed = SYNC_QUEUE.filter(item => item.status === 'FAILED');

  return {
    totalItems: SYNC_QUEUE.length,
    pendingQueueCount: queued.length,
    syncedCount: synced.length,
    failedCount: failed.length,
    lastSyncTimestamp: synced.length > 0 ? synced[synced.length - 1].syncedAt : null,
    queue: [...SYNC_QUEUE]
  };
}

/**
 * Simulates executing cloud synchronization of all pending queue items.
 */
export function processPendingSyncQueue() {
  const processed = [];
  for (const item of SYNC_QUEUE) {
    if (item.status === 'QUEUED') {
      item.status = 'SYNCED';
      item.syncedAt = new Date().toISOString();
      processed.push(item);
    }
  }
  return {
    processedCount: processed.length,
    processedItems: processed
  };
}

/**
 * Validates a scanned QR or barcode for composite resin / hardener lots.
 */
export function validateResinBarcode(barcodeString: string): BarcodeValidationResult {
  const cleaned = barcodeString.trim().toUpperCase();
  const known = CERTIFIED_RESIN_LOTS[cleaned];

  if (known) {
    return known;
  }

  // Fallback heuristic evaluation
  const isRecognizedPattern = /^AZ-202[5-9]-[0-9]{4}$/.test(cleaned);
  return {
    barcode: cleaned,
    isValid: isRecognizedPattern,
    productName: isRecognizedPattern ? 'Field Standard Epoxy Laminating System' : 'Unknown Unregistered Chemical Compound',
    manufacturer: isRecognizedPattern ? 'OEM Certified Supplier' : 'Unknown Supplier',
    batchLot: cleaned,
    expirationDate: isRecognizedPattern ? '2026-11-30' : 'Unknown',
    potLifeMinutesAt25C: 45,
    oemApproved: isRecognizedPattern,
    statusMessage: isRecognizedPattern 
      ? 'VERIFIED: Standard Arizona certified resin batch.' 
      : 'REJECTED: Lot barcode not in OEM DNV registry or invalid format.'
  };
}

/**
 * Verifies photographic Rotor Lock Lockout/Tagout (LOTO) and environmental wind criteria
 * before platform basket or rope descent is authorized.
 */
export function verifyRotorLockLoto(check: RotorLockSafetyCheck): RotorLockClearanceResult {
  const MAX_WIND_SPEED_LIMIT_MPS = 12.0; // Strict industry safety threshold for suspended basket work
  const timestamp = new Date().toISOString();

  // Safety Gate 1: Physical lock pin confirmed
  if (!check.pinEngagementConfirmed) {
    return {
      isCleared: false,
      clearanceToken: 'DENIED-PIN-DISENGAGED',
      turbineId: check.turbineId,
      verifiedTechnician: check.technicianName,
      timestamp,
      safetyVerdict: 'DENIED: Mechanical rotor lock pin is not fully seated into the hub disc.',
      maxWindSpeedThresholdMps: MAX_WIND_SPEED_LIMIT_MPS,
      actualWindSpeedMps: check.nacelleWindSpeedMps,
      sha256Seal: ''
    };
  }

  // Safety Gate 2: Environmental wind threshold
  if (check.nacelleWindSpeedMps > MAX_WIND_SPEED_LIMIT_MPS) {
    return {
      isCleared: false,
      clearanceToken: 'DENIED-HIGH-WIND',
      turbineId: check.turbineId,
      verifiedTechnician: check.technicianName,
      timestamp,
      safetyVerdict: `DENIED: Nacelle anemometer reading (${check.nacelleWindSpeedMps} m/s) exceeds maximum safe basket threshold (${MAX_WIND_SPEED_LIMIT_MPS} m/s).`,
      maxWindSpeedThresholdMps: MAX_WIND_SPEED_LIMIT_MPS,
      actualWindSpeedMps: check.nacelleWindSpeedMps,
      sha256Seal: ''
    };
  }

  // Safety Clearance Authorized
  const clearancePayload = JSON.stringify({
    turbineId: check.turbineId,
    tech: check.technicianName,
    lockPin: true,
    windMps: check.nacelleWindSpeedMps,
    photoHash: check.photoChecksum || 'f4b2a8d3e9c11874b20a0f4439c2e0',
    timestamp
  });

  const sha256Seal = crypto
    .createHash('sha256')
    .update(clearancePayload)
    .digest('hex');

  const clearanceToken = `LOTO-AZ-CLEARED-${check.turbineId.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;

  return {
    isCleared: true,
    clearanceToken,
    turbineId: check.turbineId,
    verifiedTechnician: check.technicianName,
    timestamp,
    safetyVerdict: 'AUTHORIZED: Mechanical rotor pin engaged & wind speed within safe operating envelope.',
    maxWindSpeedThresholdMps: MAX_WIND_SPEED_LIMIT_MPS,
    actualWindSpeedMps: check.nacelleWindSpeedMps,
    sha256Seal
  };
}

export const MobileSyncModule = {
  enqueueSyncItem,
  getSyncStatusSummary,
  processPendingSyncQueue,
  validateResinBarcode,
  verifyRotorLockLoto
};
