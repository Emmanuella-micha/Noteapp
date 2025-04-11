
// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
// import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

// const TodoApp = () => {
//   const [task, setTask] = useState('');
//   const [todos, setTodos] = useState([]);

//   const addTodo = async (e) => {
//     e.preventDefault();
//     if (task.trim() === '') return;

//     await addDoc(collection(db, 'todos'), {
//       text: task,
//       createdAt: new Date()
//     });

//     setTask('');
//   };

//   const deleteTodo = async (id) => {
//     await deleteDoc(doc(db, 'todos', id));
//   };

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
//       const todoList = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setTodos(todoList);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
//         <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">🔥 Firebase Todo App</h2>
        
//         <form onSubmit={addTodo} className="flex space-x-2 mb-4">
//           <input 
//             type="text" 
//             value={task} 
//             onChange={(e) => setTask(e.target.value)} 
//             placeholder="Enter a task" 
//             className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button 
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//           >
//             Add
//           </button>
//         </form>

//         <ul className="space-y-2">
//           {todos.map(todo => (
//             <li 
//               key={todo.id}
//               className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
//             >
//               <span className="text-gray-800">{todo.text}</span>
//               <button 
//                 onClick={() => deleteTodo(todo.id)} 
//                 className="text-red-500 hover:text-red-700 transition"
//                 title="Delete"
//               >
//                 ❌
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default TodoApp;






import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const TodoApp = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (task.trim() === '') return;

    await addDoc(collection(db, 'todos'), {
      text: task,
      createdAt: new Date()
    });

    setTask('');
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
      const todoList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(todoList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full sm:max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">🔥 Firebase Todo App</h2>
        
        <form onSubmit={addTodo} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input 
            type="text" 
            value={task} 
            onChange={(e) => setTask(e.target.value)} 
            placeholder="Enter a task" 
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add
          </button>
        </form>

        <ul className="space-y-2">
          {todos.map(todo => (
            <li 
              key={todo.id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
            >
              <span className="text-gray-800 break-words max-w-[80%]">{todo.text}</span>
              <button 
                onClick={() => deleteTodo(todo.id)} 
                className="text-red-500 hover:text-red-700 transition ml-2"
                title="Delete"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
