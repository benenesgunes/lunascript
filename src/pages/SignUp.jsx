import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { Link } from "react-router";
import { auth, db } from "../config/firebase";
import { doc, serverTimestamp, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";

export default function SignUp() {
    const nameRef = useRef();
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [ errorDisplay, setErrorDisplay ] = useState();
    const [ isLoading, setIsLoading ] = useState(false);
    const navigate = useNavigate();

    const { user, loading } = useAuth();
    
    useEffect(()  => {
        if(user && !loading) {
            navigate("/");
        }
    }, [user])

    const handleSignUp = async () => {
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const passwordConfirm = passwordConfirmRef.current.value;

        if(password !== passwordConfirm) {
            return setErrorDisplay("Passwords do not match!");
        }

        if(!email && !username && !password && !passwordConfirm) {
            return setErrorDisplay("Make sure to fill everything!");
        }

        // checks if the username is taken
        const usernameDocRef = doc(db, "usernames", username);
        const docSnap = await getDoc(usernameDocRef);

        if(docSnap.exists()) {
            return setErrorDisplay("Username taken!");
        }

        try {
            setErrorDisplay();
            setIsLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("user signed up, uid: ", auth.currentUser.uid);

            try {
                const usersDocRef = doc(db, "users", auth.currentUser.uid);

                // adds the user credential to the database
                await setDoc(usersDocRef, {
                    name: name,
                    username: username,
                    email: email,
                    createdAt: serverTimestamp()
                })

                // adds the username to the database
                await setDoc(usernameDocRef, {
                    uid: auth.currentUser.uid,
                    createdAt: serverTimestamp()
                })
                navigate("/");
            }
            catch(dbError) {
                console.log(dbError);
            }
        }
        catch(authError) {
            console.log(authError);
            switch(authError.code) {
                case "auth/email-already-in-use":
                    setErrorDisplay("E-mail already in use!");
                    break;
                case "auth/weak-password":
                    setErrorDisplay("Password should be at least 6 characters!");
                    break;
                case "auth/invalid-email":
                    setErrorDisplay("Make sure you enter a valid e-mail!");
                    break;
                case "auth/missing-password":
                    setErrorDisplay("Missing password!");
                    break;
                case "auth/missing-email":
                    setErrorDisplay("Missing e-mail!");
                    break;
                default:
                    setErrorDisplay("Something went wrong!", {authError});
            }
        }
        setIsLoading(false);
    }

    if(isLoading) return <p className="absolute top-1/2 left-1/2 transform -translate-1/2 text-light-text dark:text-dark-text font-text text-lg md:text-xl lg:text-2xl">loading...</p>

    return(
        <div className="text-light-text dark:text-dark-text font-text
                        w-9/10 md:w-3/5 xl:w-1/2 p-4 md:p-6 lg:p-8 
                        mt-[15%] md:mt-[10%] lg:mt-[4%] mx-auto
                        bg-light-secondary-background dark:bg-dark-secondary-background rounded-2xl
                        flex flex-col items-center lg:grid lg:grid-cols-2 lg:justify-items-center gap-y-5 md:gap-y-7 lg:gap-y-10 lg:gap-x-10">
            <h1 className="text-xl md:text-3xl lg:text-3xl font-bold lg:col-start-1 lg:col-end-3">
                sign up
            </h1>
            {errorDisplay && <p className="text-center lg:col-start-1 lg:col-end-3 text-error-red lg:text-xl">{errorDisplay} </p>}
            <input ref={nameRef} className="input lg:col-start-1 lg:col-end-3" type="text" placeholder="enter your name" />
            <input ref={usernameRef} className="input" type="text" placeholder="enter your username" />
            <input ref={emailRef} className="input" type="email" placeholder="enter your e-mail" />
            <input ref={passwordRef} className="input" type="password" placeholder="enter your password" />
            <input ref={passwordConfirmRef} className="input" type="password" placeholder="confirm your password" />
            <button onClick={handleSignUp} className="homeBtn lg:col-start-1 lg:col-end-3">
                sign up
            </button>
            <Link to="/signin" className="md:text-lg lg:text-xl lg:col-start-1 lg:col-end-3 border-b-2 border-transparent hover:border-light-text dark:hover:border-dark-text">
                already signed up? sign in here.
            </Link>
        </div>
    )
}