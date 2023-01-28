import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import '../../App.css'
import { useState } from 'react'
// import BackgroundImage from '../../assets/images/bg.png'    

export default function LandingPage() {
    const [count,setCount]=useState(0)
    function TakeImage(){
        console.log('Triggered')

        // axios.post('http://localhost:750/',{
        //     body:"nothing here run"
        // })
        axios.get('http://localhost:750/').then(
            (res)=>{
                console.log(res)
                setCount(res.data)
            }
        )
    }
    function renderElement(){
        if (count!==0)
        {       let add='http://localhost:750/'+String(count)
                return(
                <img src="http://localhost:750/bg.png"/>
                )
        }
            
        }
    
    return (
        <header style={ HeaderStyle }>
            <button onClick={TakeImage}>here</button>
            {renderElement()}
            <h1 className="main-title text-center">login / register page</h1>
            <p className="main-para text-center">Graphical Password Authentication</p>
            <div className="buttons text-center">
                <Link to="/login">
                    <button className="primary-button">log in</button>
                </Link>
                <Link to="/register">
                    <button className="primary-button" id="reg_btn"><span>register </span></button>
                </Link>

            </div>
        </header>
    )
}

const HeaderStyle = {
    width: "100%",
    height: "100vh"
}