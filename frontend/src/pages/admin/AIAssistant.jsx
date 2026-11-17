import React, { useState, useRef, useEffect } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Bot, Send, Sparkles, Copy, Check, Trash2,
  RefreshCw, User, BookOpen, Calendar, HelpCircle
} from 'lucide-react';

export default function AIAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name || 'Educator'}! I am **Skillora AI**, your institutional intelligence and personalized learning companion.\n\nI can analyze academic risk patterns, formulate targeted 7-day study roadmaps, explain foundational computer science concepts, or suggest remedial interventions for vulnerable students.\n\nHow can I support your educational goals today?`,
      timestamp: '10:30 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    'Generate a 7-day personalized study plan for Data Structures',
    'Explain Binary Search Trees and Big-O search complexity',
    'How does low attendance impact student academic risk?',
    'Create an active-recall revision cheat sheet for Database Joins',
    'Suggest intervention strategies for students with multiple backlogs'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText = input) => {
    const text = (messageText || '').trim();
    if (!text || loading) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user', content: text, timestamp: time };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', {
        message: text,
        student_context: {
          name: user?.name || 'Alex Rivera',
          gpa: 5.85,
          attendance: 64.2,
          weak_subjects: ['Data Structures & Algorithms', 'Database Systems']
        }
      });

      const assistantMsg = {
        role: 'assistant',
        content: res.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an error connecting to the AI Tutor service. Please verify that the Python FastAPI backend is running.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Conversation cleared. How can I assist you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Skillora AI Academic Assistant</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Intelligent pedagogical companion & tutoring engine</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
              m.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gradient-to-tr from-blue-700 to-sky-400 text-white shadow-xs'
            }`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`rounded-2xl p-4 text-xs leading-relaxed group relative ${
              m.role === 'user'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200'
            }`}>
              <div className="whitespace-pre-wrap">{m.content}</div>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/40 dark:border-slate-700/40 text-[10px] opacity-75">
                <span>{m.timestamp}</span>
                {m.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(m.content, idx)}
                    className="flex items-center gap-1 hover:text-blue-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-xl">
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500">
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px]">Skillora Tutor is generating pedagogical guidance...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pills */}
      <div className="px-6 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 flex items-center gap-2 overflow-x-auto">
        <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Suggestions:</span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[11px] text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a pedagogical question, study roadmap request, or concept breakdown..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
