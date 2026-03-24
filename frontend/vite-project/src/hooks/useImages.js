import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/images/';

const formatBytes = (bytes) => {
   if (bytes < 1024) return `${bytes} B`;
   if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
   return `${(bytes / 1048576).toFixed(1)} MB`;
};

// Create axios instance with auth headers
const createAuthAxios = () => {
   const token = localStorage.getItem('authToken');
   const config = {
      baseURL: 'http://localhost:8000/api',
      headers: {}
   };

   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }

   return axios.create(config);
};

export default function useImages() {
   const [images, setImages] = useState([]);
   const [uploading, setUploading] = useState(false);
   const [progress, setProgress] = useState(0);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   // Check authentication on mount
   useEffect(() => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
      if (token) {
         fetchImages();
      } else {
         setLoading(false);
      }
   }, []);

   const fetchImages = useCallback(async () => {
      try {
         setLoading(true);
         const token = localStorage.getItem('authToken');

         if (!token) {
            setError('Please login to view your images');
            setLoading(false);
            return;
         }

         const client = createAuthAxios();
         const response = await client.get('/images/');
         setImages(response.data.results || response.data);
         setError(null);
      } catch (err) {
         console.error('Error fetching images:', err);
         if (err.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
         } else {
            setError('Failed to load images');
         }
      } finally {
         setLoading(false);
      }
   }, []);

   const addFiles = useCallback(async (files) => {
      const token = localStorage.getItem('authToken');

      if (!token) {
         setError('Please login to upload images');
         return;
      }

      setUploading(true);
      setProgress(0);

      try {
         const client = createAuthAxios();
         const uploadPromises = Array.from(files).map((file) => {
            const formData = new FormData();
            formData.append('file', file);

            return client.post('/images/', formData, {
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
         if (err.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
         } else {
            setError('Failed to upload images');
         }
      } finally {
         setUploading(false);
         setProgress(0);
      }
   }, []);

   const deleteImage = useCallback(async (id) => {
      const token = localStorage.getItem('authToken');

      if (!token) {
         setError('Please login to delete images');
         return;
      }

      try {
         const client = createAuthAxios();
         await client.delete(`/images/${id}/`);
         setImages((prev) => prev.filter((img) => img.id !== id));
         setError(null);
      } catch (err) {
         console.error('Error deleting image:', err);
         if (err.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
         } else if (err.response?.status === 403) {
            setError('You can only delete your own images');
         } else {
            setError('Failed to delete image');
         }
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
      isAuthenticated,
   };
}
