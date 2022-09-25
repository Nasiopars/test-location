
import React,{useState,useEffect} from 'react';
import './App.css';
import '../node_modules/leaflet/dist/leaflet.css'
import '../node_modules/leaflet/dist/images/marker-icon.png'
import axios from 'axios';
import { MapContainer, TileLayer,Marker,Popup } from 'react-leaflet'

const API_ENDPOINT = "https://tapi.cveh.ir/v1/drivers/locations"
const API_KEY = "Bearer 93|8|5YOtJC0R6iowjJ9Q7vbkMmuqnDUGeb3jK1N"

function App() {

  const [latitude,setLatitude] = useState(35.500);
  const [longitude,setLongitude] = useState(51,500);
  const [keepTimestamp,setKeepTimestamp] = useState(null);
  const [points,setPoints] = useState([]);
 
  // convert stamp to jalali
  useEffect(()=>{
    let makeDate = new Date(keepTimestamp);
    let persianDate = makeDate.toLocaleDateString('fa-IR',{year:'numeric',month:'2-digit',day:'2-digit'});
    let makeTime = makeDate.toLocaleTimeString([],{hour: '2-digit', minute:'2-digit',second:'2-digit'})
    console.log(persianDate,makeTime);
  },[keepTimestamp]);

// check support
  let resultSupport = ""
  if (navigator.geolocation) {
    console.log("GeoLocation is Available!");
    resultSupport = "GeoLocation is Available!"
  } else {
    console.log("Sorry Not available!");
    resultSupport = "Sorry Not available!"
  }

  //get current position
  const getLocation = ()=> {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setKeepTimestamp(position.timestamp)

        let newPoint = {"lat":position.coords.latitude,"lon":position.coords.longitude};
        setPoints(points => [...points,newPoint]);
        console.log(points)
        
      });
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getLocation();
    },3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetLocation = async(e) =>{
    e.preventDefault();
    getLocation();
    await axios.post(API_ENDPOINT, {
      "Authorization":API_KEY,
      "locations":[
        {
          "bearing":null,
          "id":0,
          "lat":latitude,
          "lid":null,
          "lon":longitude,
          "timestamp":keepTimestamp,
        }
      ]
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

let report = [latitude,longitude] 
console.log(report)
console.log(keepTimestamp)

  return (
    <div className="App">
      <div className='customControlBox'>
        <p>{resultSupport}</p>
    
        <button onClick={handleGetLocation}>current Loc</button>
      </div>

  
      <MapContainer 
      
        style={{width:'100%',height:'100vh'}} 
        center={[latitude,longitude]}
        zoom={15} 
        scrollWheelZoom={true}
        zoomControl={true}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude,longitude]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
  
      </MapContainer>

    </div>
  );
}

export default App;
