import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { app } from '../backend'
import { getDatabase, ref, onValue } from 'firebase/database'

const Token = () => {

    const auth = getAuth(app)
    const db = getDatabase(app)

    const [userId, setUserId] = useState("")
    const [apiToken, setApiToken] = useState("")
    const [tokensLeft, setTokensLeft] = useState(null)
    const [loading, setLoading] = useState(false)
    const [inputWidth, setInputWidth] = useState(300)
    const spanRef = useRef(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid)
                console.log("User is logged in:", user)
            } else {
                window.location.href = "/login";
            }
        })
        return () => unsubscribe()
    }, [auth])

    useEffect(() => {
        if (!userId) return
        // Listen for API key
        const apiKeyRef = ref(db, `${userId}/api_key`)
        const unsubscribeApiKey = onValue(apiKeyRef, (snapshot) => {
            const apiKey = snapshot.val()
            if (apiKey) {
                setApiToken(apiKey)
            } else {
                setApiToken("")
            }
        })
        // Listen for tokens left
        const tokensLeftRef = ref(db, `${userId}/tokens_left`)
        const unsubscribeTokensLeft = onValue(tokensLeftRef, (snapshot) => {
            setTokensLeft(snapshot.val())
        })
        return () => {
            unsubscribeApiKey()
            unsubscribeTokensLeft()
        }
    }, [db, userId])

    // Adjust input width based on token length
    useEffect(() => {
        if (spanRef.current) {
            setInputWidth(spanRef.current.offsetWidth + 30) // add some padding
        }
    }, [apiToken])

    const sendRequest = async (e) => {
        e.preventDefault()
        if (!userId) {
            alert("User not authenticated.")
            return
        }
        setLoading(true)
        try {
            const response = await fetch('http://localhost:8000/generate_api_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId }),
            })
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`)
            }
            const data = await response.json()
            setApiToken(data.token || "")
            console.log(data)
        } catch (error) {
            console.error('Error:', error)
            setApiToken("")
            alert("Failed to generate API token. Please check the backend server.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <h1>Generate API Keys</h1>
            <div style={{ position: "relative", width: "100%" }}>
                <input
                    style={{
                        width: inputWidth,
                        margin: "10px",
                        transition: "width 0.2s",
                        fontFamily: "inherit",
                        fontSize: "inherit"
                    }}
                    type='text'
                    value={apiToken}
                    disabled
                    placeholder="Your API Token will appear here"
                />
                {/* Hidden span to measure text width */}
                <span
                    ref={spanRef}
                    style={{
                        position: "absolute",
                        visibility: "hidden",
                        whiteSpace: "pre",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        padding: "0 10px"
                    }}
                >
                    {apiToken || "Your API Token will appear here"}
                </span>
            </div>
            {tokensLeft !== null && (
                <div style={{ marginBottom: "10px" }}>
                    <strong>Tokens left:</strong> {tokensLeft}
                </div>
            )}
            {!apiToken && (
                <form action="#" method='POST' onSubmit={sendRequest}>
                    <button type='submit' disabled={loading}>{loading ? "Generating..." : "Generate"}</button>
                </form>
            )}
        </div>
    )
}

export default Token