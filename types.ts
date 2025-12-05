export interface ConversionSettings {
  variableName: string;
  bytesPerRow: number;
  useHex: boolean;
  addStaticConst: boolean;
  includeSizeVar: boolean;
  mode: 'array' | 'decompile'; // New mode
}

export interface FileData {
  name: string;
  size: number;
  content: Uint8Array;
}
