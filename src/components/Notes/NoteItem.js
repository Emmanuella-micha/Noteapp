import React from 'react';
import { motion } from 'framer-motion'; // Optional: Add if you want enhanced animations

const NoteItem = ({ note, onClick }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000);
      
      if (diff < 60) return 'just now';
      if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) !== 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch (err) {
      console.error('Date error:', err);
      return 'Unknown date';
    }
  };
  
  const truncate = (text, max = 100) => {
    if (!text) return '';
    // Remove HTML tags if present
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length <= max ? plainText : plainText.substring(0, max) + '...';
  };
  
  const hasImage = note.imageUrl || (note.imageUrls && note.imageUrls.length > 0);
  const imageUrl = note.imageUrl || (note.imageUrls?.[0] ?? null);
  
  // Define card content JSX for cleaner return statement
  const cardContent = (
    <>
      {/* Thumbnail with smooth loading transition */}
      {imageUrl && (
        <div className="h-32 sm:h-40 overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
          <img
            src={imageUrl}
            alt="Note Thumbnail"
            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
            loading="lazy"
            onLoad={(e) => e.target.classList.add('opacity-100')}
            style={{ opacity: 0 }} // Start invisible and fade in when loaded
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate transition-colors duration-300">
            {note.title || 'Untitled Note'}
          </h3>
          {note.pinned && (
            <span className="text-yellow-500 transform group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </span>
          )}
        </div>
        
        {/* Preview Text */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 flex-grow overflow-hidden line-clamp-3 transition-colors duration-300">
          {truncate(note.content, 180) || 'No content'}
        </p>
        
        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-2 mt-auto border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <span>{formatDate(note.updatedAt)}</span>
          
          <div className="flex items-center space-x-2">
            {hasImage && !imageUrl && (
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            
            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex space-x-1">
                {note.tags.slice(0, 1).map((tag, i) => (
                  <span 
                    key={i} 
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs px-2 py-0.5 rounded-full max-w-[70px] truncate transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
                {note.tags.length > 1 && (
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full transition-colors duration-300">
                    +{note.tags.length - 1}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  // If you're using framer-motion, return this:
  if (typeof motion !== 'undefined') {
    return (
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden group"
        onClick={onClick}
        whileHover={{ 
          y: -5,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {cardContent}
      </motion.div>
    );
  }
  
  // Regular version without framer-motion:
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden group"
      onClick={onClick}
      style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
    >
      {cardContent}
    </div>
  );
};

export default NoteItem;

