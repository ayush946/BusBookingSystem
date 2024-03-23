import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
// import './styles/searchBar.css'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, query, getDocs } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
    apiKey: "AIzaSyBRG-QlAei7eY_5sTnNuOeR5rjouSuPznA",
    authDomain: "booking-b81a1.firebaseapp.com",
    projectId: "booking-b81a1",
    storageBucket: "booking-b81a1.appspot.com",
    messagingSenderId: "984149004124",
    appId: "1:984149004124:web:397d1eea99bfd01537fb99",
    measurementId: "G-NZB0W661J8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


function SearchBar(){
    const {register, handleSubmit, reset} = useForm();
    const [buses, setBuses] = useState([]);
    
    const onSubmit = async (data) =>{
        // console.log(data);
        const dateObject = new Date(data.date);
        const userDay = dateObject.getDay();
        console.log("userDay: ",userDay);
        const q = query(collection(db, "busDetails"));
        let fetchBuses = []
        const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                if(docData.source === data.from && docData.destination === data.to && dayFind(userDay, docData)){
                    fetchBuses.push(docData);
                    console.log(dayFind(userDay, docData));
                }
            // doc.data() is never undefined for query doc snapshots
           setBuses(fetchBuses);
        });
        // const dateObject = new Date(data.date);
        // const day = dateObject.getDate();
        // console.log("Day: ", day);
        // console.log("fetchBuses: ", fetchBuses);
        // Add your logic here to handle the search
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="from">From</label>
                <input type="text" {...register("from")} required/>
                <label htmlFor="to">To</label>
                <input type="text" {...register("to")} required/>
                <label htmlFor="date">Date</label>
                <input type="date" {...register("date")} required />
                <input type="submit" value="Search" />
            </form>
            {buses.length > 0 && <button onClick={() => {
                setBuses([]);
                reset();
                } }>Clear</button> }
            {buses.map(bus => (
                <div key={bus.id}>
                    <h2>{bus.BusName}</h2>
                    <p>Source: {bus.source}</p>
                    <p>Destination: {bus.destination}</p>
                    {/* Add more details as needed */}
                </div>
            ))}
        </div>
    )
}


const dayFind = (day, docData) => {
    if (day === 0){
        return docData.Sunday;
    }
    if (day === 1){
        return docData.Monday;
    }
    if (day === 2){
        return docData.Tuesday;
    }
    if (day === 3){
        return docData.Wednesday;
    }
    if (day === 4){
        return docData.Thursday;
    }
    if (day === 5){
        return docData.Friday;
    }
    if (day === 6){
        return docData.Saturday;
    }
}

export default SearchBar;
