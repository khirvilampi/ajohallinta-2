import React from 'react';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import Kartta from './Kartta';
import LuoAjoPage from './LuoAjoPage'; 
import AjoPage from './AjoPage';

interface AjoHallintaPageProps {
  loggedIn: boolean;
}

const AjoHallintaPage: React.FC<AjoHallintaPageProps> = ({ loggedIn }) => {
  if (!loggedIn) {
    // Jos käyttäjä ei ole kirjautunut, ohjaa takaisin etusivulle
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Ajonhallinta</h1>
      <nav>
        <ul>
          <li><Link to="/kartta">Kartta</Link></li>
          <li><Link to="/luouusi">Luo uusi ajo</Link></li>
          <li><Link to="/ajopage">tarkastele keikkojasi</Link></li> 
        </ul>
      </nav>

      <Routes>
        <Route path="/kartta" element={<Kartta />} />
        <Route path="/luouusi" element={<LuoAjoPage />} /> 
        <Route path="/ajopage" element={<AjoPage />} /> 
      </Routes>
    </div>
  );
};

export default AjoHallintaPage;
