import React, { useRef, useState } from "react";
import { FaUser, FaPencilAlt } from "react-icons/fa";
import Image from "next/image"; // Import Next.js Image component
import { UserResponse } from "../../../@types/user";

interface UserDetailsProps {
  user?: UserResponse | null;
  onSignOut: () => void;
  onClose: () => void;
}

const Profile: React.FC<UserDetailsProps> = ({
  user,
  onSignOut,
  onClose,
}): React.JSX.Element => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePictureUrl || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Profile Picture Section */}
        <div className="flex items-center mb-4">
          {profilePicture ? (
            <div className="relative">
              <Image
                src={
                  profilePicture ||
                  "https://generated.vusercontent.net/placeholder-user.jpg"
                }
                alt="Profile Picture"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full mr-4"
              />
              <button
                className="absolute bottom-0 right-0 bg-white rounded-full p-1"
                onClick={triggerFileSelect}
                style={{
                  color: "black",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <FaPencilAlt className="text-base" /> {/* Smaller icon size */}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <FaUser className="text-blue-500 w-20 h-20 mr-4" />
          )}
          <h2 className="text-xl font-semibold">User Profile</h2>
        </div>

        {/* User Name */}
        <p className="text-gray-700">
          <strong>Name:</strong> {user?.name}
        </p>

        {/* Action Buttons */}
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
