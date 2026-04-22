import React, { useState, useEffect } from 'react';
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
  orange?: boolean;
}

interface FileExplorerProps {
  onFileSelect?: (file: FileItem) => void;
}

const DB_NAME = 'DoaShowDB';
const STORE_NAME = 'files';

// Sample file structure with hierarchical organization
const sampleFileStructure: FileItem[] = [
  {
    id: 'root',
    name: 'My Computer',
    type: 'folder',
    children: [
      {
        id: 'portable-c',
        name: 'portable-c',
        type: 'folder',
        children: [
          { id: 'start', name: '0. Start', type: 'folder', children: [] },
          { id: 'activities', name: 'A. activities', type: 'folder', children: [] },
          { id: 'posts', name: 'B. posts', type: 'folder', children: [] },
          {
            id: 'operations',
            name: 'C. OPERATIONS',
            type: 'folder',
            orange: true,
            children: [
              {
                id: 'ops-others',
                name: '$ (others)',
                type: 'folder',
                children: [
                  { id: 'ops-hidden', name: '$hiddenfolders', type: 'folder', children: [] },
                ],
              },
              {
                id: 'ops-price',
                name: '-0 price',
                type: 'folder',
                children: [
                  {
                    id: 'price-circle',
                    name: '--Prices Circle',
                    type: 'folder',
                    children: [
                      { id: 'rolls-a', name: '(+) A_rolls', type: 'folder', children: [] },
                      { id: 'rolls-b', name: '(+) B_rolls', type: 'folder', children: [] },
                      { id: 'rolls-c', name: '(+) C_rolls', type: 'folder', children: [] },
                      { id: 'category', name: '(+) Category', type: 'folder', children: [] },
                      { id: 'nav', name: '(+) NAV', type: 'folder', children: [] },
                      { id: 'nav-circle', name: '(+) NAV CIRCLE', type: 'folder', children: [] },
                      { id: 'morgue', name: 'A_.00 1 MORGUE', type: 'folder', children: [] },
                      { id: 'rolls-main', name: 'A_.00 1 ROLLS', type: 'folder', children: [] },
                    ],
                  },
                ],
              },
            ],
          },
          { id: 'd-morse', name: 'D. Morse', type: 'folder', children: [] },
          { id: 'e-experiments', name: 'E. Experiments', type: 'folder', children: [] },
          { id: 'f-something', name: 'F. Something', type: 'folder', children: [] },
          { id: 'g-something2', name: 'G. Something', type: 'folder', children: [] },
          { id: 'i-games', name: 'I. Games', type: 'folder', children: [] },
          { id: 'j-tv', name: 'J. TV', type: 'folder', children: [] },
          { id: 'k-movies', name: 'K. Movies', type: 'folder', children: [] },
          { id: 'l-radio', name: 'L. Radio', type: 'folder', children: [] },
          { id: 'm-news', name: 'M. News', type: 'folder', children: [] },
          { id: 'n-science', name: 'N. Science', type: 'folder', children: [] },
          { id: 'o-medicine', name: 'O. Medicine', type: 'folder', children: [] },
          { id: 'p-tech', name: 'P. Tech', type: 'folder', children: [] },
          { id: 'q-music', name: 'Q. Music', type: 'folder', children: [] },
          { id: 'r-recording', name: 'R. Recording', type: 'folder', children: [] },
          { id: 's-instruments', name: 'S. Instruments', type: 'folder', children: [] },
          { id: 't-people', name: 'T. People', type: 'folder', children: [] },
          { id: 'u-computer', name: 'U. Computer', type: 'folder', children: [] },
          { id: 'v-gadgets', name: 'V. Gadgets', type: 'folder', children: [] },
          { id: 'w-characters', name: 'W. Characters', type: 'folder', children: [] },
          { id: 'x-cast', name: 'X. Cast', type: 'folder', children: [] },
          { id: 'y-guest', name: 'Y. Guest', type: 'folder', children: [] },
          { id: 'z-zombie', name: 'Z. Zombie', type: 'folder', children: [] },
        ],
      },
      {
        id: 'storage-d',
        name: 'storage-d',
        type: 'folder',
        children: [],
      },
      {
        id: 'device-a',
        name: 'device-a',
        type: 'folder',
        children: [],
      },
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

function FileTreeItem({
  item,
  level = 0,
  onUpload,
  onDelete,
}: {
  item: FileItem;
  level?: number;
  onUpload: (parentId: string) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(level < 2);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hasChildren = item.children && item.children.length > 0;
  const isFolder = item.type === 'folder';

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 hover:bg-accent/10 rounded transition-colors ${
          item.orange ? 'bg-orange-500/10 border-l-2 border-orange-500' : ''
        }`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {isFolder && hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-0 hover:bg-accent/20 rounded"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          </button>
        )}
        {isFolder && !hasChildren && <div className="w-4" />}

        {isFolder ? (
          <Folder className={`w-4 h-4 ${item.orange ? 'text-orange-500' : 'text-blue-400'}`} />
        ) : (
          getFileIcon(item.fileType)
        )}

        <span className="text-sm flex-1 truncate">{item.name}</span>

        {item.size && (
          <span className="text-xs text-foreground/50">{formatFileSize(item.size)}</span>
        )}

        {hoveredId === item.id && isFolder && (
          <div className="flex gap-1">
            <Button
              onClick={() => onUpload(item.id)}
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              title="Upload files"
            >
              <Upload className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onDelete(item.id)}
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              title="Delete folder"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {isFolder && expanded && item.children && item.children.length > 0 && (
        <div>
          {item.children.map(child => (
            <FileTreeItem
              key={child.id}
              item={child}
              level={level + 1}
              onUpload={onUpload}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer() {
  const [fileStructure, setFileStructure] = useState<FileItem[]>(sampleFileStructure);
  const [uploadingFolderId, setUploadingFolderId] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const tickerMessages = [
    { text: '💾 Storage: 256 GB available', icon: Info, color: 'text-blue-400' },
    { text: '✅ System Status: All systems operational', icon: CheckCircle, color: 'text-green-400' },
    { text: '📁 Total Files: 1,247 items', icon: Info, color: 'text-blue-400' },
    { text: '⚠️ Backup: Last backup 2 hours ago', icon: AlertCircle, color: 'text-orange-400' },
    { text: '🔄 Sync: Cloud sync enabled', icon: CheckCircle, color: 'text-green-400' },
    { text: '📊 Usage: 156 GB of 256 GB used', icon: Info, color: 'text-blue-400' },
    { text: '🛡️ Security: All files encrypted', icon: CheckCircle, color: 'text-green-400' },
    { text: '⏱️ Last updated: Just now', icon: Info, color: 'text-blue-400' },
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tickerMessages.length]);

  const handleUpload = (parentId: string) => {
    setUploadingFolderId(parentId);
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !uploadingFolderId) return;

    const newFiles: FileItem[] = Array.from(files).map((file) => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: 'file',
      fileType: file.type.split('/')[0] || 'file',
      size: file.size,
      modified: new Date().toISOString().split('T')[0],
      blob: file,
    }));

    const updateFileStructure = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        if (item.id === uploadingFolderId && item.children) {
          return { ...item, children: [...item.children, ...newFiles] };
        }
        if (item.children) {
          return { ...item, children: updateFileStructure(item.children) };
        }
        return item;
      });
    };

    setFileStructure(updateFileStructure(fileStructure));
    setUploadingFolderId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id: string) => {
    const deleteItem = (items: FileItem[]): FileItem[] => {
      return items
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          children: item.children ? deleteItem(item.children) : undefined,
        }));
    };

    setFileStructure(deleteItem(fileStructure));
  };

  const currentMessage = tickerMessages[currentMessageIndex];
  const MessageIcon = currentMessage.icon;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Scrolling Ticker */}
      <div className="bg-gradient-to-r from-secondary via-secondary to-secondary border-b border-border p-2 overflow-hidden">
        <div className="flex items-center gap-2 animate-scroll-ticker">
          <MessageIcon className={`w-4 h-4 flex-shrink-0 ${currentMessage.color}`} />
          <span className="text-xs text-foreground/70 whitespace-nowrap">{currentMessage.text}</span>
          <span className="mx-4 text-foreground/30">•</span>
          <MessageIcon className={`w-4 h-4 flex-shrink-0 ${currentMessage.color}`} />
          <span className="text-xs text-foreground/70 whitespace-nowrap">{currentMessage.text}</span>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        {fileStructure.map((item) => (
          <FileTreeItem
            key={item.id}
            item={item}
            onUpload={handleUpload}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />
    </div>
  );
}
