import React from 'react';
import { Bot, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  onClose: () => void;
}

const AiDocumentation: React.FC<Props> = ({ content, onClose }) => {
  if (!content) return null;

  return (
    <div className="mt-4 bg-xbox-dark/90 border border-xbox-green/40 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 shadow-xbox-glow">
      <div className="px-4 py-2 bg-xbox-green/10 border-b border-xbox-green/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xbox-green">
          <Bot className="w-4 h-4" />
          <span className="text-sm font-bold font-mono">ASSISTANT_LOG</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 prose prose-invert prose-sm max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-xbox-green/20 prose-headings:text-xbox-green prose-a:text-xbox-green">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default AiDocumentation;
