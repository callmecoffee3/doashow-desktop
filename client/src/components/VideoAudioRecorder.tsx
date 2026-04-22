import { useState, useRef, useEffect } from 'react';
import { Video, Mic, Play, Pause, Square, Download, Trash2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Recording {
  id: string;
  type: 'audio' | 'video';
  title: string;
  duration: number;
  size: number;
  createdAt: string;
  blob: Blob;
  url: string;
}

export default function VideoAudioRecorder() {
  const [recordings, setRecordings] = useState<Recording[]>(() => {
    const saved = localStorage.getItem('doashow_recordings');
    return saved ? JSON.parse(saved).map((r: any) => ({ ...r, blob: null })) : [];
  });

  const [recordingType, setRecordingType] = useState<'audio' | 'video'>('audio');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const constraints =
        recordingType === 'video'
          ? { audio: true, video: { width: 1280, height: 720 } }
          : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (recordingType === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recordingType === 'video' ? 'video/webm' : 'audio/webm',
        });

        const url = URL.createObjectURL(blob);
        const recording: Recording = {
          id: `rec-${Date.now()}`,
          type: recordingType,
          title: `${recordingType === 'video' ? 'Video' : 'Audio'} Recording ${recordings.length + 1}`,
          duration: recordingTime,
          size: blob.size,
          createdAt: new Date().toISOString().split('T')[0],
          blob,
          url,
        };

        const updated = [recording, ...recordings];
        setRecordings(updated);
        localStorage.setItem(
          'doashow_recordings',
          JSON.stringify(
            updated.map(r => ({
              ...r,
              blob: null,
              url: null,
            }))
          )
        );
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setRecordingTime(t => t + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = (recording: Recording) => {
    if (recording.type === 'audio' && audioRef.current) {
      audioRef.current.src = recording.url;
      audioRef.current.play();
      setPlayingId(recording.id);
    } else if (recording.type === 'video' && videoRef.current) {
      videoRef.current.src = recording.url;
      videoRef.current.play();
      setPlayingId(recording.id);
    }
  };

  const downloadRecording = (recording: Recording) => {
    const url = recording.url;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.title}.${recording.type === 'video' ? 'webm' : 'webm'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const deleteRecording = (id: string) => {
    if (confirm('Delete this recording?')) {
      const updated = recordings.filter(r => r.id !== id);
      setRecordings(updated);
      localStorage.setItem(
        'doashow_recordings',
        JSON.stringify(
          updated.map(r => ({
            ...r,
            blob: null,
            url: null,
          }))
        )
      );
    }
  };

  const updateRecordingTitle = (id: string, title: string) => {
    const updated = recordings.map(r => (r.id === id ? { ...r, title } : r));
    setRecordings(updated);
    setEditingTitle(null);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 bg-secondary sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {recordingType === 'video' ? (
              <Video className="w-6 h-6 text-accent" />
            ) : (
              <Mic className="w-6 h-6 text-accent" />
            )}
            <div>
              <h2 className="text-2xl font-bold">
                {recordingType === 'video' ? '🎥 Video Recorder' : '🎙️ Audio Recorder'}
              </h2>
              <p className="text-sm text-foreground/60">Record and manage media files</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setRecordingType('audio')}
              variant={recordingType === 'audio' ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
            >
              <Mic className="w-4 h-4" />
              Audio
            </Button>
            <Button
              onClick={() => setRecordingType('video')}
              variant={recordingType === 'video' ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
            >
              <Video className="w-4 h-4" />
              Video
            </Button>
          </div>
        </div>
      </div>

      {/* Recorder Section */}
      <div className="border-b border-border px-6 py-6 bg-card">
        {/* Video Preview */}
        {recordingType === 'video' && (
          <div className="mb-4 rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              className="w-full h-64 object-cover"
              muted
            />
          </div>
        )}

        {/* Recording Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="gap-2 bg-red-600 hover:bg-red-700"
              size="lg"
            >
              <Mic className="w-5 h-5" />
              Start Recording
            </Button>
          ) : (
            <>
              <Button
                onClick={pauseRecording}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                onClick={stopRecording}
                className="gap-2 bg-red-600 hover:bg-red-700"
                size="lg"
              >
                <Square className="w-5 h-5" />
                Stop
              </Button>
              <div className="text-lg font-mono font-bold text-accent">
                {formatTime(recordingTime)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recordings List */}
      <div className="flex-1 overflow-y-auto p-6">
        {recordings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            {recordingType === 'video' ? (
              <Video className="w-16 h-16 text-foreground/20 mb-4" />
            ) : (
              <Mic className="w-16 h-16 text-foreground/20 mb-4" />
            )}
            <p className="text-foreground/60 mb-4">No recordings yet. Start recording!</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {recordings
              .filter(r => r.type === recordingType)
              .map(recording => (
                <div key={recording.id} className="border border-border rounded-lg p-4 bg-card hover:bg-card/80 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {editingTitle === recording.id ? (
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="flex-1 px-2 py-1 bg-background border border-border rounded text-sm"
                            autoFocus
                          />
                          <Button
                            onClick={() => updateRecordingTitle(recording.id, newTitle)}
                            size="sm"
                            variant="default"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditingTitle(null)}
                            size="sm"
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <h3 className="font-bold text-lg">{recording.title}</h3>
                      )}
                      <div className="flex gap-4 mt-2 text-xs text-foreground/50">
                        <span>📅 {recording.createdAt}</span>
                        <span>⏱️ {formatTime(recording.duration)}</span>
                        <span>💾 {formatSize(recording.size)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => playRecording(recording)}
                        variant={playingId === recording.id ? 'default' : 'outline'}
                        size="icon"
                        title="Play recording"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingTitle(recording.id);
                          setNewTitle(recording.title);
                        }}
                        variant="outline"
                        size="icon"
                        title="Edit title"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => downloadRecording(recording)}
                        variant="outline"
                        size="icon"
                        title="Download recording"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteRecording(recording.id)}
                        variant="destructive"
                        size="icon"
                        title="Delete recording"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Hidden media elements */}
      <audio ref={audioRef} />
    </div>
  );
}
