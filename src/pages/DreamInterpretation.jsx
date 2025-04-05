import { Link } from "react-router";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router";
import { db } from "../config/firebase";
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth"
import { IoIosReturnRight } from "react-icons/io";
import { useNavigate } from "react-router";

export default function DreamInterpretation() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, loading } = useAuth(); 
    const [ notFound, setNotFound ] = useState(false);
    const [ dreamData, setDreamData ] = useState();

    const getDream = async () => {
        const dreamRef = doc(db, "users", user.uid, "dreams", id);
        const docSnap = await getDoc(dreamRef);

        if(docSnap.exists()) {
            setDreamData(docSnap.data());
        }
        else {
            setNotFound(true);
        }
    }

    const removeDream = async () => {
        const dreamRef = doc(db, "users", user.uid, "dreams", id);

        try {
            await deleteDoc(dreamRef);
            console.log("dream removed successfully!");
            navigate("/dreamarchive");
        }
        catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(user && !loading) {
            getDream();
        }
    }, [user])

    if(loading) return <p className="absolute top-1/2 left-1/2 transform -translate-1/2 text-light-text dark:text-dark-text font-text text-lg md:text-xl lg:text-2xl">loading...</p>
    if(notFound) return <p className="absolute top-1/2 left-1/2 transform -translate-1/2 text-light-text dark:text-dark-text font-text text-lg md:text-xl lg:text-2xl">dream not found!</p>

    return(
        <div className="text-light-text dark:text-dark-text font-text flex flex-col gap-y-3 lg:gap-y-4 px-6 md:px-8 lg:px-10">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold border-b-2 w-fit pb-1">your dream</h2>
            <Link to="/dreamarchive" className="border-b-2 border-transparent hover:border-light-text/80 dark:hover:border-dark-text/80 w-fit text-light-text/80 dark:text-dark-text/80 flex gap-x-1 items-center">
                <IoIosReturnRight /> go to dream archive 
            </Link>
            <p className="lg:text-lg">{dreamData?.dream} </p>
            <p className="text-light-text/70 dark:text-dark-text/70 text-xs md:text-sm lg:text-base">
                {dreamData?.dateOfDream}
            </p>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold border-b-2 w-fit pb-1">freudian interpretation</h2>
            <p className="lg:text-lg">{dreamData?.interpretations.freudian} </p>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold border-b-2 w-fit pb-1">jungian interpretation</h2>
            <p className="lg:text-lg">{dreamData?.interpretations.jungian} </p>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold border-b-2 w-fit pb-1">cultural interpretation</h2>
            <p className="lg:text-lg">{dreamData?.interpretations.cultural} </p>
            <button onClick={removeDream} className="px-3 py-2 md:px-5 md:py-3 xl:px-6 lg:py-4
                                                     md:text-lg lg:text-xl font-text
                                                     bg-error-red hover:bg-error-red/90 text-dark-text
                                                     cursor-pointer transition-all
                                                     rounded-xl md:rounded-2xl mx-auto mt-4 md:mt-6 lg:mt-8">
                delete dream
            </button>
        </div>
    )
}