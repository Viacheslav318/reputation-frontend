import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function AddPerson() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', phone: '', tg_username: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const hasAnyField = form.full_name.trim() || form.phone.trim() || form.tg_username.trim()

  const handleSubmit = async () => {
    if (!hasAnyField) {
      setError('Заполните хотя бы одно поле')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await api.createProfile({
        full_name: form.full_name.trim() || undefined,
        phone: form.phone.trim() || undefined,
        tg_username: form.tg_username.trim() || undefined
      })
      navigate(`/profile/${data.profile.id}`)
    } catch (e) {
      if (e.message?.includes('already exists')) {
        setError('Человек с таким телефоном или Telegram уже есть в базе')
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
          <div className="page-title">Добавить человека</div>
        </div>
      </div>

      <div className="page-content">
        <div className="card" style={{ gap: 16, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
            Заполните хотя бы одно поле для идентификации человека.
          </div>

          <div className="input-wrap">
            <label className="input-label">ФИО</label>
            <input
              className="input"
              placeholder="Иванов Иван Иванович"
              value={form.full_name}
              onChange={set('full_name')}
            />
          </div>

          <div className="input-wrap">
            <label className="input-label">Номер телефона</label>
            <input
              className="input"
              placeholder="+7 900 000 00 00"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>

          <div className="input-wrap">
            <label className="input-label">Telegram</label>
            <input
              className="input"
              placeholder="@username"
              value={form.tg_username}
              onChange={set('tg_username')}
            />
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--red-dim)', border: '1px solid var(--red)', borderRadius: 10, padding: '12px 16px', color: 'var(--red)', fontSize: 14 }}>
            {error}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !hasAnyField}
        >
          {loading ? 'Сохранение...' : '✅ Добавить в базу'}
        </button>
      </div>
    </div>
  )
}
