/**
 * Stream 1: Workforce Time & Absence Module
 * Issue #8: Per Diem Stipends, Plus Hazard Pay & Weather Standby Engine
 * 
 * Compliant with Arizona Field Service Operations & Client Portal Alignment.
 * Note: All rates and numbers are neutralized with ±5% variance.
 */

import { RolePersona } from '../../types/domain.js';

export interface DailyTimeCard {
  id: string;
  technicianId: string;
  technicianName: string;
  date: string; // YYYY-MM-DD
  siteLocation: string; // e.g. "Mesquite Wind Farm, AZ"
  workOrderRef: string;
  regularHours: number;
  travelHours: number;
  climbingPlusHazardHours: number; // Rope-access tower climbing
  weatherStandbyHours: number; // Wind hold > 10 m/s
  perDiemEligible: boolean; // Remote travel > 50 miles
  perDiemStipend: number;
  grossPay: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  approverComments?: string;
  approvedBy?: string;
  approvedAt?: string;
}

// Neutralized benchmark rates (jittered ±5% to safeguard confidential client data)
export const WORKFORCE_CONFIG = {
  baseHourlyRate: 46.80, // Neutralized base rate
  plusHazardDifferentialPerHour: 25.40, // High-angle rope access differential
  dailyPerDiemStipend: 118.50, // Neutralized lodging/meals allowance
  weatherStandbyHourlyRate: 44.10, // 100% guaranteed base standby rate
  overtimeMultiplier: 1.5,
  maxDailyStandardHours: 8.0,
};

export function calculateTimecardPay(card: {
  regularHours: number;
  travelHours: number;
  climbingPlusHazardHours: number;
  weatherStandbyHours: number;
  perDiemEligible: boolean;
}): {
  basePay: number;
  hazardPlusPay: number;
  standbyPay: number;
  perDiemPay: number;
  grossPay: number;
} {
  const basePay = Number(((card.regularHours + card.travelHours) * WORKFORCE_CONFIG.baseHourlyRate).toFixed(2));
  const hazardPlusPay = Number((card.climbingPlusHazardHours * WORKFORCE_CONFIG.plusHazardDifferentialPerHour).toFixed(2));
  const standbyPay = Number((card.weatherStandbyHours * WORKFORCE_CONFIG.weatherStandbyHourlyRate).toFixed(2));
  const perDiemPay = card.perDiemEligible ? WORKFORCE_CONFIG.dailyPerDiemStipend : 0.00;
  const grossPay = Number((basePay + hazardPlusPay + standbyPay + perDiemPay).toFixed(2));

  return {
    basePay,
    hazardPlusPay,
    standbyPay,
    perDiemPay,
    grossPay,
  };
}

// Seeded Arizona Field Technicians (Scrubbed and aligned with client portal screenshots)
export const SEEDED_TIMECARDS: DailyTimeCard[] = [
  {
    id: "TC-2026-1021",
    technicianId: "TECH-AZ-041",
    technicianName: "Adrian Lewis",
    date: "2026-10-26",
    siteLocation: "Coconino Plateau, AZ",
    workOrderRef: "WO-AZ-7841",
    regularHours: 8.0,
    travelHours: 1.5,
    climbingPlusHazardHours: 5.5,
    weatherStandbyHours: 0.0,
    perDiemEligible: true,
    perDiemStipend: 118.50,
    grossPay: 703.10,
    status: "approved",
    approverComments: "TTPAY automated PTO / Regular inspection verified",
    approvedBy: "Adrian Lewis (Lead)",
    approvedAt: "2026-10-26 17:30"
  },
  {
    id: "TC-2026-1022",
    technicianId: "TECH-AZ-041",
    technicianName: "Adrian Lewis",
    date: "2026-10-27",
    siteLocation: "Coconino Plateau, AZ",
    workOrderRef: "WO-AZ-7841",
    regularHours: 6.0,
    travelHours: 0.0,
    climbingPlusHazardHours: 6.0,
    weatherStandbyHours: 2.0,
    perDiemEligible: true,
    perDiemStipend: 118.50,
    grossPay: 640.40,
    status: "approved",
    approverComments: "Wind gust hold > 11.2 m/s logged in morning",
    approvedBy: "Adrian Lewis (Lead)",
    approvedAt: "2026-10-27 18:00"
  },
  {
    id: "TC-2026-1023",
    technicianId: "TECH-AZ-088",
    technicianName: "Emmanuel Arcon Gonzalez",
    date: "2026-10-26",
    siteLocation: "Mesquite Wind Hub, AZ",
    workOrderRef: "WO-AZ-7842",
    regularHours: 8.0,
    travelHours: 2.0,
    climbingPlusHazardHours: 7.0,
    weatherStandbyHours: 0.0,
    perDiemEligible: true,
    perDiemStipend: 118.50,
    grossPay: 764.30,
    status: "approved",
    approverComments: "Cat 4 Scarf preparation on GE 78.5m blade",
    approvedBy: "Adrian Lewis (Lead)",
    approvedAt: "2026-10-26 18:15"
  },
  {
    id: "TC-2026-1024",
    technicianId: "TECH-AZ-092",
    technicianName: "David Nunez",
    date: "2026-10-27",
    siteLocation: "Mesquite Wind Hub, AZ",
    workOrderRef: "WO-AZ-7842",
    regularHours: 8.0,
    travelHours: 0.0,
    climbingPlusHazardHours: 4.5,
    weatherStandbyHours: 3.5,
    perDiemEligible: true,
    perDiemStipend: 118.50,
    grossPay: 659.25,
    status: "submitted",
    approverComments: "Pending supervisor signoff on standby duration"
  },
  {
    id: "TC-2026-1025",
    technicianId: "TECH-AZ-105",
    technicianName: "Marcus Vance",
    date: "2026-10-28",
    siteLocation: "Dry Lake Wind Site, AZ",
    workOrderRef: "WO-AZ-7845",
    regularHours: 8.0,
    travelHours: 1.0,
    climbingPlusHazardHours: 6.0,
    weatherStandbyHours: 0.0,
    perDiemEligible: true,
    perDiemStipend: 118.50,
    grossPay: 692.10,
    status: "submitted",
    approverComments: "IRATA L3 rigging supervisor hours"
  }
];

export function approveTimeCard(id: string, approverName: string): DailyTimeCard | null {
  const card = SEEDED_TIMECARDS.find(c => c.id === id);
  if (!card) return null;
  card.status = 'approved';
  card.approvedBy = approverName;
  card.approvedAt = new Date().toISOString();
  return card;
}

export const WorkforcePayModule = {
  config: WORKFORCE_CONFIG,
  calculatePay: calculateTimecardPay,
  approveCard: approveTimeCard,
  seededCards: SEEDED_TIMECARDS,
};
