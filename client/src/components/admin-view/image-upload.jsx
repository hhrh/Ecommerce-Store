import { useEffect, useRef, useState } from "react";
import axios from "axios";

function ProductImageUpload({ images, setImages, loadingIndexes, setLoadingIndexes }) {
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && images.length < 6) {
      const newIndex = images.length; // Index for the new image
      setLoadingIndexes((prev) => [...prev, newIndex]); // Mark as loading
      const uploadResult = await uploadToCloudinary(file);
      if (uploadResult) {
        setImages((prevImages) => [
          ...prevImages,
          { preview: URL.createObjectURL(file), cloudinaryData: uploadResult },
        ]);
      }
      // Remove from loading indexes
      setLoadingIndexes((prev) => prev.filter((index) => index !== newIndex));
    }
  };

  const handlePlusClick = () => {
    inputRef.current.click();
  };

    async function uploadToCloudinary(file) {
        const data = new FormData();
        data.append("my_file", file);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`, data);
        if(response?.data?.success) {
            return ({
            secure_url: response.data.data.secure_url, 
            public_id: response.data.data.public_id
            })
        }
    }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && images.length < 6) {
      const newIndex = images.length; // Index for the new image
      setLoadingIndexes((prev) => [...prev, newIndex]); // Mark as loading
      const uploadResult = await uploadToCloudinary(file);
      if (uploadResult) {
        setImages((prevImages) => [
          ...prevImages,
          uploadResult,
        ]);
      }
      // Remove from loading indexes
      setLoadingIndexes((prev) => prev.filter((index) => index !== newIndex));
    }
  };


  async function deleteFromCloudinary(publicId) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/delete-image`, {
        public_id: publicId
      });
      if (response.data.result === 'ok') {
        console.log("Image deleted successfully.");
      } else {
        console.error("Failed to delete image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  const handleRemoveImage = async (index) => {
    const imageToRemove = images[index];
    const publicId = imageToRemove.public_id;
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    await deleteFromCloudinary(publicId);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };


  return (
    <div className="mt-2 font-medium">
      Upload Images
    <div
      className="grid grid-cols-3 gap-4 p-4"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {images && images.map((image, index) => (
        <div
          key={index}
          className="relative w-full h-32 border rounded-md overflow-hidden"
        >
          {/* Show Loading Spinner */}
          {loadingIndexes.includes(index) ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Image Preview */}
              <img
                src={image.secure_url}
                alt={`Uploaded ${index}`}
                className="object-cover w-full h-full"
              />
              {/* Remove Button */}
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
              >
                &times;
              </button>
            </>
          )}
        </div>
      ))}

      {/* Add Image Box */}
      {images && images.length < 6 && (
        <div
          className="relative w-full h-32 border-dashed border-2 border-gray-400 flex items-center justify-center rounded-md cursor-pointer hover:border-gray-600"
          onClick={handlePlusClick}
        >
          <span className="text-gray-500 text-2xl font-bold">+</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      )}
    </div>
    </div>
  )
}

export default ProductImageUpload;