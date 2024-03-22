import React from "react";
import { useState, useEffect } from "react";
import {useForm} from "react-hook-form";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc, addDoc, collection , getDocs, deleteDoc} from "firebase/firestore"; 
import BusView from "./busView";

const firebaseConfig = {
    apiKey: "AIzaSyBRG-QlAei7eY_5sTnNuOeR5rjouSuPznA",
    authDomain: "booking-b81a1.firebaseapp.com",
    projectId: "booking-b81a1",
    storageBucket: "booking-b81a1.appspot.com",
    messagingSenderId: "984149004124",
    appId: "1:984149004124:web:397d1eea99bfd01537fb99",
    measurementId: "G-NZB0W661J8"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
  

function Admin() {
    const [addBus, setAddBus] = useState(false);
    const [showBus, setShowBus] = useState(false);
  
    const logout = async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        console.log("Sign-out successful.");
      } catch (error) {
        console.error("An error happened during sign out:", error);
      }
    };
  
    return (
      <div>
        <h1>Welcome</h1>
        <button onClick={() => {
            setAddBus(true);
            setShowBus(false);
        } }>Add Buses</button>
        <button onClick={() => {
            setShowBus(true);
            setAddBus(false);
            }}>Show Buses</button>
        <button onClick={logout}>Log Out</button>
        {addBus && <AddBuses />}
        {addBus && <button onClick={() => setAddBus(false)}>Close</button>}
        {showBus && <ShowBuses />}
        {showBus && <button onClick={() => setShowBus(false)}>Close</button>}
      </div>
    );
  }
  

  function Matrix(rows, cols){
    let matrix = [];
    for(let i = 0; i<rows; i++){
        let row = [];
        for(let j = 0; j<cols; j++){
            row.push(false);
        }
        matrix.push(row);
    }
    return matrix;
  }

  function AddBuses(){
    const {register, handleSubmit, reset} = useForm({
        defaultValues:{
            currentOccupancy: 0,
        }
    });
    
    const onSubmit = async (data) =>{
        let busMatrix = Matrix(data.length , data.width);
        data.busMatrix = JSON.stringify(busMatrix);
        console.log(data);
        try{
            await addDoc(collection(db, 'busDetails'), data);
            console.log("successfuly");
            reset();
        }catch (error){
            console.log("failed: ",error);
        }
    }
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return(
        <form onSubmit={handleSubmit(onSubmit)}>
        <label for="BusName">Bus Name: </label>
        <input type = "text" {...register("BusName")} required />
        <label for="TotalNumOfSeats">Number of Seats</label>
        <input type ="number" {...register("TotalNumOfSeats")} required />
        <label for="currentOccupancy"> current Occupancy</label>
        <input type ="number" {...register("currentOccupancy")} required />
        {/* <label for="DaysOfOperation" >Days of Operation</label> */}
        <label for="source">Source</label>
        <input type ="text" {...register("source")} required />
        <label for="destination">Destination</label>
        <input type ="text" {...register("destination")} required />
        <label> <b>Enter Bus Dimensions</b></label>
        <br></br>
        <label for="width">Width</label>
        <input type="number" {...register("width")} required />
        <label for="length">Length</label>
        <input type="number" {...register("length")} required />
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <h3>Available days of Operation</h3>
          {daysOfWeek.map((day, index) => (
            <div key={index} style={{ marginRight: '10px' }}>
              <label htmlFor={day}>{day}</label>
              <input type='checkbox' {...register(day)} />
            </div>
          ))}
        </div>
        <input type="submit"/>
    </form>
    )
}



function DataCard({ data , onDelete}) {
  const [showBusView, setShowBusView] = useState(false);

    const deleteBus = async() => {
        try{
            await deleteDoc(doc(db,"busDetails", data.id));
            onDelete(data.id);
        }catch(error){
            console.error("Error removing document: ", error);
        }
    };
    
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const operationalDays = daysOfWeek.filter(day => data[day]);

    const handleBusView = () => {
      console.log(data);
      setShowBusView(true);
      // <BusView busData={data}/>;
    }

    return (
      <div style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
        <h2>{data.BusName}</h2>
        <p>Number of Seats: {data.TotalNumOfSeats}</p>
        <p> Current Occupancy: {data.currentOccupancy}</p>
        <p>Source: {data.source}</p>
        <p>Destination: {data.destination}</p>
        <p>Operational Days: {operationalDays.join(', ')}</p>
        {showBusView &&  <BusView busData={data}/>}
        {showBusView && <button onClick={() => setShowBusView(false)}>Close View</button>}
        <button onClick={handleBusView}>View Seats</button>
        <button onClick={deleteBus}>Delete</button>
      </div>
    );
}


function ShowBuses(){

    const [busData, setBusData] = useState([]);
    
    const handleDelete = (id) => {
        setBusData(busData.filter(bus => bus.id !== id));
    }

    useEffect( () => {
        const  fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "busDetails"));
            setBusData(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchData();
    }, [])
    return (
        <div> 
            {busData.map((data, index) => (
                <DataCard key={index} data= {data} onDelete={handleDelete}/>
            ))}
        </div>
    )
}

export default Admin;