import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AjoHallintaPage from './AjoHallintaPage';
import LuoAjoPage from './LuoAjoPage';
import Kartta from './Kartta';
import Rekisterointi from './rekisterointi';
import AjoPage from './AjoPage';
import LoginForm from './LoginForm';


const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);
  const handleLogin = (user: any) => {
    console.log('Käyttäjä kirjautui sisään:', user); 
    setLoggedInUser(user);
  };


  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<LoginForm onLogin={(user) => { handleLogin(user); setLoggedIn(true); }} />} />
           <Route path="/ajonhallinta" element={loggedIn ? <AjoHallintaPage loggedIn={loggedIn} user={loggedInUser} /> : <Navigate to="/" />}/>
          <Route path="/kartta" element={loggedIn ? <Kartta loggedInUser={loggedInUser}  /> : <Navigate to="/" />} />
          <Route  path="/luouusi" element={loggedIn ? <LuoAjoPage /> : <Navigate to="/" />} />
          <Route path="/rekisterointi" element={<Rekisterointi />} />
          <Route path="/ajopage" element={<AjoPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
