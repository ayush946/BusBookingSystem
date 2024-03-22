import React from "react";
import { useForm } from "react-hook-form";
import './styles/Registration.css'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword} from "firebase/auth";


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
const auth = getAuth(app);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
//

async function onSubmit(data) {
  console.log(data);
  try {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // Now that the user is authenticated, save data to Firestore using the user ID
    await setDoc(doc(db, 'users', user.uid), data);
    console.log('User created and data saved successfully!');
  } catch (error) {
    console.error('Error creating user:', error);
    // Handle errors appropriately, e.g., display an error message to the user
  }
}


function Registration(){
    const {register , handleSubmit} = useForm();
   
    return (
        <div className="App">
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Name"
          {...register('name', { required: true })}
        />
        <input
          type="email"
          placeholder="Email address"
          {...register('email', { required: true })}
        />
        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
        />
        <button type="submit">Register</button>
      </form>
    </div>
    )
}
export default Registration;