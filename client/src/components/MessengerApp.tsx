import { useState, useEffect, useRef } from 'react';
import { Send, Plus, Trash2, Search, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastTimestamp: string;
  messages: Message[];
  avatar: string;
}

export default function MessengerApp() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Pastor John',
      lastMessage: 'See you at Sunday service!',
      lastTimestamp: '2:30 PM',
      avatar: '👨‍🙏',
      messages: [
        { id: '1', sender: 'Pastor John', text: 'Hello! How are you doing?', timestamp: '2:15 PM', isOwn: false },
        { id: '2', sender: 'You', text: 'Great! Looking forward to the service.', timestamp: '2:20 PM', isOwn: true },
        { id: '3', sender: 'Pastor John', text: 'See you at Sunday service!', timestamp: '2:30 PM', isOwn: false },
      ],
    },
    {
      id: '2',
      name: 'Youth Group',
      lastMessage: 'Thanks for organizing the event!',
      lastTimestamp: '1:45 PM',
      avatar: '👥',
      messages: [
        { id: '1', sender: 'Sarah', text: 'The event was amazing!', timestamp: '1:30 PM', isOwn: false },
        { id: '2', sender: 'You', text: 'Thanks for organizing the event!', timestamp: '1:45 PM', isOwn: true },
      ],
    },
    {
      id: '3',
      name: 'Prayer Group',
      lastMessage: 'Praying for you all',
      lastTimestamp: '11:20 AM',
      avatar: '🙏',
      messages: [
        { id: '1', sender: 'Elder James', text: 'Let us pray together', timestamp: '11:00 AM', isOwn: false },
        { id: '2', sender: 'You', text: 'Amen, thank you', timestamp: '11:10 AM', isOwn: true },
        { id: '3', sender: 'Elder James', text: 'Praying for you all', timestamp: '11:20 AM', isOwn: false },
      ],
    },
  ]);

  const [selectedConversationId, setSelectedConversationId] = useState<string>('1');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: messageText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };

    const updatedConversations = conversations.map(conv =>
      conv.id === selectedConversationId
        ? {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: messageText,
            lastTimestamp: newMessage.timestamp,
          }
        : conv
    );

    setConversations(updatedConversations);
    setMessageText('');
    localStorage.setItem('doashow_messenger_conversations', JSON.stringify(updatedConversations));
  };

  const deleteConversation = (id: string) => {
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    if (selectedConversationId === id) {
      setSelectedConversationId(updated[0]?.id || '');
    }
    localStorage.setItem('doashow_messenger_conversations', JSON.stringify(updated));
  };

  const createNewConversation = () => {
    if (!newChatName.trim()) return;

    const newConversation: Conversation = {
      id: Date.now().toString(),
      name: newChatName,
      lastMessage: 'No messages yet',
      lastTimestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      avatar: '💬',
      messages: [],
    };

    const updated = [...conversations, newConversation];
    setConversations(updated);
    setSelectedConversationId(newConversation.id);
    setNewChatName('');
    setShowNewChat(false);
    localStorage.setItem('doashow_messenger_conversations', JSON.stringify(updated));
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar - Conversations */}
      <div className="w-80 border-r border-border flex flex-col bg-secondary">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold mb-4">Messenger</h2>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
            </div>
            <Button
              onClick={() => setShowNewChat(true)}
              size="icon"
              className="h-10 w-10"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* New Chat Form */}
        {showNewChat && (
          <div className="p-4 border-b border-border space-y-2">
            <input
              type="text"
              placeholder="Contact name..."
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
              onKeyPress={(e) => e.key === 'Enter' && createNewConversation()}
            />
            <div className="flex gap-2">
              <Button onClick={createNewConversation} size="sm" className="flex-1">
                Create
              </Button>
              <Button onClick={() => setShowNewChat(false)} variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-foreground/50 text-sm">
              No conversations found
            </div>
          ) : (
            filteredConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`w-full text-left px-4 py-3 border-b border-border transition-colors hover:bg-accent/10 ${
                  selectedConversationId === conv.id ? 'bg-accent/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{conv.avatar}</span>
                      <h3 className="font-semibold truncate">{conv.name}</h3>
                    </div>
                    <p className="text-xs text-foreground/60 truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-foreground/40 mt-1">{conv.lastTimestamp}</p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-border p-4 bg-card flex items-center gap-3">
              <span className="text-2xl">{selectedConversation.avatar}</span>
              <div>
                <h2 className="text-lg font-bold">{selectedConversation.name}</h2>
                <p className="text-xs text-foreground/60">Active now</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedConversation.messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-foreground/50">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                selectedConversation.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.isOwn
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-card border border-border text-foreground'
                      }`}
                    >
                      {!msg.isOwn && (
                        <p className="text-xs font-semibold mb-1 opacity-70">{msg.sender}</p>
                      )}
                      <p className="text-sm break-words">{msg.text}</p>
                      <p className="text-xs opacity-60 mt-1">{msg.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-4 bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-sm"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-foreground/50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
