import React,{useState,useContext} from 'react';
import {useMapEvents,Popup,Marker} from 'react-leaflet'
import {v4} from 'uuid'
import MarkedCityContext from '../Context/MarkedCityContext'

const LocationMarker = ()=> {
  const {markedCities} = useContext(MarkedCityContext);
   const {setMarkedCities} = useContext(MarkedCityContext);
  const map = useMapEvents({
    click() {
      //map.locate();
      map.once('click', function(e) {
        
      const city = {  
            position: e.latlng,
            id: v4()
        }
    setMarkedCities(markedCities=>[...markedCities,city])
    //markedCities.push(city);
    map.flyTo(e.latlng, map.getZoom())
}
 );

    }
  })

  return  markedCities === undefined || markedCities.length === 0 ? null : (
      <div>
    {markedCities.map(item=>(
        <Marker key={item.id} position={item.position}>
      <Popup>You are here</Popup>
      
    </Marker>
    ))}
    
    </div>
  )
}
 
export default LocationMarker;