'use client';

import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import './PhotoUploader.css';

interface PhotoUploaderProps {
  onPhotoUploaded: (url: string | null) => void;
}

export default function PhotoUploader({ onPhotoUploaded }: PhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Compress the image
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // Show local preview immediately while uploading
      const localPreviewUrl = URL.createObjectURL(compressedFile);
      setPreviewUrl(localPreviewUrl);

      const formData = new FormData();
      // append the compressed file with original filename
      formData.append('file', compressedFile, file.name);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      
      // Pass the uploaded URL back to the parent
      onPhotoUploaded(data.url);
    } catch (err) {
      console.error(err);
      setError('Failed to upload photo. Please try again.');
      setPreviewUrl(null);
      onPhotoUploaded(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setError(null);
    onPhotoUploaded(null);
  };

  return (
    <div className="photo-uploader-container">
      <div className="photo-uploader-header">
        <h4 className="photo-uploader-title">PERSONALIZE YOUR HOLDER</h4>
        <p className="photo-uploader-desc">Upload a photo to be custom printed.</p>
      </div>

      {!previewUrl && !isUploading && (
        <div 
          className="photo-uploader-dropzone" 
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <span className="material-symbols-outlined">add_a_photo</span>
          <span>Click to upload photo</span>
        </div>
      )}

      {isUploading && (
        <div className="photo-uploader-dropzone uploading">
          <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span>
          <span>Uploading...</span>
        </div>
      )}

      {previewUrl && !isUploading && (
        <div className="photo-uploader-preview-container">
          <img src={previewUrl} alt="Uploaded preview" className="photo-uploader-preview-img" />
          <button className="photo-uploader-remove-btn" onClick={handleRemove}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>delete</span>
            Remove / Change Photo
          </button>
        </div>
      )}

      {error && <p className="photo-uploader-error">{error}</p>}

      <p className="upload-note-text">
        *Photo upload required before adding to cart. For best print quality, use clear photos under 5MB. Having trouble? Message us on Instagram (@ashpia_ceramic) or Email (hello@ashpia.com).
      </p>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
}
