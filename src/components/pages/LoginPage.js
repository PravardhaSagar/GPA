import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { createSearchParams, useNavigate } from "react-router-dom";
import '../../App.css'

export default function SignInPage() {
    const navigate = useNavigate();
    const [username,setName]=useState('')
    const handleChange =(e)=>{
        console.log(e.target.value);
        setName(e.target.value);
      }
      
    const handleClick=(event) => {
        event.preventDefault();
        console.log(username+" passed to home")
        navigate('/home',{state:{userName:username}});
    }
    return (
        <div className="text-center m-5-auto">
            <h2>Sign in to us</h2>
            <form onSubmit={(event)=>{handleClick(event)}}>
                <p>
                    <label>Username or email address</label><br/>
                    <input type="text" name="first_name" required onChange={(e)=> {handleChange(e)}}/>
                </p>
                <p>
                    <button id="sub_btn" type="submit">Login</button>
                </p>
            </form>
            <footer>
                <p>First time? <Link to="/register">Create an account</Link>.</p>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    )
}
