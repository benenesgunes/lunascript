import { Link } from "react-router";
import { LuCircleArrowRight } from "react-icons/lu";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";

export default function DreamArchive() {
    const navigate = useNavigate();
    const [ dreams, setDreams ] = useState();

    const { user, loading } = useAuth();
    useEffect(()  => {
        if(!user && !loading) {
            navigate("/signup");
        }
    }, [user])

    useEffect(() => {
        let unsubscribe;
        if(user && !loading) {
            const dreamsQuery = query(collection(db, "users", user.uid, "dreams"), orderBy("createdAt", "desc"));
            
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

    if(loading) return <p className="absolute top-1/2 left-1/2 transform -translate-1/2 text-light-text dark:text-dark-text font-text text-lg md:text-xl lg:text-2xl">loading...</p>

    return(
    <>    
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-light-text dark:text-dark-text font-text mx-6 md:mx-8 lg:mx-10 mb-4 md:mb-6 lg:mb-8">your dream archive</h1>
        <div className="text-light-text dark:text-dark-text font-text 
                        px-6 md:px-8 lg:px-10
                        flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 justify-evenly gap-6 md:gap-8 lg:gap-10">
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
    </>
    )
}