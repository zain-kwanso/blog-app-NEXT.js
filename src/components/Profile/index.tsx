"use client";

import React, { useRef, useState, useEffect } from "react";
import { FaPencilAlt, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import { UserResponse } from "../../../@types/user";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { url } from "@/utils/URL";

interface UserDetailsProps {
  user?: UserResponse | null;
  onSignOut: () => void;
  onClose: () => void;
  updateProfilePicture: (url: string) => void;
}

const Profile: React.FC<UserDetailsProps> = ({
  user,
  onSignOut,
  onClose,
  updateProfilePicture,
}): React.JSX.Element => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePictureUrl || ""
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true); // State for image loading
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      alert("Please select an image file (jpeg, png, etc.)");
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fileName", selectedFile.name);
    formData.append("fileType", selectedFile.type);

    try {
      setLoading(true);

      const response = await axiosInstance.post(url.upload_profile, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      setProfilePicture(data.fileUrl);
      setPreviewUrl(null);
      updateProfilePicture(data.fileUrl);
      toast.success("Profile Picture Updated Successfully.");
    } catch (error) {
      console.error("Error uploading file", error);
      toast.error("Error Uploading File.");
    } finally {
      setLoading(false);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    fileInputRef.current!.value = "";
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Profile Picture Section */}
        <div className="flex items-center mb-4">
          {previewUrl ? (
            <div className="relative">
              {imageLoading && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <FaSpinner className="animate-spin text-gray-500" />
                </div>
              )}
              <Image
                src={previewUrl}
                alt="Preview Picture"
                width={80}
                height={80}
                className={`w-20 h-20 rounded-full mr-4 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoadingComplete={() => setImageLoading(false)}
              />
              <button
                className="absolute bottom-0 right-0 bg-white rounded-full p-1"
                onClick={triggerFileSelect}
                style={{
                  color: "black",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <FaPencilAlt className="text-base" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <div className="relative">
              {imageLoading && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <FaSpinner className="animate-spin text-gray-500" />
                </div>
              )}
              <Image
                src={
                  profilePicture ||
                  "https://generated.vusercontent.net/placeholder-user.jpg"
                }
                alt="Profile Picture"
                width={80}
                height={80}
                className={`w-20 h-20 rounded-full mr-4 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoadingComplete={() => setImageLoading(false)}
              />
              <button
                className="absolute bottom-0 right-0 bg-white rounded-full p-1"
                onClick={triggerFileSelect}
                style={{
                  color: "black",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <FaPencilAlt className="text-base" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          )}
          <h2 className="text-xl font-semibold">User Profile</h2>
        </div>

        {/* Action Buttons */}
        {selectedFile && (
          <div className="flex justify-start gap-2 mt-4">
            <button
              className="bg-blue-500 text-white rounded-full p-2"
              onClick={handleFileUpload}
              disabled={loading}
              title="Upload"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
            </button>

            <button
              className="bg-red-500 text-white rounded-full p-2"
              onClick={handleCancel}
              disabled={loading}
              title="Cancel"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* User Name */}
        <p className="mt-4 text-gray-700">
          <strong>Name:</strong> {user?.name}
        </p>

        {/* Sign Out and Close Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="bg-red-500 text-white text-xs px-4 py-2 rounded"
            onClick={onSignOut}
          >
            Sign Out
          </button>
          <button
            className="bg-gray-300 text-xs px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
