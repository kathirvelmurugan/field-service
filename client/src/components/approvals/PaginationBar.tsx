import React from 'react';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}) => {
  return (
    <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
      <div className="flex items-center gap-2">
        <span>At All Pages:</span>
        <select
          value={pageSize}
          readOnly
          className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 font-semibold"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span className="text-slate-400">|</span>
        <span className="font-medium">
          {totalRecords === 0 ? '0 records' : `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalRecords)} of ${totalRecords} records`}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer transition-all"
          title="First Page"
        >
          |&lt;
        </button>
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer transition-all"
          title="Previous Page"
        >
          &lt;
        </button>
        <span className="px-3 py-1 font-semibold text-slate-800">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer transition-all"
          title="Next Page"
        >
          &gt;
        </button>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer transition-all"
          title="Last Page"
        >
          &gt;|
        </button>
      </div>
    </div>
  );
};
