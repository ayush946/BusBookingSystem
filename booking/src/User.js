import React from "react";
import { getAuth, signOut } from "firebase/auth";
import SearchBar from "./searchBar";
import 'bootstrap/dist/css/bootstrap.min.css';


const User = ({user}) => {
    const logout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    };
    return (
        <div>
            <nav class="navbar bg-body-tertiary">
                <div class="container-fluid">
                <button onClick= {logout}> LogOut</button>
                </div>
            </nav>
            {/* {!user && "Login Failed!"}
            <h1>{user && "Welcome"}</h1>
            {user && user.displayName}
            {user && user.email} */}
            <SearchBar/>
        </div>
    )
}

export default User;