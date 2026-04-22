import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Folder, BookOpen, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Note {
  id: string;
  title: string;
  content: string;
  createdDate: string;
  updatedDate: string;
  folderId: string;
}

interface Folder {
  id: string;
  name: string;
  notebookId: string;
  createdDate: string;
  noteCount: number;
}

interface Notebook {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  folders: Folder[];
  noteCount: number;
}

export default function NotesApp() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([
    {
      id: '1',
      name: 'Personal',
      description: 'Personal notes and ideas',
      createdDate: '2024-01-01',
      folders: [
        {
          id: 'f1',
          name: 'Daily Notes',
          notebookId: '1',
          createdDate: '2024-01-05',
          noteCount: 2,
        },
        {
          id: 'f2',
          name: 'Ideas',
          notebookId: '1',
          createdDate: '2024-01-10',
          noteCount: 1,
        },
      ],
      noteCount: 3,
    },
    {
      id: '2',
      name: 'Work',
      description: 'Work-related notes',
      createdDate: '2024-01-02',
      folders: [
        {
          id: 'f3',
          name: 'Projects',
          notebookId: '2',
          createdDate: '2024-01-06',
          noteCount: 0,
        },
      ],
      noteCount: 0,
    },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Welcome to Notes',
      content: 'This is your first note. You can edit it or create new notes.',
      createdDate: '2024-01-01',
      updatedDate: '2024-01-15',
      folderId: 'f1',
    },
    {
      id: '2',
      title: 'Note Taking Tips',
      content: 'Organize your notes into notebooks and folders for better management.',
      createdDate: '2024-01-05',
      updatedDate: '2024-01-14',
      folderId: 'f1',
    },
    {
      id: '3',
      title: 'Great Idea',
      content: 'Remember to implement this feature in the app.',
      createdDate: '2024-01-10',
      updatedDate: '2024-01-12',
      folderId: 'f2',
    },
  ]);

  const [selectedNotebookId, setSelectedNotebookId] = useState<string>('1');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('f1');
  const [selectedNoteId, setSelectedNoteId] = useState<string>('1');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [expandedNotebooks, setExpandedNotebooks] = useState<Set<string>>(new Set(['1', '2']));
  const [showNewNotebookForm, setShowNewNotebookForm] = useState(false);
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [newNotebookData, setNewNotebookData] = useState({
    name: '',
    description: '',
  });
  const [newFolderData, setNewFolderData] = useState({
    name: '',
  });
  const [newNoteData, setNewNoteData] = useState({
    title: '',
    content: '',
  });

  const selectedNotebook = notebooks.find(n => n.id === selectedNotebookId);
  const selectedFolder = selectedNotebook?.folders.find(f => f.id === selectedFolderId);
  const selectedNote = notes.find(n => n.id === selectedNoteId);
  const folderNotes = notes.filter(n => n.folderId === selectedFolderId);

  useEffect(() => {
    localStorage.setItem('doashow_notebooks', JSON.stringify(notebooks));
    localStorage.setItem('doashow_notes', JSON.stringify(notes));
  }, [notebooks, notes]);

  const toggleNotebookExpand = (notebookId: string) => {
    const newExpanded = new Set(expandedNotebooks);
    if (newExpanded.has(notebookId)) {
      newExpanded.delete(notebookId);
    } else {
      newExpanded.add(notebookId);
    }
    setExpandedNotebooks(newExpanded);
  };

  const createNotebook = () => {
    if (!newNotebookData.name.trim()) return;

    const newNotebook: Notebook = {
      id: Date.now().toString(),
      name: newNotebookData.name,
      description: newNotebookData.description,
      createdDate: new Date().toISOString().split('T')[0],
      folders: [],
      noteCount: 0,
    };

    setNotebooks([...notebooks, newNotebook]);
    setSelectedNotebookId(newNotebook.id);
    setSelectedFolderId('');
    setNewNotebookData({ name: '', description: '' });
    setShowNewNotebookForm(false);
    const newSet = new Set(expandedNotebooks);
    newSet.add(newNotebook.id);
    setExpandedNotebooks(newSet);
  };

  const createFolder = () => {
    if (!newFolderData.name.trim() || !selectedNotebookId) return;

    const updated = notebooks.map(n => {
      if (n.id === selectedNotebookId) {
        const newFolder: Folder = {
          id: Date.now().toString(),
          name: newFolderData.name,
          notebookId: selectedNotebookId,
          createdDate: new Date().toISOString().split('T')[0],
          noteCount: 0,
        };
        return {
          ...n,
          folders: [...n.folders, newFolder],
        };
      }
      return n;
    });

    setNotebooks(updated);
    const newFolder = updated.find(n => n.id === selectedNotebookId)?.folders.at(-1);
    if (newFolder) {
      setSelectedFolderId(newFolder.id);
    }
    setNewFolderData({ name: '' });
    setShowNewFolderForm(false);
  };

  const createNote = () => {
    if (!newNoteData.title.trim() || !selectedFolderId) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteData.title,
      content: newNoteData.content,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      folderId: selectedFolderId,
    };

    setNotes([...notes, newNote]);

    // Update folder and notebook note counts
    const updated = notebooks.map(n => {
      if (n.id === selectedNotebookId) {
        return {
          ...n,
          folders: n.folders.map(f =>
            f.id === selectedFolderId
              ? { ...f, noteCount: f.noteCount + 1 }
              : f
          ),
          noteCount: n.noteCount + 1,
        };
      }
      return n;
    });

    setNotebooks(updated);
    setSelectedNoteId(newNote.id);
    setNewNoteData({ title: '', content: '' });
    setShowNewNoteForm(false);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updated = notes.map(n =>
      n.id === id
        ? {
            ...n,
            ...updates,
            updatedDate: new Date().toISOString().split('T')[0],
          }
        : n
    );
    setNotes(updated);
    setEditingNoteId(null);
  };

  const deleteNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);

    // Update folder and notebook note counts
    if (note) {
      const notebookUpdated = notebooks.map(n => {
        if (n.id === selectedNotebookId) {
          return {
            ...n,
            folders: n.folders.map(f =>
              f.id === note.folderId
                ? { ...f, noteCount: Math.max(0, f.noteCount - 1) }
                : f
            ),
            noteCount: Math.max(0, n.noteCount - 1),
          };
        }
        return n;
      });
      setNotebooks(notebookUpdated);
    }

    if (selectedNoteId === id) {
      setSelectedNoteId(updated[0]?.id || '');
    }
  };

  const deleteFolder = (notebookId: string, folderId: string) => {
    // Delete all notes in the folder
    const folderNotesIds = notes.filter(n => n.folderId === folderId).map(n => n.id);
    let updatedNotes = notes.filter(n => n.folderId !== folderId);
    setNotes(updatedNotes);

    // Update notebook
    const updated = notebooks.map(n => {
      if (n.id === notebookId) {
        return {
          ...n,
          folders: n.folders.filter(f => f.id !== folderId),
          noteCount: Math.max(0, n.noteCount - folderNotesIds.length),
        };
      }
      return n;
    });

    setNotebooks(updated);
    if (selectedFolderId === folderId) {
      setSelectedFolderId('');
    }
  };

  const deleteNotebook = (id: string) => {
    const notebook = notebooks.find(n => n.id === id);
    const folderIds = notebook?.folders.map(f => f.id) || [];

    // Delete all notes in the notebook
    const updatedNotes = notes.filter(n => !folderIds.includes(n.folderId));
    setNotes(updatedNotes);

    // Delete notebook
    const updated = notebooks.filter(n => n.id !== id);
    setNotebooks(updated);

    if (selectedNotebookId === id) {
      setSelectedNotebookId(updated[0]?.id || '');
      setSelectedFolderId('');
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Notebooks and Folders */}
      <div className="w-72 border-r border-border bg-secondary flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold mb-3">Notebooks</h2>
          <Button onClick={() => setShowNewNotebookForm(true)} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            New Notebook
          </Button>
        </div>

        {/* New Notebook Form */}
        {showNewNotebookForm && (
          <div className="p-4 border-b border-border space-y-2">
            <input
              type="text"
              placeholder="Notebook name"
              value={newNotebookData.name}
              onChange={(e) => setNewNotebookData({ ...newNotebookData, name: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <textarea
              placeholder="Description"
              value={newNotebookData.description}
              onChange={(e) => setNewNotebookData({ ...newNotebookData, description: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-12 resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={createNotebook} size="sm" className="flex-1">
                Create
              </Button>
              <Button onClick={() => setShowNewNotebookForm(false)} variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notebooks List */}
        <div className="flex-1 overflow-y-auto p-2">
          {notebooks.map(notebook => (
            <div key={notebook.id}>
              <button
                onClick={() => {
                  setSelectedNotebookId(notebook.id);
                  setSelectedFolderId('');
                }}
                className={`w-full text-left px-3 py-2 rounded transition-colors hover:bg-accent/10 flex items-center justify-between ${
                  selectedNotebookId === notebook.id && !selectedFolderId ? 'bg-accent/20' : ''
                }`}
              >
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm truncate">{notebook.name}</h3>
                    <p className="text-xs text-foreground/60">{notebook.noteCount} notes</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {notebook.folders.length > 0 && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNotebookExpand(notebook.id);
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                    >
                      {expandedNotebooks.has(notebook.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotebook(notebook.id);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </button>

              {/* Folders */}
              {expandedNotebooks.has(notebook.id) && (
                <div className="ml-4 border-l border-border/50">
                  {notebook.folders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => {
                        setSelectedNotebookId(notebook.id);
                        setSelectedFolderId(folder.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded transition-colors hover:bg-accent/10 flex items-center justify-between text-sm ${
                        selectedFolderId === folder.id ? 'bg-accent/20' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <Folder className="w-3 h-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium truncate">{folder.name}</h4>
                          <p className="text-xs text-foreground/60">{folder.noteCount} notes</p>
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFolder(notebook.id, folder.id);
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </button>
                  ))}

                  {/* Add Folder Button */}
                  <button
                    onClick={() => {
                      setSelectedNotebookId(notebook.id);
                      setShowNewFolderForm(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded transition-colors hover:bg-accent/10 text-sm text-accent flex items-center gap-2"
                  >
                    <Plus className="w-3 h-3" />
                    Add Folder
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* New Folder Form */}
        {showNewFolderForm && (
          <div className="p-4 border-t border-border space-y-2">
            <h4 className="font-semibold text-sm">New Folder</h4>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderData.name}
              onChange={(e) => setNewFolderData({ name: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={createFolder} size="sm" className="flex-1">
                Create
              </Button>
              <Button onClick={() => setShowNewFolderForm(false)} variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedFolder ? (
          <>
            {/* Folder Header */}
            <div className="border-b border-border p-4 bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Folder className="w-6 h-6" />
                    {selectedFolder.name}
                  </h2>
                  <p className="text-sm text-foreground/60 mt-1">
                    {selectedNotebook?.name} • {folderNotes.length} notes
                  </p>
                </div>
                <Button onClick={() => setShowNewNoteForm(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Note
                </Button>
              </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 flex">
              <div className="w-64 border-r border-border bg-secondary overflow-y-auto p-2">
                {folderNotes.length > 0 ? (
                  folderNotes.map(note => (
                    <button
                      key={note.id}
                      onClick={() => setSelectedNoteId(note.id)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors hover:bg-accent/10 mb-1 ${
                        selectedNoteId === note.id ? 'bg-accent/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{note.title}</h4>
                          <p className="text-xs text-foreground/60 mt-1">{note.updatedDate}</p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-foreground/50 py-8 text-sm">No notes yet</p>
                )}
              </div>

              {/* Note Editor */}
              <div className="flex-1 flex flex-col">
                {selectedNote ? (
                  <>
                    {/* Note Header */}
                    <div className="border-b border-border p-4 bg-card flex items-center justify-between">
                      {editingNoteId === selectedNote.id ? (
                        <input
                          type="text"
                          value={selectedNote.title}
                          onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                          className="flex-1 text-2xl font-bold bg-background border border-border rounded px-3 py-2"
                        />
                      ) : (
                        <h2 className="text-2xl font-bold">{selectedNote.title}</h2>
                      )}
                      <div className="flex gap-2 ml-4">
                        {editingNoteId === selectedNote.id ? (
                          <Button
                            onClick={() => setEditingNoteId(null)}
                            className="gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Done
                          </Button>
                        ) : (
                          <Button
                            onClick={() => setEditingNoteId(selectedNote.id)}
                            variant="outline"
                            className="gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteNote(selectedNote.id)}
                          variant="destructive"
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Note Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                      {editingNoteId === selectedNote.id ? (
                        <textarea
                          value={selectedNote.content}
                          onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                          className="w-full h-full p-4 bg-background border border-border rounded-lg resize-none font-mono text-sm"
                        />
                      ) : (
                        <div className="prose prose-invert max-w-none">
                          <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                            {selectedNote.content}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Note Info */}
                    <div className="border-t border-border p-4 bg-secondary text-xs text-foreground/60">
                      <div className="flex justify-between">
                        <span>Created: {selectedNote.createdDate}</span>
                        <span>Updated: {selectedNote.updatedDate}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-foreground/50">
                    <p>Select a note to view or create a new one</p>
                  </div>
                )}
              </div>
            </div>

            {/* New Note Form */}
            {showNewNoteForm && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
                  <h3 className="text-lg font-bold">New Note</h3>
                  <input
                    type="text"
                    placeholder="Note title"
                    value={newNoteData.title}
                    onChange={(e) => setNewNoteData({ ...newNoteData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                  />
                  <textarea
                    placeholder="Note content"
                    value={newNoteData.content}
                    onChange={(e) => setNewNoteData({ ...newNoteData, content: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-24 resize-none"
                  />
                  <div className="flex gap-2">
                    <Button onClick={createNote} className="flex-1">
                      Create
                    </Button>
                    <Button onClick={() => setShowNewNoteForm(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-foreground/50">
            <p>Select a folder to view notes</p>
          </div>
        )}
      </div>
    </div>
  );
}
