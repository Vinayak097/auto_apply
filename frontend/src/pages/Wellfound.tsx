import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Navbar from '../component/Navbar'

type NullableNumber = number | null

type JobSearchFilter = {
  page: number
  locationTagIds: string[]
  remoteCompanyLocationTagIds: string[]
  roleTagIds: string[]
  skillTagIds: string[]
  equity: { min: NullableNumber; max: NullableNumber }
  jobTypes: string[]
  remotePreference: string
  salary: { min: NullableNumber; max: NullableNumber }
  yearsExperience: { min: NullableNumber; max: NullableNumber }
}

type FormState = {
  locationTagIds: string
  remoteCompanyLocationTagIds: string
  roleTagIds: string
  skillTagIds: string
  equityMin: string
  equityMax: string
  jobTypes: string[]
  remotePreference: string
  salaryMin: string
  salaryMax: string
  yearsExperienceMin: string
  yearsExperienceMax: string
}

type LocationSuggestion = {
  id: string
  name: string
}

const initialForm: FormState = {
  locationTagIds: '406413',
  remoteCompanyLocationTagIds: '153509',
  roleTagIds: '151718',
  skillTagIds: '17000, 139914',
  equityMin: '',
  equityMax: '',
  jobTypes: ['full_time', 'internship'],
  remotePreference: 'REMOTE_OPEN',
  salaryMin: '',
  salaryMax: '',
  yearsExperienceMin: '',
  yearsExperienceMax: '',
}

const toTagIds = (value: string) =>
  value.split(',').map((id) => id.trim()).filter(Boolean)

const toNullableNumber = (value: string): NullableNumber =>
  value.trim() === '' ? null : Number(value)

const findAutocompleteSuggestions = (payload: unknown, field: 'locationTags' | 'skillTags'): LocationSuggestion[] => {
  if (!payload || typeof payload !== 'object') return []

  const data = payload as { data?: { autocomplete?: Record<string, unknown> } }
  const values = data.data?.autocomplete?.[field]
  if (!Array.isArray(values)) return []

  return values.flatMap((value) => {
    if (!value || typeof value !== 'object') return []
    const suggestion = value as { id?: unknown; displayName?: unknown }
    if (typeof suggestion.id !== 'string' || typeof suggestion.displayName !== 'string') return []
    return [{ id: suggestion.id, name: suggestion.displayName }]
  })
}

const buildJobSearchFilter = (form: FormState): JobSearchFilter => ({
  page: 1,
  locationTagIds: toTagIds(form.locationTagIds),
  remoteCompanyLocationTagIds: toTagIds(form.remoteCompanyLocationTagIds),
  roleTagIds: toTagIds(form.roleTagIds),
  skillTagIds: toTagIds(form.skillTagIds),
  equity: {
    min: toNullableNumber(form.equityMin),
    max: toNullableNumber(form.equityMax),
  },
  jobTypes: form.jobTypes,
  remotePreference: form.remotePreference,
  salary: {
    min: toNullableNumber(form.salaryMin),
    max: toNullableNumber(form.salaryMax),
  },
  yearsExperience: {
    min: toNullableNumber(form.yearsExperienceMin),
    max: toNullableNumber(form.yearsExperienceMax),
  },
})

const Wellfound = () => {
  const [form, setForm] = useState<FormState>(initialForm)
  const [filter, setFilter] = useState<JobSearchFilter>(() => buildJobSearchFilter(initialForm))
  const [locationQuery, setLocationQuery] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [locationLoading, setLocationLoading] = useState(false)
  const [skillQuery, setSkillQuery] = useState('')
  const [skillSuggestions, setSkillSuggestions] = useState<LocationSuggestion[]>([])
  const [skillLoading, setSkillLoading] = useState(false)

  useEffect(() => {
    const query = locationQuery.trim()
    if (!query) {
      setLocationSuggestions([])
      return
    }

    const timeoutId = window.setTimeout(async () => {
      setLocationLoading(true)
      try {
        const response = await fetch(`http://localhost:3001/wellfound/location-tags?query=${encodeURIComponent(query)}`)
        const payload = await response.json()
        const suggestions = findAutocompleteSuggestions(payload, 'locationTags')
        setLocationSuggestions(
          suggestions.filter((suggestion, index, values) =>
            values.findIndex((value) => value.id === suggestion.id) === index,
          ),
        )
      } catch {
        setLocationSuggestions([])
      } finally {
        setLocationLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [locationQuery])

  useEffect(() => {
    const query = skillQuery.trim()
    if (!query) {
      setSkillSuggestions([])
      return
    }

    const timeoutId = window.setTimeout(async () => {
      setSkillLoading(true)
      try {
        const response = await fetch(`http://localhost:3001/wellfound/skill-tags?query=${encodeURIComponent(query)}`)
        const payload = await response.json()
        const suggestions = findAutocompleteSuggestions(payload, 'skillTags')
        setSkillSuggestions(
          suggestions.filter((suggestion, index, values) =>
            values.findIndex((value) => value.id === suggestion.id) === index,
          ),
        )
      } catch {
        setSkillSuggestions([])
      } finally {
        setSkillLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [skillQuery])

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const toggleJobType = (jobType: string) => {
    setForm((current) => ({
      ...current,
      jobTypes: current.jobTypes.includes(jobType)
        ? current.jobTypes.filter((type) => type !== jobType)
        : [...current.jobTypes, jobType],
    }))
  }

  const selectLocation = (suggestion: LocationSuggestion) => {
    const ids = toTagIds(form.locationTagIds)
    if (!ids.includes(suggestion.id)) {
      updateField('locationTagIds', [...ids, suggestion.id].join(', '))
    }
    setLocationQuery('')
    setLocationSuggestions([])
  }

  const selectSkill = (suggestion: LocationSuggestion) => {
    const ids = toTagIds(form.skillTagIds)
    if (!ids.includes(suggestion.id)) {
      updateField('skillTagIds', [...ids, suggestion.id].join(', '))
    }
    setSkillQuery('')
    setSkillSuggestions([])
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFilter(buildJobSearchFilter(form))
  }

  const textFields: Array<[keyof FormState, string, string]> = [
    ['locationTagIds', 'Location tag IDs', '406413'],
    ['remoteCompanyLocationTagIds', 'Remote company location tag IDs', '153509'],
    ['roleTagIds', 'Role tag IDs', '151718'],
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Wellfound search</p>
            <h1 className="mt-1 text-2xl font-bold">Build job filters</h1>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {textFields.map(([field, label, placeholder]) => (
              <label key={field} className="text-sm font-medium">
                {label}
                <input
                  value={form[field] as string}
                  onChange={(event) => updateField(field, event.target.value)}
                  placeholder={placeholder}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-normal outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                />
              </label>
            ))}
          </div>

          <div className="relative">
            <label className="text-sm font-medium">
              Search locations
              <input
                value={locationQuery}
                onChange={(event) => setLocationQuery(event.target.value)}
                placeholder="Start typing a city or country"
                autoComplete="off"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-normal outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
              />
            </label>
            {(locationLoading || locationSuggestions.length > 0) && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                {locationLoading && <p className="px-3 py-2 text-sm text-slate-500">Searching...</p>}
                {locationSuggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion.id}
                    onClick={() => selectLocation(suggestion)}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-amber-50"
                  >
                    {suggestion.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="text-sm font-medium">
              Skills
              <input
                value={skillQuery}
                onChange={(event) => setSkillQuery(event.target.value)}
                placeholder="Search for a skill"
                autoComplete="off"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-normal outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
              />
            </label>
            {(skillLoading || skillSuggestions.length > 0) && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                {skillLoading && <p className="px-3 py-2 text-sm text-slate-500">Searching...</p>}
                {skillSuggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion.id}
                    onClick={() => selectSkill(suggestion)}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-amber-50"
                  >
                    {suggestion.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <fieldset>
            <legend className="text-sm font-medium">Job types</legend>
            <div className="mt-2 flex gap-5">
              {['full_time', 'internship'].map((jobType) => (
                <label key={jobType} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.jobTypes.includes(jobType)}
                    onChange={() => toggleJobType(jobType)}
                    className="accent-amber-600"
                  />
                  {jobType.replace('_', ' ')}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block text-sm font-medium">
            Remote preference
            <select
              value={form.remotePreference}
              onChange={(event) => updateField('remotePreference', event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal"
            >
              <option value="REMOTE_OPEN">Remote open</option>
              <option value="REMOTE_ONLY">Remote only</option>
              <option value="ONSITE_ONLY">On-site only</option>
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            {([
              ['salaryMin', 'Salary min'], ['salaryMax', 'Salary max'],
              ['equityMin', 'Equity min'], ['equityMax', 'Equity max'],
              ['yearsExperienceMin', 'Experience min'], ['yearsExperienceMax', 'Experience max'],
            ] as Array<[keyof FormState, string]>).map(([field, label]) => (
              <label key={field} className="text-sm font-medium">
                {label}
                <input
                  type="number"
                  min="0"
                  value={form[field] as string}
                  onChange={(event) => updateField(field, event.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-normal"
                />
              </label>
            ))}
          </div>

          <button type="submit" className="rounded-md bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700">
            Generate filter
          </button>
        </form>

        <section className="h-fit rounded-xl bg-slate-900 p-6 text-slate-100 shadow-sm">
          <h2 className="text-lg font-semibold">Generated request</h2>
          <pre className="mt-4 overflow-x-auto text-sm leading-6">{JSON.stringify(filter, null, 2)}</pre>
        </section>
      </main>
    </div>
  )
}

export default Wellfound
