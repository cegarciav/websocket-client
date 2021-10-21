import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Tooltip,
} from 'react-leaflet';
import TruckMarker from './TruckMarker';
import trucksSocket from '../socketService';

function Map() {
  const successColour = '#145714';
  const failureColour = '#c01616';
  const [trucksData, setTrucksData] = useState([]);
  const [routes, setRoutes] = useState({});
  const [trucksColours, setTrucksColours] = useState({});
  const [lastCode, setLastCode] = useState(null);
  const [lastPosition, setLastPosition] = useState(null);
  const [centre, setCentre] = useState(null);
  const [isCentred, setIsCentred] = useState(false);

  useEffect(() => {
    trucksSocket.emit('TRUCKS');
    trucksSocket.on('TRUCKS', (trucksList) => {
      setTrucksData(trucksList);
    });
  }, []);

  useEffect(() => {
    trucksSocket.on('POSITION', (newPosition) => {
      // Update routes
      setRoutes((prevRoutes) => {
        const routeCodes = Object.keys(prevRoutes);
        let newRoutes = {};

        if (routeCodes.includes(newPosition.code)) {
          newRoutes = {
            ...prevRoutes,
            [newPosition.code]: [...prevRoutes[newPosition.code], newPosition.position],
          };
        } else {
          newRoutes = {
            ...prevRoutes,
            [newPosition.code]: [newPosition.position],
          };
        }
        return newRoutes;
      });

      setLastCode(newPosition.code);
      setLastPosition(newPosition.position);
    });
  }, []);

  useEffect(() => {
    trucksSocket.on('FAILURE', (failure) => {
      setTrucksColours((prevColours) => ({ ...prevColours, [failure.code]: failureColour }));
    });
  }, []);

  useEffect(() => {
    trucksSocket.on('FIX', (newFix) => {
      setTrucksColours((prevColours) => ({ ...prevColours, [newFix.code]: successColour }));
    });
  }, []);

  useEffect(() => {
    // Update list of trucks if necessary
    const truckCodes = trucksData.map((truck) => truck.code);
    if (!truckCodes.includes(lastCode)) {
      trucksSocket.emit('TRUCKS');
    }
  }, [lastCode]);

  useEffect(() => {
    // Update centre if necessary
    if (!isCentred && lastPosition) {
      setCentre(lastPosition);
      setIsCentred(true);
    }
  }, [lastPosition]);

  return (
    <article className="col-6 px-2 py-2">
      <h1>Mapa en vivo flota de camiones</h1>
      {centre
        && (
          <MapContainer center={centre} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
              Object
                .keys(routes)
                .map((truckCode) => ({
                  position: routes[truckCode][routes[truckCode].length - 1],
                  code: truckCode,
                }))
                .map((truckInfo) => (
                  <TruckMarker
                    tooltipInfo={`Código: ${truckInfo.code}`}
                    position={truckInfo.position}
                    key={truckInfo.code}
                  />
                ))
            }
            {
              trucksData
                .map((truck) => (
                  <Marker
                    position={truck.origin}
                    key={`${truck.code}-origin`}
                  >
                    <Tooltip>
                      {`Origen de camión ${truck.code}`}
                    </Tooltip>
                  </Marker>
                ))
            }
            {
              trucksData
                .map((truck) => (
                  <Marker
                    position={truck.destination}
                    key={`${truck.code}-destination`}
                  >
                    <Tooltip>
                      {`Destino de camión ${truck.code}`}
                    </Tooltip>
                  </Marker>
                ))
            }
            {
              Object
                .keys(routes)
                .map((truckCode) => (
                  <Polyline
                    positions={routes[truckCode]}
                    pathOptions={{ color: trucksColours[truckCode] || successColour }}
                    key={`${truckCode}-polyline`}
                  />
                ))
            }
          </MapContainer>
        )}
    </article>
  );
}

export default Map;
