
import { tokenServices } from "../services/tokenServices";
import { userStorage } from "../services/userServices";
import type { companyDto } from "../types/user.type";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextData {
    user: companyDto | null;
    isLoading: boolean;
    login: (
        userData: companyDto,
        accessToken: string,
        refreshToken: string
    ) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<companyDto | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const bootStrapAsync = async () => {
            const user = await userStorage.getCompany();
            const token = await tokenServices.getAccesToken();

            if (user && token) {
                setUser(user);
            }

            setLoading(false);
        };

        bootStrapAsync();
    }, []);

    const login = async (
        userData: companyDto,
        accessToken: string,
        refreshToken: string
    ) => {
        await tokenServices.setTokens(accessToken, refreshToken);
        await userStorage.setCompany(userData);
        setUser(userData);
    };

    const logout = async () => {
        await tokenServices.removeToken();
        await userStorage.removeCompany();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};