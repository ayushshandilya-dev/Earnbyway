import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Send, Paperclip, Circle, ChevronLeft, Loader2, Sparkles } from 'lucide-react';

export const MessagingPage: React.FC = () => {
  const { conversations, messages, currentUser, sendMessage } = useApp();
  const [activeConv, setActiveConv] = useState(conversations[0]?.id || null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserName, setTypingUserName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConvs = conversations.filter(c =>
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMessages = activeConv ? messages[activeConv] || [] : [];
  const activeConversation = conversations.find(c => c.id === activeConv);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  // Simulate typing indicator when user starts typing
  useEffect(() => {
    if (!messageInput.trim() || !activeConversation) {
      setIsTyping(false);
      return;
    }
    // Show typing indicator for the other participant
    setIsTyping(true);
    setTypingUserName(activeConversation.participant.name);
    const timer = setTimeout(() => setIsTyping(false), 3000);
    return () => clearTimeout(timer);
  }, [messageInput, activeConversation]);

  const handleSend = useCallback(() => {
    if (!messageInput.trim() || !activeConv) return;
    setIsTyping(false);
    sendMessage(activeConv, messageInput.trim());
    setMessageInput('');
  }, [messageInput, activeConv, sendMessage]);

  return (
    <div className="py-4 h-[calc(100vh-12rem)]">
      <div className="glass-panel rounded-2xl overflow-hidden h-full flex border border-zinc-800/80">
        <div className={`w-full sm:w-80 lg:w-96 border-r border-zinc-800/80 flex flex-col ${showSidebar ? 'flex' : 'hidden sm:flex'}`}>
          <div className="p-4 border-b border-zinc-800/80">
            <h2 className="text-lg font-heading font-bold text-white mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-900/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConvs.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">No conversations yet.</div>
            ) : (
              filteredConvs.map(conv => {
                const isActive = activeConv === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => { setActiveConv(conv.id); setShowSidebar(false); }}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors border-b border-zinc-800/40 ${
                      isActive ? 'bg-emerald-500/5 border-l-2 border-l-emerald-500' : 'hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={conv.participant.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      {conv.participant.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold text-white truncate">{conv.participant.name}</span>
                        <span className="text-[10px] text-zinc-500 flex-shrink-0">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 px-1.5 py-0.5 bg-emerald-500 text-[10px] font-bold text-black rounded-full min-w-[18px] text-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className={`flex-1 flex flex-col ${showSidebar ? 'hidden sm:flex' : 'flex'}`}>
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-zinc-800/80 flex items-center gap-3">
                <button onClick={() => setShowSidebar(true)} className="sm:hidden p-1 text-zinc-400 hover:text-white">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <img src={activeConversation.participant.avatar} alt="" className="w-9 h-9 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{activeConversation.participant.name}</div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    {activeConversation.participant.isOnline ? (
                      <>
                        <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                        <span className="text-emerald-400">Online</span>
                      </>
                    ) : (
                      <span className="text-zinc-500">Offline</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isTyping && typingUserName && (
                  <div className="flex items-start gap-2 text-xs text-zinc-500 italic">
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                    <span>{typingUserName} is typing...</span>
                  </div>
                )}
                {activeMessages.map(msg => {
                  const isMine = msg.senderId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] sm:max-w-[70%] ${isMine ? 'order-1' : 'order-1'}`}>
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                          isMine
                            ? 'bg-emerald-500/20 border border-emerald-500/30 text-white rounded-br-md'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-md'
                        }`}>
                          {msg.text}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {msg.attachments.map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-800 text-[10px] text-emerald-400 hover:underline">
                                  <Paperclip className="w-3 h-3" /> File {i + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center gap-2 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[10px] text-zinc-600">{msg.timestamp}</span>
                          {isMine && (
                            <span className={`text-[10px] ${msg.isRead ? 'text-emerald-400' : 'text-zinc-600'}`}>
                              {msg.isRead ? '✓✓ Read' : '✓ Sent'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors" aria-label="Attach file">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black transition-all"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-400 mb-2">No conversation selected</h3>
                <p className="text-sm text-zinc-600">Choose a conversation from the left to start messaging.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
