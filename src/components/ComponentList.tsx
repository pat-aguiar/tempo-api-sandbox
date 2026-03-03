import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase' 

interface SavedComponent {
  id: string
  created_at: string
  component_code: string
  image_url: string
}

export default function ComponentList({ userId }: { userId: string }) {
  const [components, setComponents] = useState<SavedComponent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchComponents() {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setComponents(data)
      }
      setLoading(false)
    }

    fetchComponents()
  }, [userId])

  if (loading) return <div className="text-slate-500 mt-8">Loading your history...</div>

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Your Recent Submissions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {components.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
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
    </div>
  )
}