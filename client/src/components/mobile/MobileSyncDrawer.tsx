import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

interface MobileSyncDrawerProps {
  onClose: () => void;
}

export const MobileSyncDrawer: React.FC<MobileSyncDrawerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'barcode' | 'loto'>('queue');
  const [isFieldOffline, setIsFieldOffline] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Barcode scanner state
  const [barcodeInput, setBarcodeInput] = useState<string>('AZ-2026-0914');
  const [barcodeResult, setBarcodeResult] = useState<any>(null);
  const [validatingBarcode, setValidatingBarcode] = useState<boolean>(false);

  // Rotor Lock LOTO state
  const [pinEngaged, setPinEngaged] = useState<boolean>(true);
  const [windSpeed, setWindSpeed] = useState<number>(6.5);
  const [lotoResult, setLotoResult] = useState<any>(null);
  const [verifyingLoto, setVerifyingLoto] = useState<boolean>(false);

  useEffect(() => {
    loadSyncData();
  }, []);

  const loadSyncData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getSyncStatus();
      setSyncStatus(res);
    } catch (err) {
      console.error('Failed to load sync status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSync = async () => {
    try {
      await apiClient.processSyncQueue();
      await loadSyncData();
    } catch (err) {
      console.error('Failed to sync queue:', err);
    }
  };

  const handleScanBarcode = async (code: string) => {
    setBarcodeInput(code);
    setValidatingBarcode(true);
    try {
      const res = await apiClient.validateBarcode(code);
      setBarcodeResult(res);
    } catch (err) {
      console.error('Failed to validate barcode:', err);
    } finally {
      setValidatingBarcode(false);
    }
  };

  const handleVerifyLoto = async () => {
    setVerifyingLoto(true);
    try {
      const res = await apiClient.verifyRotorLock({
        turbineId: 'GE-Cypress-T04',
        technicianName: 'Adrian Lewis',
        pinEngagementConfirmed: pinEngaged,
        nacelleWindSpeedMps: windSpeed,
        photoChecksum: 'sha256-a9f83b271d440b82',
      });
      setLotoResult(res);
    } catch (err) {
      console.error('Failed to verify rotor lock:', err);
    } finally {
      setVerifyingLoto(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
              📡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Mobile Field Sync &amp; Safety Hub
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isFieldOffline 
                    ? 'bg-amber-100 text-amber-800 border-amber-300' 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {isFieldOffline ? 'Field Offline (Simulated)' : '4G LTE Connected'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Pillar 7 Mobile Operations • Arizona Desert Array Offline Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFieldOffline(!isFieldOffline)}
              className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all"
            >
              {isFieldOffline ? '📶 Reconnect 4G' : '🔌 Simulate Offline'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-slate-100 flex gap-2 bg-slate-50/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('queue')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🔄</span> Offline Sync Buffer ({syncStatus?.pendingQueueCount || 0} Pending)
          </button>
          <button
            onClick={() => setActiveTab('barcode')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'barcode'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🧪</span> Chemical Lot Scanner
          </button>
          <button
            onClick={() => setActiveTab('loto')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'loto'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🛡️</span> Rotor Lock LOTO Clearance
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading synchronization telemetry...</div>
          ) : activeTab === 'queue' ? (
            /* Queue Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900">
                    Offline Synchronization Buffer Status
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {syncStatus?.pendingQueueCount === 0 
                      ? 'All field records synced to cloud master ERP.' 
                      : `${syncStatus?.pendingQueueCount} items queued for background sync.`}
                  </div>
                </div>
                <button
                  onClick={handleProcessSync}
                  disabled={isFieldOffline || syncStatus?.pendingQueueCount === 0}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isFieldOffline || syncStatus?.pendingQueueCount === 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  🚀 Sync All Pending Now
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Queue Telemetry ({syncStatus?.totalItems} Total Records)
                </h4>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {syncStatus?.queue?.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-slate-300 transition-all shadow-sm"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{item.id}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {item.actionType}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Queued: {new Date(item.queuedAt).toLocaleTimeString()} • Payload: {JSON.stringify(item.payload).slice(0, 48)}...
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'SYNCED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'barcode' ? (
            /* Barcode Tab */
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-900">
                  DNV-ST-0376 Resin &amp; Hardener Chemical Lot Verification
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Enter or scan resin QR / Lot code..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <button
                    onClick={() => handleScanBarcode(barcodeInput)}
                    disabled={validatingBarcode}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-all shadow"
                  >
                    {validatingBarcode ? 'Checking...' : 'Validate Lot'}
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 flex-wrap">
                  <span>Preset Barcodes:</span>
                  <button
                    onClick={() => handleScanBarcode('AZ-2026-0914')}
                    className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-semibold"
                  >
                    ✓ AZ-2026-0914 (Hexion Valid)
                  </button>
                  <button
                    onClick={() => handleScanBarcode('AZ-2026-0418')}
                    className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 hover:bg-sky-200 font-semibold"
                  >
                    ✓ AZ-2026-0418 (Sika Valid)
                  </button>
                  <button
                    onClick={() => handleScanBarcode('AZ-2024-0105')}
                    className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 hover:bg-rose-200 font-semibold"
                  >
                    ✗ AZ-2024-0105 (Expired)
                  </button>
                </div>
              </div>

              {barcodeResult && (
                <div className={`p-4 rounded-2xl border ${
                  barcodeResult.isValid
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : 'bg-rose-50/60 border-rose-300'
                } space-y-2 text-xs`}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">
                      {barcodeResult.productName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      barcodeResult.isValid ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {barcodeResult.isValid ? 'OEM CERTIFIED APPROVED' : 'DISQUALIFIED / REJECTED'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>Manufacturer: <strong>{barcodeResult.manufacturer}</strong></div>
                    <div>Batch Lot: <strong className="font-mono">{barcodeResult.batchLot}</strong></div>
                    <div>Expiration Date: <strong>{barcodeResult.expirationDate}</strong></div>
                    <div>Pot Life @ 25°C: <strong>{barcodeResult.potLifeMinutesAt25C} minutes</strong></div>
                  </div>
                  <p className="text-[11px] font-medium pt-1 text-slate-700">
                    {barcodeResult.statusMessage}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* LOTO Tab */
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="font-extrabold text-slate-900">
                  Photographic Rotor Lock Lockout/Tagout (LOTO) Clearance
                </div>
                <p className="text-slate-500 text-[11px]">
                  OSHA &amp; OEM turbine safety protocols require verification of mechanical lock pin engagement and nacelle wind speed &lt; 12.0 m/s prior to suspended basket ascent.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 block text-[11px]">1. Mechanical Rotor Lock Pin</span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={pinEngaged}
                        onChange={(e) => setPinEngaged(e.target.checked)}
                        className="w-4 h-4 rounded text-sky-600"
                      />
                      <span>Pin Engaged into Hub Locking Disc</span>
                    </label>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-800">2. Anemometer Wind Speed</span>
                      <strong className={`font-mono ${windSpeed > 12.0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {windSpeed.toFixed(1)} m/s (Max 12.0 m/s)
                      </strong>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="20.0"
                      step="0.5"
                      value={windSpeed}
                      onChange={(e) => setWindSpeed(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleVerifyLoto}
                    disabled={verifyingLoto}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow"
                  >
                    {verifyingLoto ? 'Evaluating Safety Parameters...' : 'Authorize Safety Clearance'}
                  </button>
                </div>
              </div>

              {lotoResult && (
                <div className={`p-4 rounded-2xl border ${
                  lotoResult.isCleared
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-rose-50/70 border-rose-300'
                } space-y-2 text-xs`}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">
                      {lotoResult.safetyVerdict}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lotoResult.isCleared ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {lotoResult.isCleared ? 'WORK AUTHORIZED' : 'WORK PROHIBITED'}
                    </span>
                  </div>

                  {lotoResult.isCleared && (
                    <div className="space-y-1 pt-1 text-[11px]">
                      <div>Clearance Token: <strong className="font-mono text-emerald-900">{lotoResult.clearanceToken}</strong></div>
                      <div>Authorized Tech: <strong>{lotoResult.verifiedTechnician}</strong></div>
                      <div className="font-mono text-[10px] text-slate-500 break-all">
                        SHA-256 Seal: {lotoResult.sha256Seal}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all shadow"
          >
            Close Sync Hub
          </button>
        </div>
      </div>
    </div>
  );
};
