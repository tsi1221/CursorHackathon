import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ClickCapture({ onClick }) {
  useMapEvents({
    click: (e) => onClick && onClick(e.latlng),
  });
  return null;
}

export default function MapView({ center = [9.0108, 38.7613], zoom = 12, markers = [], onSelectLocation }) {
  return (
    <div className="h-[420px] rounded-lg overflow-hidden border">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker key={m._id || `${m.lat},${m.lng}`} position={[m.lat, m.lng]} icon={markerIcon}>
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))}
        {onSelectLocation && <ClickCapture onClick={onSelectLocation} />}
      </MapContainer>
    </div>
  );
}