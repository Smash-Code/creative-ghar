// components/AdminBannerManager.jsx
'use client';

import { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const BannerItem = ({ banner, index, moveBanner, onDelete }) => {
  const [, ref] = useDrop({
    accept: 'BANNER',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveBanner(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [, drag] = useDrag({
    type: 'BANNER',
    item: { index },
  });

  return (
    <div
      ref={(node) => drag(ref(node))}
      className="flex items-center p-2 mb-2 bg-white rounded shadow"
    >
      <span className="mr-4 text-gray-500">{index + 1}</span>
      <img 
        src={banner.url} 
        alt={`Banner ${index + 1}`} 
        className="w-20 h-12 object-cover mr-4"
      />
      <button
        onClick={() => onDelete(banner.id, banner.public_id)}
        className="ml-auto text-red-500"
      >
        Delete
      </button>
    </div>
  );
};

export default function AdminBannerManager() {
  const [banners, setBanners] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banner');
      const data = await response.json();
      if (data.success) {
        setBanners(data.banners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('/api/banner/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        await fetchBanners();
        setFiles([]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const moveBanner = async (fromIndex, toIndex) => {
    const updatedBanners = [...banners];
    const [movedBanner] = updatedBanners.splice(fromIndex, 1);
    updatedBanners.splice(toIndex, 0, movedBanner);

    // Update local state immediately for responsive UI
    setBanners(updatedBanners);

    // Update order in database
    const updates = updatedBanners.map((banner, index) => ({
      id: banner.id,
      order: index + 1,
    }));

    try {
      await fetch('/api/banner', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });
    } catch (error) {
      console.error('Error updating order:', error);
      // Revert if failed
      fetchBanners();
    }
  };

  const handleDelete = async (id, public_id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await fetch('/api/banner', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, public_id }),
      });
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Manage Banners</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Upload New Banners</h3>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            className="mb-2"
          />
          <button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2"> {banners.length <= 0 ? "Current Banners" : "Drag and Drop to change banner order"} </h3>
          <div className="border rounded p-4">
            {banners.length === 0 ? (
              <p className="text-gray-500">No banners uploaded yet.</p>
            ) : (
              banners.map((banner, index) => (
                <BannerItem
                  key={banner.id}
                  banner={banner}
                  index={index}
                  moveBanner={moveBanner}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}