import { Link } from "react-router"
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export default function DreamJournal() {
    const [ errorDisplay, setErrorDisplay ] = useState();
    const navigate = useNavigate();
    const dreamRef = useRef();
    const [ date, setDate ] = useState();
    const [ isLoading, setIsLoading ] = useState(false);
    
    const { user, loading } = useAuth();
    
    useEffect(()  => {
        if(!user && !loading) {
            navigate("/signup");
        }
    }, [user])

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    
    const parseInterpretation = (aiResponse) => {
        const sections = aiResponse.split(/\*\*[\w\s]+ Interpretation:\*\*/g).map(s => s.trim());
        return {
            freudian: sections[1] || "No interpretation found.",
            jungian: sections[2] || "No interpretation found.",
            cultural: sections[3] || "No interpretation found."
        };
    }

    const fetchInterpretation = async () => {
        try {
            const dream = dreamRef.current.value;

            if(dream.length < 20) {
                return setErrorDisplay("your dream must be above 20 characters");
            } 

            if(!date) {
                return setErrorDisplay("make sure you enter the date of the dream!");
            }

            setIsLoading(true);
            
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are a dream interpretation expert specializing in three perspectives:
                            1. Freudian (psychoanalytic)
                            2. Jungian (archetypal & symbolic)
                            3. Cultural (common interpretations across different societies).

                            First, determine if the following text describes a dream. A dream typically includes events, emotions, and symbols experienced during sleep.

                            If the text is **not a dream**, respond with:  
                            **"Invalid Input: Please enter a dream description."**

                            Otherwise, analyze the given the following dream:
                            "${dream}"

                            Provide interpretations in this exact format:

                            **Freudian Interpretation:**
                            (Your analysis here)

                            **Jungian Interpretation:**
                            (Your analysis here)

                            **Cultural Interpretation:**
                            (Your analysis here)

                            Keep each section concise (max 150 words per interpretation). Don't use any capital letters in interpretation descriptions.`;
            const result = await model.generateContent(prompt);
            console.log(result.response.text());
            if(!result.response.text().includes("Invalid Input")) {
                const usersDreamsRef = collection(db, "users", auth.currentUser.uid, "dreams");
                const dreamRef = await addDoc(usersDreamsRef, {
                                    dream: dream,
                                    interpretations: parseInterpretation(result.response.text()),
                                    dateOfDream: date,
                                    createdAt: serverTimestamp()
                                })
                console.log("dream is added to the database!");
                navigate(`/interpretation/${dreamRef.id}`);
            }
        }
        catch(error) {
            console.log(error);
        }
        setIsLoading(false);
    }

    if(loading || isLoading) return <p className="absolute top-1/2 left-1/2 transform -translate-1/2 text-light-text dark:text-dark-text font-text text-lg md:text-xl lg:text-2xl">loading...</p>

    return(
        <div className="flex flex-col items-center justify-evenly
                        text-light-text dark:text-dark-text font-text
                        w-9/10 md:w-4/5 h-[50vh] mx-auto">
            {errorDisplay && <p className="text-center lg:col-start-1 lg:col-end-3 text-error-red lg:text-xl">{errorDisplay} </p>}
            <textarea ref={dreamRef} name="dreamInput" placeholder="enter your dream..." className="w-9/10 md:w-4/5 h-1/2 rounded-2xl md:rounded-3xl
                                                                                                    md:text-lg lg:text-xl 
                                                                                                    p-3 md:p-4 lg:p-5
                                                                                                    bg-light-secondary-background dark:bg-dark-secondary-background
                                                                                                    resize-none" />
            <div className="flex items-center gap-x-2 md:gap-x-3 lg:gap-x-4 md:text-lg lg:text-xl">
                <label htmlFor="dateInput">date of the dream: </label>
                <input onChange={(e) => setDate(e.target.value)} type="date" id="dateInput" className="accent-light-text dark:accent-dark-text" />
            </div>
            <button onClick={fetchInterpretation} className="homeBtn">
                interpret
            </button>
        </div>
    )
}