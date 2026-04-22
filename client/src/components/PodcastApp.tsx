import { useState, useRef } from 'react';
import { Mic, Play, Pause, Download, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  content: string;
  voice: string;
  speed: number;
  duration: number;
  createdAt: string;
  audioUrl?: string;
}

export default function PodcastApp() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(() => {
    const saved = localStorage.getItem('doashow_podcasts');
    return saved ? JSON.parse(saved) : [];
  });

  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    voice: 'en-US-Neural2-A',
    speed: 1,
  });

  const voices = [
    { id: 'en-US-Neural2-A', name: 'Alex (Male)' },
    { id: 'en-US-Neural2-C', name: 'Breeze (Female)' },
    { id: 'en-US-Neural2-E', name: 'Echo (Male)' },
    { id: 'en-US-Neural2-F', name: 'Fiona (Female)' },
  ];

  const handleSaveEpisode = () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in title and content');
      return;
    }

    const estimatedDuration = Math.ceil(formData.content.split(' ').length / (150 * formData.speed));

    if (editingId) {
      setEpisodes(episodes.map(ep =>
        ep.id === editingId
          ? {
              ...ep,
              title: formData.title,
              description: formData.description,
              content: formData.content,
              voice: formData.voice,
              speed: formData.speed,
              duration: estimatedDuration,
            }
          : ep
      ));
      setEditingId(null);
    } else {
      const newEpisode: PodcastEpisode = {
        id: `ep-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        content: formData.content,
        voice: formData.voice,
        speed: formData.speed,
        duration: estimatedDuration,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setEpisodes([newEpisode, ...episodes]);
    }

    setFormData({ title: '', description: '', content: '', voice: 'en-US-Neural2-A', speed: 1 });
    setShowEditor(false);

    // Save to localStorage
    localStorage.setItem('doashow_podcasts', JSON.stringify([...episodes]));
  };

  const handleEditEpisode = (episode: PodcastEpisode) => {
    setFormData({
      title: episode.title,
      description: episode.description,
      content: episode.content,
      voice: episode.voice,
      speed: episode.speed,
    });
    setEditingId(episode.id);
    setShowEditor(true);
  };

  const handleDeleteEpisode = (id: string) => {
    if (confirm('Delete this episode?')) {
      const updated = episodes.filter(ep => ep.id !== id);
      setEpisodes(updated);
      localStorage.setItem('doashow_podcasts', JSON.stringify(updated));
    }
  };

  const handlePlayEpisode = (episode: PodcastEpisode) => {
    // Using Web Speech API for text-to-speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(episode.content);
      utterance.rate = episode.speed;
      utterance.lang = 'en-US';

      utterance.onstart = () => setPlayingId(episode.id);
      utterance.onend = () => setPlayingId(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDownloadEpisode = (episode: PodcastEpisode) => {
    // Create a simple text file download
    const element = document.createElement('a');
    const file = new Blob(
      [
        `Podcast Episode: ${episode.title}\n\n`,
        `Description: ${episode.description}\n\n`,
        `Content:\n${episode.content}\n\n`,
        `Duration: ${episode.duration} minutes\n`,
        `Voice: ${voices.find(v => v.id === episode.voice)?.name || 'Unknown'}\n`,
        `Speed: ${episode.speed}x\n`,
        `Created: ${episode.createdAt}`,
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${episode.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 bg-secondary sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mic className="w-6 h-6 text-accent" />
            <div>
              <h2 className="text-2xl font-bold">🎧 Podcast Studio</h2>
              <p className="text-sm text-foreground/60">Create and manage podcast episodes</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowEditor(true);
              setEditingId(null);
              setFormData({ title: '', description: '', content: '', voice: 'en-US-Neural2-A', speed: 1 });
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Episode
          </Button>
        </div>
      </div>

      {/* Episodes List */}
      <div className="flex-1 overflow-y-auto p-6">
        {episodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Mic className="w-16 h-16 text-foreground/20 mb-4" />
            <p className="text-foreground/60 mb-4">No episodes yet. Create your first podcast!</p>
            <Button
              onClick={() => {
                setShowEditor(true);
                setEditingId(null);
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Episode
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {episodes.map(episode => (
              <div key={episode.id} className="border border-border rounded-lg p-4 bg-card hover:bg-card/80 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{episode.title}</h3>
                    <p className="text-sm text-foreground/60">{episode.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-foreground/50">
                      <span>📅 {episode.createdAt}</span>
                      <span>⏱️ {episode.duration} min</span>
                      <span>🎙️ {voices.find(v => v.id === episode.voice)?.name}</span>
                      <span>⚡ {episode.speed}x</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handlePlayEpisode(episode)}
                      variant={playingId === episode.id ? 'default' : 'outline'}
                      size="icon"
                      title="Play episode"
                    >
                      {playingId === episode.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleDownloadEpisode(episode)}
                      variant="outline"
                      size="icon"
                      title="Download episode"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleEditEpisode(episode)}
                      variant="outline"
                      size="icon"
                      title="Edit episode"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteEpisode(episode.id)}
                      variant="destructive"
                      size="icon"
                      title="Delete episode"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-foreground/70 line-clamp-2 bg-background/50 p-2 rounded">
                  {episode.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Episode' : 'Create New Episode'}</h3>
              <Button
                onClick={() => setShowEditor(false)}
                variant="ghost"
                size="icon"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Episode Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                  placeholder="Enter episode title..."
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                  placeholder="Enter episode description..."
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-24 resize-none"
                  placeholder="Enter podcast content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Voice</label>
                  <select
                    value={formData.voice}
                    onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                  >
                    {voices.map(voice => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Speed: {formData.speed}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={formData.speed}
                    onChange={(e) => setFormData({ ...formData, speed: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-border">
                <Button
                  onClick={() => setShowEditor(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEpisode}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update Episode' : 'Create Episode'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden audio element */}
      <audio ref={audioRef} />
    </div>
  );
}
