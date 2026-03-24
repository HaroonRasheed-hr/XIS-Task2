import React from 'react';
import { XIcon, WarnIcon } from './Icons';

export default function ConfirmModal({ image, onClose, onConfirm }) {
   return (
      <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
         <div className="modal">
            <div className="modal-hdr">
               <span className="modal-title">Confirm deletion</span>
               <button className="modal-close" onClick={onClose}><XIcon /></button>
            </div>
            <div className="confirm-body">
               <div className="confirm-icon"><WarnIcon /></div>
               <div className="confirm-h">Delete this image?</div>
               <p className="confirm-p">
                  "{image.name}" will be permanently removed. This cannot be undone.
               </p>
               <div className="confirm-btns">
                  <button className="btn-cancel" onClick={onClose}>Cancel</button>
                  <button className="btn-confirm-del" onClick={() => { onConfirm(image.id); onClose(); }}>
                     Yes, delete
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
