import React from 'react';
import PropTypes from 'prop-types';
import {
  Marker,
  Tooltip,
} from 'react-leaflet';
import Leaflet from 'leaflet';
import truckImg from '../assets/truck.png';

function TruckMarker({ tooltipInfo, position }) {
  const myIcon = Leaflet.icon({
    iconUrl: truckImg,
    iconSize: [35, 28],
    iconAnchor: [20, 15],
    popupAnchor: [0, 0],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
  });

  return (
    <Marker position={position} icon={myIcon}>
      <Tooltip>
        {tooltipInfo}
      </Tooltip>
    </Marker>
  );
}

TruckMarker.propTypes = {
  tooltipInfo: PropTypes.string.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default TruckMarker;
