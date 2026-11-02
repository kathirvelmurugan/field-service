import React from 'react';

interface MegaMenuProps {
  activeTab: 'approvals' | 'workorder';
  onSelectTab: (tab: 'approvals' | 'workorder') => void;
  onOpenModal: (modalId: string) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  activeTab,
  onSelectTab,
  onOpenModal,
}) => {
  return (
    <nav className="app-card rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        {/* Operations Mega-Menu Trigger */}
        <div className="relative group">
          <button className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 font-bold border border-sky-200 flex items-center gap-1 hover:bg-sky-100 transition-all">
            <span>Operations</span>
            <span className="text-[9px]">▼</span>
          </button>
          <div className="absolute left-0 top-full mt-1.5 w-96 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl hidden group-hover:block z-50 text-slate-700">
            <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
              Operations Hub
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <div className="font-bold text-slate-900 mb-1">Time And Absence/PTO</div>
                <button
                  onClick={() => onSelectTab('approvals')}
                  className="block py-0.5 text-left text-sky-600 font-semibold hover:underline"
                >
                  Waiting Time Card Approvals
                </button>
                <button
                  onClick={() => onSelectTab('approvals')}
                  className="block py-0.5 text-left hover:text-slate-900"
                >
                  Time Card Forms
                </button>
                <button
                  onClick={() => onOpenModal('modal-perdiem')}
                  className="block py-0.5 text-left text-amber-700 font-semibold hover:underline"
                >
                  ★ Per Diem & Plus Pay
                </button>
                <button
                  onClick={() => onOpenModal('modal-logs')}
                  className="block py-0.5 text-left text-sky-700 font-semibold hover:underline"
                >
                  ★ Integration Outbound Logs
                </button>
              </div>
              <div>
                <div className="font-bold text-slate-900 mb-1">Field Assets & Billing</div>
                <button
                  onClick={() => onSelectTab('workorder')}
                  className="block py-0.5 text-left text-cyan-700 font-semibold hover:underline"
                >
                  0-80m Blade Inspection
                </button>
                <button
                  onClick={() => onOpenModal('modal-taxonomy')}
                  className="block py-0.5 text-left hover:text-slate-900"
                >
                  OEM Models & Components
                </button>
                <button
                  onClick={() => onOpenModal('modal-oracle')}
                  className="block py-0.5 text-left text-emerald-700 font-semibold hover:underline"
                >
                  ★ Oracle Invoicing Feed
                </button>
                <button
                  onClick={() => onOpenModal('modal-enhancements')}
                  className="block py-0.5 text-left text-purple-700 font-semibold hover:underline"
                >
                  Enhancements Portfolio
                </button>
                <button
                  onClick={() => onOpenModal('modal-birr')}
                  className="block py-0.5 text-left text-indigo-700 font-semibold hover:underline"
                >
                  ★ DNV BIRR Certificate &amp; KPIs
                </button>
                <button
                  onClick={() => onOpenModal('modal-mobile-sync')}
                  className="block py-0.5 text-left text-rose-700 font-semibold hover:underline"
                >
                  ★ Mobile Sync &amp; Rotor LOTO Hub
                </button>
                <button
                  onClick={() => onOpenModal('modal-pre-departure')}
                  className="block py-0.5 text-left text-amber-700 font-semibold hover:underline"
                >
                  ★ Pre-Departure GWO Gate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Mega-Menu Trigger */}
        <div className="relative group">
          <button className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold flex items-center gap-1 transition-all">
            <span>Settings</span>
            <span className="text-[9px]">▼</span>
          </button>
          <div className="absolute left-0 top-full mt-1.5 w-80 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl hidden group-hover:block z-50 text-slate-700">
            <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
              System Master Settings
            </div>
            <div className="space-y-1.5 text-[11px]">
              <button
                onClick={() => onOpenModal('modal-doa')}
                className="block text-left font-semibold text-purple-700 hover:underline"
              >
                ★ Delegation of Authority (DoA) Matrix
              </button>
              <button
                onClick={() => onOpenModal('modal-taxonomy')}
                className="block text-left hover:text-slate-900"
              >
                OEM Model & Component Model Mapping
              </button>
              <button
                onClick={() => onOpenModal('modal-attendance')}
                className="block text-left text-sky-700 font-semibold hover:underline"
              >
                ★ Attendance Close Periods
              </button>
              <button
                onClick={() => onOpenModal('modal-training')}
                className="block text-left text-indigo-700 font-semibold hover:underline"
              >
                ★ Safety & Training Course Requirements
              </button>
            </div>
          </div>
        </div>

        {/* View Switching Tabs */}
        <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
          <button
            onClick={() => onSelectTab('approvals')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1 ${
              activeTab === 'approvals'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>📋</span> Approvals Table
          </button>
          <button
            onClick={() => onSelectTab('workorder')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1 ${
              activeTab === 'workorder'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>🔍</span> Blade Work Order (0-80m)
          </button>
        </div>
      </div>

      {/* Feature Shortcut Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onOpenModal('modal-perdiem')}
          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-semibold flex items-center gap-1"
        >
          <span>💵</span> Per Diem & Plus Pay
        </button>
        <button
          onClick={() => onOpenModal('modal-oracle')}
          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1"
        >
          <span>📊</span> Oracle AR Feed
        </button>
        <button
          onClick={() => onOpenModal('modal-taxonomy')}
          className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-[11px] font-semibold flex items-center gap-1"
        >
          <span>🧬</span> OEM Hierarchies
        </button>
        <button
          onClick={() => onOpenModal('modal-doa')}
          className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[11px] font-semibold flex items-center gap-1"
        >
          <span>⚖️</span> DoA Matrix
        </button>
        <button
          onClick={() => onOpenModal('modal-birr')}
          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-[11px] font-semibold flex items-center gap-1"
        >
          <span>📜</span> DNV BIRR &amp; KPIs
        </button>
        <button
          onClick={() => onOpenModal('modal-mobile-sync')}
          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-semibold flex items-center gap-1"
        >
          <span>📡</span> Mobile Sync &amp; LOTO
        </button>
        <button
          onClick={() => onOpenModal('modal-pre-departure')}
          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-semibold flex items-center gap-1"
        >
          <span>🛡️</span> GWO Badge Gate
        </button>
      </div>
    </nav>
  );
};
