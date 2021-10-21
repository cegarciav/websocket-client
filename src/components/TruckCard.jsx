import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import apiGet from '../httpService';
import trucksSocket from '../socketService';

function TruckCard({
  truckCode,
  truckEngine,
  truckOrigin,
  truckDestination,
  truckName,
  truckCapacity,
  truckStaff,
  statusOk,
  failureType,
}) {
  const fixTruck = () => {
    trucksSocket.emit('FIX', { code: truckCode });
  };

  const [originName, setOriginName] = useState(null);
  const [destinationName, setDestinationName] = useState(null);

  useEffect(async () => {
    if (!originName) {
      const originResponse = await apiGet('/', {
        format: 'json',
        lat: truckOrigin[0],
        lon: truckOrigin[1],
      });

      if (originResponse.data && originResponse.statusCode === 200) {
        setOriginName(originResponse.data.display_name);
      }
    }
  }, [truckOrigin[0], truckOrigin[1], originName]);

  useEffect(async () => {
    if (!destinationName) {
      const originResponse = await apiGet('/', {
        format: 'json',
        lat: truckDestination[0],
        lon: truckDestination[1],
      });

      if (originResponse.data && originResponse.statusCode === 200) {
        setDestinationName(originResponse.data.display_name);
      }
    }
  }, [truckDestination[0], truckDestination[1], destinationName]);

  const statusMessage = statusOk ? 'OK' : `Error en ${failureType}`;

  return (
    <div className={`col-4 px-2 my-2 black-border ${statusOk ? 'truck-ok' : 'truck-failure'}`}>
      <h3 className="text-align-center">{`Camión: ${truckCode}`}</h3>
      <div className="row my-2">
        <div className="col-6 truck-card-info">
          <p className="my-0">{`Estado: ${statusMessage}`}</p>
          <p className="my-0">{`Motor: ${truckEngine}`}</p>
          <p className="my-0">{`Origen: ${originName || truckOrigin}`}</p>
          <p className="my-0">{`Destino: ${destinationName || truckDestination}`}</p>
          <p className="my-0">{`Nombre: ${truckName}`}</p>
          <p className="my-0">{`Capacidad: ${truckCapacity}`}</p>
          <p className="my-0">Equipo:</p>
          <ul className="my-0">
            {
              truckStaff.map((staffMember) => (
                <li key={`${truckCode}-member-${staffMember.name}`}>
                  {`${staffMember.name} (${staffMember.age} años)`}
                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-4 button-container">
          {!statusOk
            && (
              <button
                type="button"
                className="black-border"
                onClick={fixTruck}
              >
                Arreglar
              </button>
            )}
        </div>
      </div>
    </div>
  );
}

TruckCard.propTypes = {
  truckCode: PropTypes.string.isRequired,
  truckEngine: PropTypes.string.isRequired,
  truckName: PropTypes.string.isRequired,
  truckCapacity: PropTypes.number.isRequired,
  truckOrigin: PropTypes.arrayOf(PropTypes.number).isRequired,
  truckDestination: PropTypes.arrayOf(PropTypes.number).isRequired,
  truckStaff: PropTypes.arrayOf(PropTypes.any).isRequired,
  statusOk: PropTypes.bool.isRequired,
  failureType: PropTypes.string,
};

TruckCard.defaultProps = {
  failureType: '',
};

export default TruckCard;
