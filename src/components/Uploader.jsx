import { useState } from 'react'

export default function Uploader({ onUploaded }) {
  const [url, setUrl] = useState('')
  const [filename, setFilename] = useState('')
  const [place, setPlace] = useState('')
  const [year, setYear] = useState('')
  const [people, setPeople] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        url,
        filename: filename || url.split('/').pop(),
        place: place || null,
        year: year ? parseInt(year) : null,
        people: people ? people.split(',').map((s) => s.trim()).filter(Boolean) : [],
      }
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Upload failed')
      setUrl(''); setFilename(''); setPlace(''); setYear(''); setPeople('')
      onUploaded?.()
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <input className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} required />
      <input className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="Filename (optional)" value={filename} onChange={(e) => setFilename(e.target.value)} />
      <input className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="Place (optional)" value={place} onChange={(e) => setPlace(e.target.value)} />
      <input className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100" placeholder="Year (optional)" value={year} onChange={(e) => setYear(e.target.value)} />
      <input className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 sm:col-span-2" placeholder="People (comma separated)" value={people} onChange={(e) => setPeople(e.target.value)} />
      <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 transition text-white rounded-lg py-2 px-3 sm:col-span-2">{loading ? 'Saving...' : 'Add Photo'}</button>
    </form>
  )
}
