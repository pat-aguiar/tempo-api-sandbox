import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'
import Sandbox from './components/Sandbox'
import ComponentList from './components/ComponentList'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      }
    })

    if (error) setMessage(error.message)
    else setMessage('Check your email for the login link!')

    setLoading(false)
  }

  // If user is logged in, show the Sandbox
  if (session) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Component API Sandbox</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            Sign Out
          </button>
        </div>
        <div className="max-w-4xl mx-auto">
          <Sandbox
            userEmail={session.user.email}
            userId={session.user.id}
            onSuccess={handleUploadSuccess}
          />
          <ComponentList
            key={refreshKey}
            userId={session.user.id}
          />
        </div>
      </div>
    )
  }

  // If not logged in, show the Auth Form
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Sign in to Tempo Sandbox</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-50"
          >
            {loading ? 'Sending link...' : 'Send Magic Link'}
          </button>
          {message && (
            <p className="text-sm text-center font-medium text-slate-600 mt-4">{message}</p>
          )}
        </form>
      </div>
    </div>
  )
}