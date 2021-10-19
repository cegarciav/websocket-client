import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';

function Map() {
  return (
    <article className="col-6 px-2 py-2">
      <h1>Mapa en vivo flota de camiones</h1>
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup.
          </Popup>
        </Marker>
      </MapContainer>
    </article>
  );
}

export default Map;
