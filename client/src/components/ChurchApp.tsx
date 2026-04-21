import { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, Users, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChurchClass {
  id: string;
  name: string;
  instructor: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  enrolled: number;
}

interface BibleBook {
  name: string;
  chapters: number;
  abbreviation: string;
}

interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

const BIBLE_BOOKS: BibleBook[] = [
  { name: 'Genesis', chapters: 50, abbreviation: 'Gen' },
  { name: 'Exodus', chapters: 40, abbreviation: 'Exo' },
  { name: 'Leviticus', chapters: 27, abbreviation: 'Lev' },
  { name: 'Numbers', chapters: 36, abbreviation: 'Num' },
  { name: 'Deuteronomy', chapters: 34, abbreviation: 'Deu' },
  { name: 'Joshua', chapters: 24, abbreviation: 'Jos' },
  { name: 'Judges', chapters: 21, abbreviation: 'Jdg' },
  { name: 'Ruth', chapters: 4, abbreviation: 'Rut' },
  { name: '1 Samuel', chapters: 31, abbreviation: '1Sa' },
  { name: '2 Samuel', chapters: 24, abbreviation: '2Sa' },
  { name: 'Psalms', chapters: 150, abbreviation: 'Psa' },
  { name: 'Proverbs', chapters: 31, abbreviation: 'Pro' },
  { name: 'Matthew', chapters: 28, abbreviation: 'Mat' },
  { name: 'Mark', chapters: 16, abbreviation: 'Mar' },
  { name: 'Luke', chapters: 24, abbreviation: 'Luk' },
  { name: 'John', chapters: 21, abbreviation: 'Joh' },
  { name: 'Acts', chapters: 28, abbreviation: 'Act' },
  { name: 'Romans', chapters: 16, abbreviation: 'Rom' },
  { name: '1 Corinthians', chapters: 16, abbreviation: '1Co' },
  { name: '2 Corinthians', chapters: 13, abbreviation: '2Co' },
  { name: 'Galatians', chapters: 6, abbreviation: 'Gal' },
  { name: 'Ephesians', chapters: 6, abbreviation: 'Eph' },
  { name: 'Philippians', chapters: 4, abbreviation: 'Phi' },
  { name: 'Colossians', chapters: 4, abbreviation: 'Col' },
  { name: '1 Thessalonians', chapters: 5, abbreviation: '1Th' },
  { name: '2 Thessalonians', chapters: 3, abbreviation: '2Th' },
  { name: '1 Timothy', chapters: 6, abbreviation: '1Ti' },
  { name: '2 Timothy', chapters: 4, abbreviation: '2Ti' },
  { name: 'Titus', chapters: 3, abbreviation: 'Tit' },
  { name: 'Philemon', chapters: 1, abbreviation: 'Phm' },
  { name: 'Hebrews', chapters: 13, abbreviation: 'Heb' },
  { name: 'James', chapters: 5, abbreviation: 'Jas' },
  { name: '1 Peter', chapters: 5, abbreviation: '1Pe' },
  { name: '2 Peter', chapters: 3, abbreviation: '2Pe' },
  { name: '1 John', chapters: 5, abbreviation: '1Jo' },
  { name: '2 John', chapters: 1, abbreviation: '2Jo' },
  { name: '3 John', chapters: 1, abbreviation: '3Jo' },
  { name: 'Jude', chapters: 1, abbreviation: 'Jud' },
  { name: 'Revelation', chapters: 22, abbreviation: 'Rev' },
];

const SAMPLE_VERSES: { [key: string]: string[] } = {
  'John 3:16': [
    'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
  ],
  'Psalm 23:1': [
    'The Lord is my shepherd, I lack nothing.',
  ],
  'Proverbs 3:5-6': [
    'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
  ],
  'Matthew 11:28': [
    'Come to me, all you who are weary and burdened, and I will give you rest.',
  ],
  'John 14:6': [
    'Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through me."',
  ],
  'Romans 3:23': [
    'for all have sinned and fall short of the glory of God,',
  ],
  'Ephesians 2:8-9': [
    'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God— not by works, so that no one can boast.',
  ],
  'Philippians 4:13': [
    'I can do all this through him who gives me strength.',
  ],
};

export default function ChurchApp() {
  const [activeTab, setActiveTab] = useState<'classes' | 'bible'>('classes');
  const [classes, setClasses] = useState<ChurchClass[]>([
    {
      id: '1',
      name: 'Sunday School',
      instructor: 'Pastor John',
      time: 'Sunday 9:00 AM',
      location: 'Room A',
      description: 'Bible study for all ages',
      capacity: 30,
      enrolled: 25,
    },
    {
      id: '2',
      name: 'Youth Group',
      instructor: 'Sarah Williams',
      time: 'Friday 6:00 PM',
      location: 'Youth Center',
      description: 'Fellowship and worship for teens',
      capacity: 50,
      enrolled: 42,
    },
    {
      id: '3',
      name: 'Prayer Meeting',
      instructor: 'Elder James',
      time: 'Wednesday 7:00 PM',
      location: 'Chapel',
      description: 'Community prayer and intercession',
      capacity: 40,
      enrolled: 18,
    },
  ]);

  const [selectedBook, setSelectedBook] = useState<string>('John');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    time: '',
    location: '',
    description: '',
    capacity: 30,
  });

  const currentBook = BIBLE_BOOKS.find(b => b.name === selectedBook);

  const addClass = () => {
    if (!formData.name || !formData.instructor) return;
    const newClass: ChurchClass = {
      id: Date.now().toString(),
      ...formData,
      enrolled: 0,
    };
    setClasses([...classes, newClass]);
    setFormData({
      name: '',
      instructor: '',
      time: '',
      location: '',
      description: '',
      capacity: 30,
    });
    setShowForm(false);
  };

  const deleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const enrollClass = (id: string) => {
    setClasses(classes.map(c =>
      c.id === id && c.enrolled < c.capacity
        ? { ...c, enrolled: c.enrolled + 1 }
        : c
    ));
  };

  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <div className="w-48 border-r border-border bg-secondary p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-6">Church</h2>
        <div className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('classes')}
            className={`w-full text-left px-4 py-2 rounded transition-colors ${
              activeTab === 'classes'
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Classes</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bible')}
            className={`w-full text-left px-4 py-2 rounded transition-colors ${
              activeTab === 'bible'
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Bible</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'classes' ? (
          <>
            {/* Classes Header */}
            <div className="border-b border-border p-4 bg-secondary flex justify-between items-center">
              <h3 className="text-xl font-bold">Church Classes</h3>
              <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Class
              </Button>
            </div>

            {/* Add Class Form */}
            {showForm && (
              <div className="border-b border-border p-4 bg-card space-y-3">
                <input
                  type="text"
                  placeholder="Class name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Instructor name"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Time (e.g., Sunday 9:00 AM)"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-16 resize-none"
                />
                <input
                  type="number"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={addClass} className="flex-1">
                    Save
                  </Button>
                  <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Classes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {classes.map(churchClass => (
                <div key={churchClass.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg">{churchClass.name}</h4>
                      <p className="text-sm text-foreground/70">{churchClass.instructor}</p>
                    </div>
                    <Button
                      onClick={() => deleteClass(churchClass.id)}
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm text-foreground/60 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {churchClass.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {churchClass.location}
                    </div>
                  </div>
                  <p className="text-sm mb-3">{churchClass.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-foreground/60">
                      Enrolled: {churchClass.enrolled}/{churchClass.capacity}
                    </div>
                    <Button
                      onClick={() => enrollClass(churchClass.id)}
                      disabled={churchClass.enrolled >= churchClass.capacity}
                      size="sm"
                    >
                      Enroll
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Bible Reader */}
            <div className="flex-1 flex flex-col">
              {/* Bible Navigation */}
              <div className="border-b border-border p-4 bg-secondary space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground/60 mb-1 block">
                      Book
                    </label>
                    <select
                      value={selectedBook}
                      onChange={(e) => {
                        setSelectedBook(e.target.value);
                        setSelectedChapter(1);
                      }}
                      className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                    >
                      {BIBLE_BOOKS.map(book => (
                        <option key={book.name} value={book.name}>
                          {book.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground/60 mb-1 block">
                      Chapter
                    </label>
                    <select
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                    >
                      {currentBook && Array.from({ length: currentBook.chapters }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Chapter {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Bible Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-background">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedBook} {selectedChapter}
                  </h2>
                  <div className="text-foreground/70 space-y-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="leading-relaxed text-lg">
                        {SAMPLE_VERSES[`${selectedBook} ${selectedChapter}:1`]?.[0] ||
                          `This is a sample Bible reading for ${selectedBook} Chapter ${selectedChapter}. In a full implementation, this would display the complete chapter text from the Bible.`}
                      </p>
                    </div>
                    <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm">
                      <p className="font-semibold mb-2">💡 Reflection</p>
                      <p>Take a moment to meditate on this passage. What does it mean to you today?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
