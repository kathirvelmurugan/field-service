import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

interface OemTaxonomyModalProps {
  onClose: () => void;
}

export const OemTaxonomyModal: React.FC<OemTaxonomyModalProps> = ({ onClose }) => {
  const [oemList, setOemList] = useState<any[]>([]);
  const [selectedOemIndex, setSelectedOemIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [testSpan, setTestSpan] = useState<number>(71.2);
  const [matchedComponents, setMatchedComponents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTaxonomy() {
      try {
        setLoading(true);
        const res = await apiClient.getTaxonomy();
        if (res?.assets) {
          setOemList(res.assets);
        }
      } catch (err) {
        console.error('Failed to load OEM taxonomy:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTaxonomy();
  }, []);

  const currentOem = oemList[selectedOemIndex] || null;

  const handleLookupSpan = async () => {
    try {
      const res = await fetch(`/api/taxonomy/span-lookup?oemIndex=${selectedOemIndex}&span=${testSpan}`);
      const data = await res.json();
      setMatchedComponents(data.matchingComponents || []);
    } catch (err) {
      console.error('Span lookup error:', err);
    }
  };

  useEffect(() => {
    if (currentOem) {
      handleLookupSpan();
    }
  }, [selectedOemIndex, testSpan, oemList]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
              🧬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  OEM Turbine Blade Models &amp; Component Taxonomy Browser
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                  Stream 3 Assets
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Multi-Tier Aerodynamic &amp; Structural Subcomponent Hierarchies (0.0m to 81.4m Span)
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading OEM component hierarchies...</div>
          ) : (
            <>
              {/* OEM Model Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
                {oemList.map((oem, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOemIndex(idx)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                      selectedOemIndex === idx
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>⚡</span>
                    <span>{oem.oemName}</span>
                    <span className="text-[10px] opacity-80 font-normal">({oem.nominalBladeLengthM}m)</span>
                  </button>
                ))}
              </div>

              {currentOem && (
                <div className="space-y-6">
                  {/* Selected OEM Overview */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-sky-700 tracking-wider">
                        Active Aerodynamic Profile
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900">{currentOem.modelIdentifier}</h3>
                      <p className="text-xs text-slate-500">
                        Manufacturer: <strong>{currentOem.oemName}</strong> • Rotor Diameter: <strong>{currentOem.nominalRotorDiameterM}m</strong> • Blade Span: <strong>{currentOem.nominalBladeLengthM}m</strong>
                      </p>
                    </div>

                    {/* Radial Span Probe Widget */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Probe Radial Span</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={currentOem.nominalBladeLengthM}
                            value={testSpan}
                            onChange={(e) => setTestSpan(Number(e.target.value))}
                            className="w-18 px-2 py-1 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg outline-none"
                          />
                          <span className="text-xs font-bold text-slate-600">meters</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Components In Radial Zone</span>
                        <span className="text-xs font-extrabold text-sky-700">
                          {matchedComponents.length} Active Layer(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Aerodynamic Span Sections */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center justify-between">
                      <span>1. Aerodynamic Chord Sections &amp; LPS Receptor Placements</span>
                      <span className="text-[11px] text-slate-500 font-normal">Root to Tip Partitioning</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {currentOem.aerodynamicSections.map((sec: any, i: number) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-sky-300 transition-all text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-sky-700">{sec.sectionCode}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-semibold text-slate-600">
                              {sec.spanRangeM}
                            </span>
                          </div>
                          <div className="font-bold text-slate-800 text-[11px] mb-1">{sec.profileType}</div>
                          <p className="text-[10px] text-slate-500 mb-2">{sec.description}</p>
                          <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                            <span>⚡</span>
                            <span>{sec.lpsReceptorsCount} LPS Receptor Button(s)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Structural Subcomponents & Failure Modes */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center justify-between">
                      <span>2. Internal Structural Layups &amp; Critical Failure Modes</span>
                      <span className="text-[11px] text-slate-500 font-normal">DNV-ST-0376 Inspection Focus</span>
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                            <th className="p-2.5">Component</th>
                            <th className="p-2.5">Material Composition</th>
                            <th className="p-2.5">Span Coverage</th>
                            <th className="p-2.5">Critical Defect / Inspection Focus</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentOem.structuralComponents.map((comp: any) => (
                            <tr key={comp.componentId} className="hover:bg-slate-50 text-slate-700">
                              <td className="p-2.5 font-bold text-slate-900">
                                {comp.name}
                                <div className="text-[10px] text-slate-400 font-mono">{comp.componentId}</div>
                              </td>
                              <td className="p-2.5 text-slate-600">{comp.material}</td>
                              <td className="p-2.5 font-mono text-[11px] font-semibold text-sky-800">{comp.spanCoverageM}</td>
                              <td className="p-2.5 text-slate-600 text-[11px]">{comp.criticalInspectionFocus}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
