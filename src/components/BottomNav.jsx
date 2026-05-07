import { useNavigate, useLocation } from 'react-router-dom'

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
  </svg>
)

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

export function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const tabs = [
    { path: '/',        label: 'Поиск',    Icon: IconSearch },
    { path: '/add',     label: 'Добавить', Icon: IconPlus   },
    { path: '/profile', label: 'Я',        Icon: IconUser   },
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(({ path, label, Icon }) => (
        <button
          key={path}
          className={`nav-item ${pathname === path ? 'active' : ''}`}
          onClick={() => navigate(path)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </nav>
  )
}
