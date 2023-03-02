import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import GridImage from './GridImage.js'
// import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from 'axios'

export default function HomePage() {
    const navigate = useNavigate();
    const [userName,setName]=useState('')
    const [visible,setVisible]=useState(false)
    const [count,setCount]=useState(0)
    let pin;

    // const [searchparams] = useSearchParams ();
    // console.log(searchparams.get("userName"));
    const location = useLocation();
    useEffect(()=>{
        setName(location.state.userName)
        setVisible(true)
    },[])

    function handlePinClick(event){
        event.preventDefault();
        let a= {userName:userName,
            pin: pin}
        console.log("inside handlePinclick Pin="+pin)
        axios.post('http://localhost:750/verifyPin',a).then((res)=>{
                console.log(res.data)
                if(res.data.user){
                    localStorage.setItem('token', res.data.user)
                   console.log("Login sucsessful")
                   navigate('/dashboard');
                }
                else{
                    if(count<2){
                        setCount(count+1)
                    }
                    else{
                        console.log("Coming here")
                        navigate('/');
                    }
                }
                console.log("COUNT"+count)
            })  
    }
    if(visible){
    return(
        <div className="text-center m-5-auto">
        <GridImage userName={userName}/>
        <form onSubmit={(event)=>{handlePinClick(event)}}>
            <p>
                <label>Enter the Passcode</label><br/>
                <input type="number" name="first_name" required onChange={(e)=> {
                    // console.log(e.target.value)
                    pin=e.target.value}}/>
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
};


