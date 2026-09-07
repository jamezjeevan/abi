import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, Clock } from 'lucide-react';
import { messagingService } from '../../services/messagingService';
import { campusStore } from '../../services/campusStore';

export const ChatWindow = ({
  conversationId,
  currentUserId,
  currentUserName,
  title,
  subtitle
}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!conversationId) return;
    const msgs = await messagingService.getMessages(conversationId);
    setMessages(msgs || []);
  };

  useEffect(() => {
    fetchMessages();
    const unsubscribe = campusStore.subscribe(() => {
      fetchMessages();
    });
    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    await messagingService.sendMessage({
      conversationId,
      senderId: currentUserId,
      senderName: currentUserName,
      content: inputText
    });

    setInputText('');
  };

  if (!conversationId) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400">
        <MessageSquare className="w-10 h-10 mb-2 stroke-1" />
        <p className="text-xs font-medium">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[520px] bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900">{title || 'Direct Conversation'}</h4>
          {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-semibold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Realtime Live</span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] font-semibold text-slate-400 mb-1 px-1">
                {isMe ? 'You' : msg.sender_name}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                  isMe
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                }`}
              >
                {msg.content}
              </div>
              <div className="text-[9px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
