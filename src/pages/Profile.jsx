import { signOut, updatePassword } from "firebase/auth"
import { auth, db } from "../config/firebase"
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { useRef } from "react";
import { doc, getDoc, limit } from "firebase/firestore";
import { useState } from "react";
import { Link } from "react-router";
import { IoMdSettings } from "react-icons/io";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { IoIosReturnRight } from "react-icons/io";
import { LuCircleArrowRight } from "react-icons/lu";

export default function Profile() {
    const navigate = useNavigate();
    const passwordRef = useRef();
    const [ userData, setUserData ] = useState();
    const [ errorDisplay, setErrorDisplay ] = useState();
    const [ dreams, setDreams] = useState();

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

    useEffect(() => {
        let unsubscribe;
        if(user && !loading) {
            const dreamsQuery = query(collection(db, "users", user.uid, "dreams"), orderBy("createdAt", "desc"), limit(3));
            
            let updatedDreams = [];
            unsubscribe = onSnapshot(dreamsQuery, (snapshot) => {
                snapshot.forEach((doc) => {
                    updatedDreams.push({
                        data: doc.data(),
                        id: doc.id
                    });
                })
                setDreams(updatedDreams);
            })
        }
        
        return () => {
            if(unsubscribe) {
                unsubscribe();
            }
        };
    }, [user])
    
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("user signed out");
            navigate("/");
        }
        catch(error) {
            console.log(error);
        }
    }
    
    if(loading) return <p className="absolute top-1/2 left-1/2 transform -translate-1/2 text-light-text dark:text-dark-text font-text text-lg md:text-xl lg:text-2xl">loading...</p>

    return(
        <div className="text-light-text dark:text-dark-text font-text 
                        w-9/10 md:w-19/20 mx-auto
                        flex flex-col gap-y-2 md:gap-y-3 lg:gap-y-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">your profile</h1>
            <h2 className="text-xl md:text-2xl xl:text-3xl font-semibold">{userData?.name} </h2>
            <div className="flex gap-x-2 items-center md:text-lg lg:text-xl">
                <h3>{userData?.username} </h3>
                <Link to="/usersettings">
                    <IoMdSettings />
                </Link>
            </div>
            <p className="text-xs md:text-sm lg:text-base">created at: {new Date((userData?.createdAt.seconds * 1000 + userData?.createdAt.nanoseconds / 1e6)).toDateString()} </p>
            <button onClick={handleSignOut} className="homeBtn my-2 md:w-fit">sign out</button>
            <h2 className="text-xl md:text-2xl xl:text-3xl font-semibold">recent dreams</h2>
            <Link to="/dreamarchive" className="border-b-2 border-transparent hover:border-light-text/80 dark:hover:border-dark-text/80 w-fit text-light-text/80 dark:text-dark-text/80 text-sm md:text-base flex gap-x-1 items-center">
                <IoIosReturnRight /> go to dream archive for more
            </Link>
            <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 justify-evenly gap-6 md:gap-8 lg:gap-10">
                {dreams?.map((dream, index) => (
                    <div key={index} className="flex flex-col justify-evenly gap-y-3 lg:gap-y-4 rounded-2xl
                                                bg-light-third-background dark:bg-dark-third-background
                                                p-5 md:p-6 lg:p-8">
                        <p className="text-sm md:text-base lg:text-lg">
                            {dream.data.dream.length < 200 ? dream.data.dream : dream.data.dream.slice(0, 200) + "..."}
                        </p>
                        <p className="text-light-text/70 dark:text-dark-text/70 text-xs md:text-sm lg:text-base">
                            {dream.data.dateOfDream}
                        </p>
                        <Link to={"/interpretation/" + dream.id} className="flex items-center gap-x-2 font-bold md:text-lg lg:text-xl border-b-2 border-transparent hover:border-light-text dark:hover:border-dark-text w-fit">
                            <LuCircleArrowRight /> more
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}