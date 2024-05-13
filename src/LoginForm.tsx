import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

interface SignUpFormState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface LoginFormProps {
  onLogin: (role: string) => void; // Muutettu, välitetään vain rooli
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState<SignUpFormState>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Field name: ${name}, Field value: ${value}`);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstname || !formData.lastname || !formData.password) {
      alert("Täytä kaikki pakolliset kentät");
      return;
    }

    
    
    try {
      const response = await axios.post('https://ajohallinta-2.onrender.com//login', {
        firstname: formData.firstname,
        lastname: formData.lastname,
        password: formData.password,
      });

      console.log("response.data.success:", response);
  
      if (response.data.success) {
        const user = response.data.user;
        if (user.role === 'driver') {
          onLogin(user);
          navigate('/ajonhallinta');
          alert("Olet Kirjautunut Ajajana.");
        } else if (user.role === 'dispatcher') {
          onLogin(user);
          navigate('/ajonhallinta');
          alert("Olet Kirjautunut Ajojärjestelijänä.");
        }
      } else {
        alert("Väärin meni. yritä uudestaan");
      }
    } catch (error) {
      console.error('virhe kirjautumisessa', error);
      alert("epäonnistui. yritä uudestaan");
    }
  };
  

  
  
  const handleRegister = () => {
    navigate("/rekisterointi");
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
      <label>
        Salasana:
        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Kirjaudu</button>
      <p>
        Eikö sinulla ole käyttäjää?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={handleRegister}>
          Rekisteröidy tästä
        </span>
      </p>
    </form>
  );
};

export default LoginForm;
