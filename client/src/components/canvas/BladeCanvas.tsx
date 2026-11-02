import React, { useState } from 'react';

interface BladeCanvasProps {
  onProceedToScarf: () => void;
}

export type AeroFace = 'SS' | 'PS' | 'LE' | 'TE';

interface FaceDefectConfig {
  faceCode: AeroFace;
  faceName: string;
  defaultSpan: number;
  pinPercent: number;
  defectId: string;
  category: number;
  categoryName: string;
  dimensions: string;
  depthMm: number;
  coreCondition: string;
  lpsResistance: string;
  tapResponse: string;
  repairAction: string;
  strokeColor: string;
}

const FACE_DEFECTS: Record<AeroFace, FaceDefectConfig> = {
  SS: {
    faceCode: 'SS',
    faceName: 'Suction Side (Leeward)',
    defaultSpan: 71.2,
    pinPercent: 0.907,
    defectId: 'DEF-AZ-SS712',
    category: 4,
    categoryName: 'Category 4 Structural Delamination',
    dimensions: '620mm × 140mm',
    depthMm: 3.6,
    coreCondition: 'Balsa sandwich moisture < 8%',
    lpsResistance: '0.18 Ω (Pass)',
    tapResponse: 'Hollow Delamination',
    repairAction: '50:1 Stepped Scarfing Mandated',
    strokeColor: '#38bdf8'
  },
  PS: {
    faceCode: 'PS',
    faceName: 'Pressure Side (Windward)',
    defaultSpan: 28.0,
    pinPercent: 0.356,
    defectId: 'DEF-AZ-PS280',
    category: 2,
    categoryName: 'Category 2 Gelcoat Micro-Cracking',
    dimensions: '180mm × 85mm',
    depthMm: 0.8,
    coreCondition: 'No structural core involvement',
    lpsResistance: '0.12 Ω (Pass)',
    tapResponse: 'Solid Acoustic Return',
    repairAction: 'Surface Prep & Gelcoat Resurfacing',
    strokeColor: '#fbbf24'
  },
  LE: {
    faceCode: 'LE',
    faceName: 'Leading Edge (High Aero Erosion)',
    defaultSpan: 74.5,
    pinPercent: 0.949,
    defectId: 'DEF-AZ-LE745',
    category: 3,
    categoryName: 'Category 3 Rain Erosion & Pitting',
    dimensions: '950mm × 45mm',
    depthMm: 2.1,
    coreCondition: 'LE Shell scrim penetration',
    lpsResistance: '0.22 Ω (Pass)',
    tapResponse: 'Dull Acoustic Attenuation',
    repairAction: 'LEP Polyurethane Tape / Coating',
    strokeColor: '#f97316'
  },
  TE: {
    faceCode: 'TE',
    faceName: 'Trailing Edge (Bond-Line)',
    defaultSpan: 48.0,
    pinPercent: 0.611,
    defectId: 'DEF-AZ-TE480',
    category: 4,
    categoryName: 'Category 4 Bond-Line Split',
    dimensions: '420mm × 110mm',
    depthMm: 4.2,
    coreCondition: 'Adhesive bond-line shear gap',
    lpsResistance: '0.15 Ω (Pass)',
    tapResponse: 'Acoustic Void Detection',
    repairAction: 'Structural Adhesive Paste Injection',
    strokeColor: '#ef4444'
  }
};

export const BladeCanvas: React.FC<BladeCanvasProps> = ({ onProceedToScarf }) => {
  const [selectedFace, setSelectedFace] = useState<AeroFace>('SS');
  const [selectedSpan, setSelectedSpan] = useState<number>(FACE_DEFECTS.SS.defaultSpan);
  const [pinX, setPinX] = useState<number>(Math.round(FACE_DEFECTS.SS.pinPercent * 940 + 30));

  const currentDefect = FACE_DEFECTS[selectedFace];

  const handleFaceSelect = (face: AeroFace) => {
    setSelectedFace(face);
    const cfg = FACE_DEFECTS[face];
    setSelectedSpan(cfg.defaultSpan);
    setPinX(Math.round(cfg.pinPercent * 940 + 30));
  };

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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>📐</span> Stage 3: Interactive 2D Blade Canvas (0m – 80m) &amp; 4-Face DNV Defect Logger
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an aerodynamic surface (SS, PS, LE, TE) and click anywhere along the 78.5m span to record DNV Cat 1–5 damage defects.
          </p>
        </div>

        {/* 4-Face Aerodynamic Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {(['SS', 'PS', 'LE', 'TE'] as AeroFace[]).map((f) => (
            <button
              key={f}
              onClick={() => handleFaceSelect(f)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedFace === f
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {f} ({f === 'SS' ? 'Suction' : f === 'PS' ? 'Pressure' : f === 'LE' ? 'Leading' : 'Trailing'})
            </button>
          ))}
        </div>
      </div>

      {/* 2D Canvas Container */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-mono">Rotor Root (0.0m)</span>
          <span className="font-mono font-bold text-sky-400">
            GE Cypress 78.5m • {currentDefect.faceName} View
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
              stroke={currentDefect.strokeColor}
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

            <circle cx={pinX} cy="59" r="6" fill={currentDefect.category >= 4 ? '#ef4444' : '#f59e0b'} stroke="#ffffff" strokeWidth="2" className="pulse-glow" />
            <text x={pinX} y="44" fill={currentDefect.category >= 4 ? '#f87171' : '#fbbf24'} fontSize="9" fontWeight="bold" textAnchor="middle">
              {currentDefect.defectId} ({selectedSpan}m • Cat {currentDefect.category})
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
            Active Face: <strong className="text-sky-400">{selectedFace}</strong> • Scale: 100mm Certified Photogrammetry Target Present
          </div>
        </div>
      </div>

      {/* Selected Defect Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Selected Defect</div>
          <div className={`text-sm font-extrabold mt-0.5 ${currentDefect.category >= 4 ? 'text-red-600' : 'text-amber-700'}`}>
            {currentDefect.defectId} (Cat {currentDefect.category})
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            Span Location: <span className="font-bold">{selectedSpan}m</span>
          </div>
          <div className="text-[11px] text-slate-600">
            Aero Face: <span className="font-bold">{currentDefect.faceName}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Damage Dimensions</div>
          <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">{currentDefect.dimensions}</div>
          <div className="text-[11px] text-slate-600 mt-1">
            Laminate Depth: <span className="font-bold text-red-600">{currentDefect.depthMm}mm</span>
          </div>
          <div className="text-[11px] text-slate-600">
            Core Condition: <span className="font-bold text-amber-700">{currentDefect.coreCondition}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Acoustic Tap Test &amp; LPS</div>
          <div className="text-sm font-extrabold text-emerald-600 mt-0.5">LPS: {currentDefect.lpsResistance}</div>
          <div className="text-[11px] text-slate-600 mt-1">
            Tap Response: <span className="font-bold text-amber-700">{currentDefect.tapResponse}</span>
          </div>
          <div className="text-[11px] text-slate-600">
            Repair Action: <span className="font-bold">{currentDefect.repairAction}</span>
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
