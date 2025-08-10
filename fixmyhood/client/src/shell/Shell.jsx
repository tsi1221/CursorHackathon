import { Outlet, NavLink } from 'react-router-dom';

export default function Shell() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-brand-500 text-white font-bold">F</span>
            <span className="font-semibold text-lg">FixMyHood Addis</span>
          </NavLink>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" className={({isActive}) => isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}>Feed</NavLink>
            <NavLink to="/map" className={({isActive}) => isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}>Map</NavLink>
            <NavLink to="/report" className={({isActive}) => isActive ? 'text-brand-600' : 'text-white bg-brand-600 px-3 py-1.5 rounded hover:bg-brand-700'}>Report</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-100 border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-600 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between">
          <p>Empowering Addis Ababa communities to report, resolve, and rebuild.</p>
          <p>Hackathon 2025 • Team FixMyHood</p>
        </div>
      </footer>
    </div>
  );
}