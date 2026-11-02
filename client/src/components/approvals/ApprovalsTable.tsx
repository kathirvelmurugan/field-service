import React, { useState } from 'react';
import { TimeCardRecord } from '../../api/client';
import { PaginationBar } from './PaginationBar';

interface ApprovalsTableProps {
  records: TimeCardRecord[];
  onApprove: (id: string) => Promise<void>;
  onBatchApprove: (ids: string[]) => Promise<void>;
  onInspectBlade: (woRef: string, techName: string) => void;
}

export const ApprovalsTable: React.FC<ApprovalsTableProps> = ({
  records,
  onApprove,
  onBatchApprove,
  onInspectBlade,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(records.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredRecords = records.filter(r => 
    r.technicianName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.workOrderRef.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.siteLocation.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const displayedRecords = filteredRecords.slice((activePage - 1) * pageSize, activePage * pageSize);

  const handleBatchApproveClick = () => {
    if (selectedIds.length > 0) {
      onBatchApprove(selectedIds);
    } else {
      const pendingIds = records.filter(r => r.status === 'submitted').map(r => r.id);
      onBatchApprove(pendingIds.length > 0 ? pendingIds : ['TC-2026-1024', 'TC-2026-1025']);
    }
  };

  return (
    <main className="space-y-4">
      {/* Table Header Card */}
      <div className="app-card rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            Waiting Time Card Approvals
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
              {records.filter(r => r.status === 'submitted').length} Pending Action
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Arizona Field Services Operations Hub • Timecard & Absence Validation with Automated Plus Pay (+$25.40/hr) and Per Diem ($118.50)
          </p>
        </div>

        {/* Filter Controls & Batch Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Filter employee or work order..."
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            onClick={handleBatchApproveClick}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>✓</span> Batch Approve
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="app-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === records.length && records.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3.5 w-8 text-center">Status</th>
                <th className="p-3.5">Employee Name</th>
                <th className="p-3.5">Submission Date</th>
                <th className="p-3.5">Work Type / Hazard</th>
                <th className="p-3.5">Site Location</th>
                <th className="p-3.5 text-center">Hours</th>
                <th className="p-3.5 text-right">Neutralized Gross</th>
                <th className="p-3.5">Status & Comments</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {displayedRecords.map(card => {
                const isApproved = card.status === 'approved';
                return (
                  <tr
                    key={card.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      !isApproved ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(card.id)}
                        onChange={() => toggleSelectRow(card.id)}
                      />
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          isApproved ? 'bg-emerald-500' : 'bg-amber-400'
                        }`}
                        title={isApproved ? 'Approved' : 'Pending Approval'}
                      />
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {card.technicianName}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {card.technicianId} • IRATA Certified
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{card.date}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                          card.climbingPlusHazardHours > 0
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {card.climbingPlusHazardHours > 0
                          ? `Regular + Plus Hazard (${card.climbingPlusHazardHours}h)`
                          : `Standby (${card.weatherStandbyHours}h)`}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {card.climbingPlusHazardHours > 0 ? 'High-Angle Rope Access (+$25.40/h)' : 'Wind Hold > 10.0 m/s'}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">{card.siteLocation}</td>
                    <td className="p-3.5 text-center font-bold text-slate-800">
                      {(card.regularHours + card.travelHours).toFixed(1)} Hour(s)
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                      ${card.grossPay.toFixed(2)}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`font-medium ${
                          isApproved ? 'text-emerald-700' : 'text-amber-800 font-semibold'
                        }`}
                      >
                        {card.approverComments}
                      </span>
                      {card.approvedBy && (
                        <div className="text-[10px] text-slate-400">Approved by {card.approvedBy}</div>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onInspectBlade(card.workOrderRef, card.technicianName)}
                          className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                        >
                          Inspect Blade
                        </button>
                        {!isApproved && (
                          <button
                            onClick={() => onApprove(card.id)}
                            className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm cursor-pointer"
                          >
                            ✓
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <PaginationBar
          currentPage={activePage}
          totalPages={totalPages}
          totalRecords={filteredRecords.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </main>
  );
};
