import React, { useState, useEffect } from 'react';
import { ConversionSettings, FileData } from './types';
import { convertToCSource, sanitizeVariableName, isXexFile } from './utils/converter';
import { generateDocumentation, decompileBinary } from './services/gemini';
import SettingsPanel from './components/SettingsPanel';
import FileUploader from './components/FileUploader';
import CodeViewer from './components/CodeViewer';
import AiDocumentation from './components/AiDocumentation';
import { Gamepad2, Cpu, Terminal, ChevronRight, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [settings, setSettings] = useState<ConversionSettings>({
    variableName: 'xex_binary',
    bytesPerRow: 16,
    useHex: true,
    addStaticConst: true,
    includeSizeVar: true,
    mode: 'array',
  });
  
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [docs, setDocs] = useState<string>('');
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
  const [isDecompiling, setIsDecompiling] = useState(false);
  const [isXex, setIsXex] = useState(false);

  // Handle Processing based on Mode
  useEffect(() => {
    const processFile = async () => {
      if (!fileData) return;

      if (settings.mode === 'array') {
        const code = convertToCSource(fileData.content, settings);
        setGeneratedCode(code);
      } else if (settings.mode === 'decompile') {
        // We only trigger decompilation if explicitly switched to this mode
        // Note: We might want a button to trigger this to save API calls, 
        // but for now we'll do it on mode switch with a loading state.
        if (!isDecompiling && generatedCode.indexOf("Decompiled") === -1) {
           setGeneratedCode("// Initializing Decompiler Module...\n// Connecting to Neural Core...");
           setIsDecompiling(true);
           const result = await decompileBinary(fileData.content, fileData.name);
           setGeneratedCode(result);
           setIsDecompiling(false);
        }
      }
    };

    processFile();
  }, [fileData, settings.mode, settings.variableName, settings.bytesPerRow, settings.useHex, settings.addStaticConst, settings.includeSizeVar]);

  // Reset generated code when file changes to avoid stale decompile showing for new file
  useEffect(() => {
    if (fileData) {
       setIsXex(isXexFile(fileData.content));
       if (settings.mode === 'decompile') {
         // Reset to array mode on new file load to prevent auto-triggering heavy API
         setSettings(s => ({...s, mode: 'array'}));
       }
    }
  }, [fileData]);

  const handleFileLoaded = (data: FileData) => {
    const cleanName = sanitizeVariableName(data.name.split('.')[0]);
    setFileData(data);
    setSettings(prev => ({ ...prev, variableName: cleanName }));
    setDocs(''); 
  };

  const handleGenerateDocs = async () => {
    if (!fileData) return;
    setIsGeneratingDocs(true);
    const docContent = await generateDocumentation(settings.variableName, fileData.size, fileData.name);
    setDocs(docContent);
    setIsGeneratingDocs(false);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col font-sans selection:bg-xbox-green/30">
      {/* Header */}
      <header className="border-b border-xbox-green/30 bg-xbox-dark/95 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-xbox-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-xbox-green rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(155,240,11,0.5)] animate-pulse-slow">
              <Gamepad2 className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white font-mono italic">
                XEX<span className="text-xbox-green">TOOL</span>
              </h1>
              <p className="text-xs text-xbox-green font-bold tracking-widest uppercase">DevKit Utility</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
             <span className="hidden sm:flex items-center gap-2">
                <Cpu className="w-4 h-4 text-xbox-green" /> 
                <span className="text-gray-400">XENON_CORE</span>
             </span>
             <div className="h-4 w-px bg-xbox-green/30"></div>
             <span className="text-xbox-green font-bold">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Input & Settings */}
          <div className="lg:col-span-4 space-y-6">
            <section>
              <FileUploader onFileLoaded={handleFileLoaded} />
            </section>
            
            <section className="h-full">
               <SettingsPanel settings={settings} onSettingsChange={setSettings} />
            </section>

             {/* File Info Card */}
             {fileData && (
              <div className="bg-xbox-card border border-xbox-border p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-left-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-xbox-green"></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Loaded Binary</p>
                  <p className="text-sm font-bold text-white truncate max-w-[200px] font-mono mt-1">{fileData.name}</p>
                  {isXex && <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-xbox-green text-black text-[10px] font-bold">XEX2 DETECTED</span>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Size</p>
                  <p className="text-sm font-mono text-xbox-green mt-1">{(fileData.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {fileData ? (
              <>
                <div className="h-[600px] lg:h-[700px] relative">
                  <CodeViewer 
                    code={generatedCode} 
                    fileName={settings.variableName}
                    onGenerateDocs={handleGenerateDocs}
                    isGeneratingDocs={isGeneratingDocs}
                  />
                  {isDecompiling && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
                      <Zap className="w-12 h-12 text-xbox-green animate-pulse mb-4" />
                      <p className="text-xbox-green font-mono font-bold text-lg">DECOMPILING BINARY...</p>
                      <p className="text-gray-500 text-sm mt-2 font-mono">Analyzing PowerPC Instructions</p>
                    </div>
                  )}
                </div>
                <AiDocumentation content={docs} onClose={() => setDocs('')} />
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-xbox-border rounded-xl bg-xbox-card/30 p-12 text-center min-h-[400px]">
                <div className="w-20 h-20 bg-black border-2 border-xbox-green rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(155,240,11,0.15)]">
                  <ChevronRight className="w-10 h-10 text-xbox-green" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-mono tracking-tight">AWAITING INPUT</h3>
                <p className="text-gray-500 max-w-sm">
                  Upload an Xbox 360 Executable (.xex) to begin conversion or decompilation analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
