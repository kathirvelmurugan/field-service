import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

interface PreDepartureGateModalProps {
  onClose: () => void;
}

export const PreDepartureGateModal: React.FC<PreDepartureGateModalProps> = ({ onClose }) => {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [selectedTechId, setSelectedTechId] = useState<string>('TECH-AZ-101');
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([
    'CAL-BLANKET-01',
    'CAL-MICRO-OHM-04',
    'CAL-VAC-PUMP-02',
  ]);
  const [gateResult, setGateResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [evaluating, setEvaluating] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [techs, equipment] = await Promise.all([
          apiClient.getComplianceTechnicians(),
          apiClient.getComplianceTools(),
        ]);
        setTechnicians(techs || []);
        setTools(equipment || []);
      } catch (err) {
        console.error('Failed to load compliance data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleValidate = async () => {
    setEvaluating(true);
    try {
      const res = await apiClient.checkPreDepartureCompliance(selectedTechId, selectedToolIds);
      setGateResult(res);
    } catch (err) {
      console.error('Compliance validation error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const toggleTool = (toolId: string) => {
    setSelectedToolIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Pre-Departure Compliance Gatekeeper
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                  GWO &amp; IRATA Gate
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Mandatory certification &amp; tool calibration verification prior to site departure
              </p>
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
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading technician credentials &amp; tool calibration registry...</div>
          ) : (
            <>
              {/* Technician Selector */}
              <div className="space-y-2">
                <label className="font-extrabold text-slate-900 block text-xs">
                  1. Select Dispatched Blade Technician (GWO / IRATA Registry)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {technicians.map((t) => (
                    <div
                      key={t.technicianId}
                      onClick={() => setSelectedTechId(t.technicianId)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedTechId === t.technicianId
                          ? 'border-sky-500 bg-sky-50/60 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{t.fullName}</div>
                        <div className="text-[10px] text-slate-500">
                          {t.technicianId} • IRATA Level {t.irataLevel}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool Crib Multi-Select */}
              <div className="space-y-2">
                <label className="font-extrabold text-slate-900 block text-xs">
                  2. Select Assigned Specialized Equipment (Calibration Verification)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tools.map((eq) => {
                    const isSelected = selectedToolIds.includes(eq.toolId);
                    return (
                      <div
                        key={eq.toolId}
                        onClick={() => toggleTool(eq.toolId)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50/60 shadow-sm'
                            : 'border-slate-200 bg-slate-50 opacity-80'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="rounded text-indigo-600"
                            />
                            <span>{eq.toolId}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">{eq.toolType} • {eq.serialNumber}</div>
                          <div className="text-[10px] text-slate-600">Cal Due: {eq.nextCalibrationDueDate}</div>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          eq.isCalibrated ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {eq.isCalibrated ? 'CALIBRATED' : 'EXPIRED'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleValidate}
                  disabled={evaluating}
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>⚡</span>
                  <span>{evaluating ? 'Evaluating Credentials & Tool Seals...' : 'Validate Compliance & Issue Gate Pass'}</span>
                </button>
              </div>

              {/* Gate Pass Result */}
              {gateResult && (
                <div className={`p-4 rounded-2xl border ${
                  gateResult.isCleared ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
                } space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">
                      {gateResult.verificationVerdict}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      gateResult.isCleared ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {gateResult.isCleared ? 'GATE PASS ISSUED' : 'GATE ACCESS BLOCKED'}
                    </span>
                  </div>

                  {gateResult.isCleared ? (
                    <div className="space-y-1 text-[11px] pt-1">
                      <div>Pass Token: <strong className="font-mono text-emerald-900">{gateResult.gatePassToken}</strong></div>
                      <div>Technician: <strong>{gateResult.technicianName}</strong> • Verified Tools: <strong>{gateResult.verifiedToolsCount}</strong></div>
                      <div>Shift Expiration: <strong>{new Date(gateResult.expiresAt).toLocaleTimeString()} (14h Shift Window)</strong></div>
                      <div className="font-mono text-[10px] text-slate-500 break-all">SHA-256 Tamper Seal: {gateResult.sha256Seal}</div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-[11px] text-rose-800 pt-1">
                      <div className="font-bold">Compliance Failures:</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {gateResult.rejectionReasons.map((reason: string, idx: number) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all shadow"
          >
            Close Gate
          </button>
        </div>
      </div>
    </div>
  );
};
