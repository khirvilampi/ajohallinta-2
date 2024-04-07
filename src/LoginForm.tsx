// LoginForm.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignUpFormState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [formData, setFormData] = useState<SignUpFormState>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Lisää tarkistus minimipituudelle
    if ((name === 'firstname' || name === 'lastname') && value.length < 5) {
      // Jos etu- tai sukunimi on liian lyhyt, älä päivitä tilaa
      return;
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
    navigate("/ajonhallinta");
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        Etunimi:
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Sukunimi:
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
        />
      </label>
      <br />
      <br />
      <button type="submit">Kirjaudu</button>
    </form>
  );
};

export default LoginForm;
