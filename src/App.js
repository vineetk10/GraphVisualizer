import React,{useState,useEffect} from 'react';
import {MapContainer,TileLayer,Popup,Marker} from 'react-leaflet'
import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css"
import './App.css';
import {Container,Row,Col} from "reactstrap"
import MapComponent from "./Components/MapComponent"
import MarkedCityContext from './Context/MarkedCityContext'
import LatLngContext from './Context/LatLngContext'
import Dashboard from "./Components/Dashboard"
import {Polyline} from 'react-leaflet'

function App() {
  const [markedCities,setMarkedCities] = useState([]);
  const [latlngs,setLatlngs] = useState([]);
  //const [markedCities ,dispatch] = useReducer(cityReducer,[])

  return (
  <LatLngContext.Provider value={{latlngs,setLatlngs}}>
    <MarkedCityContext.Provider value={{markedCities,setMarkedCities}}>
            <MapComponent/>     
            <Dashboard/>
   </MarkedCityContext.Provider>
  </LatLngContext.Provider>
  
  );
}

export default App;
