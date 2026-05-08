import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

function ReviewCard({ review }) {
  const isPos = review.type === 'positive'

  return (
    <div className="card fade-up" style={{ borderLeft: `3px solid ${isPos ? 'var(--green)' : 'var(--red)'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: isPos ? 'var(--green-dim)' : 'var(--red-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16
          }}>
            {isPos ? '👍' : '👎'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>
              Анонимный отзыв
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
              {new Date(review.created_at).toLocaleDateString('ru-RU')}
            </div>
          </div>
        </div>
        <span className={`badge ${isPos ? 'badge-green' : 'badge-red'}`}>
          {isPos ? 'Позитивный' : 'Негативный'}
        </span>
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)', marginBottom: review.photo_urls?.length ? 10 : 0 }}>
        {review.text}
      </p>

      {review.photo_urls?.length > 0 && (
        <div className="photo-grid">
          {review.photo_urls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt="Фото доказательство"
              onClick={() => window.open(url, '_blank')}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.getProfile(id)
      .then(data => {
        setProfile(data.profile)
        setReviews(data.reviews)
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="page">
      <div className="loader"><div className="spinner" /></div>
    </div>
  )

  if (!profile) return null

  const total = profile.rating_positive + profile.rating_negative
  const score = total > 0 ? Math.round((profile.rating_positive / total) * 100) : null
  const isGood = score !== null && score >= 50

  const filtered = reviews.filter(r => {
    if (filter === 'all') return true
    return r.type === filter
  })

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ color: 'var(--text2)', fontSize: 22, lineHeight: 1 }}>←</button>
          <div className="page-title">Профиль</div>
        </div>
      </div>

      <div className="page-content">
        {/* Profile card */}
        <div className="card" style={{ background: 'var(--bg2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              {profile.full_name && (
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 8 }}>
                  {profile.full_name}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {profile.phone && (
                  <span style={{ fontSize: 14, color: 'var(--text2)' }}>📞 {profile.phone}</span>
                )}
                {profile.tg_username && (
                  <span style={{ fontSize: 14, color: 'var(--text2)' }}>✈️ @{profile.tg_username}</span>
                )}
              </div>
            </div>
            {score !== null && (
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: isGood ? 'var(--green-dim)' : 'var(--red-dim)',
                border: `2px solid ${isGood ? 'var(--green)' : 'var(--red)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-head)', color: isGood ? 'var(--green)' : 'var(--red)' }}>
                  {score}%
                </span>
              </div>
            )}
          </div>

          <div className="rating-row">
            <div className="rating-item pos">
              <span>👍</span>
              <span className="count">{profile.rating_positive}</span>
              <span style={{ fontSize: 12 }}>позитивных</span>
            </div>
            <div className="rating-item neg">
              <span>👎</span>
              <span className="count">{profile.rating_negative}</span>
              <span style={{ fontSize: 12 }}>негативных</span>
            </div>
          </div>
        </div>

        {/* Add review button */}
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/review/${id}`)}
        >
          ✍️ Оставить отзыв
        </button>

        {/* Reviews filter */}
        {reviews.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'positive', 'negative'].map(f => (
              <button
                key={f}
                className={`badge ${filter === f ? 'badge-green' : 'badge-gray'}`}
                style={{ cursor: 'pointer', padding: '6px 14px', fontSize: 13 }}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'Все' : f === 'positive' ? '👍 Позитивные' : '👎 Негативные'}
              </button>
            ))}
          </div>
        )}

        {/* Reviews list */}
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">💬</div>
            <div className="empty-title">Отзывов пока нет</div>
            <div className="empty-sub">Будьте первым</div>
          </div>
        ) : (
          filtered.map(r => <ReviewCard key={r.id} review={r} />)
        )}
      </div>
    </div>
  )
}
