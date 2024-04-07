// Kartta.tsx

import React, { useEffect } from 'react';
import L from 'leaflet';

const Kartta: React.FC = () => {
  useEffect(() => {
   
    const kartta = L.map('kartta-container').setView([60.1695, 24.9354], 13);

   
    L.tileLayer('ae0e2007-af73-4855-83d1-5b5afeb01373').addTo(kartta);

    
    return () => {
      kartta.remove();
    };
  }, []); 

  return (
    <div>
      <h2>Maanmittauslaitoksen Kartta</h2>
      <div id="kartta-container" style={{ height: '500px' }}></div>
    </div>
  );
};

export default Kartta;
