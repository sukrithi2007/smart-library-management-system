import React, { useState, useEffect, useRef } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { QrCode, Camera, Search, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const ScanDiscoverModal: React.FC = () => {
  const { activeModal, setActiveModal, books, openBookDetail, addToast } = useLibrary();
  const [manualIsbn, setManualIsbn] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (activeModal === 'scanner') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeModal]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } else {
        setCameraError('Camera access is not supported in this browser environment.');
      }
    } catch {
      setCameraError('Camera permission was dismissed or unavailable. Use the manual ISBN lookup or quick scan presets below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  if (activeModal !== 'scanner') return null;

  const handleLookup = (isbnToFind: string) => {
    const cleanIsbn = isbnToFind.replace(/[^0-9X-]/gi, '').trim();
    const found = books.find(
      (b) =>
        b.isbn.replace(/[^0-9X-]/gi, '').toLowerCase() === cleanIsbn.toLowerCase() ||
        b.isbn.replace(/-/g, '') === cleanIsbn.replace(/-/g, '')
    );

    if (found) {
      addToast('success', 'Book Discovered!', `Found "${found.title}" by ${found.author}`);
      stopCamera();
      setActiveModal(null);
      openBookDetail(found);
    } else {
      addToast('error', 'ISBN Not Recognized', `No volume found matching ISBN "${isbnToFind}".`);
    }
  };

  const samplePresets = [
    { title: 'Artificial Intelligence', isbn: '978-0134610993' },
    { title: 'Designing Data-Intensive Apps', isbn: '978-1449373320' },
    { title: 'Quantum Computation', isbn: '978-1107002173' },
    { title: 'Principles of Neural Science', isbn: '978-0071390118' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200/20 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Scan & Discover
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Point camera at barcode or enter physical ISBN
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Camera Viewport / Scanner target */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Laser animation */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-48 h-32 border-2 border-dashed border-cyan-400/80 rounded-lg relative overflow-hidden">
                    <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse top-1/2" />
                  </div>
                  <span className="text-[11px] text-cyan-300 font-mono mt-2 bg-slate-950/80 px-2 py-0.5 rounded">
                    ALIGN BARCODE INSIDE RETICLE
                  </span>
                </div>
              </>
            ) : (
              <div className="p-6 text-center space-y-2">
                <Camera className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  {cameraError || 'Camera preview will activate when permitted.'}
                </p>
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/50 rounded-lg transition-colors"
                >
                  Request Camera Access
                </button>
              </div>
            )}
          </div>

          {/* Quick Barcode Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Instant Barcode Simulators (Test Stacks):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {samplePresets.map((preset) => (
                <button
                  key={preset.isbn}
                  onClick={() => handleLookup(preset.isbn)}
                  className="p-2 text-left rounded-lg border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 bg-slate-50 dark:bg-slate-800/40 hover:bg-cyan-500/5 transition-all group"
                >
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-cyan-400">
                    {preset.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {preset.isbn}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Manual ISBN Input Fallback */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Manual ISBN Lookup:
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLookup(manualIsbn);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. 978-0134610993"
                  value={manualIsbn}
                  onChange={(e) => setManualIsbn(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors whitespace-nowrap"
              >
                Lookup Book
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
