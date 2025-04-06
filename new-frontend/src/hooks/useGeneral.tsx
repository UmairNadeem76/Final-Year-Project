import { useContext, useEffect } from "react";
import { GeneralContext } from "../Context/GeneralProvider";
import { User } from "../types"; // ✅ import shared User type

interface GeneralContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    uploadHistory: any[];
    setUploadHistory: React.Dispatch<React.SetStateAction<any[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function useGeneral(): GeneralContextType {
    const context = useContext(GeneralContext);

    if (!context) {
        throw new Error("useGeneral must be used within a GeneralProvider");
    }

    const {
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        uploadHistory,
        setUploadHistory,
        loading,
        setLoading
    } = context;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/users/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Not authenticated");

                const data = await res.json();
                setUser(data);
                setIsLoggedIn(true);
            } catch (err) {
                setUser(null);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [setUser, setIsLoggedIn, setLoading]);

    return {
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        uploadHistory,
        setUploadHistory,
        loading,
        setLoading,
    };
}

export default useGeneral;
