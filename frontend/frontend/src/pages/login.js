// SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const REACT_APP_MAIN_API = process.env.REACT_APP_MAIN_API;
import axios from 'axios';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSignIn = () => {
    if (email !== '' && password !== '') {
        axios.post(`${REACT_APP_MAIN_API}/login`, { email, password })
            .then((res) => {
              const { uid, email } = res.data;

              // Save user info to local storage
              localStorage.setItem('user', JSON.stringify({ uid, email }));
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error(error);
            });
    } else {
        alert("Please fill in the details");
    }
};


  return (
    <div>
      <h2>Sign In</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}

export default Login;
