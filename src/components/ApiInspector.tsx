import React from 'react';
import { X, Code, Globe, Database } from 'lucide-react';
import type { SavedComponent } from '../lib/types';

interface ApiInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  component: SavedComponent | null;
}

export const ApiInspector: React.FC<ApiInspectorProps> = ({ isOpen, onClose, component }) => {
  if (!isOpen || !component) return null;

  const spec = component.openapi_spec;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[#1a1a1a] border-l border-zinc-800 shadow-2xl z-50 transform transition-transform duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#242424]">
        <div className="flex items-center gap-2">
          <Code className="text-blue-400" size={20} />
          <h2 className="font-semibold text-zinc-100">API Documentation: {component.name || `Component ${component.id.slice(0, 8)}`}</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-zinc-700 rounded-md text-zinc-400">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto h-[calc(100vh-64px)] text-zinc-300 custom-scrollbar">
        {!spec ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mb-4"></div>
            <p>AI is still generating your OpenAPI spec...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Info Section */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-2">General Info</h3>
              <div className="bg-[#242424] p-4 rounded-lg border border-zinc-800">
                <p className="text-lg font-medium text-white">{spec.info?.title}</p>
                <p className="text-sm text-zinc-400 mt-1">{spec.info?.description}</p>
              </div>
            </section>

            {/* Endpoints Section */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                <Globe size={14} /> Endpoints
              </h3>
              {Object.entries(spec.paths || {}).map(([path, _methods]: any) => (
                <div key={path} className="bg-[#242424] rounded-lg border border-zinc-800 overflow-hidden">
                  <div className="p-3 bg-zinc-800/50 flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs font-bold rounded border border-green-800/50">POST</span>
                    <code className="text-sm text-zinc-200">{path}</code>
                  </div>
                  <div className="p-4 text-sm">
                    <p className="text-zinc-400 mb-4">Generates the visual representation of the component based on the provided props.</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Schema / Props Section */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                <Database size={14} /> Props Schema
              </h3>
              <div className="bg-[#111] p-4 rounded-lg border border-zinc-800 overflow-x-auto">
                <pre className="text-xs text-blue-300">
                  {JSON.stringify(spec.components?.schemas || {}, null, 2)}
                </pre>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};