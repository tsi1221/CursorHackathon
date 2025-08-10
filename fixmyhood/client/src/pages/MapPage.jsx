import { useEffect, useState } from 'react';
import MapView from '../components/MapView.jsx';
import { api } from '../services/api.js';

export default function MapPage() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    api.get('/issues', { params: { limit: 200 } }).then((res) => {
      const items = res.data.items || [];
      setMarkers(items.map((it) => ({
        _id: it._id,
        lat: it.location?.coordinates?.[1],
        lng: it.location?.coordinates?.[0],
        popup: `${it.title} (${it.subCity || 'Addis Ababa'})`,
      })).filter((m) => m.lat && m.lng));
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">City Map</h1>
      <MapView markers={markers} />
    </div>
  );
}