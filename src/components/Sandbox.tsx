import { useState, type ChangeEvent, type SyntheticEvent } from 'react'
import { supabase } from '../lib/supabase' 

export default function Sandbox({ userEmail, userId }: { userEmail: string | undefined, userId: string }) {
  const [code, setCode] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    if (!file || !code) return

    setIsSubmitting(true)
    setStatusMessage('')

    try {
      // 1. Generate a unique file name to prevent collision overwrites
      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`

      // 2. Upload the file to the Storage Bucket
      const { error: uploadError } = await supabase.storage
        .from('component_images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 3. Retrieve the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('component_images')
        .getPublicUrl(fileName)

      // 4. Insert the record into the Database table
      const { error: dbError } = await supabase
        .from('components')
        .insert({
          user_id: userId,
          component_code: code,
          image_url: publicUrl,
          // Omit 'openapi_spec' so it defaults to null
        })

      if (dbError) throw dbError

      // 5. Success! Clear the form
      setStatusMessage('Component successfully uploaded and saved!')
      setCode('')
      setFile(null)
      
      // Reset the physical file input element in the DOM
      const fileInput = document.getElementById('image') as HTMLInputElement
      if (fileInput) fileInput.value = ''

    } catch (error: any) {
      console.error('Submission error:', error)
      setStatusMessage(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <p className="text-slate-600 mb-6 font-medium">
        Logged in as: <span className="text-blue-600">{userEmail}</span>
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="code" className="block text-sm font-bold text-slate-800 mb-2">
            React Component Code
          </label>
          <textarea
            id="code"
            rows={8}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full px-4 py-3 font-mono text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-inner bg-slate-50"
            placeholder="export default function MyComponent() { ... }"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-bold text-slate-800 mb-2">
            Reference Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer border border-slate-200 rounded-lg"
          />
        </div>

        {statusMessage && (
          <div className={`p-4 rounded-md text-sm font-medium ${statusMessage.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
            {statusMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-900 focus:ring-4 focus:ring-slate-200 transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : 'Submit to Sandbox'}
        </button>
      </form>
    </div>
  )
}