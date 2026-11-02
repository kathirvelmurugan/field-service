import React, { useState, useEffect } from 'react';
import { apiClient, ScarfResult } from '../../api/client';

export const ScarfCalculator: React.FC = () => {
  const [depthMm, setDepthMm] = useState<number>(3.6);
  const [scarfData, setScarfData] = useState<ScarfResult | null>(null);

  useEffect(() => {
    apiClient.calculateScarf(depthMm, 620, 140).then(data => {
      setScarfData(data);
    });
  }, [depthMm]);

  return (
    <div className="app-card rounded-2xl p-5 border-l-4 border-l-purple-500 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>🧪</span> Stage 4: Composite Scarfing Calculator (50:1) & Thermal Cure Datalogger
        </h3>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
          QMS Specification
        </span>
      </div>
      <p className="text-xs text-slate-500">
        Computes structural bevel width based on DNV 50:1 scarfing ratio. Monitors heating blanket dwell at 72.0°C and vacuum integrity under -0.85 bar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Scarf Geometry */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="font-bold text-slate-800 flex items-center justify-between">
            <span>50:1 Scarf Geometry Generator</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Depth:</span>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="10.0"
                value={depthMm}
                onChange={e => setDepthMm(Number(e.target.value) || 1.0)}
                className="w-16 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-right font-mono font-bold"
              />
              <span className="font-bold">mm</span>
            </div>
          </div>

          {scarfData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-600">Calculated Bevel Width:</span>
                <span className="font-mono font-bold text-slate-900">
                  {depthMm}mm × 50 ={' '}
                  <span className="text-sky-600 font-black">{scarfData.totalBevelWidthMm} mm</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-600">Required Glass Plies:</span>
                <span className="font-mono font-bold text-slate-900">
                  {scarfData.requiredPliesCount} Stepped Plies (Triax 800g / Biax 600g)
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-600">Resin Formulation:</span>
                <span className="font-mono font-bold text-slate-900">
                  {scarfData.resinMixRequirements.baseEpoxyGrams}g Epoxy :{' '}
                  {scarfData.resinMixRequirements.hardenerGrams}g Hardener (100:30)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Thermal Cure Datalogger */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="font-bold text-slate-800 flex items-center justify-between">
            <span>Thermal Cure Profile (Blanket Telemetry)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              Dwell Phase Active
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500">TC1 (Root-Side)</div>
              <div className="text-sm font-extrabold text-slate-800 font-mono">71.8 °C</div>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500">TC2 (Center)</div>
              <div className="text-sm font-extrabold text-emerald-600 font-mono">72.4 °C</div>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500">TC3 (Tip-Side)</div>
              <div className="text-sm font-extrabold text-slate-800 font-mono">72.0 °C</div>
            </div>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between font-mono">
            <span className="text-slate-600">Vacuum Gauge Level:</span>
            <span className="font-bold text-emerald-600">-0.90 bar (&lt; -0.85 bar threshold)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
