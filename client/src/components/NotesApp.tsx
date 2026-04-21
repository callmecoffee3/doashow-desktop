import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Note {
  id: string;
  title: string;
  content: string;
  created: string;
  modified: string;
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('doashow_notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('doashow_notes', JSON.stringify(updatedNotes));
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      created: new Date().toLocaleString(),
      modified: new Date().toLocaleString(),
    };
    const updated = [newNote, ...notes];
    saveNotes(updated);
    setSelectedNote(newNote);
    setTitle(newNote.title);
    setContent(newNote.content);
  };

  const updateNote = () => {
    if (!selectedNote) return;
    const updated = notes.map(note =>
      note.id === selectedNote.id
        ? {
            ...note,
            title: title || 'Untitled Note',
            content,
            modified: new Date().toLocaleString(),
          }
        : note
    );
    saveNotes(updated);
    setSelectedNote({ ...selectedNote, title: title || 'Untitled Note', content, modified: new Date().toLocaleString() });
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(note => note.id !== id);
    saveNotes(updated);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setTitle('');
      setContent('');
    }
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div className="flex h-full">
      {/* Notes List */}
      <div className="w-1/3 border-r border-border bg-secondary overflow-y-auto">
        <div className="p-4 border-b border-border">
          <Button onClick={createNewNote} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            New Note
          </Button>
        </div>
        <div className="space-y-2 p-2">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-foreground/50">
              <p>No notes yet</p>
              <p className="text-xs">Create one to get started</p>
            </div>
          ) : (
            notes.map(note => (
              <button
                key={note.id}
                onClick={() => selectNote(note)}
                className={`w-full text-left p-3 rounded border transition-colors ${
                  selectedNote?.id === note.id
                    ? 'bg-accent/20 border-accent'
                    : 'border-border hover:bg-accent/10'
                }`}
              >
                <div className="font-medium text-sm truncate">{note.title}</div>
                <div className="text-xs text-foreground/50 truncate">{note.content.substring(0, 40)}</div>
                <div className="text-xs text-foreground/40 mt-1">{note.modified}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="border-b border-border p-4 bg-secondary">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-xl font-bold outline-none"
                placeholder="Note title"
              />
              <div className="text-xs text-foreground/50 mt-2">
                Created: {selectedNote.created}
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-4 bg-background text-foreground outline-none resize-none"
              placeholder="Start typing your note..."
            />
            <div className="border-t border-border p-4 bg-secondary flex gap-2 justify-end">
              <Button
                onClick={() => deleteNote(selectedNote.id)}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
              <Button
                onClick={updateNote}
                size="sm"
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-foreground/50">
            <div className="text-center">
              <p className="text-lg mb-2">No note selected</p>
              <p className="text-sm">Create or select a note to begin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
