import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Folder, File, Image, Music, FileText, Archive, AlertCircle, CheckCircle, Info, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: string;
  size?: number;
  modified?: string;
  children?: FileItem[];
  blob?: Blob;
}

interface FileExplorerProps {
  onFileSelect?: (file: FileItem) => void;
}

const DB_NAME = 'DoaShowDB';
const STORE_NAME = 'files';

// Sample file structure
const sampleFileStructure: FileItem[] = [
  {
    id: 'root',
    name: 'My Computer',
    type: 'folder',
    children: [
      {
        id: 'documents',
        name: 'Documents',
        type: 'folder',
        children: [
          { id: 'doc1', name: 'Resume.pdf', type: 'file', fileType: 'pdf', size: 245, modified: '2024-01-15' },
          { id: 'doc2', name: 'Notes.txt', type: 'file', fileType: 'txt', size: 12, modified: '2024-01-20' },
        ],
      },
      {
        id: 'pictures',
        name: 'Pictures',
        type: 'folder',
        children: [
          { id: 'pic1', name: 'Vacation.jpg', type: 'file', fileType: 'image', size: 2048, modified: '2024-01-10' },
          { id: 'pic2', name: 'Family.png', type: 'file', fileType: 'image', size: 1024, modified: '2024-01-12' },
          { id: 'pic3', name: 'Landscape.jpg', type: 'file', fileType: 'image', size: 3072, modified: '2024-01-18' },
        ],
      },
      {
        id: 'music',
        name: 'Music',
        type: 'folder',
        children: [
          { id: 'song1', name: 'Song1.mp3', type: 'file', fileType: 'audio', size: 5120, modified: '2024-01-05' },
          { id: 'song2', name: 'Song2.mp3', type: 'file', fileType: 'audio', size: 4096, modified: '2024-01-08' },
        ],
      },
      {
        id: 'downloads',
        name: 'Downloads',
        type: 'folder',
        children: [
          { id: 'app1', name: 'Software.zip', type: 'file', fileType: 'archive', size: 10240, modified: '2024-01-19' },
        ],
      },
      {
        id: 'uploads',
        name: 'Uploads',
        type: 'folder',
        children: [],
      },
    ],
  },
];

function getFileIcon(fileType?: string) {
  switch (fileType) {
    case 'image':
      return <Image className="w-4 h-4 text-blue-400" />;
    case 'audio':
      return <Music className="w-4 h-4 text-purple-400" />;
    case 'pdf':
    case 'txt':
      return <FileText className="w-4 h-4 text-red-400" />;
    case 'archive':
      return <Archive className="w-4 h-4 text-orange-400" />;
    case 'video':
      return <File className="w-4 h-4 text-yellow-400" />;
    default:
      return <File className="w-4 h-4 text-gray-400" />;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (['mp3', 'wav', 'flac', 'aac'].includes(ext)) return 'audio';
  if (['mp4', 'webm', 'avi', 'mov'].includes(ext)) return 'video';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['txt', 'md', 'json', 'csv'].includes(ext)) return 'txt';
  if (['zip', 'rar', '7z', 'tar'].includes(ext)) return 'archive';
  return 'file';
}

export default function FileExplorer({ onFileSelect }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [currentPath, setCurrentPath] = useState<string[]>(['My Computer']);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [fileStructure, setFileStructure] = useState<FileItem[]>(sampleFileStructure);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingTo, setUploadingTo] = useState<string | null>(null);

  const tickerMessages = [
    { type: 'info', text: '📁 Total files: 12 | Folders: 5' },
    { type: 'success', text: '✓ System running smoothly' },
    { type: 'info', text: '💾 Storage: 45GB available' },
    { type: 'info', text: '🔒 All files secured' },
    { type: 'success', text: '✓ Last backup: Today at 2:15 PM' },
    { type: 'info', text: '📊 CPU Usage: 12% | Memory: 34%' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetFolderId: string) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const newStructure = JSON.parse(JSON.stringify(fileStructure));

    const addFilesToFolder = (items: FileItem[], folderId: string) => {
      for (const item of items) {
        if (item.id === folderId && item.type === 'folder') {
          if (!item.children) item.children = [];
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const newFile: FileItem = {
              id: `file_${Date.now()}_${i}`,
              name: file.name,
              type: 'file',
              fileType: getFileType(file.name),
              size: file.size,
              modified: new Date().toLocaleString(),
              blob: file,
            };
            item.children.push(newFile);
          }
          return true;
        }
        if (item.children) {
          if (addFilesToFolder(item.children, folderId)) return true;
        }
      }
      return false;
    };

    addFilesToFolder(newStructure, targetFolderId);
    setFileStructure(newStructure);
    setUploadingTo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const deleteFile = (fileId: string) => {
    const newStructure = JSON.parse(JSON.stringify(fileStructure));

    const removeFile = (items: FileItem[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === fileId) {
          items.splice(i, 1);
          return true;
        }
        if (items[i].children && removeFile(items[i].children!)) {
          return true;
        }
      }
      return false;
    };

    removeFile(newStructure);
    setFileStructure(newStructure);
  };

  const downloadFile = (file: FileItem) => {
    if (file.blob) {
      const url = URL.createObjectURL(file.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map(item => (
      <div key={item.id}>
        <div
          className="flex items-center gap-2 px-3 py-2 hover:bg-accent/10 cursor-pointer text-sm group"
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id);
            } else {
              onFileSelect?.(item);
            }
          }}
        >
          {item.type === 'folder' ? (
            <>
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  expandedFolders.has(item.id) ? 'rotate-90' : ''
                }`}
              />
              <Folder className="w-4 h-4 text-blue-400" />
            </>
          ) : (
            <>
              <div className="w-4" />
              {getFileIcon(item.fileType)}
            </>
          )}
          <span className="flex-1">{item.name}</span>
          {item.size && (
            <span className="text-xs text-foreground/50 ml-auto">
              {formatFileSize(item.size)}
            </span>
          )}
          {item.type === 'folder' && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setUploadingTo(item.id);
                fileInputRef.current?.click();
              }}
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
            >
              <Upload className="w-3 h-3" />
            </Button>
          )}
        </div>

        {item.type === 'folder' && expandedFolders.has(item.id) && item.children && (
          renderFileTree(item.children, depth + 1)
        )}
      </div>
    ));
  };

  const currentMessage = tickerMessages[tickerIndex];

  const getTickerIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrolling Ticker */}
      <div className="bg-gradient-to-r from-accent/20 to-accent/10 border-b border-accent/30 px-4 py-2 overflow-hidden">
        <div className="flex items-center gap-3">
          {getTickerIcon(currentMessage.type)}
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium text-foreground/80 whitespace-nowrap animate-pulse">
              {currentMessage.text}
            </div>
          </div>
        </div>
      </div>

      {/* Address Bar */}
      <div className="border-b border-border px-4 py-2 bg-secondary">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-foreground/60">📍</span>
          <span className="text-foreground">{currentPath.join(' > ')}</span>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {renderFileTree(fileStructure)}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => uploadingTo && handleFileUpload(e, uploadingTo)}
        className="hidden"
        accept="image/*,audio/*,video/*,.pdf,.txt,.zip,.rar"
      />

      {/* Status Bar */}
      <div className="border-t border-border px-4 py-2 bg-secondary text-xs text-foreground/60 flex justify-between">
        <span>Ready</span>
        {uploadingTo && <span className="text-accent">Uploading...</span>}
      </div>
    </div>
  );
}
