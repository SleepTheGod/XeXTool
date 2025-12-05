import React, { useRef, useState } from 'react';
import { UploadCloud, FileCode, Disc } from 'lucide-react';
import { FileData } from '../types';

interface Props {
  onFileLoaded: (data: FileData) => void;
}

const FileUploader: React.FC<Props> = ({ onFileLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        onFileLoaded({
          name: file.name,
          size: file.size,
          content: new Uint8Array(e.target.result),
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
        flex flex-col items-center justify-center min-h-[160px] group
        ${isDragging 
          ? 'border-xbox-green bg-xbox-green/10 scale-[1.02] shadow-[0_0_20px_rgba(155,240,11,0.2)]' 
          : 'border-xbox-border hover:border-xbox-green/50 hover:bg-xbox-card/50 bg-xbox-card'
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        className="hidden"
        accept=".xex,.bin,*"
      />
      
      <div className={`p-4 rounded-full bg-black border border-xbox-border mb-4 transition-transform duration-300 ${isDragging ? 'scale-110 border-xbox-green' : 'group-hover:border-xbox-green/50'}`}>
        <Disc className={`w-8 h-8 ${isDragging ? 'text-xbox-green animate-spin' : 'text-gray-400 group-hover:text-xbox-green'}`} />
      </div>
      
      <h3 className="text-lg font-bold text-white mb-1 font-mono tracking-wide">
        {isDragging ? 'INSERT DISK' : 'LOAD EXECUTABLE'}
      </h3>
      <p className="text-sm text-gray-500 font-mono">
        Drop .XEX file to initialize
      </p>
    </div>
  );
};

export default FileUploader;
