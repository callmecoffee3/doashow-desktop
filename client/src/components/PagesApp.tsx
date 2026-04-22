import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Eye, FileText, Search, LogOut, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  createdDate: string;
  updatedDate: string;
  views: number;
  owner: string;
}

export default function PagesApp() {
  const [myPages, setMyPages] = useState<Page[]>([
    {
      id: '1',
      title: 'Welcome to DoaShow',
      slug: 'welcome',
      content: 'Welcome to our community! This is a sample page to get you started.',
      status: 'published',
      createdDate: '2024-01-01',
      updatedDate: '2024-01-15',
      views: 245,
      owner: 'You',
    },
    {
      id: '2',
      title: 'Getting Started Guide',
      slug: 'getting-started',
      content: 'Learn how to use DoaShow and all its amazing features.',
      status: 'published',
      createdDate: '2024-01-02',
      updatedDate: '2024-01-14',
      views: 189,
      owner: 'You',
    },
  ]);

  const [allPages, setAllPages] = useState<Page[]>([
    {
      id: '3',
      title: 'Advanced Features',
      slug: 'advanced-features',
      content: 'Explore the advanced features available in DoaShow.',
      status: 'published',
      createdDate: '2024-01-10',
      updatedDate: '2024-01-20',
      views: 156,
      owner: 'John Doe',
    },
    {
      id: '4',
      title: 'Community Guidelines',
      slug: 'community-guidelines',
      content: 'Please follow these guidelines when using DoaShow.',
      status: 'published',
      createdDate: '2024-01-05',
      updatedDate: '2024-01-18',
      views: 342,
      owner: 'Admin',
    },
    {
      id: '5',
      title: 'Tips and Tricks',
      slug: 'tips-tricks',
      content: 'Discover useful tips and tricks to get the most out of DoaShow.',
      status: 'published',
      createdDate: '2024-01-08',
      updatedDate: '2024-01-19',
      views: 298,
      owner: 'Jane Smith',
    },
  ]);

  const [selectedPageId, setSelectedPageId] = useState<string>('1');
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [showPageDiscovery, setShowPageDiscovery] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPageData, setNewPageData] = useState({
    title: '',
    slug: '',
    content: '',
  });

  const selectedPage = myPages.find(p => p.id === selectedPageId);

  useEffect(() => {
    localStorage.setItem('doashow_my_pages', JSON.stringify(myPages));
    localStorage.setItem('doashow_all_pages', JSON.stringify(allPages));
  }, [myPages, allPages]);

  const createPage = () => {
    if (!newPageData.title.trim() || !newPageData.slug.trim()) return;

    const newPage: Page = {
      id: Date.now().toString(),
      title: newPageData.title,
      slug: newPageData.slug,
      content: newPageData.content,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      views: 0,
      owner: 'You',
    };

    setMyPages([...myPages, newPage]);
    setSelectedPageId(newPage.id);
    setNewPageData({ title: '', slug: '', content: '' });
    setShowNewPageForm(false);
  };

  const joinPage = (pageId: string) => {
    const pageToJoin = allPages.find(p => p.id === pageId);
    if (!pageToJoin) return;

    const joinedPage: Page = {
      ...pageToJoin,
      views: pageToJoin.views + 1,
    };

    setMyPages([...myPages, joinedPage]);
    setAllPages(allPages.filter(p => p.id !== pageId));
    setSelectedPageId(joinedPage.id);
    setShowPageDiscovery(false);
  };

  const leavePage = (id: string) => {
    const updated = myPages.filter(p => p.id !== id);
    setMyPages(updated);
    if (selectedPageId === id) {
      setSelectedPageId(updated[0]?.id || '');
    }

    const leftPage = myPages.find(p => p.id === id);
    if (leftPage && leftPage.owner !== 'You') {
      setAllPages([...allPages, leftPage]);
    }
  };

  const updatePage = (id: string, updates: Partial<Page>) => {
    const updated = myPages.map(p =>
      p.id === id
        ? {
            ...p,
            ...updates,
            updatedDate: new Date().toISOString().split('T')[0],
          }
        : p
    );
    setMyPages(updated);
    setEditingPageId(null);
  };

  const deletePage = (id: string) => {
    const updated = myPages.filter(p => p.id !== id);
    setMyPages(updated);
    if (selectedPageId === id) {
      setSelectedPageId(updated[0]?.id || '');
    }
  };

  const publishPage = (id: string) => {
    updatePage(id, { status: 'published' });
  };

  const unpublishPage = (id: string) => {
    updatePage(id, { status: 'draft' });
  };

  const filteredPages = allPages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full">
      {/* Pages Sidebar */}
      <div className="w-72 border-r border-border bg-secondary flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold mb-3">My Pages</h2>
          <div className="flex gap-2">
            <Button onClick={() => setShowNewPageForm(true)} className="flex-1 gap-2" size="sm">
              <Plus className="w-4 h-4" />
              New
            </Button>
            <Button onClick={() => setShowPageDiscovery(true)} variant="outline" className="flex-1 gap-2" size="sm">
              <Search className="w-4 h-4" />
              Browse
            </Button>
          </div>
        </div>

        {/* New Page Form */}
        {showNewPageForm && (
          <div className="p-4 border-b border-border space-y-2">
            <input
              type="text"
              placeholder="Page title"
              value={newPageData.title}
              onChange={(e) => setNewPageData({ ...newPageData, title: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <input
              type="text"
              placeholder="Page slug (URL)"
              value={newPageData.slug}
              onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <textarea
              placeholder="Page content"
              value={newPageData.content}
              onChange={(e) => setNewPageData({ ...newPageData, content: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-20 resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={createPage} size="sm" className="flex-1">
                Create
              </Button>
              <Button onClick={() => setShowNewPageForm(false)} variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Pages List */}
        <div className="flex-1 overflow-y-auto">
          {myPages.map(page => (
            <button
              key={page.id}
              onClick={() => setSelectedPageId(page.id)}
              className={`w-full text-left px-4 py-3 border-b border-border transition-colors hover:bg-accent/10 ${
                selectedPageId === page.id ? 'bg-accent/20' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{page.title}</h3>
                  <p className="text-xs text-foreground/60 mt-1">/{page.slug}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        page.status === 'published'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {page.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-foreground/50 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {page.views}
                    </span>
                  </div>
                </div>
                {page.owner === 'You' ? (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePage(page.id);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      leavePage(page.id);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <LogOut className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Page Discovery Modal */}
      {showPageDiscovery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Discover Pages</h3>
              <Button onClick={() => setShowPageDiscovery(false)} variant="ghost" size="icon">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm mb-4"
            />

            <div className="space-y-2">
              {filteredPages.length > 0 ? (
                filteredPages.map(page => (
                  <div key={page.id} className="p-3 bg-background border border-border rounded-lg flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{page.title}</h4>
                      <p className="text-xs text-foreground/60 mt-1">{page.content.substring(0, 60)}...</p>
                      <p className="text-xs text-foreground/50 mt-1">
                        By {page.owner} • {page.views} views
                      </p>
                    </div>
                    <Button onClick={() => joinPage(page.id)} className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      Join
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-foreground/50 py-4">No pages found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Editor */}
      <div className="flex-1 flex flex-col">
        {selectedPage ? (
          <>
            {/* Page Header */}
            <div className="border-b border-border p-4 bg-card flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedPage.title}</h2>
                <p className="text-sm text-foreground/60 mt-1">/{selectedPage.slug} • By {selectedPage.owner}</p>
              </div>
              <div className="flex gap-2">
                {selectedPage.owner === 'You' && (
                  <>
                    {selectedPage.status === 'draft' ? (
                      <Button onClick={() => publishPage(selectedPage.id)} className="gap-2">
                        <Eye className="w-4 h-4" />
                        Publish
                      </Button>
                    ) : (
                      <Button onClick={() => unpublishPage(selectedPage.id)} variant="outline" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Unpublish
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Page Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {editingPageId === selectedPage.id && selectedPage.owner === 'You' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Title</label>
                    <input
                      type="text"
                      value={selectedPage.title}
                      onChange={(e) => updatePage(selectedPage.id, { title: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      value={selectedPage.slug}
                      onChange={(e) => updatePage(selectedPage.id, { slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Content</label>
                    <textarea
                      value={selectedPage.content}
                      onChange={(e) => updatePage(selectedPage.id, { content: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm h-64 resize-none font-mono"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setEditingPageId(null)} className="gap-2">
                      <Save className="w-4 h-4" />
                      Done Editing
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          selectedPage.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {selectedPage.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-sm text-foreground/60">
                        Created: {selectedPage.createdDate} • Updated: {selectedPage.updatedDate}
                      </span>
                    </div>
                    {selectedPage.owner === 'You' && (
                      <Button onClick={() => setEditingPageId(selectedPage.id)} variant="outline" className="gap-2">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                    )}
                  </div>

                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="prose prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                        {selectedPage.content}
                      </p>
                    </div>
                  </div>

                  {/* Page Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-card border border-border rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">{selectedPage.views}</p>
                      <p className="text-xs text-foreground/60 mt-1">Views</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4 text-center">
                      <p className="text-sm text-foreground/80">{selectedPage.createdDate}</p>
                      <p className="text-xs text-foreground/60 mt-1">Created</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4 text-center">
                      <p className="text-sm text-foreground/80">{selectedPage.updatedDate}</p>
                      <p className="text-xs text-foreground/60 mt-1">Updated</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-foreground/50">
            <p>Select a page to view or edit</p>
          </div>
        )}
      </div>
    </div>
  );
}
