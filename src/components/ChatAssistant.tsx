import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { ChatMessage, ChatConfig } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatAssistantProps {
  config: ChatConfig;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Initialize with welcome message from config
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'model',
      text: config.welcomeMessage,
      timestamp: new Date()
    }]);
  }, [config.welcomeMessage]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(
        messages, 
        userMessage.text, 
        config.apiKey, 
        config.systemInstruction,
        config.botName
      );
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to generate response", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format markdown-like text
  const formatText = (text: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let remaining = text;
    let keyIndex = 0;

    while (remaining.length > 0) {
      // Buscar **negrita**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Buscar *cursiva*
      const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);
      
      // Encontrar cuál viene primero
      const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : -1;
      const italicIndex = italicMatch ? remaining.indexOf(italicMatch[0]) : -1;
      
      let firstMatch: { match: RegExpMatchArray; index: number; type: 'bold' | 'italic' } | null = null;
      
      if (boldIndex !== -1 && (italicIndex === -1 || boldIndex <= italicIndex)) {
        firstMatch = { match: boldMatch!, index: boldIndex, type: 'bold' };
      } else if (italicIndex !== -1) {
        firstMatch = { match: italicMatch!, index: italicIndex, type: 'italic' };
      }
      
      if (firstMatch) {
        // Agregar texto antes del match
        if (firstMatch.index > 0) {
          result.push(<span key={keyIndex++}>{remaining.substring(0, firstMatch.index)}</span>);
        }
        
        // Agregar el texto formateado
        if (firstMatch.type === 'bold') {
          result.push(<strong key={keyIndex++} className="font-bold">{firstMatch.match[1]}</strong>);
        } else {
          result.push(<em key={keyIndex++} className="italic">{firstMatch.match[1]}</em>);
        }
        
        remaining = remaining.substring(firstMatch.index + firstMatch.match[0].length);
      } else {
        // No más matches, agregar el resto
        result.push(<span key={keyIndex++}>{remaining}</span>);
        break;
      }
    }
    
    return result;
  };

  // Helper function to render text with clickable links/buttons and formatting
  const renderMessageContent = (text: string, role: 'user' | 'model') => {
    // Primero dividir por líneas para manejar listas
    const lines = text.split('\n');
    
    return (
      <div className="space-y-1">
        {lines.map((line, lineIndex) => {
          // Detectar listas con viñetas (- o •)
          const isBullet = /^[\-•]\s/.test(line.trim());
          const cleanLine = isBullet ? line.trim().replace(/^[\-•]\s/, '') : line;
          
          // Regex to find URLs
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const parts = cleanLine.split(urlRegex);
          
          const lineContent = parts.map((part, partIndex) => {
            if (part.match(urlRegex)) {
              // It's a URL
              if (role === 'model') {
                // Bot Link: Render as a Button
                return (
                  <a
                    key={`${lineIndex}-${partIndex}`}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 mb-1 flex items-center justify-between gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[var(--secondary)] transition-all shadow-md group transform hover:scale-105 no-underline max-w-full overflow-hidden"
                  >
                    <span className="truncate flex-1">Ver Enlace / Info</span>
                    <ExternalLink size={14} className="shrink-0" />
                  </a>
                );
              } else {
                // User Link: Render as underlined text
                return (
                  <a
                    key={`${lineIndex}-${partIndex}`}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-white/90 hover:text-white break-all"
                  >
                    {part}
                  </a>
                );
              }
            }
            // It's regular text - apply formatting
            return <span key={`${lineIndex}-${partIndex}`}>{formatText(part)}</span>;
          });
          
          if (isBullet) {
            return (
              <div key={lineIndex} className="flex items-start gap-2 pl-1">
                <span className="text-[var(--primary)] mt-0.5">•</span>
                <span className="flex-1">{lineContent}</span>
              </div>
            );
          }
          
          // Línea vacía
          if (line.trim() === '') {
            return <div key={lineIndex} className="h-2" />;
          }
          
          return <div key={lineIndex}>{lineContent}</div>;
        })}
      </div>
    );
  };

  return (
    // Fixed Center Right Position
    <div className="fixed top-1/2 right-0 -translate-y-1/2 z-[60] flex flex-row-reverse items-start font-sans">
      
      {/* Toggle Button with Animation */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="relative group mr-2"
        >
          {/* Pulsing Effect Ring */}
          <span className="absolute inset-0 rounded-full bg-[var(--primary)] opacity-75 animate-ping"></span>
          
          <div className="relative bg-[var(--primary)] hover:bg-[var(--secondary)] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-white">
            <MessageSquare size={24} className="animate-pulse" />
          </div>

          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-white text-slate-800 px-3 py-1 rounded-lg text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100">
             ¡Chatea con nosotros!
             <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border-r border-t border-slate-100"></div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="mr-4 bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-right-10 fade-in duration-300 relative h-[550px] max-h-[90vh]">
          
          {/* Header */}
          <div className="bg-[var(--primary)] p-4 flex justify-between items-center transition-colors duration-700 shadow-md z-10">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-white/20 p-2 rounded-full border border-white/20">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">{config.botName}</h3>
                <span className="text-[10px] text-white/90 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> En línea
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-6 scrollbar-hide">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border shadow-sm mt-1
                  ${msg.role === 'user' ? 'bg-white border-slate-200' : 'bg-[var(--primary)]/10 border-[var(--primary)]/20'}`}>
                  {msg.role === 'user' ? <User size={16} className="text-slate-600" /> : <Bot size={16} className="text-[var(--primary)]" />}
                </div>
                
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-[var(--primary)] text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-gray-100'
                  }`}
                >
                  {renderMessageContent(msg.text, msg.role)}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-3 animate-pulse">
                 <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex-shrink-0 flex items-center justify-center border border-[var(--primary)]/20">
                   <Bot size={16} className="text-[var(--primary)]" />
                 </div>
                 <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1 items-center">
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu consulta..."
                className="flex-1 bg-slate-100 text-slate-800 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-shadow border border-transparent focus:border-[var(--primary)]/30"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center aspect-square"
              >
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="text-center mt-3 flex items-center justify-center gap-1.5 opacity-60">
              <Sparkles size={12} className="text-[var(--primary)]" />
              <span className="text-[10px] text-slate-500 font-medium">Potenciado por Gemini AI</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;