import { FaCheck } from "react-icons/fa";
import { IoIosReturnRight } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router";
import { useRef } from "react";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { updatePassword } from "firebase/auth";

export default function UserSettings() {
    const nameRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [ userData, setUserData ] = useState();
    const [ errorDisplay, setErrorDisplay ] = useState();

    const { user, loading } = useAuth();
    useEffect(()  => {
        if(!user && !loading) {
            navigate("/signup");
        }
        else if(user && !loading) {
            getUserData();
        }
    }, [user])

    const getUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if(docSnap.exists()) {
            setUserData(docSnap.data());
        }
        else {
            setErrorDisplay("something went wrong! please try again.");
        }
    }

    const changeName = async () => {
        if(!nameRef.current.value) {
            setErrorDisplay("fill the input area to change your name!")
        }

        const userRef = doc(db, "users", user.uid);
        try {
            setErrorDisplay();
            await updateDoc(userRef, {
                name: nameRef.current.value
            })
            console.log("name changed for: ", user.uid);
            nameRef.current.value = "";
            document.getElementById("updated").classList.toggle("visibleUpdated");
            setTimeout(() => document.getElementById("updated").classList.toggle("visibleUpdated"), 3000);
        }
        catch(error) {
            console.log(error);
        }
    }

    const changeUsername = async () => {
        if(!usernameRef.current.value) {
            setErrorDisplay("fill the input area to change your username!")
        }

        const usernameDocRef = doc(db, "usernames", usernameRef.current.value);
        const docSnap = await getDoc(usernameDocRef);

        if(docSnap.exists()) {
            return setErrorDisplay("username taken!");
        }

        const userRef = doc(db, "users", user.uid);
        try {
            setErrorDisplay();
            await setDoc(usernameDocRef, {
                uid: user.uid,
                createdAt: userData.createdAt,
                updatedAt: serverTimestamp()
            })
            await deleteDoc(doc(db, "usernames", userData.username));
            await updateDoc(userRef, {
                username: usernameRef.current.value
            })
            console.log("username changed for: ", user.uid);
            usernameRef.current.value = "";
            document.getElementById("updated").classList.toggle("visibleUpdated");
            setTimeout(() => document.getElementById("updated").classList.toggle("visibleUpdated"), 3000);
        }
        catch(error) {
            console.log(error);
        }
    }
    
    const changePassword = async () => {
        if(passwordRef.current.value !== confirmPasswordRef.current.value) {
            return setErrorDisplay("passwords do not match!");
        }

        if(!passwordRef.current.value && !confirmPasswordRef.current.value) {
            return setErrorDisplay("fill both input areas to change your password!");
        }

        try {
            setErrorDisplay();
            await updatePassword(user, passwordRef.current.value);
            console.log("password changed succesfully for: ", user.uid);
            passwordRef.current.value = "";
            confirmPasswordRef.current.value = "";
            document.getElementById("updated").classList.toggle("visibleUpdated");
            setTimeout(() => document.getElementById("updated").classList.toggle("visibleUpdated"), 3000);
        }
        catch(error) {
            console.log(error);
            switch(error.code) {
                case "auth/requires-recent-login":
                    setErrorDisplay("you have to sign in recently to change your password! try signing in again.")
                    break;
                default:
                    setErrorDisplay("something went wrong!")
                    break;
            }
        }
    }

    if(loading) return <p className="absolute top-1/2 left-1/2 transform -translate-1/2 text-light-text dark:text-dark-text font-text text-lg md:text-xl lg:text-2xl">loading...</p>

    return(
        <>
            <div className="flex flex-col gap-y-4 md:gap-y-5 lg:gap-y-6 text-light-text dark:text-dark-text font-text w-9/10 md:w-19/20 mx-auto">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">user settings</h1>
                {errorDisplay && <p className="text-center lg:col-start-1 lg:col-end-3 text-error-red lg:text-xl">{errorDisplay} </p>}
                <h2 className="text-xl md:text-2xl lg:text-3xl">change your name</h2>
                <div className="flex gap-x-2">
                    <input ref={nameRef} type="text" placeholder="enter your new name" className="settingsInput" />
                    <button onClick={changeName} className="homeBtn">
                        <FaCheck />
                    </button>
                </div>
                <h2 className="text-xl md:text-2xl lg:text-3xl">change your username</h2>
                <div className="flex gap-x-2">
                    <input ref={usernameRef} type="text" placeholder="enter your new username" className="settingsInput" />
                    <button onClick={changeUsername} className="homeBtn">
                        <FaCheck />
                    </button>
                </div>
                <h2 className="text-xl md:text-2xl lg:text-3xl">change your password</h2>
                <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-2 gap-y-3 md:gap-y-4">
                    <input ref={passwordRef} type="password" placeholder="enter your new password" className="input" />
                    <div className="flex gap-x-2">
                        <input ref={confirmPasswordRef} type="password" placeholder="confirm your new password" className="input" />
                        <button onClick={changePassword} className="homeBtn">
                            <FaCheck />
                        </button>
                    </div>
                </div>
                <Link to="/profile" className="border-b-2 border-transparent hover:border-light-text/80 dark:hover:border-dark-text/80 w-fit text-light-text/80 dark:text-dark-text/80 text-sm md:text-base flex gap-x-1 items-center">
                    <IoIosReturnRight /> return to profile
                </Link>
            </div>
            <div id="updated" className="absolute bottom-0 left-[-100%] transform -translate-x-1/2 
                                         text-light-text dark:text-dark-text font-text
                                         bg-light-third-background dark:bg-dark-third-background
                                         w-9/10 md:w-4/5 lg:w-3/5 mx-auto p-4 md:p-5 lg:p-6 my-4 md:my-5 lg:my-6
                                         md:text-lg lg:text-xl rounded-2xl md:rounded-3xl lg:rounded-4xl
                                         flex items-center justify-center gap-x-2
                                         transition-all">
                your settings are updated! <FaCheckCircle className="text-update-green bg-light-text dark:bg-dark-text rounded-[50%]" />
            </div>
        </>
    )
}