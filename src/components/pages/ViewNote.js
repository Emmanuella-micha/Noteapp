// src/components/pages/ViewNote.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

function ViewNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      const docRef = doc(db, "notes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNote({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate("/dashboard");
      }
    };
    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteDoc(doc(db, "notes", id));
      navigate("/dashboard");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {note ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
          <p className="mb-4 whitespace-pre-wrap">{note.content}</p>
          <div className="flex gap-3">
            <Link
              to={`/edit/${note.id}`}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <p>Loading note...</p>
      )}
    </div>
  );
}

export default ViewNote;
