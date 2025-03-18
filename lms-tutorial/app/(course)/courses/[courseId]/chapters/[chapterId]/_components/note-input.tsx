"use client";
import { useState, useEffect } from "react";

interface Note {
  id: string;
  timestamp: number;
  text: string;
  createdAt: string;
}

interface NotesSectionProps {
  userId: string;
  chapterId: string;
  courseId: string;
  isLocked: boolean;
}

export const NotesSection = ({ userId, chapterId, courseId, isLocked }: NotesSectionProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [timestamp, setTimestamp] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const storageKey = `notes_${userId}_${chapterId}`;
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [userId, chapterId]);

  useEffect(() => {
    const storageKey = `notes_${userId}_${chapterId}`;
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes, userId, chapterId]);

  const addNote = () => {
    if (!text || timestamp < 0) return;

    const newNote: Note = {
      id: crypto.randomUUID(), 
      timestamp,
      text,
      createdAt: new Date().toISOString(),
    };

    setNotes((prev) => [...prev, newNote].sort((a, b) => a.timestamp - b.timestamp));
    setText("");
    setTimestamp(0);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Your Notes</h3>
      {notes.length ? (
        notes.map((note) => (
          <div key={note.id} className="p-2 bg-gray-100 rounded-md mb-2">
            <span className="font-bold">
              {new Date(note.timestamp * 1000).toISOString().substr(14, 5)}:
            </span>{" "}
            {note.text}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No notes yet.</p>
      )}
      {!isLocked && (
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex gap-2">
            <input
              type="number"
              value={timestamp}
              onChange={(e) => setTimestamp(parseInt(e.target.value) || 0)}
              placeholder="Timestamp (seconds)"
              className="p-2 border rounded-md w-32"
              min="0"
            />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a note..."
              className="p-2 border rounded-md flex-1"
            />
            <button
              onClick={addNote}
              className="p-2 bg-sky-700 text-white rounded-md hover:bg-sky-800"
            >
              Add Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};