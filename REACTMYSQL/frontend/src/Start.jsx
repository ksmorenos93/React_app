import React, {useState} from "react";
import { Link } from 'react-router-dom' // this make the links ready to operate and navegate    The useNavigate hook returns a function that lets you navigate programmatically in the browser in response to user interactions or effects



function Start(){
    
    // return a button to the register website.
    return (
        
        <div className="bg-white p-3 rounded w-50 h-50">
            <h2>Register</h2>
        <Link to="/register" className="btn btn-default border w-300 bg-light rounded-0 text-decoration-none">Create Account</Link> 

        </div>
    )
}


export default Start