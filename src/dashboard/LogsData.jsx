import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { app } from '../backend' // Make sure db is your initialized database instance
import { ref, onValue, getDatabase } from 'firebase/database' // Import for Realtime Database

const LogsData = () => {
    const auth = getAuth(app)
    const [userId, setUserId] = useState("")
    const [results, setResults] = useState([])
    const db = getDatabase(app)
    

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

    useEffect(() => {
        if (!userId) return
        const resultsRef = ref(db, `${userId}/results`)
        const unsubscribe = onValue(resultsRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                // Convert object to array
                const resultsArray = Object.values(data)
                console.log("Results:", resultsArray)
                setResults(resultsArray)
            } else {
                setResults([])
            }
        })
        return () => unsubscribe()
    }, [userId])

    return (
        <div>
            <h2>LogsData</h2>
            <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
    )
}

export default LogsData