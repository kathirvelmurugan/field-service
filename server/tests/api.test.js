/**
 * Automated Test Suite for Leading Edge FSM Backend
 */
import test from 'node:test';
import assert from 'node:assert';
import { calculateTimecardPay } from '../../dist/server/src/modules/workforce/index.js';
import { calculate50To1Scarf } from '../../dist/server/src/modules/qms-repair/index.js';
import { generateOracleInvoicePayload } from '../../dist/server/src/modules/oracle-billing/index.js';
import { determineRequiredDoaTier } from '../../dist/server/src/modules/doa-approval/index.js';

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
