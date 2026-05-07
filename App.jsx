import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import Home from './pages/Home'
import Profile from './pages/Profile'
import AddPerson from './pages/AddPerson'
import AddReview from './pages/AddReview'
import MyProfile from './pages/MyProfile'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<><Home />      <BottomNav /></>} />
        <Route path="/profile/:id"    element={<Profile />} />
        <Route path="/add"            element={<><AddPerson /> <BottomNav /></>} />
        <Route path="/review/:profileId" element={<AddReview />} />
        <Route path="/profile"        element={<><MyProfile /> <BottomNav /></>} />
      </Routes>
    </BrowserRouter>
  )
}
