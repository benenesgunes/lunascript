import { useEffect, useState } from "react";
import { auth } from "../config/firebase";

export default function useAuth() {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        })

        return () => unsubscribe();
    }, [])

    return { user, loading };
}