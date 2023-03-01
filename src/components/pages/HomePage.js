import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GridImage from './GridImage.js'
// import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from 'axios'

export default function HomePage() {
    const [pin,setPin]=useState('')
    const [userName,setName]=useState('')
    const [visible,setVisible]=useState(false)
    let x;

    // const [searchparams] = useSearchParams ();
    // console.log(searchparams.get("userName"));
    const location = useLocation();
    useEffect(()=>{
        setName(location.state.userName)
       setVisible(true)
    })

    function handlePinClick(event){
        event.preventDefault();
        let a= {userName:userName,
            pinNum: x}
        console.log("inside handlePinclick Pin="+x)
        axios.post('http://localhost:750/verifyPin',a).then((res)=>{
                // console.log(res.data)
                // setCount(res.data)
                console.log("recieved Pin number from server"+res.data)
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
                    x=e.target.value}}/>
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


