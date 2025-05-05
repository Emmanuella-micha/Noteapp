// components/Settings/Settings.jsx
import React, { useState } from 'react';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { FaMoon, FaSun, FaCheck, FaUser, FaEnvelope, FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';

const Settings = ({ user, darkMode, toggleDarkMode }) => {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsUpdating(true);
    
    try {
      // Update display name
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Update email (requires reauthentication)
      if (email !== user.email && currentPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, email);
      }
      
      // Update password (requires reauthentication)
      if (newPassword && newPassword === confirmPassword && currentPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else if (newPassword && newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto`}>
        <h1 className="text-2xl font-bold mb-6 text-pink-500 dark:text-pink-400">Settings</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
            <FaCheck className="mr-2" /> {successMessage}
          </div>
        )}
        
        <div className="mb-6 p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <FaShieldAlt className="text-pink-500 w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Appearance</h2>
          </div>
          <div className="flex items-center pl-8">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 text-pink-500'
              } transition-colors`}
            >
              {darkMode ? (
                <>
                  <FaSun className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <FaMoon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
              Change the appearance of Notes
            </span>
          </div>
        </div>
        
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-6 p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <FaUser className="text-pink-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Account Information</h2>
            </div>
          
            <div className="mb-4 pl-8">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="mb-4 pl-8">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {email !== user.email && (
                <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                  You'll need to provide your current password to change your email
                </p>
              )}
            </div>
          </div>
          
          <div className="mb-6 p-4">
            <div className="flex items-center gap-3 mb-3">
              <FaKey className="text-pink-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Change Password</h2>
            </div>
            
            <div className="mb-4 pl-8">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="mb-4 pl-8">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="mb-6 pl-8">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords don't match</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;