import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Navbar from '../component/Navbar'

type NullableNumber = number | null

type JobSearchFilter = {
  page: number
  currencyCode: string
  locationTagIds: string[]
  remoteCompanyLocationTagIds: string[]
  roleTagIds: string[]
  skillTagIds: string[]
  equity: { min: NullableNumber; max: NullableNumber }
  jobTypes: string[]
  remotePreference: string
  includeJobsWithoutExperience: boolean
  salary: { min: NullableNumber; max: NullableNumber }
  yearsExperience: { min: NullableNumber; max: NullableNumber }
}

type FormState = {
  currencyCode: string
  roleNames: string
  locationTagIds: string
  remoteCompanyLocationTagIds: string
  roleTagIds: string
  skillTagIds: string
  equityMin: string
  equityMax: string
  jobTypes: string[]
  remotePreference: string
  includeJobsWithoutExperience: boolean
  salaryMin: string
  salaryMax: string
  yearsExperienceMin: string
  yearsExperienceMax: string
}

type LocationSuggestion = {
  id: string
  name: string
}

const defaultSkills: LocationSuggestion[] = [
  { id: '139914', name: 'React.js' },
  { id: '17000', name: 'Node.js' },
  { id: '14775', name: 'TypeScript' },
]

const defaultRoles: LocationSuggestion[] = [
  { id: '14726', name: 'Software Engineer' },
  { id: '151647', name: 'Frontend Engineer' },
  { id: '151718', name: 'Backend Engineer' },
]

const initialForm: FormState = {
  currencyCode: 'USD',
  roleNames: defaultRoles.map((role) => role.name).join(', '),
  locationTagIds: '',
  remoteCompanyLocationTagIds: '',
  roleTagIds: defaultRoles.map((role) => role.id).join(', '),
  skillTagIds: ['14775', '17000', '139914'].join(', '),
  equityMin: '',
  equityMax: '',
  jobTypes: ['full_time', 'internship', 'contract'],
  remotePreference: 'REMOTE_OPEN',
  includeJobsWithoutExperience: true,
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
  currencyCode: form.currencyCode,
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
  includeJobsWithoutExperience: form.includeJobsWithoutExperience,
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
  const [showFilters, setShowFilters] = useState(false)
  const [locationQuery, setLocationQuery] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [locationLoading, setLocationLoading] = useState(false)
  const [selectedLocations, setSelectedLocations] = useState<LocationSuggestion[]>([])
  const [skillQuery, setSkillQuery] = useState('')
  const [skillSuggestions, setSkillSuggestions] = useState<LocationSuggestion[]>([])
  const [skillLoading, setSkillLoading] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<LocationSuggestion[]>(defaultSkills)

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
      setSelectedLocations((current) => [...current, suggestion])
    }
    setLocationQuery('')
    setLocationSuggestions([])
  }

  const selectSkill = (suggestion: LocationSuggestion) => {
    const ids = toTagIds(form.skillTagIds)
    if (!ids.includes(suggestion.id)) {
      updateField('skillTagIds', [...ids, suggestion.id].join(', '))
      setSelectedSkills((current) => [...current, suggestion])
    }
    setSkillQuery('')
    setSkillSuggestions([])
  }

  const removeLocation = (id: string) => {
    setSelectedLocations((current) => current.filter((location) => location.id !== id))
    updateField('locationTagIds', toTagIds(form.locationTagIds).filter((tagId) => tagId !== id).join(', '))
  }

  const removeSkill = (id: string) => {
    setSelectedSkills((current) => current.filter((skill) => skill.id !== id))
    updateField('skillTagIds', toTagIds(form.skillTagIds).filter((tagId) => tagId !== id).join(', '))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    buildJobSearchFilter(form)
    setShowFilters(false)
  }

  const names = (value: string) => value.split(',').map((name) => name.trim()).filter(Boolean)
  const inputClass = 'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-normal outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="w-full px-5 py-8">
        {!showFilters ? (
          <section className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Wellfound search</p>
                <h1 className="mt-1 text-2xl font-bold">Your selected filters</h1>
              </div>
              <button type="button" onClick={() => setShowFilters(true)} className="rounded-md bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700">
                Filter
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div><p className="text-xs font-semibold uppercase text-slate-500">Roles</p><p className="mt-1">{names(form.roleNames).join(', ') || 'None selected'}</p></div>
              <div><p className="text-xs font-semibold uppercase text-slate-500">Skills</p><p className="mt-1">{selectedSkills.map((skill) => skill.name).join(', ') || 'None selected'}</p></div>
              <div><p className="text-xs font-semibold uppercase text-slate-500">Locations</p><p className="mt-1">{selectedLocations.map((location) => location.name).join(', ') || 'None selected'}</p></div>
              <div><p className="text-xs font-semibold uppercase text-slate-500">Job types</p><p className="mt-1">{form.jobTypes.map((type) => type.replace('_', ' ')).join(', ') || 'None selected'}</p></div>
            </div>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div><p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Wellfound search</p><h1 className="mt-1 text-2xl font-bold">Build job filters</h1></div>
              <button type="button" onClick={() => setShowFilters(false)} className="rounded-md border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-50">Close</button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium">Role names<input value={form.roleNames} onChange={(event) => updateField('roleNames', event.target.value)} placeholder="e.g. Software Engineer, Product Manager" className={inputClass} /></label>
              <label className="text-sm font-medium">Role tag IDs<input value={form.roleTagIds} onChange={(event) => updateField('roleTagIds', event.target.value)} placeholder="e.g. 14726, 151647" className={inputClass} /></label>
              <label className="text-sm font-medium">Remote company location tag IDs<input value={form.remoteCompanyLocationTagIds} onChange={(event) => updateField('remoteCompanyLocationTagIds', event.target.value)} placeholder="Enter location tag IDs" className={inputClass} /></label>
              <label className="text-sm font-medium">Currency<input value={form.currencyCode} onChange={(event) => updateField('currencyCode', event.target.value)} placeholder="USD" className={inputClass} /></label>
            </div>

            <div className="relative"><label className="text-sm font-medium">Locations<input value={locationQuery} onChange={(event) => setLocationQuery(event.target.value)} placeholder="Start typing a city or country" autoComplete="off" className={inputClass} /></label>{selectedLocations.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{selectedLocations.map((location) => <button type="button" key={location.id} onClick={() => removeLocation(location.id)} className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900" title="Remove location">{location.name} x</button>)}</div>}{(locationLoading || locationSuggestions.length > 0) && <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">{locationLoading && <p className="px-3 py-2 text-sm text-slate-500">Searching...</p>}{locationSuggestions.map((suggestion) => <button type="button" key={suggestion.id} onClick={() => selectLocation(suggestion)} className="block w-full px-3 py-2 text-left text-sm hover:bg-amber-50">{suggestion.name}</button>)}</div>}</div>

            <div className="relative"><label className="text-sm font-medium">Skills<input value={skillQuery} onChange={(event) => setSkillQuery(event.target.value)} placeholder="Search for a skill" autoComplete="off" className={inputClass} /></label>{selectedSkills.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{selectedSkills.map((skill) => <button type="button" key={skill.id} onClick={() => removeSkill(skill.id)} className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900" title="Remove skill">{skill.name} x</button>)}</div>}{(skillLoading || skillSuggestions.length > 0) && <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">{skillLoading && <p className="px-3 py-2 text-sm text-slate-500">Searching...</p>}{skillSuggestions.map((suggestion) => <button type="button" key={suggestion.id} onClick={() => selectSkill(suggestion)} className="block w-full px-3 py-2 text-left text-sm hover:bg-amber-50">{suggestion.name}</button>)}</div>}</div>

            <fieldset><legend className="text-sm font-medium">Job types</legend><div className="mt-2 flex flex-wrap gap-5">{['full_time', 'internship', 'contract'].map((jobType) => <label key={jobType} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.jobTypes.includes(jobType)} onChange={() => toggleJobType(jobType)} className="accent-amber-600" />{jobType.replace('_', ' ')}</label>)}</div></fieldset>
            <div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-medium">Remote preference<select value={form.remotePreference} onChange={(event) => updateField('remotePreference', event.target.value)} className={inputClass}><option value="REMOTE_OPEN">Remote open</option><option value="REMOTE_ONLY">Remote only</option><option value="ONSITE_ONLY">On-site only</option></select></label><label className="flex items-center gap-2 self-end pb-2 text-sm font-medium"><input type="checkbox" checked={form.includeJobsWithoutExperience} onChange={(event) => setForm((current) => ({ ...current, includeJobsWithoutExperience: event.target.checked }))} className="accent-amber-600" />Include jobs without experience</label></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{([['salaryMin', 'Salary minimum'], ['salaryMax', 'Salary maximum'], ['equityMin', 'Equity minimum'], ['equityMax', 'Equity maximum'], ['yearsExperienceMin', 'Experience minimum'], ['yearsExperienceMax', 'Experience maximum']] as Array<[keyof FormState, string]>).map(([field, label]) => <label key={field} className="text-sm font-medium">{label}<input type="number" min="0" value={form[field] as string} onChange={(event) => updateField(field, event.target.value)} placeholder="Optional" className={inputClass} /></label>)}</div>
            <button type="submit" className="rounded-md bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700">Apply filters</button>
          </form>
        )}
      </main>
    </div>
  )
}

export default Wellfound
