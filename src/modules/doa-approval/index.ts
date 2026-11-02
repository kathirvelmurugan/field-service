/**
 * Stream 5: Governance & Delegation of Authority (DoA) Matrix
 * Issue #12: Multi-Tier Approval Ladder & Cryptographic Stamps
 */

export type DoaTierLevel = 'tier_1_supervisor' | 'tier_2_project_manager' | 'tier_3_vp_operations';

export interface DoaApprovalRecord {
  id: string;
  documentType: 'field_work_order' | 'repair_quotation' | 'oracle_invoice';
  amountUsd: number;
  requiredTier: DoaTierLevel;
  approvedBy: string;
  pinVerified: boolean;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function determineRequiredDoaTier(amountUsd: number): DoaTierLevel {
  if (amountUsd <= 5000) {
    return 'tier_1_supervisor';
  } else if (amountUsd <= 25000) {
    return 'tier_2_project_manager';
  } else {
    return 'tier_3_vp_operations';
  }
}

export function evaluateDoaApproval(amountUsd: number, approvedByRole: string): boolean {
  const neededTier = determineRequiredDoaTier(amountUsd);

  if (neededTier === 'tier_1_supervisor') {
    return ['supervisor', 'project_manager', 'vp_operations'].includes(approvedByRole);
  }
  if (neededTier === 'tier_2_project_manager') {
    return ['project_manager', 'vp_operations'].includes(approvedByRole);
  }
  return approvedByRole === 'vp_operations';
}
