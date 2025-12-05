import React, { useState } from 'react';
import { Copy, Check, Download, Wand2, Terminal } from 'lucide-react';

interface Props {
  code: string;
  fileName: string;
  onGenerateDocs: () => void;
  isGeneratingDocs: boolean;
}

const CodeViewer: React.FC<Props> = ({ code, fileName, onGenerateDocs, isGeneratingDocs }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.c`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-xbox-card border border-xbox-border rounded-xl shadow-lg flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-xbox-border bg-xbox-dark">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-xbox-green" />
          <span className="text-sm text-xbox-light font-mono font-bold tracking-wide">{fileName}.c</span>
        </div>
        <div className="flex items-center gap-2">
           <button
            onClick={onGenerateDocs}
            disabled={isGeneratingDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium font-mono text-xbox-green bg-xbox-green/10 hover:bg-xbox-green/20 border border-xbox-green/20 rounded transition-colors disabled:opacity-50"
          >
             <Wand2 className={`w-3.5 h-3.5 ${isGeneratingDocs ? 'animate-spin' : ''}`} />
             {isGeneratingDocs ? 'PROCESSING...' : 'GUIDE'}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium font-mono text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            SAVE
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium font-mono text-white bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'OK' : 'COPY'}
          </button>
        </div>
      </div>
      
      <div className="relative flex-1 bg-[#0c0c0c] overflow-auto group">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code className="text-xbox-light/90">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeViewer;
