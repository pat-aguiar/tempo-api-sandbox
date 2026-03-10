import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { SavedComponent } from '../lib/types';
import { ComponentPreview } from "./ComponentPreview";

interface ApiInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  component: SavedComponent | null;
}

export const ApiInspector: React.FC<ApiInspectorProps> = ({ isOpen, onClose, component }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'code'>('schema');
  const [editedCode, setEditedCode] = useState<string>('');
  const [debouncedCode, setDebouncedCode] = useState<string>('');

  // 1. Sync the initial code when a new component is selected
  useEffect(() => {
    if (component) {
      setEditedCode(component.component_code || '');
      setDebouncedCode(component.component_code || '');
      setActiveTab('schema');
    }
  }, [component]);

  // 2. Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCode(editedCode);
    }, 1000); // Waits 1000ms after the last keystroke

    // Clean up the timeout if the user types again before 500ms
    return () => clearTimeout(handler);
  }, [editedCode]);

  if (!isOpen || !component) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[500px] sm:w-[600px] bg-zinc-950 border-l border-zinc-800 p-6 shadow-2xl z-50 flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-xl font-bold text-white">{component.name || "API Inspector"}</h2>
        <button onClick={onClose} className="text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col h-full overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-zinc-800 mb-4 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('schema')}
            className={`text-sm transition-colors ${activeTab === 'schema' ? 'text-blue-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Props Schema
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`text-sm transition-colors ${activeTab === 'code' ? 'text-blue-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Live Editor
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'schema' ? (
          <pre className="p-4 bg-zinc-900 rounded border border-zinc-800 text-xs text-zinc-300 overflow-auto flex-1">
            {JSON.stringify(component.openapi_spec, null, 2)}
          </pre>
        ) : (
          <div className="flex flex-col gap-4 flex-1 overflow-hidden pb-4">
            {/* Live Preview of the edits */}
            <div className="h-64 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center">
              <ComponentPreview code={debouncedCode} />
            </div>

            {/* The Editor */}
            <textarea
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
              className="flex-1 w-full p-4 bg-zinc-900 text-zinc-300 font-mono text-xs rounded-lg border border-zinc-800 focus:outline-none focus:border-blue-500 resize-none overflow-auto"
              spellCheck="false"
              placeholder="Edit your React component here..."
            />
          </div>
        )}
      </div>
    </div>
  );
};