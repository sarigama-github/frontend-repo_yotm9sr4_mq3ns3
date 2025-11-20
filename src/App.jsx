import { useState, useCallback } from 'react'
import Filters from './components/Filters'
import Gallery from './components/Gallery'
import Uploader from './components/Uploader'

function App() {
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const handleFilters = useCallback((f) => {
    setFilters(f)
  }, [])

  const refresh = () => setRefreshKey((k) => k + 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Photo Sorter</h1>
          <p className="text-slate-400">Upload photos, tag people, and filter by place, year, or person.</p>
        </header>

        <section className="mb-6">
          <Uploader onUploaded={refresh} />
        </section>

        <section className="mb-4">
          <Filters onChange={handleFilters} />
        </section>

        <section key={refreshKey}>
          <Gallery filters={filters} />
        </section>
      </div>
    </div>
  )
}

export default App
