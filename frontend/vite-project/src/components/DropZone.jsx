import React, { useState, useRef } from 'react';
import { UploadIcon } from './Icons';

const FORMATS = ['JPG', 'PNG', 'GIF', 'WEBP', 'SVG'];
const ACCEPTED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_MB = 15;

export default function DropZone({ onFiles, onError }) {
   const [dragging, setDragging] = useState(false);
   const inputRef = useRef(null);

   const validate = (files) => {
      const arr = Array.from(files);
      const valid = arr.filter((f) => ACCEPTED.includes(f.type));
      if (!valid.length) { onError('Only image files allowed (JPG, PNG, GIF, WEBP, SVG)'); return; }
      if (valid.some((f) => f.size > MAX_MB * 1024 * 1024)) { onError(`Max file size is ${MAX_MB} MB`); return; }
      onFiles(valid);
   };

   return (
      <div
         className={`dropzone${dragging ? ' drag' : ''}`}
         onDrop={(e) => { e.preventDefault(); setDragging(false); validate(e.dataTransfer.files); }}
         onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
         onDragLeave={() => setDragging(false)}
      >
         <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => { if (e.target.files?.length) validate(e.target.files); e.target.value = ''; }}
         />
         <div className="dz-icon"><UploadIcon /></div>
         <div className="dz-title">Drop images here, or click to browse</div>
         <div className="dz-sub">Multi-file upload · Drag &amp; Drop supported · Max {MAX_MB} MB</div>
         <div className="dz-formats">
            {FORMATS.map((f) => <span key={f} className="fmt-tag">{f}</span>)}
         </div>
      </div>
   );
}
