/**
 * Automated Test Suite for Leading Edge FSM Backend
 */
import test from 'node:test';
import assert from 'node:assert';
import { calculateTimecardPay } from '../../dist/server/src/modules/workforce/index.js';
import { calculate50To1Scarf } from '../../dist/server/src/modules/qms-repair/index.js';
import { generateOracleInvoicePayload } from '../../dist/server/src/modules/oracle-billing/index.js';
import { determineRequiredDoaTier } from '../../dist/server/src/modules/doa-approval/index.js';
import { calculateFleetKpis, generateBirrCertificate } from '../../dist/server/src/modules/reporting/index.js';
import { 
  enqueueSyncItem, 
  getSyncStatusSummary, 
  processPendingSyncQueue, 
  validateResinBarcode, 
  verifyRotorLockLoto 
} from '../../dist/server/src/modules/mobile-sync/index.js';

test('Workforce: calculates timecard pay with neutralized rates and plus hazard', () => {
  const result = calculateTimecardPay({
    regularHours: 8,
    travelHours: 1.5,
    climbingPlusHazardHours: 5.5,
    weatherStandbyHours: 0,
    perDiemEligible: true
  });

  assert.strictEqual(typeof result.grossPay, 'number');
  assert.ok(result.grossPay > 600, 'Gross pay should exceed $600 with Per Diem and Plus Pay');
  assert.strictEqual(result.perDiemPay, 118.50);
});

test('QMS Repair: calculates 50:1 scarf bevel geometry accurately', () => {
  const depth = 3.6;
  const scarf = calculate50To1Scarf(depth, 600, 140);

  assert.strictEqual(scarf.scarfRatio, 50);
  assert.strictEqual(scarf.totalBevelWidthMm, 180.0);
  assert.strictEqual(scarf.halfBevelMm, 90.0);
  assert.strictEqual(scarf.requiredPliesCount, 6);
});

test('Oracle AR: generates valid invoice payload with +18.4% consumables markup', () => {
  const invoice = generateOracleInvoicePayload({
    workOrderId: 'WO-AZ-7842',
    poNumber: 'PO-AZ-7842',
    customerAccount: 'CUST-001',
    customerName: 'Southwest Wind LLC',
    irataL3Hours: 10,
    bladeTechHours: 0,
    standbyHours: 0,
    consumablesCostUsd: 1000,
    skyliftCraneCostUsd: 500
  });

  assert.strictEqual(invoice.currency, 'USD');
  assert.strictEqual(invoice.paymentTerms, 'NET_30');
  const consumablesLine = invoice.lines.find(l => l.itemCode === 'MAT-PASS-THRU');
  assert.ok(consumablesLine, 'Consumables line must exist');
  assert.strictEqual(consumablesLine.lineTotalUsd, 1184.00); // 1000 * 1.184
});

test('DoA Matrix: routes financial amounts to the proper approval tier', () => {
  assert.strictEqual(determineRequiredDoaTier(3500).tier, 'tier_1_supervisor');
  assert.strictEqual(determineRequiredDoaTier(15000).tier, 'tier_2_project_manager');
  assert.strictEqual(determineRequiredDoaTier(50000).tier, 'tier_3_vp_operations');
});

test('Reporting: calculates neutralized fleet KPIs within operational tolerances', () => {
  const kpis = calculateFleetKpis();
  assert.strictEqual(kpis.totalTurbinesMonitored, 118);
  assert.ok(kpis.fleetAvailabilityPercent > 90, 'Fleet availability must exceed 90%');
  assert.strictEqual(kpis.fleetAvailabilityPercent, 94.6);
  assert.strictEqual(kpis.avoidedStandbyHours, 84.5);
  assert.strictEqual(kpis.standbyCostSavingsUsd, 38400.00);
  assert.strictEqual(kpis.lpsContinuityPassRatePercent, 100.0);
  assert.ok(Array.isArray(kpis.regionalBreakdown));
  assert.ok(kpis.regionalBreakdown.length >= 3);
});

test('Reporting: generates DNV-ST-0376 BIRR certificate with valid SHA-256 seal', () => {
  const cert = generateBirrCertificate({
    workOrderId: 'WO-AZ-7842',
    turbineSerial: 'GE-Cypress-T04',
    bladeSerial: 'BLD-SS-8492-B',
    leadTechnicianName: 'Adrian Lewis',
    oemSiteLeadName: 'V. Prasanth'
  });

  assert.strictEqual(cert.standard, 'DNV-ST-0376');
  assert.strictEqual(cert.status, 'CERTIFIED_READY_FOR_COMMISSIONING');
  assert.strictEqual(cert.site.state, 'Arizona');
  assert.strictEqual(cert.signatories.leadTechnician.name, 'Adrian Lewis');
  assert.strictEqual(cert.signatories.oemSiteQualityLead.name, 'V. Prasanth');
  assert.strictEqual(cert.qaValidation.lpsContinuityResistanceOhms, 0.18);
  assert.ok(cert.cryptographicSha256, 'SHA-256 seal must be present');
  assert.strictEqual(cert.cryptographicSha256.length, 64, 'SHA-256 must be a 64-char hex string');
  assert.match(cert.cryptographicSha256, /^[a-f0-9]{64}$/);
});

test('Mobile Sync: enqueues items and processes pending sync buffer', () => {
  const item = enqueueSyncItem('SCARF_INSPECTION', {
    turbineId: 'GE-Cypress-T04',
    bladeSpanM: 71.2,
    defectDepthMm: 3.6,
    bevelRatio: 50
  });

  assert.ok(item.id.startsWith('SYNC-AZ-'));
  assert.strictEqual(item.status, 'QUEUED');

  const beforeSync = getSyncStatusSummary();
  assert.ok(beforeSync.pendingQueueCount >= 1);

  const processResult = processPendingSyncQueue();
  assert.ok(processResult.processedCount >= 1);

  const afterSync = getSyncStatusSummary();
  assert.strictEqual(afterSync.pendingQueueCount, 0);
});

test('Mobile Sync: validates resin barcodes against DNV qualification registry', () => {
  const validHexion = validateResinBarcode('AZ-2026-0914');
  assert.strictEqual(validHexion.isValid, true);
  assert.strictEqual(validHexion.oemApproved, true);
  assert.ok(validHexion.productName.includes('Hexion') || validHexion.productName.includes('Epikote'));

  const expiredResin = validateResinBarcode('AZ-2024-0105');
  assert.strictEqual(expiredResin.isValid, false);
  assert.ok(expiredResin.statusMessage.includes('REJECTED') || expiredResin.statusMessage.includes('expired'));

  const invalidCode = validateResinBarcode('INVALID-RESIN-CODE');
  assert.strictEqual(invalidCode.isValid, false);
  assert.strictEqual(invalidCode.oemApproved, false);
});

test('Mobile Sync: verifies Rotor Lock LOTO safety gates and cryptographic clearance', () => {
  // Gate 1: Safe condition - pin engaged, 6.4 m/s wind speed (< 12 m/s limit)
  const cleared = verifyRotorLockLoto({
    turbineId: 'GE-Cypress-T04',
    technicianName: 'Adrian Lewis',
    pinEngagementConfirmed: true,
    nacelleWindSpeedMps: 6.4
  });
  assert.strictEqual(cleared.isCleared, true);
  assert.ok(cleared.clearanceToken.startsWith('LOTO-AZ-CLEARED-'));
  assert.strictEqual(cleared.sha256Seal.length, 64);

  // Gate 2: Pin disengaged -> rejected
  const pinDisengaged = verifyRotorLockLoto({
    turbineId: 'GE-Cypress-T04',
    technicianName: 'Adrian Lewis',
    pinEngagementConfirmed: false,
    nacelleWindSpeedMps: 5.0
  });
  assert.strictEqual(pinDisengaged.isCleared, false);
  assert.strictEqual(pinDisengaged.clearanceToken, 'DENIED-PIN-DISENGAGED');

  // Gate 3: High wind > 12 m/s -> rejected
  const highWind = verifyRotorLockLoto({
    turbineId: 'GE-Cypress-T04',
    technicianName: 'Adrian Lewis',
    pinEngagementConfirmed: true,
    nacelleWindSpeedMps: 14.8
  });
  assert.strictEqual(highWind.isCleared, false);
  assert.strictEqual(highWind.clearanceToken, 'DENIED-HIGH-WIND');
});
