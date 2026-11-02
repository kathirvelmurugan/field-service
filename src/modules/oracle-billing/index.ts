/**
 * Stream 2: Oracle Invoicing & Finance Adapter
 * Issue #9: Accounts Receivable Payload, Consumable Markups, PO Line Matching
 * 
 * Compliant with Oracle Fusion / EBS Accounts Receivable standards.
 * All pricing, markup rates, and PO figures are neutralized with ±5% variance.
 */

export interface OracleInvoiceLine {
  lineNumber: number;
  itemCode: string;
  description: string;
  quantity: number;
  unitOfMeasure: 'HRS' | 'DAY' | 'EA' | 'LOT';
  unitRateUsd: number;
  lineTotalUsd: number;
  taxCode: string; // e.g. "US_AZ_EXEMPT"
  glAccountCode: string; // e.g. "01-410-6200-BLD-REPAIR"
}

export interface OracleInvoicePayload {
  sourceSystem: 'LEADING_EDGE_FSM';
  transactionType: 'WIND_FIELD_SERVICE_INVOICE';
  invoiceNumber: string;
  purchaseOrderNumber: string;
  customerAccountNumber: string;
  customerName: string;
  currency: 'USD';
  invoiceDate: string; // YYYY-MM-DD
  paymentTerms: 'NET_30';
  subtotalLaborUsd: number;
  subtotalPassThroughUsd: number;
  invoiceTotalUsd: number;
  approvalStatus: 'VALIDATED' | 'AWAITING_DOA' | 'TRANSMITTED';
  lines: OracleInvoiceLine[];
}

// Neutralized benchmark rates (jittered ±5%)
export const BILLING_CONFIG = {
  irataL3RatePerHour: 188.50, // Neutralized IRATA Level 3 Lead rate
  compositeBladeSpecialistRatePerHour: 148.20, // Composite technician billable rate
  safetyWatchRatePerHour: 92.50, // Ground safety watch rate
  contractualWeatherStandbyRatePerHour: 88.00, // Client-billable weather standby rate
  consumablesMarkupMultiplier: 1.184, // +18.4% contractual markup
  equipmentPassThroughFeeMultiplier: 1.098, // +9.8% equipment handling fee
};

// Neutralized enhancement project budget tracking (jittered ±5% to safeguard client quote)
export const ENHANCEMENT_PORTFOLIO_NEUTRALIZED = [
  { project: "Oracle-LE Invoicing Integration", budgetedHours: 1320, costUsd: 59180.00 },
  { project: "Site Management Mobile Application", budgetedHours: 235, costUsd: 21350.00 },
  { project: "QMS FS Composite Repair Engine", budgetedHours: 690, costUsd: 51480.00 },
  { project: "Per Diem & Plus Payments Module", budgetedHours: 510, costUsd: 46250.00 },
  { project: "Technician Training & Certs Sync", budgetedHours: 260, costUsd: 23450.00 },
  { project: "Operational Status BI Reporting", budgetedHours: 145, costUsd: 15380.00 },
  { project: "Field Kick-off Template BD", budgetedHours: 315, costUsd: 28720.00 },
  { project: "Field Service Resource Planning", budgetedHours: 730, costUsd: 48600.00 },
  { project: "Database Cost Quotation Engine", budgetedHours: 1290, costUsd: 54920.00 },
  { project: "Quotation Approvals & DoA Matrix", budgetedHours: 1390, costUsd: 56120.00 },
];

export function calculateNeutralizedPortfolioTotal(): number {
  return ENHANCEMENT_PORTFOLIO_NEUTRALIZED.reduce((acc, item) => acc + item.costUsd, 0);
}

export function generateOracleInvoicePayload(params: {
  workOrderId: string;
  poNumber: string;
  customerAccount: string;
  customerName: string;
  irataL3Hours: number;
  bladeTechHours: number;
  standbyHours: number;
  consumablesCostUsd: number;
  skyliftCraneCostUsd: number;
}): OracleInvoicePayload {
  const l3Total = Number((params.irataL3Hours * BILLING_CONFIG.irataL3RatePerHour).toFixed(2));
  const techTotal = Number((params.bladeTechHours * BILLING_CONFIG.compositeBladeSpecialistRatePerHour).toFixed(2));
  const standbyTotal = Number((params.standbyHours * BILLING_CONFIG.contractualWeatherStandbyRatePerHour).toFixed(2));
  
  const markedUpConsumables = Number((params.consumablesCostUsd * BILLING_CONFIG.consumablesMarkupMultiplier).toFixed(2));
  const markedUpEquipment = Number((params.skyliftCraneCostUsd * BILLING_CONFIG.equipmentPassThroughFeeMultiplier).toFixed(2));

  const subtotalLabor = Number((l3Total + techTotal + standbyTotal).toFixed(2));
  const subtotalPassThrough = Number((markedUpConsumables + markedUpEquipment).toFixed(2));
  const invoiceTotal = Number((subtotalLabor + subtotalPassThrough).toFixed(2));

  const lines: OracleInvoiceLine[] = [
    {
      lineNumber: 1,
      itemCode: "SRV-IRATA-L3",
      description: "IRATA Level 3 Composite Repair Lead Labor",
      quantity: params.irataL3Hours,
      unitOfMeasure: "HRS",
      unitRateUsd: BILLING_CONFIG.irataL3RatePerHour,
      lineTotalUsd: l3Total,
      taxCode: "US_AZ_EXEMPT",
      glAccountCode: "01-410-6200-BLD-REPAIR"
    },
    {
      lineNumber: 2,
      itemCode: "SRV-TECH-COMP",
      description: "Composite Blade Specialist Repair Labor",
      quantity: params.bladeTechHours,
      unitOfMeasure: "HRS",
      unitRateUsd: BILLING_CONFIG.compositeBladeSpecialistRatePerHour,
      lineTotalUsd: techTotal,
      taxCode: "US_AZ_EXEMPT",
      glAccountCode: "01-410-6200-BLD-REPAIR"
    },
    {
      lineNumber: 3,
      itemCode: "SRV-STANDBY-WX",
      description: "Contractual Weather Standby (Wind Hold > 10.0 m/s)",
      quantity: params.standbyHours,
      unitOfMeasure: "HRS",
      unitRateUsd: BILLING_CONFIG.contractualWeatherStandbyRatePerHour,
      lineTotalUsd: standbyTotal,
      taxCode: "US_AZ_EXEMPT",
      glAccountCode: "01-410-6210-WX-STANDBY"
    },
    {
      lineNumber: 4,
      itemCode: "MAT-PASS-THRU",
      description: "Infusion Resin & Glass Reinforcements (with +18.4% markup)",
      quantity: 1,
      unitOfMeasure: "LOT",
      unitRateUsd: markedUpConsumables,
      lineTotalUsd: markedUpConsumables,
      taxCode: "US_AZ_TAXABLE",
      glAccountCode: "01-140-5100-MAT-PASSTHRU"
    },
    {
      lineNumber: 5,
      itemCode: "EQP-PASS-THRU",
      description: "34m Bronto Skylift Platform Rental (with +9.8% handling fee)",
      quantity: 1,
      unitOfMeasure: "LOT",
      unitRateUsd: markedUpEquipment,
      lineTotalUsd: markedUpEquipment,
      taxCode: "US_AZ_TAXABLE",
      glAccountCode: "01-140-5200-EQP-PASSTHRU"
    }
  ];

  return {
    sourceSystem: "LEADING_EDGE_FSM",
    transactionType: "WIND_FIELD_SERVICE_INVOICE",
    invoiceNumber: `INV-${params.workOrderId.replace('WO-', '')}-AR`,
    purchaseOrderNumber: params.poNumber,
    customerAccountNumber: params.customerAccount,
    customerName: params.customerName,
    currency: "USD",
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentTerms: "NET_30",
    subtotalLaborUsd: subtotalLabor,
    subtotalPassThroughUsd: subtotalPassThrough,
    invoiceTotalUsd: invoiceTotal,
    approvalStatus: "VALIDATED",
    lines
  };
}

export const OracleBillingModule = {
  config: BILLING_CONFIG,
  portfolio: ENHANCEMENT_PORTFOLIO_NEUTRALIZED,
  generateInvoice: generateOracleInvoicePayload,
  calculatePortfolioTotal: calculateNeutralizedPortfolioTotal,
};
