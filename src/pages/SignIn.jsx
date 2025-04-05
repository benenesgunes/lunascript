import { Link, useNavigate } from "react-router"
import { FaGoogle } from "react-icons/fa6";
import useAuth from "../hooks/useAuth";
import { useRef } from "react";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useEffect } from "react";

export default function SignIn() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(()  => {
        if(user && !loading) {
            navigate("/");
        }
    }, [user])

    const [ errorDisplay, setErrorDisplay ] = useState();
    const [ isLoading, setIsLoading ] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSignIn = async () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {
            setErrorDisplay();
            await signInWithEmailAndPassword(auth, email, password);
            console.log("user signed in, uid: ", auth.currentUser.uid);
            setIsLoading(true);
            navigate("/");
        }
        catch(error) {
            console.log(error);
            if(error.code === "auth/invalid-credential") {
                setErrorDisplay("make sure your e-mail and password are correct!")
            }
        }
        setIsLoading(false);
    }

    if(isLoading) return <p className="absolute top-1/2 left-1/2 transform -translate-1/2 text-light-text dark:text-dark-text font-text text-lg md:text-xl lg:text-2xl">loading...</p>

    return(
        <div className="text-light-text dark:text-dark-text font-text
                        w-9/10 md:w-3/5 xl:w-1/2 p-4 md:p-6 lg:p-8 
                        mt-[20%] md:mt-[10%] lg:mt-[4%] mx-auto
                        bg-light-secondary-background dark:bg-dark-secondary-background rounded-2xl
                        flex flex-col items-center gap-y-5 md:gap-y-7 lg:gap-y-10">
            <h1 className="text-xl md:text-3xl lg:text-3xl font-bold lg:col-start-1 lg:col-end-3">
                sign in
            </h1>
            {errorDisplay && <p className="text-center lg:col-start-1 lg:col-end-3 text-error-red lg:text-xl">{errorDisplay} </p>}
            <input ref={emailRef} className="input" type="email" placeholder="enter your e-mail" />
            <input ref={passwordRef} className="input" type="password" placeholder="enter your password" />
            <button onClick={handleSignIn} className="homeBtn lg:col-start-1 lg:col-end-3">
                sign in
            </button>
            <Link to="/signup" className="md:text-lg lg:text-xl lg:col-start-1 lg:col-end-3 border-b-2 border-transparent hover:border-light-text dark:hover:border-dark-text">
                don't have an account? sign up here.
            </Link>
        </div>
    )
}