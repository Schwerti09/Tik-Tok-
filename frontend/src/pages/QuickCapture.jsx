import React, { useState } from 'react';
import { Upload, Film } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuickCapture() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type.startsWith('video/')) {
      setFile(dropped);
      toast.success(`"${dropped.name}" bereit zum Upload`);
    } else {
      toast.error('Bitte eine Videodatei ablegen.');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold gradient-text">QuickCapture</h2>
        <p className="text-sm text-gray-500 mt-0.5">Video hochladen und direkt bearbeiten</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`glass-card p-8 sm:p-12 flex flex-col items-center justify-center gap-4 border-2 border-dashed transition-colors cursor-pointer ${
          dragging ? 'border-brand-500 bg-brand-50' : 'border-brand-200 hover:border-brand-400'
        }`}
        onClick={() => document.getElementById('file-input').click()}
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center">
          {file ? <Film size={28} className="text-brand-600" /> : <Upload size={28} className="text-brand-400" />}
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-700">
            {file ? file.name : 'Video hierher ziehen'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {file ? `${(file.size / 1e6).toFixed(1)} MB` : 'oder klicken zum Auswählen – MP4, MOV, WebM'}
          </p>
        </div>
        {file && (
          <button className="btn-primary text-sm" onClick={(e) => { e.stopPropagation(); toast.success('Upload gestartet!'); }}>
            Upload starten
          </button>
        )}
        <input id="file-input" type="file" accept="video/*" className="hidden"
          onChange={(e) => { const f = e.target.files[0]; if (f) { setFile(f); toast.success(`"${f.name}" bereit`); } }}
        />
      </div>
    </div>
  );
}
