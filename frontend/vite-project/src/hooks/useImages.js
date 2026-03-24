import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/images/';

const formatBytes = (bytes) => {
   if (bytes < 1024) return `${bytes} B`;
   if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
   return `${(bytes / 1048576).toFixed(1)} MB`;
};

export default function useImages() {
   const [images, setImages] = useState([]);
   const [uploading, setUploading] = useState(false);
   const [progress, setProgress] = useState(0);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // Fetch all images on mount
   useEffect(() => {
      fetchImages();
   }, []);

   const fetchImages = useCallback(async () => {
      try {
         setLoading(true);
         const response = await axios.get(API_URL);
         setImages(response.data.results || response.data);
         setError(null);
      } catch (err) {
         console.error('Error fetching images:', err);
         setError('Failed to load images');
      } finally {
         setLoading(false);
      }
   }, []);

   const addFiles = useCallback(async (files) => {
      setUploading(true);
      setProgress(0);

      try {
         const uploadPromises = Array.from(files).map((file) => {
            const formData = new FormData();
            formData.append('file', file);

            return axios.post(API_URL, formData, {
               headers: { 'Content-Type': 'multipart/form-data' },
               onUploadProgress: (progressEvent) => {
                  const percentCompleted = Math.round(
                     (progressEvent.loaded * 100) / progressEvent.total
                  );
                  setProgress(percentCompleted);
               },
            });
         });

         const responses = await Promise.all(uploadPromises);
         const newImages = responses.map((res) => res.data);
         setImages((prev) => [...newImages, ...prev]);
         setError(null);
      } catch (err) {
         console.error('Error uploading images:', err);
         setError('Failed to upload images');
      } finally {
         setUploading(false);
         setProgress(0);
      }
   }, []);

   const deleteImage = useCallback(async (id) => {
      try {
         await axios.delete(`${API_URL}${id}/`);
         setImages((prev) => prev.filter((img) => img.id !== id));
         setError(null);
      } catch (err) {
         console.error('Error deleting image:', err);
         setError('Failed to delete image');
      }
   }, []);

   const totalMB = images.reduce((acc, img) => {
      const n = parseFloat(img.size) || 0;
      return acc + (img.size.includes('MB') ? n : n / 1024);
   }, 0);

   const uniqueTypes = [...new Set(images.map((img) => img.type))];

   return {
      images,
      uploading,
      progress,
      totalMB,
      uniqueTypes,
      loading,
      error,
      addFiles,
      deleteImage,
      fetchImages,
   };
}
