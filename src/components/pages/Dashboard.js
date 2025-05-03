// src/components/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const q = query(
          collection(db, "notes"),
          where("uid", "==", user.uid),
          orderBy("updatedAt", "desc")
        );
        const unsubscribeNotes = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setNotes(data);
        });
        return () => unsubscribeNotes();
      } else {
        navigate("/");
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl">My Notes</h1>
        <div>
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
            Logout
          </button>
          <Link to="/edit/new" className="ml-2 bg-green-500 text-white px-3 py-1 rounded">
            + New Note
          </Link>
        </div>
      </div>
      <div className="grid gap-4">
        {notes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          notes.map((note) => (
            <Link
              to={`/view/${note.id}`}
              key={note.id}
              className="p-4 border rounded shadow hover:bg-gray-50"
            >
              <h3 className="font-semibold text-lg">{note.title}</h3>
              <p className="text-sm text-gray-600">
                {note.content.slice(0, 100)}...
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
