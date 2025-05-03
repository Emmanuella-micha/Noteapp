// src/components/pages/NoteEditor.jsx
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";

function NoteEditor() {
  const { id } = useParams();
  const isEditing = id !== "new";
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isEditing) {
      const fetchNote = async () => {
        const docRef = doc(db, "notes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setContent(data.content);
        } else {
          navigate("/dashboard");
        }
      };
      fetchNote();
    }
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const noteData = {
      uid: user.uid,
      title,
      content,
      updatedAt: serverTimestamp(),
    };

    try {
      if (isEditing) {
        await setDoc(doc(db, "notes", id), noteData, { merge: true });
      } else {
        await addDoc(collection(db, "notes"), {
          ...noteData,
          createdAt: serverTimestamp(),
        });
      }
      navigate("/dashboard");
    } catch (err) {
      alert("Error saving note: " + err.message);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4">{isEditing ? "Edit Note" : "New Note"}</h2>
      <form onSubmit={handleSave} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          className="border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content..."
          className="border p-2 h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {isEditing ? "Update Note" : "Save Note"}
        </button>
      </form>
    </div>
  );
}

export default NoteEditor;
