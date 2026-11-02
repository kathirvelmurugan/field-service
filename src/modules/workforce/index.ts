/**
 * Stream 1: Workforce Time & Absence Module
 * Issue #8: Per Diem Stipends, Plus Hazard Pay & Weather Standby
 */
import { RolePersona } from '../../types/domain';

export interface DailyTimeCard {
  id: string;
  technicianId: string;
  technicianName: string;
  date: string; // YYYY-MM-DD
  travelHours: number;
  workHours: number;
  climbingPlusHazardHours: number;
  weatherStandbyHours: number;
  perDiemEligible: boolean;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

export const WORKFORCE_CONFIG = {
  baseHourlyRate: 45.00,
  plusHazardDifferentialPerHour: 25.00, // Tower climbing / rope differential
  dailyPerDiemStipend: 120.00, // Flat meal & lodging allowance (>50 miles)
  weatherStandbyHourlyRate: 45.00, // 100% guaranteed base rate
};

export function calculateTechnicianPay(timeCard: DailyTimeCard): number {
  const travelPay = timeCard.travelHours * WORKFORCE_CONFIG.baseHourlyRate;
  const regularWorkPay = timeCard.workHours * WORKFORCE_CONFIG.baseHourlyRate;
  const hazardPlusPay = timeCard.climbingPlusHazardHours * WORKFORCE_CONFIG.plusHazardDifferentialPerHour;
  const standbyPay = timeCard.weatherStandbyHours * WORKFORCE_CONFIG.weatherStandbyHourlyRate;
  const perDiem = timeCard.perDiemEligible ? WORKFORCE_CONFIG.dailyPerDiemStipend : 0;

  return travelPay + regularWorkPay + hazardPlusPay + standbyPay + perDiem;
}
