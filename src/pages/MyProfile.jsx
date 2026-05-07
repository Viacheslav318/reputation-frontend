import { useTelegram } from '../hooks/useTelegram'

export default function MyProfile() {
  const { user } = useTelegram()

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">👤 Мой профиль</div>
      </div>

      <div className="page-content">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--accent-dim)',
              border: '2px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--accent)'
            }}>
              {user?.first_name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                {user?.first_name || 'Пользователь'}
              </div>
              {user?.username && (
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>@{user.username}</div>
              )}
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                ID: {user?.id}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)' }}>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>
            <strong>ℹ️ О приложении</strong><br />
            Этот сервис позволяет оставлять отзывы о людях для защиты сообщества. Каждый пользователь может оставить только один отзыв на человека. Отзывы с фото-доказательствами имеют больший вес.
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.7 }}>
            Используйте сервис ответственно.<br />
            Ложные отзывы — нарушение правил.
          </div>
        </div>
      </div>
    </div>
  )
}
