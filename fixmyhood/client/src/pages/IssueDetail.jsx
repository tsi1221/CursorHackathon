import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import StatusBadge from '../components/StatusBadge.jsx';
import UpvoteButton from '../components/UpvoteButton.jsx';
import MapView from '../components/MapView.jsx';
import { useDeviceId } from '../services/device.js';

export default function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const deviceId = useDeviceId();

  async function load() {
    const res = await api.get(`/issues/${id}`);
    setIssue(res.data);
  }

  useEffect(() => { load(); }, [id]);

  if (!issue) return <div className="max-w-3xl mx-auto px-4 py-6">Loading…</div>;

  async function upvote() {
    await api.post(`/issues/${id}/upvote`, { deviceId });
    await load();
  }

  async function addComment() {
    if (!comment.trim()) return;
    await api.post(`/issues/${id}/comments`, { deviceId, name, text: comment });
    setComment('');
    await load();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border rounded-lg overflow-hidden">
        {issue.imageUrl && <img src={issue.imageUrl} className="w-full max-h-96 object-cover" alt={issue.title} />}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-bold">{issue.title}</h1>
            <StatusBadge status={issue.status} />
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
          <div className="text-sm text-gray-500 flex items-center gap-3">
            <span>Category: {issue.category}</span>
            <span>•</span>
            <span>📍 {issue.subCity || 'Addis Ababa'}{issue.woreda ? `, Woreda ${issue.woreda}` : ''}</span>
          </div>
          <div>
            <MapView markers={[{ lat: issue.location.coordinates[1], lng: issue.location.coordinates[0], popup: issue.title }]} />
          </div>
          <div className="flex items-center gap-2">
            <UpvoteButton count={issue.upvotes} onUpvote={upvote} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Comments</h3>
          <div className="space-y-3 max-h-80 overflow-auto">
            {(issue.comments || []).slice().reverse().map((c, idx) => (
              <div key={idx} className="border rounded p-2">
                <div className="text-xs text-gray-500">{c.name || 'Resident'} • {new Date(c.createdAt).toLocaleString()}</div>
                <div className="text-sm">{c.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="w-full border rounded px-3 py-2 text-sm" />
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" className="w-full border rounded px-3 py-2 text-sm" rows={3} />
            <button onClick={addComment} className="px-3 py-2 rounded bg-brand-600 text-white text-sm">Post Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
}