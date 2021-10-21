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

  const markersDataList = trucksData.map((truck) => ({
    truckCode: truck.code,
    markerCodeOrigin: `${truck.origin[0]};${truck.origin[1]}`,
    origin: truck.origin,
    markerCodeDestination: `${truck.destination[0]};${truck.destination[1]}`,
    destination: truck.destination,
  })).reduce((prevData, currElement) => {
    let newData;
    // Save origin messages
    const newOriginMessage = `Origen de camión ${currElement.truckCode}`;
    if (Object.keys(prevData).includes(currElement.markerCodeOrigin)) {
      newData = {
        ...prevData,
        [currElement.markerCodeOrigin]: {
          ...prevData[currElement.markerCodeOrigin],
          messages: [
            ...prevData[currElement.markerCodeOrigin].messages,
            newOriginMessage,
          ],
        },
      };
    } else {
      newData = {
        ...prevData,
        [currElement.markerCodeOrigin]: {
          position: currElement.origin,
          messages: [newOriginMessage],
        },
      };
    }

    // Save destination messages
    const newDestinationMessage = `Destino de camión ${currElement.truckCode}`;
    if (Object.keys(prevData).includes(currElement.markerCodeDestination)) {
      newData = {
        ...newData,
        [currElement.markerCodeDestination]: {
          ...prevData[currElement.markerCodeDestination],
          messages: [
            ...prevData[currElement.markerCodeDestination].messages,
            newDestinationMessage,
          ],
        },
      };
    } else {
      newData = {
        ...newData,
        [currElement.markerCodeDestination]: {
          position: currElement.destination,
          messages: [newDestinationMessage],
        },
      };
    }
    return newData;
  }, {});

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
              Object
                .keys(markersDataList)
                .map((markerKey) => (
                  <Marker
                    position={markersDataList[markerKey].position}
                    key={`${markerKey}-marker`}
                  >
                    <Tooltip>
                      {markersDataList[markerKey].messages.map((message) => (
                        <p className="my-0" key={`${markerKey}-${message}`}>{message}</p>
                      ))}
                    </Tooltip>
                  </Marker>
                ))
            }
            {
              trucksData
                .filter((truck) => Object.keys(routes).includes(truck.code))
                .map((truck) => (
                  <Polyline
                    positions={[truck.origin, routes[truck.code][0]]}
                    pathOptions={{ color: 'white' }}
                    key={`${truck.code}-origin-polyline`}
                  />
                ))
            }
            {
              trucksData
                .filter((truck) => Object.keys(routes).includes(truck.code))
                .map((truck) => (
                  <Polyline
                    positions={[
                      truck.destination,
                      routes[truck.code][routes[truck.code].length - 1],
                    ]}
                    pathOptions={{ color: 'white' }}
                    key={`${truck.code}-destination-polyline`}
                  />
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
