import React from 'react';
import './App.css';
import {useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './styles/AdminLogin.css'
// import './BusDetails';
import User from './User';
import Registration from './Registration';
import Admin from './admin';
import 'bootstrap/dist/css/bootstrap.min.css';

//Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider , signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const auth = getAuth();
const provider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  return (
    <Router>

      <div className="App">
        <div className="Heading"> 
          {/* <h1> Bus Booking System</h1> */}
          <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
              <span className="navbar-brand mb-0 h1">Bus Booking System</span>
            </div>
          </nav>
        </div>
        <Routes>
          {/* <Route path='/' element={user == null ? <Login/>: <User user = {user}/>}> </Route> */}
          <Route path='/' element={user == null ? <Login/>: user.email === "ayushkg@iitbhilai.ac.in" ? <Admin admin = {user}/> : <User user = {user}/>}> </Route>
          <Route path='/Register' element={<Registration/>}/>
        </Routes>
        
      </div>
    </Router>
  );
}

function Login(){
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      console.log("User Signed In", result);

    })
    .catch((error) => {
      console.error("Error Signing In", error);
    });
  };
  const { register, handleSubmit } = useForm();
  const handleEmailLogin = (data) => {
    // console.log(data);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, data.username, data.password)
    .then( (userCredential) => {
      const user = userCredential.user;
    })
    .catch( (error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  };

  return ( 
    <div className="Logins">
        <form onSubmit={handleSubmit(handleEmailLogin)}> 
            <h2>Login</h2>
            <label for="username">Username:</label>
            <input type="text" {...register('username')} required />
            <label for="password">Password:</label>
            <input type="password" {...register('password')} required />
            <input type="submit" value="Login"></input>
            <input type="button" value="Google" onClick={handleGoogleLogin}></input>
            <Link to={"/Register"}>
            <input type="button" value="Register"/>
            </Link>
        </form>
    </div>
  )
} 


signInWithPopup(auth, provider)
  .then((result) => {
    console.log("signInwithPopup");
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    // const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });


export default App;
