import { useEffect, useState } from 'react'

export default function Gallery({ filters }) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.place) params.set('place', filters.place)
        if (filters.year) params.set('year', filters.year)
        if (filters.person) params.set('person', filters.person)
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/photos?${params.toString()}`)
        const data = await res.json()
        setPhotos(data)
      } catch (e) {
        console.error('Failed to load photos', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filters])

  return (
    <div>
      {loading && <p className="text-blue-300">Loading...</p>}
      {!loading && photos.length === 0 && (
        <p className="text-slate-400">No photos match these filters yet. Try uploading a few.</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
        {photos.map((p) => (
          <div key={p.id || p.url} className="relative group rounded-lg overflow-hidden border border-slate-700">
            <img src={p.url} alt={p.filename} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition p-2 text-xs text-white flex flex-col justify-end">
              <div className="flex flex-wrap gap-1">
                {p.people?.map((n) => (
                  <span key={n} className="px-2 py-0.5 bg-blue-600/80 rounded-full">{n}</span>
                ))}
              </div>
              <div className="mt-1 text-slate-200">
                {p.place || 'Unknown place'} • {p.year || '—'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
