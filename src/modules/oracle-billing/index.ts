/**
 * Stream 2: Oracle Invoicing & Finance Adapter
 * Issue #9: Accounts Receivable Payload, Consumable Markups, PO Invoicing
 */

export interface OracleInvoiceLine {
  lineNumber: number;
  description: string;
  quantityHours?: number;
  unitRate?: number;
  lineTotal: number;
  taxCode: string;
}

export interface OracleInvoicePayload {
  sourceSystem: string;
  invoiceNumber: string;
  purchaseOrderNumber: string;
  customerAccountNumber: string;
  currency: string;
  invoiceTotal: number;
  lines: OracleInvoiceLine[];
}

export const BILLING_CONFIG = {
  irataL3RatePerHour: 195.00,
  compositeBladeSpecialistRatePerHour: 145.00,
  safetyWatchRatePerHour: 95.00,
  contractualWeatherStandbyRatePerHour: 90.00,
  consumablesMarkupMultiplier: 1.18, // +18%
  equipmentPassThroughFeeMultiplier: 1.10, // +10%
};

export function generateOracleInvoicePayload(params: {
  workOrderId: string;
  poNumber: string;
  customerAccount: string;
  l3Hours: number;
  standbyHours: number;
  consumablesCost: number;
  skyliftCost: number;
}): OracleInvoicePayload {
  const laborLine: OracleInvoiceLine = {
    lineNumber: 1,
    description: "IRATA L3 Composite Repair Lead Labor",
    quantityHours: params.l3Hours,
    unitRate: BILLING_CONFIG.irataL3RatePerHour,
    lineTotal: params.l3Hours * BILLING_CONFIG.irataL3RatePerHour,
    taxCode: "TAX_EXEMPT_FIELD_SERVICE"
  };

  const standbyLine: OracleInvoiceLine = {
    lineNumber: 2,
    description: "Billable Weather Standby Hold (Anemometer > 10m/s)",
    quantityHours: params.standbyHours,
    unitRate: BILLING_CONFIG.contractualWeatherStandbyRatePerHour,
    lineTotal: params.standbyHours * BILLING_CONFIG.contractualWeatherStandbyRatePerHour,
    taxCode: "TAX_EXEMPT_FIELD_SERVICE"
  };

  const consumablesLine: OracleInvoiceLine = {
    lineNumber: 3,
    description: "Composite Epoxy Resin & Triaxial Fabric (+18% markup)",
    lineTotal: Number((params.consumablesCost * BILLING_CONFIG.consumablesMarkupMultiplier).toFixed(2)),
    taxCode: "STANDARD_VAT_0"
  };

  const equipmentLine: OracleInvoiceLine = {
    lineNumber: 4,
    description: "100m Skylift Crane Pass-through (+10% handling fee)",
    lineTotal: Number((params.skyliftCost * BILLING_CONFIG.equipmentPassThroughFeeMultiplier).toFixed(2)),
    taxCode: "STANDARD_VAT_0"
  };

  const lines = [laborLine, standbyLine, consumablesLine, equipmentLine];
  const invoiceTotal = lines.reduce((acc, l) => acc + l.lineTotal, 0);

  return {
    sourceSystem: "LeadingEdge_FSM",
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    purchaseOrderNumber: params.poNumber,
    customerAccountNumber: params.customerAccount,
    currency: "USD",
    invoiceTotal: Number(invoiceTotal.toFixed(2)),
    lines
  };
}
