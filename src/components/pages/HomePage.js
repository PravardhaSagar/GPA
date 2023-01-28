import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GridImage from './GridImage.js'
// import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function HomePage() {
    const [userName,setName]=useState('')
    // const [searchparams] = useSearchParams ();
    // console.log(searchparams.get("userName"));
    const location = useLocation();
    useEffect(()=>{
        setName(location.state.userName)
    })
    // setName(location.state.userName);
    // return (
    //     <div className="text-center">
    //         <h1 className="main-title home-page-title">welcome to our app</h1>
    //         <Link to="/">
    //             <button className="primary-button">Log out</button>
    //         </Link>
    //     </div>
    // )
    return(
        <div className="text-center m-5-auto">
        <GridImage userName={userName}/>
        <form action="/home">
            <p>
                <label>Enter the Passcode</label><br/>
                <input type="number" name="first_name" required />
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
