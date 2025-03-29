import React from "react";

type AppContextType = {
    id: string;
}

export const AppContext = React.createContext<AppContextType | null>(null);

export const useApp = () => {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within a AppProvider");
    }
    return context;
}

