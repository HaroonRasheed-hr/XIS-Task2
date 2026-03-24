import React, { useState } from 'react';
import { EyeIcon, TrashIcon, ImageIcon } from './Icons';

const BADGE = { jpg: 'badge-jpg', jpeg: 'badge-jpeg', png: 'badge-png', gif: 'badge-gif', webp: 'badge-webp', svg: 'badge-svg' };

export default function ImageCard({ image, index, onView, onDelete }) {
   const [imgError, setImgError] = useState(false);

   return (
      <div className="card" style={{ animationDelay: `${index * 0.055}s` }}>
         {!imgError
            ? <img className="card-thumb" src={image.url} alt={image.name} onError={() => setImgError(true)} />
            : <div className="thumb-placeholder"><ImageIcon /></div>
         }
         <div className="card-top-badge">
            <span className={`type-badge ${BADGE[image.type] || 'badge-png'}`}>{image.type}</span>
         </div>
         <div className="card-overlay">
            <div className="overlay-actions">
               <button className="oa-btn oa-view" onClick={() => onView(image)}>VIEW</button>
               <button className="oa-btn oa-del" onClick={() => onDelete(image)}>DELETE</button>
            </div>
         </div>
         <div className="card-body">
            <div className="card-name" title={image.name}>{image.name}</div>
            <div className="card-meta"><span>{image.size}</span><span>{image.date}</span></div>
         </div>
      </div>
   );
}
