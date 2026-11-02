/**
 * Leading Edge FSM - Enterprise REST API Server
 * Supporting Phase 1 Foundation & Issue #13
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Shared modular engines
import { 
  SEEDED_TIMECARDS, 
  calculateTimecardPay, 
  approveTimeCard, 
  WORKFORCE_CONFIG 
} from '../src/modules/workforce/index.js';

import { 
  BILLING_CONFIG, 
  generateOracleInvoicePayload, 
  ENHANCEMENT_PORTFOLIO_NEUTRALIZED, 
  calculateNeutralizedPortfolioTotal 
} from '../src/modules/oracle-billing/index.js';

import { 
  OEM_PORTFOLIO, 
  findComponentBySpan 
} from '../src/modules/asset-taxonomy/index.js';

import { 
  calculate50To1Scarf, 
  generateSampleCureTelemetry, 
  compileBirrPackage, 
  CURE_PROFILE_SPEC 
} from '../src/modules/qms-repair/index.js';

import { 
  DOA_THRESHOLDS, 
  SEEDED_DOA_RECORDS, 
  determineRequiredDoaTier, 
  executeDoaSignOff 
} from '../src/modules/doa-approval/index.js';

import { 
  calculateFleetKpis, 
  generateBirrCertificate 
} from '../src/modules/reporting/index.js';

import { 
  enqueueSyncItem, 
  getSyncStatusSummary, 
  processPendingSyncQueue, 
  validateResinBarcode, 
  verifyRotorLockLoto 
} from '../src/modules/mobile-sync/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Health & Readiness Probe
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    version: '2026.2.0-enterprise',
    service: 'Leading Edge FSM API Engine',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 2. Workforce & Timecard APIs (Stream 1)
app.get('/api/timecards', (req: Request, res: Response) => {
  res.json({
    config: WORKFORCE_CONFIG,
    records: SEEDED_TIMECARDS,
    totalRecords: SEEDED_TIMECARDS.length,
  });
});

app.post('/api/timecards/:id/approve', (req: Request, res: Response) => {
  const { id } = req.params;
  const approver = req.body.approverName || 'Adrian Lewis (Operations Lead)';
  const updated = approveTimeCard(id, approver);
  if (!updated) {
    return res.status(404).json({ error: `Timecard ${id} not found` });
  }
  res.json({ success: true, record: updated });
});

app.post('/api/timecards/batch-approve', (req: Request, res: Response) => {
  const { ids, approverName } = req.body;
  const targetIds: string[] = Array.isArray(ids) ? ids : [];
  const approver = approverName || 'Adrian Lewis (Operations Lead)';
  const approvedCards = [];

  for (const id of targetIds) {
    const card = approveTimeCard(id, approver);
    if (card) approvedCards.push(card);
  }

  res.json({
    success: true,
    approvedCount: approvedCards.length,
    approvedRecords: approvedCards,
  });
});

app.post('/api/timecards/calculate', (req: Request, res: Response) => {
  const { regularHours, travelHours, climbingPlusHazardHours, weatherStandbyHours, perDiemEligible } = req.body;
  const pay = calculateTimecardPay({
    regularHours: Number(regularHours) || 0,
    travelHours: Number(travelHours) || 0,
    climbingPlusHazardHours: Number(climbingPlusHazardHours) || 0,
    weatherStandbyHours: Number(weatherStandbyHours) || 0,
    perDiemEligible: Boolean(perDiemEligible),
  });
  res.json(pay);
});

// 3. Oracle AR Invoicing APIs (Stream 2)
app.post('/api/oracle-ar/invoice', (req: Request, res: Response) => {
  const { workOrderId, poNumber, customerAccount, customerName, irataL3Hours, bladeTechHours, standbyHours, consumablesCostUsd, skyliftCraneCostUsd } = req.body;
  
  const payload = generateOracleInvoicePayload({
    workOrderId: workOrderId || 'WO-AZ-7842',
    poNumber: poNumber || 'PO-AZ-7842',
    customerAccount: customerAccount || 'CUST-WIND-9021',
    customerName: customerName || 'Southwest Wind Holdings LLC',
    irataL3Hours: Number(irataL3Hours) || 10.0,
    bladeTechHours: Number(bladeTechHours) || 0.0,
    standbyHours: Number(standbyHours) || 0.0,
    consumablesCostUsd: Number(consumablesCostUsd) || 940.0,
    skyliftCraneCostUsd: Number(skyliftCraneCostUsd) || 440.0,
  });

  res.json(payload);
});

// 4. Asset Management & OEM Taxonomy (Stream 3)
app.get('/api/taxonomy', (req: Request, res: Response) => {
  res.json({
    assets: OEM_PORTFOLIO,
  });
});

app.get('/api/taxonomy/span-lookup', (req: Request, res: Response) => {
  const oemIndex = Number(req.query.oemIndex) || 0;
  const span = Number(req.query.span) || 71.2;
  const nodes = findComponentBySpan(oemIndex, span);
  res.json({
    spanMeters: span,
    matchingComponents: nodes,
  });
});

// 5. QMS Composite Repair APIs (Stream 4)
app.post('/api/qms/scarf', (req: Request, res: Response) => {
  const depth = Number(req.body.depthMm) || 3.6;
  const length = Number(req.body.lengthMm) || 620;
  const width = Number(req.body.widthMm) || 140;

  const result = calculate50To1Scarf(depth, length, width);
  res.json(result);
});

app.get('/api/qms/cure-telemetry', (req: Request, res: Response) => {
  const telemetry = generateSampleCureTelemetry();
  res.json({
    specification: CURE_PROFILE_SPEC,
    readings: telemetry,
  });
});

app.post('/api/qms/birr-package', (req: Request, res: Response) => {
  const { workOrderId, turbineSerial, bladeSerial, leadTech, siteLead } = req.body;
  const pkg = compileBirrPackage({
    workOrderId: workOrderId || 'WO-AZ-7842',
    turbineSerial: turbineSerial || 'GE-Cypress-T04 (78.5m)',
    bladeSerial: bladeSerial || 'BLD-SS-8492-B',
    leadTech: leadTech || 'Adrian Lewis (IRATA L3)',
    siteLead: siteLead || 'V. Prasanth (Site Lead)',
  });
  res.json(pkg);
});

// 6. Delegation of Authority (Stream 5)
app.get('/api/doa/records', (req: Request, res: Response) => {
  res.json({
    thresholds: DOA_THRESHOLDS,
    records: SEEDED_DOA_RECORDS,
  });
});

app.post('/api/doa/sign-off', (req: Request, res: Response) => {
  const { recordId, approverName } = req.body;
  const updated = executeDoaSignOff(recordId, approverName || 'Adrian Lewis');
  if (!updated) {
    return res.status(404).json({ error: `DoA record ${recordId} not found` });
  }
  res.json({ success: true, record: updated });
});

// 7. Neutralized Portfolio Overview
app.get('/api/portfolio/summary', (req: Request, res: Response) => {
  res.json({
    totalNeutralizedUsd: calculateNeutralizedPortfolioTotal(),
    workPackages: ENHANCEMENT_PORTFOLIO_NEUTRALIZED,
  });
});

// 8. Reporting & DNV-ST-0376 BIRR Certification (Stream 6 / Pillar 6)
app.get('/api/reports/kpis', (req: Request, res: Response) => {
  const kpis = calculateFleetKpis();
  res.json(kpis);
});

app.post('/api/reports/birr/generate', (req: Request, res: Response) => {
  const { 
    workOrderId, 
    turbineSerial, 
    bladeSerial, 
    defectLocationSpanM, 
    defectDepthMm, 
    leadTechnicianName, 
    leadTechnicianCert, 
    oemSiteLeadName, 
    oemSiteLeadCert, 
    resinBatchLot, 
    lpsResistanceOhms 
  } = req.body;

  const certificate = generateBirrCertificate({
    workOrderId,
    turbineSerial,
    bladeSerial,
    defectLocationSpanM: defectLocationSpanM ? Number(defectLocationSpanM) : undefined,
    defectDepthMm: defectDepthMm ? Number(defectDepthMm) : undefined,
    leadTechnicianName,
    leadTechnicianCert,
    oemSiteLeadName,
    oemSiteLeadCert,
    resinBatchLot,
    lpsResistanceOhms: lpsResistanceOhms ? Number(lpsResistanceOhms) : undefined,
  });

  res.json(certificate);
});

// 9. Mobile Field Sync & Safety Verification (Stream 7 / Pillar 7)
app.post('/api/sync/queue', (req: Request, res: Response) => {
  const { actionType, payload } = req.body;
  if (!actionType || !payload) {
    return res.status(400).json({ error: 'actionType and payload are required' });
  }
  const item = enqueueSyncItem(actionType, payload);
  res.json({ success: true, item });
});

app.get('/api/sync/status', (req: Request, res: Response) => {
  const summary = getSyncStatusSummary();
  res.json(summary);
});

app.post('/api/sync/process', (req: Request, res: Response) => {
  const result = processPendingSyncQueue();
  res.json({ success: true, ...result });
});

app.post('/api/qms/validate-barcode', (req: Request, res: Response) => {
  const { barcode } = req.body;
  const result = validateResinBarcode(barcode || '');
  res.json(result);
});

app.post('/api/safety/rotor-lock-verify', (req: Request, res: Response) => {
  const { turbineId, technicianName, pinEngagementConfirmed, nacelleWindSpeedMps, photoChecksum } = req.body;
  const clearance = verifyRotorLockLoto({
    turbineId: turbineId || 'GE-Cypress-T04',
    technicianName: technicianName || 'Adrian Lewis',
    pinEngagementConfirmed: Boolean(pinEngagementConfirmed),
    nacelleWindSpeedMps: nacelleWindSpeedMps !== undefined ? Number(nacelleWindSpeedMps) : 6.4,
    photoChecksum: photoChecksum || undefined,
  });
  res.json(clearance);
});

// Static Asset Delivery
const clientDistPath = path.resolve(process.cwd(), 'dist/client');

app.use(express.static(clientDistPath));

// Fallback to client React SPA index for all non-API routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Leading Edge FSM] Enterprise API Server listening on port ${PORT}`);
});
