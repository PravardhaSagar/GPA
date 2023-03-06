import React, { useEffect, useState } from "react"
import '../../App.css'
import dog from '../../assets/images/bg.png'
// src/assets/images/bg.png
import axios from 'axios'

//Make a alternate property while in image tag
 function GridImage(prop){
    const [Image,setImage]=useState([
        dog,dog,dog,dog,dog,
        dog, dog,dog,dog,
    ])
    useEffect(()=>
    {
        // console.log(prop.userName)
        let a= {username: prop.userName}
        // console.log(prop.userName)
        // console.log("a is"+a.username)
        if(a.username){
            // console.log("inside if and a is "+a.username)
            axios.post('http://localhost:750/',a).then((res)=>{
                console.log(res.data)
                setImage(res.data)
                console.log(Image)
            })
        }     
    },[prop]);

    // let x=Math.floor(Math.random() * (2000 - 1000 + 1) ) + 1000;
  
       return( 
        <div className='mid'>
            <div className ="row">
                <div className ="column">
                    <img src={Image[0]}></img>
                    
                </div>   
                <div className ="column">
                    <img src={Image[1]}></img>
                    
                </div>   
                <div className ="column">
                    <img src={Image[2]}></img>
                </div>   
            </div>
            <div className ="row">
                <div className ="column">
                    <img src={Image[3]}></img>
                </div>   
                <div className ="column">
                    <img src={Image[4]}></img>
                </div>   
                <div className ="column">
                    <img src={Image[5]}></img>
                </div>   
            </div>
            <div className ="row">
                <div className ="column">
                    <img src={Image[6]}></img>
                </div>   
                <div className ="column">
                    <img src={Image[7]}></img>
                </div>   
                <div className ="column">
                    <img src={Image[8]}></img>
                </div>   
            </div>

        </div>
       );
}
export default GridImage;