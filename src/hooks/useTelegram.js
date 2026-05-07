import { useEffect, useState } from 'react'

export function useTelegram() {
  const [tg] = useState(() => window.Telegram?.WebApp)

  useEffect(() => {
    if (tg) {
      tg.ready()
      tg.expand()
    }
  }, [tg])

  const user = tg?.initDataUnsafe?.user || {
    id: 0,
    first_name: 'Dev',
    username: 'dev_user'
  }

  return { tg, user }
}
