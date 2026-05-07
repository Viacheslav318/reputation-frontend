import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function AddReview() {
  const { profileId } = useParams()
  const navigate = useNavigate()
  const [type, setType] = useState(null) // 'positive' | 'negative'
  const [text, setText] = useState('')
  const [photos, setPhotos] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    setPhotos(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const removePhoto = (i) => {
    setPhotos(p => p.filter((_, idx) => idx !== i))
    setPreviews(p => p.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async () => {
    if (!type) { setError('Выберите тип отзыва'); return }
    if (text.trim().length < 10) { setError('Текст отзыва минимум 10 символов'); return }

    setLoading(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('profile_id', profileId)
      fd.append('type', type)
      fd.append('text', text.trim())
      photos.forEach(p => fd.append('photos', p))

      await api.createReview(fd)
      navigate(`/profile/${profileId}`)
    } catch (e) {
      if (e.message?.includes('already reviewed')) {
        setError('Вы уже оставляли отзыв об этом человеке')
      } else {
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ color: 'var(--text2)', fontSize: 22, lineHeight: 1 }}>←</button>
          <div className="page-title">Оставить отзыв</div>
        </div>
      </div>

      <div className="page-content">
        {/* Type selector */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
            Тип отзыва
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              onClick={() => setType('positive')}
              style={{
                padding: '16px 12px',
                borderRadius: 'var(--radius)',
                border: `2px solid ${type === 'positive' ? 'var(--green)' : 'var(--border)'}`,
                background: type === 'positive' ? 'var(--green-dim)' : 'var(--bg2)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                transition: 'all 0.15s', cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: 28 }}>👍</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: type === 'positive' ? 'var(--green)' : 'var(--text2)' }}>
                Позитивный
              </span>
              <span style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>
                Можно доверять
              </span>
            </button>

            <button
              onClick={() => setType('negative')}
              style={{
                padding: '16px 12px',
                borderRadius: 'var(--radius)',
                border: `2px solid ${type === 'negative' ? 'var(--red)' : 'var(--border)'}`,
                background: type === 'negative' ? 'var(--red-dim)' : 'var(--bg2)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                transition: 'all 0.15s', cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: 28 }}>👎</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: type === 'negative' ? 'var(--red)' : 'var(--text2)' }}>
                Негативный
              </span>
              <span style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>
                Не рекомендую
              </span>
            </button>
          </div>
        </div>

        {/* Text */}
        <div className="input-wrap">
          <label className="input-label">Текст отзыва *</label>
          <textarea
            className="input"
            placeholder="Опишите ваш опыт взаимодействия с этим человеком..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
          />
          <span style={{ fontSize: 12, color: text.length < 10 ? 'var(--text3)' : 'var(--green)', alignSelf: 'flex-end' }}>
            {text.length} / мин. 10 символов
          </span>
        </div>

        {/* Photos */}
        <div className="input-wrap">
          <label className="input-label">Фото-доказательства (до 5 шт.)</label>
          <label style={{
            border: '2px dashed var(--border)',
            borderRadius: 'var(--radius)',
            padding: '20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            cursor: 'pointer', color: 'var(--text2)', fontSize: 14
          }}>
            <span style={{ fontSize: 28 }}>📎</span>
            <span>Прикрепить фото</span>
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>JPG, PNG до 10 МБ каждое</span>
            <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhotos} />
          </label>

          {previews.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={src} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 10 }} />
                  <button
                    onClick={() => removePhoto(i)}
                    style={{
                      position: 'absolute', top: 4, right: 4,
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.7)', color: '#fff',
                      fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div style={{ background: 'var(--red-dim)', border: '1px solid var(--red)', borderRadius: 10, padding: '12px 16px', color: 'var(--red)', fontSize: 14 }}>
            {error}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !type || text.trim().length < 10}
        >
          {loading ? 'Отправка...' : '📤 Опубликовать отзыв'}
        </button>
      </div>
    </div>
  )
}
