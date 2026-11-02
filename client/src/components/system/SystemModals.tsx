import React from 'react';

interface ModalWrapperProps {
  title: string;
  badge: string;
  subtitle: string;
  icon: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  title,
  badge,
  subtitle,
  icon,
  onClose,
  children,
}) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">{title}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                {badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-all"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
        {children}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-200 flex justify-end bg-slate-50/50">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all shadow"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export const IntegrationLogsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const logs = [
    {
      id: 'OUT-TX-9841',
      system: 'Oracle Financials AR',
      endpoint: '/api/oracle-ar/invoice',
      status: 'SUCCESS (200 OK)',
      timestamp: '2026-11-02 23:14:02 UTC',
      payloadSummary: 'WO-AZ-7842 Invoice $3,480.20 (Consumables +18.4% markup)',
      retryCount: 0,
    },
    {
      id: 'OUT-TX-9840',
      system: 'ADP / Workday Payroll Feed',
      endpoint: '/api/timecards/sync',
      status: 'SUCCESS (200 OK)',
      timestamp: '2026-11-02 22:45:18 UTC',
      payloadSummary: '5 Approved Field Timecards ($764.30 gross each)',
      retryCount: 0,
    },
    {
      id: 'OUT-TX-9839',
      system: 'DNV Compliance Archive',
      endpoint: '/api/reports/birr/generate',
      status: 'SUCCESS (200 OK)',
      timestamp: '2026-11-02 21:30:00 UTC',
      payloadSummary: 'BIRR-DNV-2026-AZ7842 Cryptographic SHA-256 seal verified',
      retryCount: 0,
    },
  ];

  return (
    <ModalWrapper
      title="Outbound ERP Integration Logs"
      badge="Active Data Stream"
      subtitle="Automated synchronization logs for Oracle Financials, ADP, and DNV Compliance"
      icon="📡"
      onClose={onClose}
    >
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900">{log.id} • {log.system}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {log.status}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 font-mono">{log.endpoint}</div>
            <p className="text-[11px] text-slate-700">{log.payloadSummary}</p>
            <div className="text-[10px] text-slate-400">Timestamp: {log.timestamp} • Retries: {log.retryCount}</div>
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};

export const AttendanceClosePeriodsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const periods = [
    { period: 'Pay Period 22 (Current)', dates: 'Oct 26 - Nov 08, 2026', cutoff: 'Nov 09, 2026 12:00 PM MST', status: 'OPEN FOR APPROVAL' },
    { period: 'Pay Period 21', dates: 'Oct 12 - Oct 25, 2026', cutoff: 'Oct 26, 2026 12:00 PM MST', status: 'LOCKED & RECONCILED' },
    { period: 'Pay Period 20', dates: 'Sep 28 - Oct 11, 2026', cutoff: 'Oct 12, 2026 12:00 PM MST', status: 'AUDITED & ARCHIVED' },
  ];

  return (
    <ModalWrapper
      title="Attendance & PTO Close Periods"
      badge="Arizona Operations"
      subtitle="Master calendar for weekly timecard lockouts, field approvals, and payroll freeze schedules"
      icon="📅"
      onClose={onClose}
    >
      <div className="space-y-3">
        {periods.map((p, idx) => (
          <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">{p.period}</div>
              <div className="text-[11px] text-slate-500">{p.dates}</div>
              <div className="text-[10px] text-amber-700 font-medium">Cutoff: {p.cutoff}</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
              p.status.includes('OPEN') ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-700'
            }`}>
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};

export const TrainingRequirementsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const certs = [
    { course: 'GWO Working at Heights', validity: '24 Months', requiredFor: 'All Technicians', minLevel: 'Certified' },
    { course: 'IRATA / SPRAT Rope Access Level 3', validity: '36 Months', requiredFor: 'Lead Blade Specialists', minLevel: 'Level 3 Supervisor' },
    { course: 'DNV-ST-0376 Composite Blade Repair', validity: '12 Months', requiredFor: 'Structural Technicians', minLevel: '50:1 Scarf Certified' },
    { course: 'Lockout/Tagout (LOTO) Rotor Pin Gate', validity: 'Annual', requiredFor: 'All Site Personnel', minLevel: 'Authorized' },
  ];

  return (
    <ModalWrapper
      title="Safety & Training Course Requirements"
      badge="GWO / IRATA Standard"
      subtitle="Mandatory certifications required before dispatch to Arizona wind array sites"
      icon="🛡️"
      onClose={onClose}
    >
      <div className="space-y-3">
        {certs.map((c, i) => (
          <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900">{c.course}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {c.validity}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 flex justify-between">
              <span>Audience: <strong>{c.requiredFor}</strong></span>
              <span className="text-sky-700 font-semibold">{c.minLevel}</span>
            </div>
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};
