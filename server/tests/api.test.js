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
