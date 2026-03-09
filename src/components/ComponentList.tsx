import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { SavedComponent } from '../types'
import { ApiInspector } from './ApiInspector'

export default function ComponentList({ userId }: { userId: string }) {
  const [components, setComponents] = useState<SavedComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedComponent, setSelectedComponent] = useState<SavedComponent | null>(null)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)

  useEffect(() => {
    // 1. Listen for changes specifically on the 'components' table for the current user
    const channel = supabase.channel(`components-user-${userId}`)

    channel
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'components',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // 2. If the updated row has a new spec, update the local UI state
          if (payload.new.openapi_spec) {
            console.log("AI Spec received in real-time!", payload.new.openapi_spec);
            // Update components state
            setComponents(current =>
              current.map(c => c.id === payload.new.id ? (payload.new as SavedComponent) : c)
            );
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [userId]);

  useEffect(() => {
    async function fetchComponents() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('components')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        if (data) {
          setComponents(data)
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching components:', error.message)
        } else {
          console.error('An unknown error occurred:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchComponents()
  }, [userId])

  if (loading) return <div className="text-slate-500 mt-8">Loading your history...</div>

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Your Recent Submissions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {components.map((c) => (
          <div key={c.id} onClick={() => { setSelectedComponent(c); setIsInspectorOpen(true); }} className="group cursor-pointer bg-white border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all">
            <img src={c.image_url} alt="Reference" className="w-full h-48 object-cover border-b border-slate-100" />
            <div className="p-4">
              <pre className="bg-slate-50 p-2 rounded text-xs text-slate-600 overflow-x-auto max-h-24">
                <code>{c.component_code}</code>
              </pre>
              <p className="text-[10px] text-slate-400 mt-2">
                Submitted: {new Date(c.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <ApiInspector isOpen={isInspectorOpen} onClose={() => setIsInspectorOpen(false)} component={selectedComponent} />
    </div>
  )
}
