import React, { useRef, useState } from 'react';
import { Upload, Film, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VideoUpload({ onFileSelect, accept = 'video/*' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      toast.error('Bitte nur Videodateien hochladen.');
      return;
    }
    setFile(f);
    onFileSelect && onFileSelect(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
        ${dragging ? 'border-violet-500 bg-violet-500/10' : 'border-white/20 hover:border-violet-500/50 hover:bg-white/5'}
        ${file ? 'cursor-default' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {file ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/30 flex items-center justify-center">
              <Film size={20} className="text-violet-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setFile(null); onFileSelect && onFileSelect(null); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/30 to-pink-600/30 border border-violet-500/20 flex items-center justify-center mx-auto">
            <Upload size={24} className="text-violet-400" />
          </div>
          <div>
            <p className="text-white font-medium">Video hierher ziehen</p>
            <p className="text-gray-400 text-sm mt-1">oder <span className="text-violet-400">klicken zum Auswählen</span></p>
          </div>
          <p className="text-xs text-gray-500">MP4, MOV, AVI bis zu 500 MB</p>
        </div>
      )}
    </div>
  );
}
