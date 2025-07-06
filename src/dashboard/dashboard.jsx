import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { app } from '../backend'


const Dashboard = () => {
    const auth = getAuth(app)
    const[userId, setUserId] = useState("")

    const[amount,setAmount] = useState(0)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            
            if (user) {
                console.log("User is logged in:", user)
                setUserId(user.uid)
            } else {
                // User is signed out
                window.location.href = "/login";
            }
        })
        return () => unsubscribe()
    }, [auth])

    return (
        <div>
            <div>
                <a href="/token">API Keys</a>
            </div>
            <div>
                <input placeholder='Recharge' type='number' value={amount} onChange={(e)=>setAmount(e.target.value)}/>
                <a href={`http://localhost:8000/razorpay/pay?uid=${userId}&amount=${amount}`}>Recharge</a>
            </div>
            <div>
                <a href="/logs">Logs</a>
            </div>
        </div>
    )
}

export default Dashboard