import React, { useState } from 'react';

interface BladeCanvasProps {
  onProceedToScarf: () => void;
}

export const BladeCanvas: React.FC<BladeCanvasProps> = ({ onProceedToScarf }) => {
  const [selectedSpan, setSelectedSpan] = useState<number>(71.2);
  const [pinX, setPinX] = useState<number>(890);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const span = Number((pct * 78.5).toFixed(1));
    setSelectedSpan(span);
    setPinX(Math.round(pct * 940 + 30));
  };

  return (
    <div className="app-card rounded-2xl p-5 border-l-4 border-l-cyan-500 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>📐</span> Stage 3: Interactive 2D Blade Canvas (0m – 80m) & DNV Defect Logger
        </h3>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
          DNV-ST-0376 Standard
        </span>
      </div>
      <p className="text-xs text-slate-500">
        Click along the 78.5m aerodynamic span below to log damage defects across Suction Side (SS), Pressure Side (PS), Leading Edge (LE), and Trailing Edge (TE).
      </p>

      {/* 2D Canvas Container */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-mono">Rotor Root (0.0m)</span>
          <span className="font-mono font-bold text-sky-400">
            GE Cypress 78.5m Aerodynamic Blade Canvas
          </span>
          <span className="font-mono">Wing Tip (78.5m)</span>
        </div>

        <div
          className="relative w-full h-36 bg-slate-950 rounded-xl blade-mesh border border-slate-800 flex items-center px-4 cursor-crosshair overflow-hidden"
          onClick={handleCanvasClick}
        >
          <svg viewBox="0 0 1000 120" className="w-full h-full">
            <path
              d="M 30,60 C 90,20 220,15 350,28 C 550,42 750,52 970,58 C 980,59 980,61 970,62 C 750,68 550,78 350,92 C 220,105 90,100 30,60 Z"
              fill="url(#bladeGrad)"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <path
              d="M 120,48 L 880,58 L 880,62 L 120,72 Z"
              fill="#0284c7"
              opacity="0.3"
              stroke="#0ea5e9"
              strokeWidth="0.8"
              strokeDasharray="4,2"
            />

            <line x1="150" y1="20" x2="150" y2="100" stroke="#334155" strokeDasharray="2,2" />
            <line x1="350" y1="20" x2="350" y2="100" stroke="#334155" strokeDasharray="2,2" />
            <line x1="600" y1="20" x2="600" y2="100" stroke="#334155" strokeDasharray="2,2" />
            <line x1="850" y1="20" x2="850" y2="100" stroke="#334155" strokeDasharray="2,2" />

            <text x="150" y="112" fill="#64748b" fontSize="9" textAnchor="middle">12.0m</text>
            <text x="350" y="112" fill="#64748b" fontSize="9" textAnchor="middle">28.0m (Max Chord)</text>
            <text x="600" y="112" fill="#64748b" fontSize="9" textAnchor="middle">48.0m</text>
            <text x="850" y="112" fill="#64748b" fontSize="9" textAnchor="middle">68.0m (High Aero)</text>

            <circle cx={pinX} cy="59" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" className="pulse-glow" />
            <text x={pinX} y="44" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle">
              DEF-{selectedSpan}m (Cat 4)
            </text>

            <defs>
              <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="35%" stopColor="#0f172a" />
                <stop offset="70%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute bottom-2 left-2 text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
            Physical Scale Ruler: 100mm Certified Photogrammetry Target Present
          </div>
        </div>
      </div>

      {/* Selected Defect Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Selected Defect</div>
          <div className="text-sm font-extrabold text-red-600 mt-0.5">DEF-AZ-712 (Category 4)</div>
          <div className="text-[11px] text-slate-600 mt-1">
            Span Location: <span className="font-bold">{selectedSpan}m</span>
          </div>
          <div className="text-[11px] text-slate-600">
            Aero Face: <span className="font-bold">SS (Suction Side)</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Damage Dimensions</div>
          <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">620mm × 140mm</div>
          <div className="text-[11px] text-slate-600 mt-1">
            Laminate Depth: <span className="font-bold text-red-600">3.6mm</span> (Structural Spar Incursion)
          </div>
          <div className="text-[11px] text-slate-600">
            Core Condition: <span className="font-bold text-amber-600">Balsa sandwich moisture &lt; 8%</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Acoustic Tap Test & LPS</div>
          <div className="text-sm font-extrabold text-emerald-600 mt-0.5">LPS: 0.18 Ω (Pass)</div>
          <div className="text-[11px] text-slate-600 mt-1">
            Tap Response: <span className="font-bold text-amber-600">Hollow Delamination</span>
          </div>
          <div className="text-[11px] text-slate-600">
            Repair Action: <span className="font-bold">50:1 Stepped Scarfing Mandated</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onProceedToScarf}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          Proceed to 50:1 Scarf Calculator <span>→</span>
        </button>
      </div>
    </div>
  );
};
