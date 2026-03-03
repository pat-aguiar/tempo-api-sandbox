import { useState, type ChangeEvent, type SyntheticEvent } from 'react'

export default function Sandbox({ userEmail }: { userEmail: string | undefined }) {
    const [code, setCode] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // TODO: Supabase Storage and DB insertion will go here
        console.log('Ready to upload:', file?.name)
        console.log('Component code length:', code.length)

        setTimeout(() => setIsSubmitting(false), 1000) // Mock loading state for now
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