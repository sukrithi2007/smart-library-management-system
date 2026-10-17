import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { HelpCircle, Send, X, Bot, Check, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'librarian';
  text: string;
  time: string;
}

export const AskLibrarianModal: React.FC = () => {
  const { activeModal, setActiveModal, currentUser, addToast } = useLibrary();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'librarian',
      text: `Hello ${currentUser.name.split(' ')[0]}! I'm Dr. Elena Rostova from the Academic Circulation & Research Desk. How may I assist your scholarship or book discovery today?`,
      time: 'Just now',
    },
  ]);

  if (activeModal !== 'ask_librarian') return null;

  const quickQueries = [
    'How do I renew my borrowed book?',
    'What is the borrowing limit for students?',
    'How do reservations & waitlists work?',
    'Where is the Science Wing located?',
    'How do I download my reading history CSV?',
  ];

  const getLibrarianAnswer = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('renew')) {
      return 'You can renew eligible loans directly under "My Loans". Each book can be renewed up to 2 times (+14 days each), provided another student has not placed a reservation on that title.';
    }
    if (q.includes('limit') || q.includes('quota') || q.includes('how many')) {
      return `Undergraduate & graduate students have a standard quota of ${currentUser.borrowedLimit} concurrent volumes. Faculty and research scholars can request extended limits at the 1st floor desk.`;
    }
    if (q.includes('reserve') || q.includes('waitlist')) {
      return 'When all physical copies of a title are checked out, the "Reserve My Copy" button appears. You are placed in a sequential queue and receive an immediate alert when the book is returned!';
    }
    if (q.includes('science wing') || q.includes('location') || q.includes('shelf') || q.includes('where')) {
      return 'The Science Wing is located on the 3rd Floor of Kepler Complex. Computer Science & AI books are on Shelves 301–312, while Quantum Physics is on the 2nd Floor (Shelves 210–225).';
    }
    if (q.includes('csv') || q.includes('report') || q.includes('history')) {
      return 'You can export your complete official borrowing statement anytime by clicking "Download My Report" in your Dashboard or under "My Loans". It downloads a clean CSV file.';
    }
    return `Thank you for your inquiry about "${query}". I have logged your research request with the reference desk. You can also explore our digital catalog or visit us at Kepler Hall Level 1!`;
  };

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate librarian response after 600ms
    setTimeout(() => {
      const replyText = getLibrarianAnswer(q);
      const replyMsg: ChatMessage = {
        id: `msg-lib-${Date.now()}`,
        sender: 'librarian',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200/20 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col h-[540px]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/avatar_librarian_elena_1792230676929.jpg"
              alt="Dr. Elena Rostova"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Dr. Elena Rostova
                <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  Active
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Head of Cataloging & Student Research Desk
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick FAQ Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-x-auto whitespace-nowrap flex gap-1.5">
          {quickQueries.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Dr. Elena about books, loans, or floor directions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white disabled:opacity-40 hover:from-indigo-500 hover:to-violet-500 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
