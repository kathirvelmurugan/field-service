import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { MegaMenu } from './components/layout/MegaMenu';
import { ApprovalsTable } from './components/approvals/ApprovalsTable';
import { BladeCanvas } from './components/canvas/BladeCanvas';
import { ScarfCalculator } from './components/qms/ScarfCalculator';
import { TwinStreamRec } from './components/finance/TwinStreamRec';
import { BirrModal } from './components/reporting/BirrModal';
import { MobileSyncDrawer } from './components/mobile/MobileSyncDrawer';
import { OemTaxonomyModal } from './components/canvas/OemTaxonomyModal';
import { apiClient, TimeCardRecord } from './api/client';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'workorder'>('approvals');
  const [isCorporateTheme, setIsCorporateTheme] = useState<boolean>(true);
  const [apiStatus, setApiStatus] = useState<string>('Connecting...');
  const [timecards, setTimecards] = useState<TimeCardRecord[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    // 1. Probe Backend Health
    apiClient.getHealth()
      .then(h => setApiStatus(`API Online (${h.version})`))
      .catch(() => setApiStatus('Local Cache Mode'));

    // 2. Fetch Timecards from Backend
    apiClient.getTimecards()
      .then(res => setTimecards(res.records))
      .catch(() => console.error('Failed to load timecards'));
  }, []);

  const handleToggleTheme = () => {
    setIsCorporateTheme(prev => !prev);
    const root = document.documentElement;
    if (isCorporateTheme) {
      root.classList.remove('theme-corporate');
      root.classList.add('theme-field-dark');
    } else {
      root.classList.remove('theme-field-dark');
      root.classList.add('theme-corporate');
    }
  };

  const handleApprove = async (id: string) => {
    await apiClient.approveTimecard(id);
    setTimecards(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'approved', approvedBy: 'Adrian Lewis (Operations Lead)' } : c))
    );
  };

  const handleBatchApprove = async (ids: string[]) => {
    await apiClient.batchApprove(ids);
    setTimecards(prev =>
      prev.map(c => (ids.includes(c.id) ? { ...c, status: 'approved', approvedBy: 'Adrian Lewis (Operations Lead)' } : c))
    );
    alert(`Successfully batch approved ${ids.length} timecard(s) via Enterprise REST API!`);
  };

  const handleInspectBlade = (woRef: string, techName: string) => {
    setActiveTab('workorder');
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-4">
      {/* 1. Corporate Breadcrumb & Top Bar */}
      <Navbar
        currentBreadcrumb={
          activeTab === 'approvals'
            ? 'Waiting Time Card Approvals'
            : 'Blade Inspection & Repair Console (WO-AZ-7842)'
        }
        isCorporateTheme={isCorporateTheme}
        onToggleTheme={handleToggleTheme}
        apiStatus={apiStatus}
      />

      {/* 2. Operations & Settings Mega-Menu */}
      <MegaMenu
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenModal={setActiveModal}
      />

      {/* 3. Primary View Routing */}
      {activeTab === 'approvals' ? (
        <ApprovalsTable
          records={timecards}
          onApprove={handleApprove}
          onBatchApprove={handleBatchApprove}
          onInspectBlade={handleInspectBlade}
        />
      ) : (
        <section className="space-y-4">
          <BladeCanvas onProceedToScarf={() => {}} />
          <ScarfCalculator />
          <TwinStreamRec
            onOpenOracleModal={() => setActiveModal('modal-oracle')}
            onBackToApprovals={() => setActiveTab('approvals')}
          />
        </section>
      )}

      {/* 4. Enterprise Modals */}
      {activeModal === 'modal-perdiem' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="app-card rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span>💵</span> Per Diem & Plus Pay Engine (Stream 1 — Workforce)
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer">✕</button>
            </div>
            <p className="text-xs text-slate-500">
              Enforces Arizona regional field stipends. All figures are neutralized with ±5% variance.
            </p>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Technician Base Rate</div>
                  <div className="text-[11px] text-slate-500">Standard hourly wage for travel & ground assembly</div>
                </div>
                <div className="font-mono font-bold text-slate-900 text-sm">$46.80 / hr</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Plus Hazard Differential</div>
                  <div className="text-[11px] text-slate-500">Tower climbing, high-angle rope access & suspended platform work</div>
                </div>
                <div className="font-mono font-bold text-sky-600 text-sm">+$25.40 / hr</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Daily Per Diem Stipend</div>
                  <div className="text-[11px] text-slate-500">Flat lodging & meal stipend for remote wind sites &gt; 50 miles</div>
                </div>
                <div className="font-mono font-bold text-amber-600 text-sm">$118.50 / day</div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 cursor-pointer">
                Close Configurator
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'modal-oracle' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="app-card rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span>📊</span> Oracle Accounts Receivable JSON Invoicing Feed (Stream 2 — Finance)
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer">✕</button>
            </div>
            <pre className="bg-slate-950 text-emerald-400 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-800">
{`{
  "sourceSystem": "LEADING_EDGE_FSM",
  "transactionType": "WIND_FIELD_SERVICE_INVOICE",
  "invoiceNumber": "INV-7842-AR",
  "purchaseOrderNumber": "PO-AZ-7842",
  "customerAccountNumber": "CUST-WIND-9021",
  "customerName": "Southwest Wind Holdings LLC",
  "currency": "USD",
  "paymentTerms": "NET_30",
  "subtotalLaborUsd": 1885.00,
  "subtotalPassThroughUsd": 1595.20,
  "invoiceTotalUsd": 3480.20,
  "approvalStatus": "VALIDATED",
  "lines": [
    {
      "lineNumber": 1,
      "itemCode": "SRV-IRATA-L3",
      "description": "IRATA Level 3 Composite Repair Lead Labor",
      "quantity": 10.0,
      "unitRateUsd": 188.50,
      "lineTotalUsd": 1885.00,
      "glAccountCode": "01-410-6200-BLD-REPAIR"
    },
    {
      "lineNumber": 2,
      "itemCode": "MAT-PASS-THRU",
      "description": "Infusion Resin & Glass Reinforcements (+18.4% contractual markup)",
      "quantity": 1,
      "unitRateUsd": 1112.96,
      "lineTotalUsd": 1112.96,
      "glAccountCode": "01-140-5100-MAT-PASSTHRU"
    }
  ]
}`}
            </pre>
            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'modal-doa' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="app-card rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span>⚖️</span> Delegation of Authority (DoA) Approval Ladder (Stream 5 — Governance)
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Tier 1 — Field Operations Supervisor</div>
                  <div className="text-[11px] text-slate-500">Authorized for routine field work orders & minor materials</div>
                </div>
                <div className="font-mono font-bold text-slate-900 text-sm">≤ $5,250.00</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Tier 2 — Project Manager / Operations Lead</div>
                  <div className="text-[11px] text-slate-500">Authorized for Cat 4/5 major scarf repairs & skylift platforms</div>
                </div>
                <div className="font-mono font-bold text-purple-700 text-sm">≤ $26,250.00</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Tier 3 — VP Operations / Executive Sign-off</div>
                  <div className="text-[11px] text-slate-500">Mandatory for structural blade replacements & warranty settlements</div>
                </div>
                <div className="font-mono font-bold text-slate-900 text-sm">&gt; $26,250.00</div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 cursor-pointer">
                Close DoA Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'modal-enhancements' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="app-card rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span>📈</span> Leading Edge Enhancements Portfolio ($412,850 Neutralized)
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer">✕</button>
            </div>
            <p className="text-xs text-slate-500">
              Neutralized budget allocation across 10 modular work packages. Jittered ±5% to safeguard confidential quotation data.
            </p>
            <div className="space-y-1.5 text-xs max-h-60 overflow-y-auto pr-1">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="font-medium text-slate-800">Oracle-LE Invoicing Integration</span>
                <span className="font-mono font-bold text-slate-900">1,320 hrs • $59,180.00</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="font-medium text-slate-800">QMS FS Composite Repair Engine</span>
                <span className="font-mono font-bold text-slate-900">690 hrs • $51,480.00</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="font-medium text-slate-800">Per Diem & Plus Payments Module</span>
                <span className="font-mono font-bold text-slate-900">510 hrs • $46,250.00</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span className="font-medium text-slate-800">Quotation Approvals & DoA Matrix</span>
                <span className="font-mono font-bold text-slate-900">1,390 hrs • $56,120.00</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 cursor-pointer">
                Close Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'modal-birr' && (
        <BirrModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'modal-mobile-sync' && (
        <MobileSyncDrawer onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'modal-taxonomy' && (
        <OemTaxonomyModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};
