import React from 'react';

interface NavbarProps {
  currentBreadcrumb: string;
  isCorporateTheme: boolean;
  onToggleTheme: () => void;
  apiStatus: string;
  onNavigateApprovals?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentBreadcrumb,
  isCorporateTheme,
  onToggleTheme,
  apiStatus,
  onNavigateApprovals,
}) => {
  return (
    <header className="app-card rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Breadcrumbs & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateApprovals}
          className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow hover:scale-105 transition-all cursor-pointer"
          title="Return to Approvals Dashboard"
        >
          ⚡
        </button>
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <button
              onClick={onNavigateApprovals}
              className="hover:text-sky-600 hover:underline cursor-pointer"
            >
              Operations
            </button>
            <span>&gt;</span>
            <button
              onClick={onNavigateApprovals}
              className="hover:text-sky-600 hover:underline cursor-pointer"
            >
              Time And Absence/PTO
            </button>
            <span>&gt;</span>
            <span className="text-sky-600 font-semibold">{currentBreadcrumb}</span>
          </div>
          <div className="font-extrabold text-sm tracking-tight text-slate-900 flex items-center gap-2">
            Leading Edge FSM
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-100 text-sky-700 font-bold border border-sky-200 uppercase">
              v2026.2 Enterprise
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-2 hidden md:block">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search for tools, work orders, wind turbines, help... (Alt + Q)"
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right: User Profile, Theme & Online Badge */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleTheme}
          className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-all"
          title="Toggle between Corporate White and Field Dark Mode"
        >
          <span>{isCorporateTheme ? '☀️' : '🌙'}</span>
          <span className="font-medium">{isCorporateTheme ? 'Corporate View' : 'Field Dark'}</span>
        </button>

        <span className="hidden sm:flex text-[11px] items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold">Adrian Lewis</span>
          <span className="text-slate-500">(Operations Lead)</span>
        </span>

        <span className="text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{apiStatus}</span>
        </span>
      </div>
    </header>
  );
};
