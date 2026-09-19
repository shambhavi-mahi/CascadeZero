import { X, UploadCloud, Camera } from "lucide-react";
import { useState } from "react";

interface UploadModalProps {
  onClose: () => void;
  onUpload: () => void;
}

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      onUpload();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">REPORT AN INCIDENT</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100/50 hover:border-blue-400 transition-colors cursor-pointer group">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Camera size={32} />
            </div>
            <p className="text-slate-700 font-medium mb-1">Drop an incident photo here</p>
            <p className="text-slate-400 text-sm mb-4">or click to browse from your device</p>
            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2"
            >
              <UploadCloud size={16} />
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Location</label>
              <div className="bg-slate-50 text-slate-500 p-2 rounded border border-slate-100 text-sm font-mono flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Automatically detecting...
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Incident Type</label>
              <div className="bg-slate-50 text-slate-500 p-2 rounded border border-slate-100 text-sm">
                [ Auto-detect via AI ]
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm shadow-blue-200 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing Incident...
              </>
            ) : (
              "Analyze Incident"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
