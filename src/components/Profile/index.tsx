"use client"; // Ensure this is a client-side component

import React from "react";
import { FaUser } from "react-icons/fa";
import { User } from "../../../@types/user";

interface UserDetailsProps {
  user?: User | null;
  onSignOut: () => void;
  onClose: () => void;
}

const Profile: React.FC<UserDetailsProps> = ({
  user,
  onSignOut,
  onClose,
}): React.JSX.Element => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <div className="flex items-center mb-4">
          <FaUser className="text-blue-500 w-10 h-10 mr-4" />
          <h2 className="text-xl font-semibold">User Profile</h2>
        </div>
        <p className="text-gray-700">
          <strong>Name:</strong> {user?.name}
        </p>
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
