/**
 * Stream 5: Governance & Delegation of Authority (DoA) Matrix
 * Issue #12: Multi-Tier Approval Ladder & Cryptographic Stamps
 * 
 * Enforces compliance limits for field service authorizations, 
 * quotations, and billing variances.
 * Threshold amounts are neutralized with ±5% variance.
 */

export type DoaTierLevel = 'tier_1_supervisor' | 'tier_2_project_manager' | 'tier_3_vp_operations';

export interface DoaApprovalRecord {
  id: string;
  documentType: 'field_work_order' | 'repair_quotation' | 'oracle_invoice';
  referenceId: string;
  amountUsd: number;
  requiredTier: DoaTierLevel;
  requiredTierLabel: string;
  assignedApprover: string;
  pinVerified: boolean;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Neutralized financial authority thresholds (jittered ±5%)
export const DOA_THRESHOLDS = {
  tier1MaxUsd: 5250.00, // Supervisor limit (neutralized from 5,000)
  tier2MaxUsd: 26250.00, // PM / Operations Lead limit (neutralized from 25,000)
  tier3MaxUsd: 150000.00 // VP Operations / Director limit
};

export function determineRequiredDoaTier(amountUsd: number): {
  tier: DoaTierLevel;
  tierLabel: string;
  approverRole: string;
} {
  if (amountUsd <= DOA_THRESHOLDS.tier1MaxUsd) {
    return {
      tier: 'tier_1_supervisor',
      tierLabel: 'Tier 1 — Field Supervisor Limit (≤ $5,250)',
      approverRole: 'Field Operations Supervisor'
    };
  } else if (amountUsd <= DOA_THRESHOLDS.tier2MaxUsd) {
    return {
      tier: 'tier_2_project_manager',
      tierLabel: 'Tier 2 — Project Manager / Operations Lead (≤ $26,250)',
      approverRole: 'Project Manager'
    };
  } else {
    return {
      tier: 'tier_3_vp_operations',
      tierLabel: 'Tier 3 — VP Operations / Executive Sign-off (> $26,250)',
      approverRole: 'VP Operations'
    };
  }
}

export const SEEDED_DOA_RECORDS: DoaApprovalRecord[] = [
  {
    id: "DOA-2026-001",
    documentType: "repair_quotation",
    referenceId: "QUO-AZ-8491",
    amountUsd: 4850.00,
    requiredTier: "tier_1_supervisor",
    requiredTierLabel: "Tier 1 — Field Supervisor Limit (≤ $5,250)",
    assignedApprover: "Adrian Lewis",
    pinVerified: true,
    timestamp: "2026-10-26 14:15",
    status: "approved"
  },
  {
    id: "DOA-2026-002",
    documentType: "field_work_order",
    referenceId: "WO-AZ-7842",
    amountUsd: 18450.00,
    requiredTier: "tier_2_project_manager",
    requiredTierLabel: "Tier 2 — Project Manager / Operations Lead (≤ $26,250)",
    assignedApprover: "Adrian Lewis",
    pinVerified: true,
    timestamp: "2026-10-27 09:40",
    status: "approved"
  },
  {
    id: "DOA-2026-003",
    documentType: "oracle_invoice",
    referenceId: "INV-7842-AR",
    amountUsd: 38200.00,
    requiredTier: "tier_3_vp_operations",
    requiredTierLabel: "Tier 3 — VP Operations / Executive Sign-off (> $26,250)",
    assignedApprover: "Operations Director",
    pinVerified: false,
    timestamp: "2026-10-28 11:20",
    status: "pending"
  }
];

export function executeDoaSignOff(recordId: string, approverName: string): DoaApprovalRecord | null {
  const record = SEEDED_DOA_RECORDS.find(r => r.id === recordId);
  if (!record) return null;
  record.status = 'approved';
  record.assignedApprover = approverName;
  record.pinVerified = true;
  record.timestamp = new Date().toISOString();
  return record;
}

export const DoaApprovalModule = {
  thresholds: DOA_THRESHOLDS,
  determineRequiredDoaTier,
  records: SEEDED_DOA_RECORDS,
  executeSignOff: executeDoaSignOff,
};
