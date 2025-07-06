import React, { useEffect } from 'react'
import { app } from '../backend'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from "firebase/auth";


const Login = () => {

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                window.location.href = "/dashboard";
            } else {
                console.log("No user is logged in");
            }
        });
        return () => unsubscribe();
    }, [auth]);

    const googleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            // Popup failed (maybe blocked), suggest redirect
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
                alert("Popup blocked. Trying redirect sign-in...");
                signInWithRedirect(auth, provider);
            } else {
                console.error("Google Sign-In Error:", error);
                alert("Google Sign-In failed. Please try again.");
            }
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <button onClick={googleSignIn}>Sign In With Google</button>
        </div>
    );
}

export default Login