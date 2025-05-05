// src/components/NotesDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaSearch, FaSort } from 'react-icons/fa';

const NotesDashboard = ({ user, darkMode, toggleDarkMode }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();

  // Define Redmi Notes style color palette (pink-focused)
  const noteColors = [
    'bg-gradient-to-br from-pink-400 to-pink-500',
    'bg-gradient-to-br from-pink-300 to-rose-400',
    'bg-gradient-to-br from-fuchsia-400 to-pink-400',
    'bg-gradient-to-br from-rose-300 to-pink-300',
    'bg-gradient-to-br from-pink-200 to-pink-400',
  ];

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      const userNotesRef = collection(db, 'notes');
      const q = query(userNotesRef, where('userId', '==', user.uid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let notesData = [];
        
        snapshot.forEach(doc => {
          const data = doc.data();
          // Assign a random color to each note if it doesn't have one
          const colorIndex = data.colorIndex || Math.floor(Math.random() * noteColors.length);
          notesData.push({
            id: doc.id,
            ...data,
            colorIndex: colorIndex,
            colorClass: noteColors[colorIndex],
            updatedAt: data.updatedAt || { seconds: 0 }
          });
        });

        notesData.sort((a, b) => {
          const aTime = a.updatedAt?.seconds || 0;
          const bTime = b.updatedAt?.seconds || 0;
          return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
        });

        setNotes(notesData);
        setLoading(false);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching notes:', error);
      setLoading(false);
    }
  }, [navigate, sortOrder, user]);

  const handleSort = useCallback(() => {
    setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
  }, []);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (category === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && note.category === category;
    }
  });

  // Sample categories
  const categories = ['all', 'work', 'personal', 'ideas', 'tasks'];

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 to-red-100'} min-h-screen w-full overflow-hidden transition-colors duration-300`}>
      {/* Top App Bar - Redmi style */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-r from-pink-500 to-rose-400 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-medium tracking-wide">Mi Notes</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-white opacity-80 hover:opacity-100 transition-opacity"
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <div className="rounded-full overflow-hidden w-8 h-8 bg-pink-200">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-pink-300 text-white">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 mt-20">
        {/* Search and filter bar - Redmi style */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 overflow-hidden transition-all duration-300">
          <div className="flex items-center px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <FaSearch className="text-pink-400 mr-2" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border-0 focus:ring-0 dark:bg-gray-800 dark:text-white text-sm"
              aria-label="Search notes"
            />
          </div>
          
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <button
                onClick={handleSort}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-pink-50 dark:bg-gray-700 text-pink-500 dark:text-pink-300"
                aria-label={`Sort by date ${sortOrder === 'desc' ? 'oldest first' : 'newest first'}`}
              >
                <FaSort className="text-xs" />
                <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
              </button>
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1.5 bg-pink-50 dark:bg-gray-700 rounded-full border-0 text-sm text-pink-500 dark:text-pink-300 focus:ring-0"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-500"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className={`text-center py-16 ${darkMode ? 'text-white' : 'text-pink-700'}`}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900">
                <svg className="w-10 h-10 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-medium">
                {searchTerm ? 'No matching notes found.' : 'No notes yet.'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                {searchTerm ? 'Try using different keywords or clear your search.' : 'Create your first note to get started.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/new-note')}
                  className="mt-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Create Note
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <p className={`mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-pink-600'}`}>
              {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
            </p>
            
            {/* Redmi Notes-style grid with cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredNotes.map((note, index) => (
                <div 
                  key={note.id} 
                  onClick={() => navigate(`/note/${note.id}`)}
                  className="transform transition-all duration-300 ease-out cursor-pointer"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    animation: 'fadeIn 0.4s forwards'
                  }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                    {/* Color strip on top - Redmi style */}
                    <div className={`h-1.5 w-full ${note.colorClass}`}></div>
                    
                    <div className="p-4">
                      <h3 className={`font-medium text-base mb-1 ${darkMode ? 'text-white' : 'text-gray-800'} line-clamp-1`}>
                        {note.title || 'Untitled Note'}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-3 mb-3`}>
                        {note.content || 'No content'}
                      </p>
                      <div className="flex justify-between items-center pt-2 text-xs text-gray-400 dark:text-gray-500">
                        <span>
                          {note.updatedAt?.seconds ? new Date(note.updatedAt.seconds * 1000).toLocaleDateString() : 'Unknown date'}
                        </span>
                        {note.category && (
                          <span className="px-2 py-0.5 bg-pink-50 dark:bg-gray-700 rounded-full text-pink-500 dark:text-pink-300">
                            {note.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Floating Action Button - Redmi style */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate('/new-note')}
          className="bg-gradient-to-r from-pink-500 to-rose-400 text-white p-3.5 rounded-full shadow-lg 
                   hover:shadow-xl flex items-center justify-center
                   transition-all duration-300 ease-out 
                   hover:scale-105 active:scale-95
                   focus:outline-none"
          aria-label="Create new note"
        >
          <FaPen className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default NotesDashboard;