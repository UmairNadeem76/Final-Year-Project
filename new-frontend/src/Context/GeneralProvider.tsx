import React, { createContext, useState } from "react";
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

export const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export const GeneralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [uploadHistory, setUploadHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    return (
        <GeneralContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                uploadHistory,
                setUploadHistory,
                loading,
                setLoading,
            }}
        >
            {children}
        </GeneralContext.Provider>
    );
};
