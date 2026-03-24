import React from 'react';
import { XIcon } from './Icons';

export default function PreviewModal({ image, onClose, onDelete }) {
   return (
      <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
         <div className="modal">
            <div className="modal-hdr">
               <span className="modal-title">{image.name}</span>
               <button className="modal-close" onClick={onClose}><XIcon /></button>
            </div>
            <div className="modal-img-wrap">
               <img className="modal-img" src={image.url} alt={image.name} />
            </div>
            <div className="modal-ftr">
               <div>
                  <div className="modal-name">{image.name}</div>
                  <div className="modal-sub">{image.size} · {image.type.toUpperCase()} · {image.date}</div>
               </div>
               <button className="btn-danger" onClick={() => { onDelete(image); onClose(); }}>
                  Delete image
               </button>
            </div>
         </div>
      </div>
   );
}
