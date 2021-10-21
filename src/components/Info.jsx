import React, { useState, useEffect } from 'react';
import TruckCard from './TruckCard';
import trucksSocket from '../socketService';

function Info() {
  const getTrucks = () => {
    trucksSocket.emit('TRUCKS');
  };

  const [trucks, setTrucks] = useState([]);
  const [activeFailures, setActiveFailures] = useState([]);

  useEffect(() => {
    getTrucks();
    trucksSocket.on('TRUCKS', (trucksList) => {
      setTrucks(trucksList);
    });
  }, []);

  useEffect(() => {
    trucksSocket.on('FAILURE', (failure) => {
      setActiveFailures((prevFailures) => [...prevFailures, failure]);
    });
  }, []);

  useEffect(() => {
    trucksSocket.on('FIX', (newFix) => {
      setActiveFailures((prevFailures) => prevFailures
        .filter((failure) => failure.code !== newFix.code));
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
              trucks.map((truck) => {
                const truckFailures = activeFailures
                  .filter((failure) => failure.code === truck.code);
                const truckIsOk = truckFailures.length === 0;
                const lastFailure = !truckIsOk ? truckFailures[truckFailures.length - 1].source : '';
                return (
                  <TruckCard
                    key={`${truck.code}-card`}
                    truckCode={truck.code}
                    truckEngine={truck.engine}
                    truckOrigin={truck.origin}
                    truckDestination={truck.destination}
                    truckName={truck.truck}
                    truckCapacity={truck.capacity}
                    truckStaff={truck.staff}
                    statusOk={truckIsOk}
                    failureType={lastFailure}
                  />
                );
              })
            }
          </div>
        </main>
      </section>
    </article>
  );
}

export default Info;
