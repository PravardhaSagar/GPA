import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { isExpired, decodeToken } from "react-jwt"

import '../../App.css'

export default function Dashboard(){
    const navigate = useNavigate();

	const [quote, setQuote] = useState('')
	const [tempQuote, setTempQuote] = useState('')

	async function populateQuote() {
        var x= localStorage.getItem('token')
		const req = await fetch('http://localhost:750/dashboard', {
			headers: {
				'x-access-token': x,
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
			setQuote(data.quote)
		} else {
			alert(data.error)
		}
	}

	useEffect(() => {
		const token = localStorage.getItem('token')
        console.log(token)
		if (token) {
			const user = decodeToken(token)
            console.log(user)
			if (!user) {
				localStorage.removeItem('token')
                navigate('/');
			} else {
				populateQuote()
			}
		}
        else{
            navigate('/');
        }
	}, [])

	async function updateQuote(event) {
		event.preventDefault()
        console.log("Update quote Entered")
        event.preventDefault()

		const req = await fetch('http://localhost:750/dashboard', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				quote: tempQuote,
			}),
		})

		const data = await req.json()
        console.log(data)
		if (data.status === 'ok') {
			setQuote(tempQuote)
			setTempQuote('')
		} else {
			alert(data.error)
		}
	}
    function logout(){
        localStorage.removeItem('token')
        navigate('/');
    }

	return (
		<div>
			<h1>Your quote: {quote || 'No quote found'}</h1>
			<form onSubmit={updateQuote}>
				<input
					type="text"
					placeholder="Quote"
					value={tempQuote}
					onChange={(e) => setTempQuote(e.target.value)}
				/>
				<input type="submit" value="Update quote" />
			</form>
            <button onClick={logout}>Logout</button>
    	</div>
	)
}
