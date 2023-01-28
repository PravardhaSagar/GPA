import React, { useEffect, useState } from "react"
import '../../App.css'
import dog from '../../assets/images/bg.png'
// src/assets/images/bg.png
import elephant from '../../Images/elephant/1000.jpg'
import horse from '../../Images/horse/1000.jpg'
import cat	from '../../Images/cat/1000.jpg'
import cow from '../../Images/cow/1000.jpg'
import sheep from '../../Images/sheep/1000.jpg'
import squirrele from '../../Images/squirille/1000.jpg'
import hen from '../../Images/hen/1000.jpg'
import spider from '../../Images/spider/1000.jpg'
import axios from 'axios'


 function GridImage(prop){
    const [count,setCount]=useState([
        dog,dog,dog,dog,dog,
        dog, dog,dog,dog,
    ])
    useEffect(()=>
    {
        // console.log(prop.userName)
        let a= {username: prop.userName}
        console.log(prop.userName)
        console.log("a is"+a.username)
        if(a.username){
            // console.log("inside if and a is "+a.username)
            axios.post('http://localhost:750/',a).then((res)=>{
                // console.log(res.data)
                setCount(res.data)
                console.log(count)
            })
        }     
    },[prop]);

    // let x=Math.floor(Math.random() * (2000 - 1000 + 1) ) + 1000;
  
       return( 
        <div className='mid'>
            <div className ="row">
                <div className ="column">
                    <img src={count[0]}></img>
                    
                </div>   
                <div className ="column">
                    <img src={count[1]}></img>
                    
                </div>   
                <div className ="column">
                    <img src={count[2]}></img>
                </div>   
            </div>
            <div className ="row">
                <div className ="column">
                    <img src={count[3]}></img>
                </div>   
                <div className ="column">
                    <img src={count[4]}></img>
                </div>   
                <div className ="column">
                    <img src={count[5]}></img>
                </div>   
            </div>
            <div className ="row">
                <div className ="column">
                    <img src={count[6]}></img>
                </div>   
                <div className ="column">
                    <img src={count[7]}></img>
                </div>   
                <div className ="column">
                    <img src={count[8]}></img>
                </div>   
            </div>

        </div>
       );
}
export default GridImage;