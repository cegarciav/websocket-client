import React, { useState, useEffect } from 'react';
import TruckCard from './TruckCard';
import trucksSocket from '../socketService';

function Info() {
  const getTrucks = () => {
    trucksSocket.emit('TRUCKS');
  };

  const [trucks, setTrucks] = useState([]);

  useEffect(() => {
    getTrucks();
    trucksSocket.on('TRUCKS', (trucksList) => {
      setTrucks(trucksList);
    });
  }, []);

  return (
    <article className="col-10 px-2 py-2">
      <section className="row information black-border">
        <aside className="col-3">
          <h2 className="row justify-center h-2">Información camiones</h2>
          <div className="row justify-center h-8 align-items-center">
            <button
              type="button"
              className="black-border py-2 px-2 h-3"
              onClick={getTrucks}
            >
              Get Info
            </button>
          </div>
        </aside>
        <main className="col-7">
          <div className="row trucks-info-container">
            {
              trucks.map((truck) => (
                <TruckCard
                  truckCode={truck.code}
                  truckEngine={truck.engine}
                  truckOrigin={truck.origin}
                  truckDestination={truck.destination}
                  truckName={truck.truck}
                  truckCapacity={truck.capacity}
                  truckStaff={truck.staff}
                  truckStatus="Ok"
                />
              ))
            }
          </div>
        </main>
      </section>
    </article>
  );
}

export default Info;
