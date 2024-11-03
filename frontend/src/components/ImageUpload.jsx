// components/ImageUpload.jsx
import { useState } from 'react';

export default function ImageUpload({ image, setImage, imagePreview, setImagePreview }) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-1/3 bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
      <label className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
        Upload Image
        <input type="file" onChange={handleImageChange} className="hidden" />
      </label>
      {imagePreview && (
        <img src={imagePreview} alt="Selected" className="w-full h-auto rounded-lg border mt-4" />
      )}
    </div>
  );
}
