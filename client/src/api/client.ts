/**
 * Leading Edge FSM - Typed REST API Client
 * Connects React UI to Express Backend API (/api/*)
 */

export interface TimeCardRecord {
  id: string;
  technicianId: string;
  technicianName: string;
  date: string;
  siteLocation: string;
  workOrderRef: string;
  regularHours: number;
  travelHours: number;
  climbingPlusHazardHours: number;
  weatherStandbyHours: number;
  perDiemEligible: boolean;
  perDiemStipend: number;
  grossPay: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  approverComments?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ScarfResult {
  defectDepthMm: number;
  scarfRatio: number;
  totalBevelWidthMm: number;
  halfBevelMm: number;
  requiredPliesCount: number;
  plyOrientationSchedule: {
    plyIndex: number;
    fabricType: string;
    orientation: string;
    dimensionsMm: string;
  }[];
  resinMixRequirements: {
    baseEpoxyGrams: number;
    hardenerGrams: number;
    mixRatio: string;
    potLifeAt25CMinutes: number;
  };
}

export const apiClient = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getTimecards(): Promise<{ records: TimeCardRecord[]; totalRecords: number }> {
    const res = await fetch('/api/timecards');
    return res.json();
  },

  async approveTimecard(id: string, approverName = 'Adrian Lewis (Operations Lead)') {
    const res = await fetch(`/api/timecards/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approverName }),
    });
    return res.json();
  },

  async batchApprove(ids: string[], approverName = 'Adrian Lewis (Operations Lead)') {
    const res = await fetch('/api/timecards/batch-approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, approverName }),
    });
    return res.json();
  },

  async calculateScarf(depthMm: number, lengthMm: number, widthMm: number): Promise<ScarfResult> {
    const res = await fetch('/api/qms/scarf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ depthMm, lengthMm, widthMm }),
    });
    return res.json();
  },

  async getTaxonomy() {
    const res = await fetch('/api/taxonomy');
    return res.json();
  },

  async getDoaRecords() {
    const res = await fetch('/api/doa/records');
    return res.json();
  },

  async getPortfolioSummary() {
    const res = await fetch('/api/portfolio/summary');
    return res.json();
  },
};
