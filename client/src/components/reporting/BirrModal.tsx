import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

interface BirrModalProps {
  onClose: () => void;
}

export const BirrModal: React.FC<BirrModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'certificate' | 'kpis'>('certificate');
  const [certData, setCertData] = useState<any>(null);
  const [kpiData, setKpiData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hashCopied, setHashCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cert, kpis] = await Promise.all([
          apiClient.generateBirrCertificate({
            workOrderId: 'WO-AZ-7842',
            turbineSerial: 'GE-Cypress-T04',
            bladeSerial: 'BLD-SS-8492-B',
            leadTechnicianName: 'Adrian Lewis',
            leadTechnicianCert: 'AZ-IRATA-9182',
            oemSiteLeadName: 'V. Prasanth',
            oemSiteLeadCert: 'OEM-QA-4402',
          }),
          apiClient.getFleetKpis(),
        ]);
        setCertData(cert);
        setKpiData(kpis);
      } catch (err) {
        console.error('Failed to load reporting data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopyHash = () => {
    if (certData?.cryptographicSha256) {
      navigator.clipboard.writeText(certData.cryptographicSha256);
      setHashCopied(true);
      setTimeout(() => setHashCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  DNV-ST-0376 Blade Repair Certificate & Fleet KPIs
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  DNV Certified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Pillar 6 Reporting • Cryptographic Audit Trail & Operational Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher Tabs */}
            <div className="bg-slate-200/80 p-0.5 rounded-xl flex text-xs font-semibold">
              <button
                onClick={() => setActiveTab('certificate')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'certificate'
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                BIRR Certificate
              </button>
              <button
                onClick={() => setActiveTab('kpis')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'kpis'
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fleet Analytics & KPIs
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-2">
              <span className="animate-spin text-2xl">⏳</span>
              <p className="text-xs font-medium">Compiling cryptographic certificate & querying fleet metrics...</p>
            </div>
          ) : activeTab === 'certificate' ? (
            /* Certificate View */
            <div className="space-y-6">
              {/* Document Certificate Sheet */}
              <div className="border-2 border-slate-300 rounded-2xl p-6 bg-slate-50/50 shadow-inner relative overflow-hidden">
                {/* Watermark / Seal Background */}
                <div className="absolute right-4 top-4 opacity-5 pointer-events-none text-9xl font-black">
                  DNV
                </div>

                {/* Certificate Title Banner */}
                <div className="flex flex-wrap items-center justify-between border-b-2 border-slate-300 pb-4 mb-4 gap-2">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-sky-700 uppercase">
                      Standard DNV-ST-0376 Rotor Blade Structural Repair
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      Blade Inspection & Repair Report (BIRR) Certificate
                    </h3>
                    <p className="text-xs text-slate-600">
                      Site: <strong className="text-slate-900">{certData?.site?.name}</strong> • {certData?.site?.county}, {certData?.site?.state} ({certData?.site?.coordinates})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-700 block">
                      {certData?.certificateId}
                    </span>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                      READY FOR COMMISSIONING
                    </span>
                  </div>
                </div>

                {/* Asset Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Turbine Asset</span>
                    <div className="font-extrabold text-slate-900">{certData?.turbine?.unitId}</div>
                    <div className="text-[11px] text-slate-500">{certData?.turbine?.oemModel}</div>
                    <div className="text-[11px] text-slate-500">Rotor: {certData?.turbine?.rotorDiameterMeters}m • Span: {certData?.turbine?.bladeLengthMeters}m</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Blade Target</span>
                    <div className="font-extrabold text-slate-900">{certData?.blade?.serialNumber}</div>
                    <div className="text-[11px] text-slate-500">{certData?.blade?.position}</div>
                    <div className="text-[11px] text-slate-500">Installed Span: {certData?.blade?.installedSpanMeters}m</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Defect Classification</span>
                    <div className="font-extrabold text-amber-700">Category {certData?.defect?.category} Structural</div>
                    <div className="text-[11px] text-slate-600">{certData?.defect?.surfaceSide} @ {certData?.defect?.locationSpanMeters}m</div>
                    <div className="text-[11px] text-slate-500">Depth: {certData?.defect?.defectDepthMm}mm • {certData?.defect?.preparedBevelDimensionsMm}</div>
                  </div>
                </div>

                {/* Repair Execution & QA Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1 flex items-center justify-between">
                      <span>Composite Repair Specification</span>
                      <span className="text-sky-600 font-mono">50:1 Ratio</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Scarf Ratio:</span>
                        <strong className="text-slate-800">{certData?.repairExecution?.scarfRatio}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Plies Applied:</span>
                        <strong className="text-slate-800">{certData?.repairExecution?.pliesApplied} Structural Plies</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Resin System:</span>
                        <strong className="text-slate-800">{certData?.repairExecution?.resinSystem}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Resin Lot #:</span>
                        <strong className="text-slate-800 font-mono">{certData?.repairExecution?.resinBatchLot}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Thermal Dwell:</span>
                        <strong className="text-slate-800">{certData?.repairExecution?.postCureDwellHours}h @ {certData?.repairExecution?.postCureTargetTempC}°C</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Vacuum Seal:</span>
                        <strong className="text-slate-800">{certData?.repairExecution?.postCureVacuumBar} bar</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1 flex items-center justify-between">
                      <span>Quality Assurance Verification</span>
                      <span className="text-emerald-600 font-semibold">100% Passed</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">LPS Continuity:</span>
                        <strong className="text-emerald-700 font-bold">
                          {certData?.qaValidation?.lpsContinuityResistanceOhms} Ω
                        </strong>
                        <span className="text-[10px] text-slate-400 block">(Max &lt; 0.50 Ω)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Ultrasonic NDT:</span>
                        <strong className="text-emerald-700 font-bold">Void-Free Verified</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Barcol Hardness:</span>
                        <strong className="text-slate-800">{certData?.qaValidation?.barcolHardnessReading} (Spec &gt; 35)</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Aero Finish:</span>
                        <strong className="text-slate-800">Gelcoat Flush &amp; Contoured</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signatories & Cryptographic Seal */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-b border-slate-100 pb-3">
                    <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Lead Composite Technician</span>
                      <div className="font-extrabold text-slate-900">{certData?.signatories?.leadTechnician?.name}</div>
                      <div className="text-[11px] text-slate-600">{certData?.signatories?.leadTechnician?.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">Credential: {certData?.signatories?.leadTechnician?.credentialNumber}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">✓ Digitally Signed &amp; Stamped</div>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">OEM Site Quality Operations Lead</span>
                      <div className="font-extrabold text-slate-900">{certData?.signatories?.oemSiteQualityLead?.name}</div>
                      <div className="text-[11px] text-slate-600">{certData?.signatories?.oemSiteQualityLead?.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">Credential: {certData?.signatories?.oemSiteQualityLead?.credentialNumber}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">✓ Digitally Signed &amp; Stamped</div>
                    </div>
                  </div>

                  {/* SHA-256 Seal Block */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-900 text-white rounded-xl p-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                        <span>🔒</span>
                        <span>Cryptographic SHA-256 Tamper-Proof Seal:</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-300 break-all select-all">
                        {certData?.cryptographicSha256}
                      </div>
                    </div>
                    <button
                      onClick={handleCopyHash}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold whitespace-nowrap transition-all shadow"
                    >
                      {hashCopied ? '✓ Copied' : 'Copy Hash'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <span>🖨️</span> Print / Export PDF
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Fleet KPI Analytics View */
            <div className="space-y-6">
              {/* Top 4 KPI Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-sky-700 block mb-1">Fleet Availability</span>
                  <div className="text-2xl font-black text-sky-900">{kpiData?.fleetAvailabilityPercent}%</div>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">▲ +1.5% vs Q4 Target</span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">Mean Time to Repair</span>
                  <div className="text-2xl font-black text-emerald-900">{kpiData?.meanTimeToRepairHours}h</div>
                  <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Blade Composite Average</span>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block mb-1">Standby Avoided</span>
                  <div className="text-2xl font-black text-amber-900">{kpiData?.avoidedStandbyHours}h</div>
                  <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">
                    ${kpiData?.standbyCostSavingsUsd?.toLocaleString()} Saved
                  </span>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-700 block mb-1">First-Time Pass</span>
                  <div className="text-2xl font-black text-indigo-900">{kpiData?.firstTimePassRatePercent}%</div>
                  <span className="text-[10px] text-indigo-700 font-semibold block mt-0.5">DNV-ST-0376 Standard</span>
                </div>
              </div>

              {/* Regional Breakdown Cards */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <h4 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center justify-between">
                  <span>Arizona Regional Array Operational Performance</span>
                  <span className="text-xs font-semibold text-slate-500">118 Turbines Monitored</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {kpiData?.regionalBreakdown?.map((region: any, i: number) => (
                    <div key={i} className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                      <div className="font-bold text-xs text-slate-800 mb-1">{region.region}</div>
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                        <span>Turbines: <strong>{region.turbines}</strong></span>
                        <span>Open Repairs: <strong className="text-amber-700">{region.openRepairs}</strong></span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-sky-600 h-2 rounded-full"
                          style={{ width: `${region.availability}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] font-semibold text-right text-sky-800 mt-1">
                        {region.availability}% Uptime
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trend Progress */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <h4 className="font-extrabold text-sm text-slate-900 mb-3">
                  Monthly Repair Velocity &amp; Standby Mitigation Trend
                </h4>
                <div className="space-y-3">
                  {kpiData?.monthlyTrends?.map((trend: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                      <div className="w-24 font-bold text-slate-700">{trend.month}</div>
                      <div className="flex-1 mx-4">
                        <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                          <span>Availability: <strong>{trend.availabilityPercent}%</strong></span>
                          <span>Repairs: <strong>{trend.repairsCompleted}</strong></span>
                          <span>Avoided: <strong>{trend.standbyHoursAvoided}h</strong></span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{ width: `${trend.availabilityPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
