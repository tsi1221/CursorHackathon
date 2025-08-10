import { useState } from 'react';
import MapView from './MapView.jsx';
import AISuggestions from './AISuggestions.jsx';

export default function IssueForm({ onSubmit, onSuggest }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Pothole');
  const [subCity, setSubCity] = useState('');
  const [woreda, setWoreda] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(9.0108);
  const [lng, setLng] = useState(38.7613);
  const [image, setImage] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const categories = ['Pothole', 'Street Light', 'Garbage', 'Water Leak', 'Sewer', 'Sidewalk', 'Road Block', 'Other'];
  const subCities = ['Arada', 'Addis Ketema', 'Bole', 'Kirkos', 'Kolfe Keranio', 'Gullele', 'Lideta', 'Nifas Silk-Lafto', 'Yeka', 'Akaky Kaliti'];

  async function handleSuggest() {
    setAiLoading(true);
    try {
      const data = await onSuggest({ title, description, category, subCity, woreda });
      setAiSuggestion(data?.suggestion || '');
    } finally {
      setAiLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!lat || !lng) return alert('Please pick a location on the map');
    onSubmit({ title, description, category, subCity, woreda, address, lat, lng, image });
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" placeholder="Short title (e.g., Large pothole near ... )" />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 w-full border rounded px-3 py-2" placeholder="Describe the problem and its impact" />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full border rounded px-3 py-2">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Sub-city</label>
            <select value={subCity} onChange={(e) => setSubCity(e.target.value)} className="mt-1 w-full border rounded px-3 py-2">
              <option value="">Select</option>
              {subCities.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Woreda</label>
            <input value={woreda} onChange={(e) => setWoreda(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="e.g., 03" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Address (optional)</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="Nearby landmark or street" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Pick location on the map</label>
          <MapView
            markers={[{ lat, lng, popup: 'Selected location' }]}
            onSelectLocation={(p) => { setLat(p.lat); setLng(p.lng); }}
          />
          <p className="mt-1 text-xs text-gray-500">Lat: {lat.toFixed(5)} Lng: {lng.toFixed(5)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="mt-1 w-full" />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className="px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700">Submit Issue</button>
          <button type="button" onClick={handleSuggest} className="px-4 py-2 rounded border hover:bg-gray-50">Get AI Suggestions</button>
        </div>
      </form>
      <AISuggestions loading={aiLoading} suggestion={aiSuggestion} />
    </div>
  );
}