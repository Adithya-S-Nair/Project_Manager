import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {

    let storedTheme = localStorage.getItem('theme');
    
    const [theme, setTheme] = useState(storedTheme);

    if (!storedTheme || storedTheme === 'undefined') {
        storedTheme = 'theme1';
        localStorage.setItem('theme', storedTheme);
    }

    useEffect(()=>{
        localStorage.setItem("theme",theme)
    },[theme])    

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
