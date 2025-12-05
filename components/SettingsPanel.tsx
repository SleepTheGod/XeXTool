import React from 'react';
import { ConversionSettings } from '../types';
import { Settings, Sliders, Type, Hash, Code2, Binary } from 'lucide-react';

interface Props {
  settings: ConversionSettings;
  onSettingsChange: (settings: ConversionSettings) => void;
}

const SettingsPanel: React.FC<Props> = ({ settings, onSettingsChange }) => {
  const handleChange = (key: keyof ConversionSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-xbox-card border border-xbox-border p-5 rounded-xl shadow-lg h-full">
      <div className="flex items-center gap-2 mb-6 text-xbox-green">
        <Settings className="w-5 h-5" />
        <h2 className="font-bold text-lg font-mono tracking-wider">SYSTEM_CONFIG</h2>
      </div>

      <div className="space-y-6">
        
        {/* Mode Selector */}
        <div className="p-1 bg-xbox-dark border border-xbox-border rounded-lg flex">
          <button
            onClick={() => handleChange('mode', 'array')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded transition-all ${
              settings.mode === 'array' 
                ? 'bg-xbox-green text-black shadow-xbox-glow' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Binary className="w-4 h-4" /> Byte Array
          </button>
          <button
            onClick={() => handleChange('mode', 'decompile')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded transition-all ${
              settings.mode === 'decompile' 
                ? 'bg-xbox-green text-black shadow-xbox-glow' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" /> Decompile
          </button>
        </div>

        {settings.mode === 'array' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
            {/* Variable Name */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 flex items-center gap-2 font-mono">
                <Type className="w-4 h-4" /> VARIABLE_ID
              </label>
              <input
                type="text"
                value={settings.variableName}
                onChange={(e) => handleChange('variableName', e.target.value)}
                className="w-full bg-xbox-dark border border-xbox-border rounded-lg px-3 py-2 text-sm text-xbox-green focus:outline-none focus:border-xbox-green transition-colors font-mono"
                placeholder="xex_data"
              />
            </div>

            {/* Bytes Per Row */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 flex items-center gap-2 font-mono">
                <Hash className="w-4 h-4" /> MEMORY_WIDTH
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="8"
                  max="32"
                  step="4"
                  value={settings.bytesPerRow}
                  onChange={(e) => handleChange('bytesPerRow', parseInt(e.target.value))}
                  className="flex-1 accent-xbox-green h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="font-mono text-sm w-8 text-right text-xbox-green">{settings.bytesPerRow}</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-xbox-border">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-mono">HEX_FORMAT (0xFF)</span>
                <input
                  type="checkbox"
                  checked={settings.useHex}
                  onChange={(e) => handleChange('useHex', e.target.checked)}
                  className="accent-xbox-green w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-mono">CONST_QUALIFIER</span>
                <input
                  type="checkbox"
                  checked={settings.addStaticConst}
                  onChange={(e) => handleChange('addStaticConst', e.target.checked)}
                  className="accent-xbox-green w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-mono">SIZE_METADATA</span>
                <input
                  type="checkbox"
                  checked={settings.includeSizeVar}
                  onChange={(e) => handleChange('includeSizeVar', e.target.checked)}
                  className="accent-xbox-green w-4 h-4"
                />
              </label>
            </div>
          </div>
        )}

        {settings.mode === 'decompile' && (
          <div className="text-sm text-gray-400 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="p-3 border border-xbox-green/30 bg-xbox-green/5 rounded-lg">
              <p className="font-bold text-xbox-green mb-2 font-mono">WARN: EXPERIMENTAL</p>
              <p>Decompilation uses AI to analyze binary patterns and reconstruct C logic.</p>
            </div>
            <p>
              This feature attempts to reverse engineer the XEX structure, imports, and entry point logic into valid C code.
            </p>
            <p className="text-xs text-gray-500">
              *Large files will have only their header and entry sections analyzed.*
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
