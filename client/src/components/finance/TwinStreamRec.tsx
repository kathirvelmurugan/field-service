import React from 'react';

interface TwinStreamRecProps {
  onOpenOracleModal: () => void;
  onBackToApprovals: () => void;
}

export const TwinStreamRec: React.FC<TwinStreamRecProps> = ({
  onOpenOracleModal,
  onBackToApprovals,
}) => {
  return (
    <div className="app-card rounded-2xl p-5 border-l-4 border-l-emerald-600 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>⚖️</span> Stage 6: Twin-Stream Financial Reconciliation (Payroll vs. Invoicing)
        </h3>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
          100% Reconciled
        </span>
      </div>
      <p className="text-xs text-slate-500">
        Reconciles technician field payroll (Stream A) against client Oracle AR invoice line items (Stream B), including contractual +18.4% consumables markup and DoA matrix authorization.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Stream A: Payroll */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="font-bold text-slate-800 flex items-center justify-between border-b border-slate-200 pb-2">
            <span>Stream A — Technician Field Payroll</span>
            <span className="font-mono font-bold text-slate-900">$764.30 Gross</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span>Base Regular Hours (8.0h @ $46.80/h):</span>
              <span className="font-bold">$374.40</span>
            </div>
            <div className="flex justify-between">
              <span>Travel Hours (2.0h @ $46.80/h):</span>
              <span className="font-bold">$93.60</span>
            </div>
            <div className="flex justify-between">
              <span>Plus Pay Hazard (7.0h @ +$25.40/h):</span>
              <span className="font-bold text-sky-700">+$177.80</span>
            </div>
            <div className="flex justify-between">
              <span>Daily Travel Per Diem Stipend:</span>
              <span className="font-bold text-amber-700">+$118.50</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-900">
              <span>Total Technician Compensation:</span>
              <span>$764.30</span>
            </div>
          </div>
        </div>

        {/* Stream B: Client Invoicing */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="font-bold text-slate-800 flex items-center justify-between border-b border-slate-200 pb-2">
            <span>Stream B — Oracle Accounts Receivable</span>
            <span className="font-mono font-bold text-emerald-700">$3,480.20 Billable</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span>IRATA L3 Composite Labor (10.0h @ $188.50/h):</span>
              <span className="font-bold">$1,885.00</span>
            </div>
            <div className="flex justify-between">
              <span>Standby Hold (0.0h @ $88.00/h):</span>
              <span className="font-bold">$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Consumables ($940 cost + 18.4% markup):</span>
              <span className="font-bold text-emerald-700">+$1,112.96</span>
            </div>
            <div className="flex justify-between">
              <span>Equipment Pass-Through ($440 + 9.8% fee):</span>
              <span className="font-bold text-emerald-700">+$482.24</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-900">
              <span>Total Client AR Invoice:</span>
              <span className="text-emerald-700">$3,480.20</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-emerald-900">Reconciled Gross Margin:</span>
          <span className="font-mono font-extrabold text-emerald-700 text-sm ml-2">
            $2,715.90 (78.0% Margin)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenOracleModal}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer"
          >
            View Oracle AR Payload
          </button>
          <button
            onClick={onBackToApprovals}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
          >
            Back to Approvals Grid
          </button>
        </div>
      </div>
    </div>
  );
};
