import { useEffect, useMemo, useState } from 'react'

export default function Gallery({ filters }) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [peopleIndex, setPeopleIndex] = useState({})

  const backend = import.meta.env.VITE_BACKEND_URL

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.place) params.set('place', filters.place)
      if (filters.year) params.set('year', filters.year)
      if (filters.person) params.set('person', filters.person)
      const res = await fetch(`${backend}/api/photos?${params.toString()}`)
      const data = await res.json()
      setPhotos(data)
      // build index of people -> photos
      const idx = {}
      data.forEach((p) => {
        (p.people || []).forEach((name) => {
          if (!idx[name]) idx[name] = []
          idx[name].push(p)
        })
      })
      setPeopleIndex(idx)
    } catch (e) {
      console.error('Failed to load photos', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const uniquePeople = useMemo(() => Object.keys(peopleIndex).sort(), [peopleIndex])

  const seedMock = async () => {
    try {
      await fetch(`${backend}/api/mock/seed`, { method: 'POST' })
      await fetchPhotos()
    } catch (e) {
      console.error('Mock seed failed', e)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        {loading && <p className="text-blue-300">Loading...</p>}
        {!loading && photos.length === 0 && (
          <p className="text-slate-400">No photos yet. Seed with mock data below.</p>
        )}
        <button onClick={seedMock} className="ml-auto bg-emerald-600 hover:bg-emerald-500 transition text-white rounded-lg py-1.5 px-3 text-sm">Add mock photos</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
        {photos.map((p) => (
          <div key={p.id || p.url} className="relative group rounded-lg overflow-hidden border border-slate-700">
            <img src={p.url} alt={p.filename} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition p-2 text-xs text-white flex flex-col justify-end">
              <div className="flex flex-wrap gap-1">
                {(p.people || []).map((n) => (
                  <span key={n} className="px-2 py-0.5 bg-blue-600/80 rounded-full">{n}</span>
                ))}
              </div>
              <div className="mt-1 text-slate-200">
                {(p.place || 'Unknown place')} • {(p.year || '—')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Face-based groups */}
      {uniquePeople.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Sorted by faces</h3>
          <div className="space-y-6">
            {uniquePeople.map((name) => (
              <div key={name}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-200 text-xs">
                    {name.slice(0,1)}
                  </div>
                  <h4 className="font-medium">{name}</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {peopleIndex[name].map((p) => (
                    <img key={(p.id || p.url) + name} src={p.url} alt={p.filename} className="w-full h-24 object-cover rounded-md border border-slate-800" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
