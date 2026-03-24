import React, { useState } from 'react';
import { EyeIcon, TrashIcon, ImageIcon } from './Icons';

export default function ListCard({ image, index, onView, onDelete }) {
   const [imgError, setImgError] = useState(false);

   return (
      <div className="lcard" style={{ animationDelay: `${index * 0.04}s` }}>
         {!imgError
            ? <img className="lthumb" src={image.url} alt={image.name} onError={() => setImgError(true)} />
            : <div className="lthumb-ph"><ImageIcon /></div>
         }
         <div className="linfo">
            <div className="lname" title={image.name}>{image.name}</div>
            <div className="lsub">{image.size} · {image.type.toUpperCase()} · {image.date}</div>
         </div>
         <div className="lactions">
            <button className="la-btn view" onClick={() => onView(image)}><EyeIcon /></button>
            <button className="la-btn del" onClick={() => onDelete(image)}><TrashIcon /></button>
         </div>
      </div>
   );
}
