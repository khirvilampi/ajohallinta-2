import React from 'react';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import Kartta from './Kartta';
import LuoAjoPage from './LuoAjoPage'; 
import AjoPage from './AjoPage';

interface User {
  role: string; 
}
interface AjoHallintaPageProps {
  loggedIn: boolean;
  user: User | null;
}

const AjoHallintaPage: React.FC<AjoHallintaPageProps> = ({ loggedIn, user }) => {

  if (!loggedIn) {
    // estetään "luvaton" kirjautuminen tällä
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Ajonhallinta</h1>
      <nav>
        <ul>
          <li><Link to="/kartta">Kartta</Link></li>
          {user && user.role === 'dispatcher' && <li><Link to="/luouusi">luo uusi ajo</Link></li>}
         <li><Link to="/ajopage">Tarkastele keikkojasi</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/kartta" element={<Kartta loggedInUser={undefined} />} />
        {user && user.role === 'dispatcher' && <Route path="/luouusi" element={<LuoAjoPage />} />} {/* Näytetään vain dispatcherille */}
        <Route path="/ajopage" element={<AjoPage />} /> 
       


      </Routes>
    </div>
  );
};

export default AjoHallintaPage;
