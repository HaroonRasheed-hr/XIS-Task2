import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useImages from './hooks/useImages';
import DropZone from './components/DropZone';
import ImageCard from './components/ImageCard';
import ListCard from './components/ListCard';
import PreviewModal from './components/PreviewModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { GridIcon, ListIcon, ImageIcon } from './components/Icons';

function Dashboard() {
   const { images, uploading, progress, totalMB, uniqueTypes, loading, error, addFiles, deleteImage } = useImages();

   const [view, setView] = useState('grid');
   const [filter, setFilter] = useState('all');
   const [preview, setPreview] = useState(null);
   const [confirm, setConfirm] = useState(null);
   const [toast, setToast] = useState(null);

   const pop = useCallback((msg, type = 'ok') => setToast({ msg, type }), []);

   const handleFiles = useCallback((files) => {
      addFiles(files);
      pop(`${files.length} image${files.length > 1 ? 's' : ''} uploading...`, 'inf');
   }, [addFiles, pop]);

   const handleDelete = useCallback((id) => {
      deleteImage(id);
      pop('Image removed', 'inf');
   }, [deleteImage, pop]);

   const shown = filter === 'all' ? images : images.filter((img) => img.type === filter);
   const filterTabs = ['all', ...uniqueTypes];

   if (loading) {
      return (
         <>
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div className="app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
               <div style={{ textAlign: 'center' }}>
                  <div className="wordmark" style={{ marginBottom: '20px' }}>Loading...</div>
                  <div className="tagline">Fetching your images</div>
               </div>
            </div>
         </>
      );
   }

   return (
      <>
         <div className="orb orb-1" />
         <div className="orb orb-2" />
         <div className="orb orb-3" />

         <div className="app">
            {/* HEADER */}
            <header className="header">
               <div>
                  <div className="wordmark">XIS <em>Wallet</em></div>
                  <div className="tagline">Image Management System</div>
               </div>
               <div className="header-pills">
                  <div className="pill"><div className="pill-dot" /><b>{images.length}</b>&nbsp;assets</div>
                  <div className="pill"><b>{totalMB.toFixed(1)} MB</b>&nbsp;stored</div>
                  <div className="pill"><b>{uniqueTypes.length}</b>&nbsp;types</div>
               </div>
            </header>

            {/* STATS */}
            <div className="stats-row">
               <div className="stat-card"><div className="stat-val">{images.length}</div><div className="stat-lbl">Total Images</div></div>
               <div className="stat-card"><div className="stat-val">{totalMB.toFixed(1)} MB</div><div className="stat-lbl">Storage Used</div></div>
               <div className="stat-card"><div className="stat-val">{uniqueTypes.length}</div><div className="stat-lbl">File Types</div></div>
            </div>

            {/* DROPZONE */}
            <DropZone onFiles={handleFiles} onError={(msg) => pop(msg, 'err')} />

            {/* PROGRESS */}
            <div className={`pbar-wrap${uploading ? ' show' : ''}`}>
               <div className="pbar" style={{ width: `${progress}%` }} />
            </div>

            {/* TOOLBAR */}
            <div className="toolbar">
               <div className="tl-left">
                  <span className="tl-label">Gallery</span>
                  <div className="filter-wrap">
                     {filterTabs.map((f) => (
                        <button key={f} className={`fbtn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                           {f === 'all' ? 'All' : f.toUpperCase()}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="tl-right">
                  <button className={`vbtn${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')}><GridIcon /></button>
                  <button className={`vbtn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}><ListIcon /></button>
               </div>
            </div>

            {/* GALLERY */}
            {shown.length === 0 ? (
               <div className="empty">
                  <div className="empty-ring"><ImageIcon /></div>
                  <div className="empty-h">Nothing here yet</div>
                  <p className="empty-p">{filter === 'all' ? 'Upload your first image above' : `No ${filter.toUpperCase()} files found`}</p>
               </div>
            ) : (
               <div className={`bento${view === 'list' ? ' list' : ''}`}>
                  {shown.map((img, i) =>
                     view === 'grid'
                        ? <ImageCard key={img.id} image={img} index={i} onView={setPreview} onDelete={setConfirm} />
                        : <ListCard key={img.id} image={img} index={i} onView={setPreview} onDelete={setConfirm} />
                  )}
               </div>
            )}
         </div>

         {preview && <PreviewModal image={preview} onClose={() => setPreview(null)} onDelete={(img) => { setConfirm(img); setPreview(null); }} />}
         {confirm && <ConfirmModal image={confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} />}
         {error && <Toast key={Date.now()} msg={error} type="err" onDone={() => { }} />}
         {toast && <Toast key={Date.now()} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      </>
   );
}

export default function App() {
   const isAuthenticated = !!localStorage.getItem('authToken');

   return (
      <Router>
         <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
         </Routes>
      </Router>
   );
}
