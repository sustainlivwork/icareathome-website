import { Route, Routes } from 'react-router'
import Layout from './components/layout/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ObjectivesPage from './pages/ObjectivesPage.jsx'
import WorkPackagesPage from './pages/WorkPackagesPage.jsx'
import ConsortiumPage from './pages/ConsortiumPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import EventsPage from './pages/EventsPage.jsx'
import EventDetailPage from './pages/EventDetailPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

// Page addresses. Event pages (/events/<file-name>/) are created automatically
// from the files in src/content/events/ — no change is needed here to add one.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="objectives" element={<ObjectivesPage />} />
        <Route path="work-packages" element={<WorkPackagesPage />} />
        <Route path="consortium" element={<ConsortiumPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:slug" element={<EventDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
