import './App.css';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";


function App() {

  const [login, setLogin] = useState(null);
  
  useEffect(() => {
    const creds = {
      email: localStorage.getItem("userEmail"),
      token: localStorage.getItem("accessToken")
    };
    axios.post("http://127.0.0.1:8000/", creds).then((res) => {
      console.log(res)
      if (res.data.status === "200") {
        setLogin(true);
      }
      else{
        setLogin(false);
      }
    });
  }, [])

  return (
    <div className="h-100">
      {login === true ? <MainPage /> : <LoginPage setLogin = {setLogin} />}
      
    </div>
  );
}

export default App;
