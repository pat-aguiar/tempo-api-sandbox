import React, { useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { transform } from '@babel/standalone';

interface Props {
  code: string;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-xs overflow-auto">
          Runtime Error: {String(this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}

export const ComponentPreview: React.FC<Props> = ({ code }) => {
  const RenderedComponent = useMemo(() => {
    try {
      // 1. Clean the code string
      const cleanCode = code
        .replace(/import.*;/g, '')
        .replace(/export default/g, 'const GeneratedComponent = ')
        .replace(/export /g, '');

      // 2. Transpile JSX and TypeScript to standard JavaScript
      const { code: transpiledCode } = transform(cleanCode, {
        presets: ['react', 'typescript'],
        filename: 'component.tsx'
      });

      if (!transpiledCode) throw new Error("Transpilation failed");

      // 3. Define the Clean "Sandbox Scope" (Universal dependencies only)
      const scope = {
        React,
        useState: React.useState,
        useEffect: React.useEffect,
        ...LucideIcons,
      };

      // 4. Inject the scope dynamically into the Function constructor
      const scopeKeys = Object.keys(scope);
      const scopeValues = Object.values(scope);

      const finalCode = `${transpiledCode}; return GeneratedComponent;`;
      const createComponent = new Function(...scopeKeys, finalCode);

      return createComponent(...scopeValues);
    } catch (err) {
      console.error("Rendering Error:", err);
      return () => (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-xs overflow-auto max-h-40">
          Failed to render: {String(err)}
        </div>
      );
    }
  }, [code]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
      {/* React trick: 'key' prop forces the ErrorBoundary to completely reset itself every time the user types a new character! */}
      <ErrorBoundary key={code}>
        <RenderedComponent />
      </ErrorBoundary>
    </div>
  );
};