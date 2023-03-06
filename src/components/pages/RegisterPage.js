import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


import '../../App.css'

export default function SignUpPage() {
    const navigate=useNavigate();
    let userName, emailAddress, password;

    const handleClickEvent=(e)=>{
        e.preventDefault();
        let a={
            userName:userName,
            emailAddress:emailAddress,
            password:password
        }
        axios.post('http://localhost:750/register',a).then((res)=>{
                console.log(res.data)
                if(res.data.user){
                    localStorage.setItem('token', res.data.user)
                    //Navigate to Select Password.js
                    navigate('/selectpassword',{state:{userName:res.data.user}})
                    //also sent the prop of username 
                }
                else{
                    alert("userName Already Exists")

                }
            })  
        //check if the username exists and send back a flag
        //if the does not exists then navigate to other page where a gpa can be set pass username as a prop
    }

    return (
        <div className="text-center m-5-auto">
            <h2>Join us</h2>
            <h5>Create your personal account</h5>
            <form onSubmit={(e)=>{handleClickEvent(e)}}>
                <p>
                    <label>Username</label><br/>
                    <input type="text" name="first_name" required onChange={(e)=>{userName=e.target.value}}/>
                </p>
                <p>
                    <label>Email address</label><br/>
                    <input type="email" name="email" required onChange={(e)=>{emailAddress=e.target.value}}/>
                </p>
                <p>
                    <label>Password</label><br/>
                    <input type="password" name="password" required onChange={(e)=>{password=e.target.value}}/>
                </p>
                <p>
                    <input type="checkbox" name="checkbox" id="checkbox" required /> <span>I agree all statements in <a href="https://google.com" target="_blank" rel="noopener noreferrer">terms of service</a></span>.
                </p>
                <p>
                    <button id="sub_btn" type="submit">Register</button>
                </p>
            </form>
            <footer>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    )

}
