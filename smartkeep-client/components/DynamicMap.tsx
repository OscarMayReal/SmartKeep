import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface DynamicMapProps {
  center: [number, number];
  zoom?: number;
  height?: string;
  width?: string;
}

export default function DynamicMap({ center, zoom = 20, height = "500px", width = "100%" }: DynamicMapProps) {
  return (
    <MapContainer
      className="shadow-sm rounded-md"
      center={center}
      style={{ height, width, backgroundColor: "white", overflow: "hidden", marginTop: "10px" }}
      zoom={zoom}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} />
    </MapContainer>
  );
}
