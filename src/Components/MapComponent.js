import React,{useState,useEffect,useContext} from 'react';
import {MapContainer,TileLayer,Popup,Marker} from 'react-leaflet'
import '../App.css';
import LocationMarker from '../Components/LocationMarker'
import cityReducer from '../Context/reducer'
import {Polyline} from 'react-leaflet'
import LatLngContext from '../Context/LatLngContext'
const MapComponent = ()=> {
    const {latlngs,setLatlngs} = useContext(LatLngContext);

    return (
        <div id="mapid">
            <MapContainer center={[18.062314, 73.652341]} zoom={5} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker/>
                {latlngs.length>0 && latlngs.map(({from_lat, from_long, to_lat, to_long})=>{
            return <Polyline positions={[
                [from_lat, from_long], [to_lat, to_long],
            ]}>

            </Polyline> 
      })
    }
            </MapContainer>
        </div>
    )
}

export default MapComponent;