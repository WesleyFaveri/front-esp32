import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import logo from './logo.svg';
import './App.css';
import { Thermometer } from './assets';
import Geocode from "react-geocode";
import { io } from 'socket.io-client';

console.log(io);

const TESTE = 'TESTE';

Geocode.setApiKey(TESTE);

Geocode.setLanguage("pt-br");
Geocode.setRegion("br");

const temperature = 15;

const socket = io('ws://localhost:3000');

const App = (props) => {
  console.log(props);
  const [position, setPosition] = useState(null);
  const [city, setCity] = useState(null);

  socket.on('message', data => {
    console.log(data);
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        try {
          const values = { latitude: coords.latitude,  longitude: coords.longitude };
          setPosition(values);
        } catch(err) {
          console.log(err);
        }
      },
      (error) => console.log(error) ,
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );

    return () => null;
  }, []);

  useEffect(() => {
    if (position) {
      Geocode.fromLatLng(position.latitude, position.longitude).then((response) => {
        const address = response.results[6].formatted_address;

        setCity(address)
      }, (error) => console.error(error));
    }

    return null;
  }, [position]);

  return (
    <div className="App">
      <header className="App-header">
        {city ? <p style={{ fontSize: 50 }}>{city}</p> : (<ReactLoading type={'spin'} color={'white'} height={'10%'} width={'10%'} />)}
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
          <img  src={Thermometer} style={{ fontColor: 'white', height: 45, width: 45 }} />
          <p style={{ fontSize: 40 }}>{temperature}°C</p>
        </div>
        <p style={{ fontSize: 40 }}>Umidade: {temperature}%</p>
      </header>
    </div>
  );
}

export default App;
