import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import axios from 'axios';
import { FaChevronLeft, FaImage, FaTag, FaPalette, FaEye, FaEyeSlash, FaThumbtack } from 'react-icons/fa';

const NewNoteForm = () => {
  const navigate = useNavigate();
  const [note, setNote] = useState({ 
    title: '', 
    content: '', 
    tags: [], 
    color: '#fff0f7' // Light pink default
  });
  
  const [status, setStatus] = useState({
    error: '',
    saving: false,
    showColorPicker: false,
    showTagInput: false,
    pinned: false,
    isPublic: false,
    shareLink: '',
    savedNoteId: null
  });
  
  const [tagInput, setTagInput] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  
  // Pink-focused color palette
  const colorPalette = [
    '#fff0f7', '#ffd6e7', '#ffb6d9', '#ff92c2', 
    '#ffe2f0', '#ffc2e2', '#ffffff'
  ];

  // Check authentication on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      user => !user && navigate('/signin')
    );
    return () => unsubscribe();
  }, [navigate]);

  // Show notification helper
  const showNotification = (message) => {
    setStatus(s => ({ ...s, error: '', saving: false }));
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-4 py-2 rounded-full shadow-md z-50 text-sm animate-fade-in-up';
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('animate-fade-out-down');
      setTimeout(() => notification.remove(), 300);
    }, 2700);
  };

  // Handle form actions
  const togglePublic = () => {
    const newIsPublic = !status.isPublic;
    setStatus(s => ({ 
      ...s, 
      isPublic: newIsPublic, 
      shareLink: newIsPublic ? `${window.location.origin}/view/note/temp-${Date.now()}` : '' 
    }));
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dpzh3o2pb', 'Img_Upload');
      
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', 
        formData
      );
      
      setImageUrls(prev => [...prev, response.data.secure_url]);
    } catch (error) {
      setStatus(s => ({ ...s, error: `Error uploading image: ${error.message}` }));
    }
  };

  const handleTags = {
    add: () => {
      if (tagInput.trim() && !note.tags.includes(tagInput.trim())) {
        setNote(n => ({ ...n, tags: [...n.tags, tagInput.trim()] }));
        setTagInput('');
      }
    },
    remove: (tagToRemove) => {
      setNote(n => ({ ...n, tags: n.tags.filter(tag => tag !== tagToRemove) }));
    }
  };

  const handleImages = {
    remove: (index) => setImageUrls(prev => prev.filter((_, i) => i !== index))
  };

  // Save note to Firebase
  const handleSave = async () => {
    const finalTitle = note.title.trim() || 
      (note.content.trim().split('\n')[0]?.substring(0, 30) || 'Untitled Note');
    
    try {
      setStatus(s => ({ ...s, saving: true }));
      const user = auth.currentUser;
      
      if (!user) {
        navigate('/signin');
        return;
      }
      
      // Create note document
      const docRef = await addDoc(collection(db, 'notes'), {
        title: finalTitle,
        content: note.content,
        tags: note.tags,
        color: note.color,
        pinned: status.pinned,
        isPublic: status.isPublic,
        imageUrls,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const noteId = docRef.id;
      setStatus(s => ({ ...s, savedNoteId: noteId }));
      
      if (status.isPublic) {
        const permalinkUrl = `${window.location.origin}/view/note/${noteId}`;
        setStatus(s => ({ ...s, shareLink: permalinkUrl }));
        showNotification('Note saved! Link copied');
        navigator.clipboard.writeText(permalinkUrl);
      } else {
        showNotification("Note saved successfully!");
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err) {
      console.error("Error creating note:", err);
      setStatus(s => ({ 
        ...s, error: 'Error creating note: ' + err.message, saving: false 
      }));
    }
  };

  // Handle share actions
  const handleShare = {
    copyLink: () => {
      if (status.shareLink) {
        navigator.clipboard.writeText(status.shareLink)
          .then(() => showNotification('Link copied!'))
          .catch(err => setStatus(s => ({ 
            ...s, error: 'Could not copy link: ' + err.message 
          })));
      }
    },
    viewNote: () => status.savedNoteId && navigate(`/view/note/${status.savedNoteId}`)
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: note.color }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 shadow-sm px-4 py-3.5 flex items-center justify-between text-white">
        <div className="flex items-center">
          <button onClick={() => navigate('/dashboard')} className="mr-4">
            <FaChevronLeft className="text-lg" />
          </button>
          <div className="text-lg font-medium">
            {status.saving ? 'Saving...' : 'New Note'}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setStatus(s => ({ ...s, pinned: !s.pinned }))}
            className={`p-2 ${status.pinned ? 'text-yellow-300' : 'text-white opacity-80 hover:opacity-100'}`}
            title={status.pinned ? 'Unpin note' : 'Pin note'}
          >
            <FaThumbtack className="text-lg" />
          </button>
          <button 
            onClick={handleSave} 
            disabled={status.saving} 
            className="text-white font-medium"
          >
            {status.saving ? '...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Error message */}
      {status.error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 shadow-inner">
          <p className="text-sm">{status.error}</p>
        </div>
      )}

      {/* Share link display */}
      {status.shareLink && (
        <div className="bg-pink-50 p-3 flex items-center justify-between shadow-inner">
          <div className="flex-1 mr-2">
            <p className="font-medium text-pink-700 text-sm mb-0.5">
              {status.shareLink.includes('temp-') ? 'Share link preview:' : 'Public link:'}
            </p>
            <p className="text-pink-600 text-xs truncate">{status.shareLink}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleShare.copyLink}
              className="bg-pink-500 text-white text-sm px-3 py-1 rounded-full hover:bg-pink-600"
            >
              Copy
            </button>
            {status.savedNoteId && (
              <button 
                onClick={handleShare.viewNote} 
                className="bg-pink-400 text-white text-sm px-3 py-1 rounded-full hover:bg-pink-500"
              >
                View
              </button>
            )}
          </div>
        </div>
      )}

      {/* Note Form */}
      <div className="px-4 pt-4 pb-2">
        <input
          type="text"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          className="w-full border-0 border-b border-pink-100 p-2 text-lg font-medium placeholder-gray-400 bg-transparent focus:outline-none focus:border-pink-300 focus:ring-0"
          placeholder="Note title"
        />
      </div>

      {/* Note content area */}
      <div className="flex-grow px-4 pb-4">
        <textarea
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
          className="w-full h-full p-2 resize-none focus:outline-none focus:ring-0 border-0 bg-transparent"
          placeholder="Start writing..."
        />
        
        {/* Images display */}
        {imageUrls.length > 0 && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={url} 
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-32 object-cover" 
                />
                <button
                  type="button"
                  onClick={() => handleImages.remove(index)}
                  className="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Tags display */}
        {note.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {note.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full flex items-center text-xs"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleTags.remove(tag)}
                  className="ml-1 text-pink-400 hover:text-pink-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      <div className="border-t border-gray-100 bg-white shadow-md">
        {/* Tag input field */}
        {status.showTagInput && (
          <div className="p-3 bg-gray-50 border-b border-gray-100">
            <div className="flex">
              <input
                id="tagInput"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-grow p-2 border border-gray-200 rounded-l-lg focus:outline-none focus:border-pink-300 focus:ring-0 text-sm"
                placeholder="Add tag..."
                onKeyPress={(e) => e.key === 'Enter' && handleTags.add()}
              />
              <button
                type="button"
                onClick={handleTags.add}
                className="px-3 bg-pink-500 text-white rounded-r-lg text-sm"
              >
                Add
              </button>
            </div>
          </div>
        )}
        
        {/* Color picker */}
        {status.showColorPicker && (
          <div className="p-3 bg-gray-50 border-b border-gray-100">
            <div className="flex justify-center space-x-3">
              {colorPalette.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setNote({...note, color});
                    setStatus(s => ({ ...s, showColorPicker: false }));
                  }}
                  className="w-7 h-7 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Toolbar buttons */}
        <div className="flex justify-between items-center px-2 py-2">
          <div className="flex space-x-1">
            {/* Image upload */}
            <div className="relative">
              <label htmlFor="imageInput" className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer block">
                <FaImage className="text-lg" />
              </label>
              <input 
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                className="hidden"
              />
            </div>
            
            {/* Color picker toggle */}
            <button
              onClick={() => setStatus(s => ({ 
                ...s, 
                showColorPicker: !s.showColorPicker,
                showTagInput: false
              }))}
              className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <FaPalette className="text-lg" />
            </button>
            
            {/* Tag toggle */}
            <button
              onClick={() => setStatus(s => ({ 
                ...s, 
                showTagInput: !s.showTagInput,
                showColorPicker: false
              }))}
              className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <FaTag className="text-lg" />
            </button>
          </div>
          
          {/* Right side actions */}
          <div className="flex space-x-1">
            {/* Public/Private toggle */}
            <button
              onClick={togglePublic}
              className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full"
              title={status.isPublic ? 'Make private' : 'Make public'}
            >
              {status.isPublic ? <FaEye className="text-lg" /> : <FaEyeSlash className="text-lg" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewNoteForm;