import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import { isExpired, decodeToken } from "react-jwt"


import CatG from '/Users/pravardhasagar/Desktop/Graphical Password Authentication/gpa/src/Images/Grid/CatG.jpg'
import CowG from '/Users/pravardhasagar/Desktop/Graphical Password Authentication/gpa/src/Images/Grid/CowG.jpg'
import DogG from '/Users/pravardhasagar/Desktop/Graphical Password Authentication/gpa/src/Images/Grid/DogG.jpg'
import SheepG from '/Users/pravardhasagar/Desktop/Graphical Password Authentication/gpa/src/Images/Grid/SheepG.jpg'
import SpiderG from '/Users/pravardhasagar/Desktop/Graphical Password Authentication/gpa/src/Images/Grid/SpiderG.jpg'
import SquirrelG from '/Users/pravardhasagar/Desktop/Graphical Password Authentication/gpa/src/Images/Grid/SquirrelG.jpg'
import HenG from '/Users/pravardhasagar/Desktop/Graphical Password Authentication/gpa/src/Images/Grid/HenG.jpg'
import HorseG from '/Users/pravardhasagar/Desktop/Graphical Password Authentication/gpa/src/Images/Grid/HorseG.jpg'
import ElephantG from '/Users/pravardhasagar/Desktop/Graphical Password Authentication/gpa/src/Images/Grid/ElephantG.jpg'

import '../../App.css'
 
export default function GpaRegister (){
    const navigate = useNavigate();
    const [userName,setName]=useState('')
    const [sequence,setsequence]=useState([])
    const [user,setuser]=useState();
    const [display,setdisplay]=useState('')
    const location = useLocation();
    const [token,setToken]=useState('')
    useEffect(()=>{
        setName(location.state.userName)
        console.log(location.state.userName)
    },[])
    function addSequence(x){
        const a=sequence
        a.push(x)
        setsequence(a)
        console.log(sequence)
        setdisplay(sequence.toString())//role of setdisplay is still not very clear
    }
    function makePassword(event){
        event.preventDefault();
        const a={
            userName:user.userName,
            emailId:user.emailId,
            password:user.password,
            ojectSequence:sequence
        }
        console.log(a)
        console.log("Sent userName and sequence to backend makePasword")
        try{
            axios.post('http://localhost:750/makePassword',a,{
            headers: {
                'x-access-token': token,
        }}).then((res)=>{
            //response will be boolean
            if(res.status="updated"){
                alert("Account created")
            }
            else if(res.statu="created"){
                alert("Account created")
            }
            navigate('/')
            })
        }
        catch(err){
            alert(err)
        }
    }
    useEffect(() => {
		const token = localStorage.getItem('token')
        setToken(token)
        console.log(token)
		if (token) {
			const user = decodeToken(token)
            console.log(user)
			if (!user) {
				localStorage.removeItem('token')
                navigate('/');
			} else {
				setuser(user)
			}
		}
        else{
            navigate('/');
        }
	}, [])
       return( 
        <div className="text-center m-5-auto">
        <div className='mid'>
            <div className ="row">
                <div className ="column">
                <button onClick={()=>addSequence('cat')}>
                    <img src= {CatG}></img>
                </button>
                </div>   
                <div className ="column">
                <button onClick={()=>addSequence('cow')}>
                    <img src={CowG}></img>
                </button>
                </div>   
                <div className ="column">
                <button onClick={()=>addSequence('dog')}> 
                    <img src={DogG}></img>
                </button>
                </div>   
            </div>
            <div className ="row">
                <div className ="column">
                <button onClick={()=>addSequence('hen')}>
                    <img src={HenG}></img>
                </button>
                </div>   
                <div className ="column">
                <button onClick={()=>addSequence('horse')}>
                    <img src={HorseG}></img>
                </button>
                </div>   
                <div className ="column">
                <button onClick={()=>addSequence('sheep')}>
                    <img src={SheepG}></img>
                </button>
                </div>   
            </div>
            <div className ="row">
                <div className ="column">
                <button onClick={()=>addSequence('spider')}>
                    <img src={SpiderG}></img>
                </button>
                </div>   
                <div className ="column">
                    <button onClick={()=>addSequence('elephant')}>
                    <img src={ElephantG}></img>
                    </button>
                </div>   
                <div className ="column">
                    <button onClick={()=>addSequence('squirille')}>
                        <img src={SquirrelG}></img>
                    </button>
                </div>   
            </div>

        </div>
        <form onSubmit={(event)=>{makePassword(event)}}>
            <p>
                <label>Your Sequence of Objects</label><br/>
                <input type="text" value={sequence.toString()}/>
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
   
       );   
 };
