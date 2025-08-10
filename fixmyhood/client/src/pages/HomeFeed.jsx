import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IssueCard from '../components/IssueCard.jsx';
import UpvoteButton from '../components/UpvoteButton.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { api } from '../services/api.js';
import { useDeviceId } from '../services/device.js';

export default function HomeFeed() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [subCity, setSubCity] = useState('');
  const [q, setQ] = useState('');
  const deviceId = useDeviceId();

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/issues', { params: { status, category, subCity, q } });
      setIssues(res.data.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const subCities = ['', 'Arada', 'Addis Ketema', 'Bole', 'Kirkos', 'Kolfe Keranio', 'Gullele', 'Lideta', 'Nifas Silk-Lafto', 'Yeka', 'Akaky Kaliti'];
  const categories = ['', 'Pothole', 'Street Light', 'Garbage', 'Water Leak', 'Sewer', 'Sidewalk', 'Road Block', 'Other'];

  async function upvote(id) {
    await api.post(`/issues/${id}/upvote`, { deviceId });
    await load();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Community Feed</h1>
        <Link to="/report" className="inline-flex justify-center items-center px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700">Report an Issue</Link>
      </div>

      <div className="bg-white border rounded-lg p-3 mb-4 grid gap-3 sm:grid-cols-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="border rounded px-3 py-2" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded px-3 py-2">
          {categories.map((c) => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
        <select value={subCity} onChange={(e) => setSubCity(e.target.value)} className="border rounded px-3 py-2">
          {subCities.map((s) => <option key={s} value={s}>{s || 'All Sub-cities'}</option>)}
        </select>
        <div className="sm:col-span-4 flex gap-2">
          <button onClick={load} className="px-3 py-2 rounded bg-gray-800 text-white">Apply</button>
          <button onClick={() => { setQ(''); setStatus(''); setCategory(''); setSubCity(''); }} className="px-3 py-2 rounded border">Reset</button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : issues.length === 0 ? (
        <p className="text-gray-500">No issues found yet. Be the first to <Link to="/report" className="text-brand-700 underline">report one</Link>.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <div key={issue._id} className="relative">
              <IssueCard issue={issue} />
              <div className="absolute top-2 right-2">
                <UpvoteButton count={issue.upvotes} onUpvote={() => upvote(issue._id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}