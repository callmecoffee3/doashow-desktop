import { useState } from 'react';
import { ChevronRight, Folder, File, Image, Music, FileText, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: string;
  size?: number;
  modified?: string;
  children?: FileItem[];
}

interface FileExplorerProps {
  onFileSelect?: (file: FileItem) => void;
}

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

export default function FileExplorer({ onFileSelect }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [currentPath, setCurrentPath] = useState<string[]>(['My Computer']);

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

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map(item => (
      <div key={item.id}>
        <div
          className="flex items-center gap-2 px-3 py-2 hover:bg-accent/10 cursor-pointer text-sm"
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
        </div>

        {item.type === 'folder' && expandedFolders.has(item.id) && item.children && (
          renderFileTree(item.children, depth + 1)
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Address Bar */}
      <div className="border-b border-border px-4 py-2 bg-secondary">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-foreground/60">📍</span>
          <span className="text-foreground">{currentPath.join(' > ')}</span>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {renderFileTree(sampleFileStructure)}
      </div>

      {/* Status Bar */}
      <div className="border-t border-border px-4 py-2 bg-secondary text-xs text-foreground/60">
        <span>Ready</span>
      </div>
    </div>
  );
}
