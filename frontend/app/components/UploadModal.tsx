import { X, UploadCloud, Camera, CheckCircle2, Search } from "lucide-react";
import { useState, useRef } from "react";

interface UploadModalProps {
  onClose: () => void;
  onUpload: () => void;
}

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!imagePreview) {
      fileInputRef.current?.click();
      return;
    }
    
    setIsUploading(true);
    // Simulate AI scanning the uploaded image
    setTimeout(() => {
      onUpload();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 text-sm tracking-wider uppercase">Citizen Report Submission</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-1 border border-slate-200">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          {/* File Drop / Preview Zone */}
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative rounded-xl flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-300 ${
              imagePreview 
                ? 'border border-slate-200 bg-black aspect-video cursor-default' 
                : 'border-2 border-dashed border-slate-300 p-8 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 cursor-pointer group'
            }`}
          >
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Incident Preview" className="w-full h-full object-cover opacity-90" />
                
                {/* AI Scanning Animation overlay */}
                {isUploading && (
                  <>
                    <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay"></div>
                    
                    {/* The scanning bar */}
                    <div className="absolute left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_3px_rgba(96,165,250,0.8)]" style={{
                      animation: "scan-bar 2s ease-in-out infinite"
                    }}></div>
                    
                    <style>{`
                      @keyframes scan-bar {
                        0%, 100% { top: 0%; }
                        50% { top: 100%; }
                      }
                    `}</style>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-700/50 flex items-center gap-3">
                        <Search className="text-blue-400 animate-pulse" size={18} />
                        <span className="text-white text-sm font-semibold tracking-wide">AI Vision Analyzing...</span>
                      </div>
                    </div>
                  </>
                )}
                
                {!isUploading && (
                  <div className="absolute top-2 right-2 bg-slate-900/60 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer hover:bg-slate-900" onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}>
                    Change Photo
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <Camera size={28} />
                </div>
                <p className="text-slate-800 font-semibold mb-1">Click to upload photo</p>
                <p className="text-slate-500 text-xs font-medium">or drag and drop here</p>
              </>
            )}
          </div>

          {/* Metadata Display */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Geo-Location</label>
              <div className="bg-slate-50 text-slate-600 p-2.5 rounded-lg border border-slate-100 text-xs font-mono flex items-center gap-2 font-medium">
                <div className={`w-2 h-2 rounded-full ${imagePreview ? 'bg-emerald-500' : 'bg-slate-300 animate-pulse'}`}></div>
                {imagePreview ? 'Lat 16.515° N' : 'Waiting...'}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Incident Type</label>
              <div className="bg-slate-50 text-slate-400 p-2.5 rounded-lg border border-slate-100 text-xs font-medium flex items-center gap-2">
                {isUploading ? (
                  <><span className="w-3 h-3 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></span> Processing</>
                ) : imagePreview ? (
                  <><CheckCircle2 size={14} className="text-emerald-500"/> Ready to scan</>
                ) : (
                  "Pending Upload"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[10px] text-slate-400 font-medium">Securely processed by CascadeZero Vision AI.</p>
          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className={`px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all flex items-center gap-2 text-sm ${
              isUploading 
                ? 'bg-blue-700 text-white cursor-not-allowed opacity-80' 
                : imagePreview
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                  : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
            }`}
          >
            {isUploading ? (
              "Extracting Fault Data..."
            ) : imagePreview ? (
              <>Run AI Analysis</>
            ) : (
              <>
                <UploadCloud size={16} />
                Select Photo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
