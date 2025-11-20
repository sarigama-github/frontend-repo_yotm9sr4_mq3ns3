import { useEffect, useState } from 'react'

export default function Filters({ onChange }) {
  const [places, setPlaces] = useState([])
  const [years, setYears] = useState([])
  const [people, setPeople] = useState([])
  const [selected, setSelected] = useState({ place: '', year: '', person: '' })

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/filters`)
        const data = await res.json()
        setPlaces(data.places || [])
        setYears(data.years || [])
        setPeople(data.people || [])
      } catch (e) {
        console.error('Failed to load filters', e)
      }
    }
    fetchFilters()
  }, [])

  useEffect(() => {
    onChange(selected)
  }, [selected])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <select className="bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2" value={selected.place}
        onChange={(e) => setSelected((s) => ({ ...s, place: e.target.value }))}>
        <option value="">All places</option>
        {places.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select className="bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2" value={selected.year}
        onChange={(e) => setSelected((s) => ({ ...s, year: e.target.value }))}>
        <option value="">All years</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <select className="bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2" value={selected.person}
        onChange={(e) => setSelected((s) => ({ ...s, person: e.target.value }))}>
        <option value="">Any person</option>
        {people.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  )
}
