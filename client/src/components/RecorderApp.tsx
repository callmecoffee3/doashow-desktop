import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Recording {
  id: string;
  name: string;
  duration: number;
  blob: Blob;
  created: string;
}

export default function RecorderApp() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const newRecording: Recording = {
          id: Date.now().toString(),
          name: `Recording ${recordings.length + 1}`,
          duration: recordingTime,
          blob: audioBlob,
          created: new Date().toLocaleString(),
        };
        setRecordings([newRecording, ...recordings]);
        setRecordingTime(0);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = (recording: Recording) => {
    if (audioRef.current) {
      const url = URL.createObjectURL(recording.blob);
      audioRef.current.src = url;
      audioRef.current.play();
      setPlayingId(recording.id);
    }
  };

  const deleteRecording = (id: string) => {
    setRecordings(recordings.filter(r => r.id !== id));
    if (playingId === id) {
      setPlayingId(null);
      if (audioRef.current) audioRef.current.pause();
    }
  };

  const downloadRecording = (recording: Recording) => {
    const url = URL.createObjectURL(recording.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.name}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Recording Controls */}
      <div className="border-b border-border p-6 bg-secondary">
        <div className="text-center mb-6">
          <div className="text-5xl font-mono font-bold text-accent mb-4">
            {formatTime(recordingTime)}
          </div>
          <div className="flex gap-3 justify-center">
            {!isRecording ? (
              <Button onClick={startRecording} size="lg" className="gap-2 bg-accent hover:bg-accent/90">
                <Mic className="w-5 h-5" />
                Start Recording
              </Button>
            ) : (
              <>
                <Button onClick={pauseRecording} variant="outline" size="lg" className="gap-2">
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button onClick={stopRecording} variant="destructive" size="lg" className="gap-2">
                  <Square className="w-5 h-5" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recordings List */}
      <div className="flex-1 overflow-y-auto p-6">
        {recordings.length === 0 ? (
          <div className="flex items-center justify-center h-full text-foreground/50">
            <div className="text-center">
              <Mic className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No recordings yet</p>
              <p className="text-sm">Start recording to create your first audio file</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl">
            {recordings.map(recording => (
              <div key={recording.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-semibold">{recording.name}</div>
                    <div className="text-xs text-foreground/60">
                      {recording.created} • {formatTime(recording.duration)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => playRecording(recording)}
                      variant="outline"
                      size="icon"
                      className={playingId === recording.id ? 'bg-accent/20' : ''}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => downloadRecording(recording)}
                      variant="outline"
                      size="icon"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteRecording(recording.id)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <audio
                  ref={audioRef}
                  onEnded={() => setPlayingId(null)}
                  className="w-full h-8"
                  controls
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
