// // components/AdminBannerManager.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { DndProvider } from 'react-dnd';
// import MarqueeAdmin from '../heading/page';

// const BannerItem = ({ banner, index, moveBanner, onDelete }) => {
//   const [, ref] = useDrop({
//     accept: 'BANNER',
//     hover: (draggedItem) => {
//       if (draggedItem.index !== index) {
//         moveBanner(draggedItem.index, index);
//         draggedItem.index = index;
//       }
//     },
//   });

//   const [, drag] = useDrag({
//     type: 'BANNER',
//     item: { index },
//   });

//   return (
//     <div
//       ref={(node) => drag(ref(node))}
//       className="flex items-center p-2 mb-2 bg-white rounded shadow"
//     >
//       <span className="mr-4 text-gray-500">{index + 1}</span>
//       <img
//         src={banner.url}
//         alt={`Banner ${index + 1}`}
//         className="w-20 h-12 object-cover mr-4"
//       />
//       {/* <button
//         onClick={() => onDelete(banner.id, banner.public_id)}
//         className="ml-auto text-red-500"
//       >
//         Delete
//       </button> */}
//       <button
//         onClick={() => onDelete(banner.id, banner.public_id)}
//         className="ml-auto p-2 cursor-pointer rounded bg-red-100 hover:bg-red-200 text-red-600"
//       >
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
//         </svg>
//       </button>
//     </div>
//   );
// };
// function AdminBannerManager() {
//   const [banners, setBanners] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   const fetchBanners = async () => {
//     try {
//       const response = await fetch('/api/banner');
//       const data = await response.json();
//       if (data.success) {
//         setBanners(data.banners);
//       }
//     } catch (error) {
//       console.error('Error fetching banners:', error);
//     }
//   };

//   const handleFileChange = (e) => {
//     setFiles(Array.from(e.target.files));
//   };

//   const handleUpload = async () => {
//     if (files.length === 0) return;

//     setIsUploading(true);
//     const formData = new FormData();
//     files.forEach(file => formData.append('files', file));

//     try {
//       const response = await fetch('/api/banner/upload', {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await response.json();
//       if (data.success) {
//         await fetchBanners();
//         setFiles([]);
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const moveBanner = async (fromIndex, toIndex) => {
//     const updatedBanners = [...banners];
//     const [movedBanner] = updatedBanners.splice(fromIndex, 1);
//     updatedBanners.splice(toIndex, 0, movedBanner);

//     // Update local state immediately for responsive UI
//     setBanners(updatedBanners);

//     // Update order in database
//     const updates = updatedBanners.map((banner, index) => ({
//       id: banner.id,
//       order: index + 1,
//     }));

//     try {
//       await fetch('/api/banner', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ updates }),
//       });
//     } catch (error) {
//       console.error('Error updating order:', error);
//       // Revert if failed
//       fetchBanners();
//     }
//   };

//   const handleDelete = async (id, public_id) => {
//     if (!confirm('Are you sure you want to delete this banner?')) return;

//     try {
//       await fetch('/api/banner', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ id, public_id }),
//       });
//       fetchBanners();
//     } catch (error) {
//       console.error('Error deleting banner:', error);
//     }
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="p-4">
//         <h2 className="text-xl font-bold mb-4">Manage Banners</h2>

//         <div className="mb-8">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700">Upload New Banners</h3>

//           {/* Custom styled file input */}
//           <label className="flex flex-col items-center justify-center w-full h-32 border-2 py-4 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200 mb-4">
//             <div className="flex flex-col items-center justify-center pt-5 pb-6">
//               <svg className="w-10 h-10 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
//               </svg>
//               <p className="mb-2 text-sm text-gray-500">
//                 <span className="font-semibold">Click to upload</span> or drag and drop
//               </p>
//               <p className="text-xs text-gray-500">PNG, JPG</p>
//             </div>
//             <input
//               type="file"
//               multiple
//               onChange={handleFileChange}
//               accept="image/*"
//               className="hidden"
//             />
//           </label>

//           {/* Upload button with icon */}
//           <button
//             onClick={handleUpload}
//             disabled={isUploading || files.length === 0}
//             className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-300 ${isUploading || files.length === 0
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
//               }`}
//           >
//             {isUploading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Uploading...
//               </>
//             ) : (
//               <>
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
//                 </svg>
//                 Upload {files.length > 0 && `(${files.length})`}
//               </>
//             )}
//           </button>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2"> {banners.length <= 0 ? "Current Banners" : "Drag and Drop to change banner order"} </h3>
//           <div className="border rounded p-4">
//             {banners.length === 0 ? (
//               <p className="text-gray-500">No banners uploaded yet.</p>
//             ) : (
//               banners.map((banner, index) => (
//                 <BannerItem
//                   key={banner.id}
//                   banner={banner}
//                   index={index}
//                   moveBanner={moveBanner}
//                   onDelete={handleDelete}
//                 />
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </DndProvider>
//   );
// }


// export default function page() {

//   return (
//     <div>
//       <AdminBannerManager />
//       <MarqueeAdmin />
//     </div>
//   )
// }




'use client';

import { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import MarqueeAdmin from '../heading/page';
import ConfirmationModal from '@/components/modals/DeleteModal';

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
        aria-label='Stat'
        onClick={() => onDelete(banner.id, banner.public_id)}
        className="ml-auto p-2 cursor-pointer rounded bg-red-100 hover:bg-red-200 text-red-600"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
        </svg>
      </button>
    </div>
  );
};

function AdminBannerManager() {
  const [banners, setBanners] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

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

    setBanners(updatedBanners);

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
      fetchBanners();
    }
  };

  const handleInitiateDelete = (id, public_id) => {
    setBannerToDelete({ id, public_id });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;

    try {
      await fetch('/api/banner', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: bannerToDelete.id, public_id: bannerToDelete.public_id }),
      });
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setBannerToDelete(null);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Manage Banners</h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Upload New Banners</h3>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 py-4 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200 mb-4">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG</p>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </label>

          <button
            aria-label='Stat'
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-300 ${isUploading || files.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                Upload {files.length > 0 && `(${files.length})`}
              </>
            )}
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
                  onDelete={handleInitiateDelete} // Pass the new initiate function
                />
              ))
            )}
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this banner? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </DndProvider>
  );
}

export default function page() {
  return (
    <div>
      <AdminBannerManager />
      <MarqueeAdmin />
    </div>
  );
}