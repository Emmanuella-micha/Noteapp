// components/Profile/Profile.jsx
import React from 'react';
import { FaUser, FaEnvelope, FaCalendarAlt, FaClock } from 'react-icons/fa';

const Profile = ({ user, darkMode }) => {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto`}>
        <h1 className="text-2xl font-bold mb-6 text-pink-500 dark:text-pink-400">User Profile</h1>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-pink-500 flex items-center justify-center text-white text-3xl font-bold">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="h-24 w-24 rounded-full" />
            ) : (
              user.email ? user.email.charAt(0).toUpperCase() : 'U'
            )}
          </div>
          
          <div className="flex-1 w-full">
            <div className="mb-4 p-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <FaUser className="text-pink-500 w-5 h-5" />
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Display Name</label>
              </div>
              <div className="text-gray-800 dark:text-white font-medium pl-8 mt-2">
                {user.displayName || 'Not set'}
              </div>
            </div>
            
            <div className="mb-4 p-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-pink-500 w-5 h-5" />
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Email</label>
              </div>
              <div className="text-gray-800 dark:text-white font-medium pl-8 mt-2">
                {user.email || 'Not available'}
              </div>
            </div>
            
            <div className="mb-4 p-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-pink-500 w-5 h-5" />
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Account Created</label>
              </div>
              <div className="text-gray-800 dark:text-white font-medium pl-8 mt-2">
                {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
            
            <div className="mb-4 p-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <FaClock className="text-pink-500 w-5 h-5" />
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Last Sign In</label>
              </div>
              <div className="text-gray-800 dark:text-white font-medium pl-8 mt-2">
                {user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;