import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

function ProfileCard({ profile, onClick }) {
  const total = profile.rating_positive + profile.rating_negative
  const score = total > 0
    ? Math.round((profile.rating_positive / total) * 100)
    : null

  return (
    <div className="card fade-up" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, fontFamily: 'var(--font-head)', letterSpacing: '-0.3px' }}>
            {profile.full_name}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {profile.phone && (
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>📞 {profile.phone}</span>
            )}
            {profile.tg_username && (
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>✈️ @{profile.tg_username}</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          {score !== null && (
            <span
              className={`badge ${score >= 50 ? 'badge-green' : 'badge-red'}`}
            >
              {score}%
            </span>
          )}
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
              👍 {profile.rating_positive}
            </span>
            <span style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600 }}>
              👎 {profile.rating_negative}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSearch = useCallback(async () => {
    if (query.trim().length < 2) return
    setLoading(true)
    setError('')
    try {
      const data = await api.searchProfiles(query.trim())
      setResults(data.profiles)
      setSearched(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [query])

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title" style={{ marginBottom: 14 }}>🔍 Поиск</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            placeholder="ФИО, телефон или @username..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '0 18px' }}
            onClick={handleSearch}
            disabled={loading || query.trim().length < 2}
          >
            {loading ? '...' : 'Найти'}
          </button>
        </div>
      </div>

      <div className="page-content">
        {error && (
          <div style={{ background: 'var(--red-dim)', border: '1px solid var(--red)', borderRadius: 10, padding: '12px 16px', color: 'var(--red)', fontSize: 14 }}>
            {error}
          </div>
        )}

        {!searched && !loading && (
          <div className="empty">
            <div className="empty-icon">🧐</div>
            <div className="empty-title">Найдите человека</div>
            <div className="empty-sub">Введите ФИО, номер телефона<br />или Telegram username</div>
          </div>
        )}

        {searched && results.length === 0 && !loading && (
          <div className="empty">
            <div className="empty-icon">🤷</div>
            <div className="empty-title">Никого не найдено</div>
            <div className="empty-sub">Хотите добавить этого человека?</div>
            <button
              className="btn btn-primary"
              style={{ marginTop: 16, maxWidth: 200, margin: '16px auto 0' }}
              onClick={() => navigate('/add')}
            >
              Добавить
            </button>
          </div>
        )}

        {results.map(profile => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onClick={() => navigate(`/profile/${profile.id}`)}
          />
        ))}
      </div>
    </div>
  )
}
